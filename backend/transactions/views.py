import logging
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from transactions.models import Transaction
from transactions.serializers import TransactionSerializer, TransactionCreateSerializer
from transactions.services.payment_service import PaymentService
from transactions.services.transaction_service import TransactionService
from transactions.tasks import process_payment_webhook
from accounts.permissions import IsAdminUser
from accounts.throttles import PaymentThrottle, WebhookThrottle

logger = logging.getLogger(__name__)


class UserTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related('plan').order_by('-created_at')


class UserTransactionDetailView(generics.RetrieveAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related('plan')


class CreateTransactionView(generics.CreateAPIView):
    serializer_class = TransactionCreateSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([AllowAny])
def initialize_payment_view(request):
    transaction_id = request.data.get('transaction_id')
    if not transaction_id:
        return Response({'error': 'transaction_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    transaction = get_object_or_404(Transaction, id=transaction_id)
    payment_service = PaymentService()
    try:
        result = payment_service.initialize_payment(
            user=transaction.user,
            plan=transaction.plan,
        )
        return Response({'message': 'Payment initialized', 'payment_data': result})
    except Exception as exc:
        return Response({'error': 'Failed to initialize payment'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def payment_webhook_view(request):
    from transactions.gateways.paystack import PaystackGateway
    raw_body = request.body
    signature = request.META.get('HTTP_X_PAYSTACK_SIGNATURE', '')
    if not signature:
        return Response({'error': 'Missing signature header'}, status=status.HTTP_400_BAD_REQUEST)
    gateway = PaystackGateway()
    if not gateway.verify_webhook_signature(raw_body, signature):
        return Response({'error': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)
    webhook_data = request.data
    reference = webhook_data.get('reference', '') or webhook_data.get('data', {}).get('reference', '')
    if not reference:
        return Response({'error': 'Reference required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        transaction = Transaction.objects.get(payment_reference=reference)
        process_payment_webhook.delay(transaction.id, webhook_data)
        return Response({'message': 'Webhook received'})
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_payment_view(request):
    reference = request.data.get('reference')
    if not reference:
        return Response({'error': 'Reference required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        payment_service = PaymentService()
        transaction = payment_service.verify_payment(reference)
        return Response({
            'message': 'Payment verified',
            'transaction': TransactionSerializer(transaction).data,
            'success': True,
        })
    except Exception as exc:
        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)


class AdminTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Transaction.objects.select_related('user', 'plan').order_by('-created_at')


class AdminTransactionDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminUser]
    queryset = Transaction.objects.select_related('user', 'plan')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_transaction_stats_view(request):
    stats = TransactionService.get_payment_summary()
    return Response(stats)
