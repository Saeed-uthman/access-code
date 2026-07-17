from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Count, Q

from plans.models import Plan
from plans.serializers import PlanSerializer, PlanCreateUpdateSerializer
from accounts.permissions import IsAdminUser


class PlanListView(generics.ListAPIView):
    serializer_class = PlanSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Plan.objects.filter(is_active=True)
        plan_type = self.request.query_params.get('type', None)
        if plan_type:
            queryset = queryset.filter(plan_type=plan_type)
        return queryset.order_by('plan_type', 'cost')


class PlanDetailView(generics.RetrieveAPIView):
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Plan.objects.filter(is_active=True)


class AdminPlanCreateView(generics.CreateAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanCreateUpdateSerializer
    permission_classes = [IsAdminUser]


class AdminPlanUpdateView(generics.UpdateAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanCreateUpdateSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'


class AdminPlanDeleteView(generics.DestroyAPIView):
    queryset = Plan.objects.all()
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'


class AdminPlanListView(generics.ListCreateAPIView):
    serializer_class = PlanSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = Plan.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', None)
        plan_type = self.request.query_params.get('type', None)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if plan_type:
            queryset = queryset.filter(plan_type=plan_type)
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PlanCreateUpdateSerializer
        return PlanSerializer


class AdminPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlanSerializer
    permission_classes = [IsAdminUser]
    queryset = Plan.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PlanCreateUpdateSerializer
        return PlanSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_plan_stats_view(request):
    from transactions.models import Transaction
    total_plans = Plan.objects.count()
    active_plans = Plan.objects.filter(is_active=True).count()
    total_revenue = Transaction.objects.filter(status='completed').aggregate(
        total=Sum('amount')
    )['total'] or 0
    return Response({
        'total_plans': total_plans,
        'active_plans': active_plans,
        'total_revenue': total_revenue,
    })


@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_plan_status_view(request, plan_id):
    try:
        plan = Plan.objects.get(id=plan_id)
        plan.is_active = not plan.is_active
        plan.save()
        status_text = "activated" if plan.is_active else "deactivated"
        return Response({'message': f'Plan {plan.name} has been {status_text}', 'is_active': plan.is_active})
    except Plan.DoesNotExist:
        return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
