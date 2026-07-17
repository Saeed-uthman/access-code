import logging
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from access_code.models import AccessCode
from access_code.serializers import AccessCodeSerializer, UserAccessCodeSerializer
from access_code.services import CodeService
from plans.models import Plan
from accounts.permissions import IsAdminUser

logger = logging.getLogger(__name__)


class UserAccessCodeListView(generics.ListAPIView):
    serializer_class = UserAccessCodeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CodeService.get_user_active_codes(self.request.user).select_related('plan')


class AdminAccessCodeListView(generics.ListAPIView):
    serializer_class = AccessCodeSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return AccessCode.objects.select_related('plan', 'assigned_to', 'used_by').order_by('-created_at')


class AdminAccessCodeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AccessCodeSerializer
    permission_classes = [IsAdminUser]
    queryset = AccessCode.objects.select_related('plan', 'assigned_to', 'used_by')


@api_view(['POST'])
@permission_classes([IsAdminUser])
def bulk_add_access_codes_view(request):
    codes_raw = request.data.get('codes', '')
    plan_id = request.data.get('plan_id')
    if not codes_raw or not plan_id:
        return Response({'error': 'codes and plan_id are required'}, status=status.HTTP_400_BAD_REQUEST)
    plan = get_object_or_404(Plan, id=plan_id)
    lines = [line.strip() for line in codes_raw.strip().splitlines() if line.strip()]
    created_codes = CodeService.bulk_upload(lines, plan)
    return Response({'message': f'{len(created_codes)} codes created'})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def access_code_stats_view(request):
    from django.db.models import Count, Q
    total_codes = AccessCode.objects.count()
    available_codes = AccessCode.objects.filter(status='available').count()
    assigned_codes = AccessCode.objects.filter(status='assigned').count()
    used_codes = AccessCode.objects.filter(status='used').count()
    expired_codes = AccessCode.objects.filter(status='expired').count()
    return Response({
        'total_codes': total_codes, 'available_codes': available_codes,
        'assigned_codes': assigned_codes, 'used_codes': used_codes,
        'expired_codes': expired_codes,
    })


@api_view(['POST'])
@permission_classes([IsAdminUser])
def assign_access_code_view(request):
    import uuid as _uuid
    from django.utils import timezone
    from accounts.models import User
    from transactions.models import Transaction
    
    code_id = request.data.get('code_id')
    user_id = request.data.get('user_id')
    if not code_id or not user_id:
        return Response({'error': 'code_id and user_id are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        code = AccessCode.objects.get(id=code_id, status='available')
        user = User.objects.get(id=user_id)
        code.assign_to_user(user)
        Transaction.objects.create(
            user=user, plan=code.plan,
            amount=code.plan.cost, total_amount=code.plan.cost,
            quantity=1, payment_method='manual',
            payment_reference=str(_uuid.uuid4()),
            status='completed', paid_at=timezone.now(),
        )
        return Response({'message': f'Access code {code.code} assigned to {user.full_name}'})
    except AccessCode.DoesNotExist:
        return Response({'error': 'Access code not found or not available'}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
