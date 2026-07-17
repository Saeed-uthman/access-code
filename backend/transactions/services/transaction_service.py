import logging
from django.db.models import Sum, Count, Q
from django.utils import timezone

from transactions.models import Transaction

logger = logging.getLogger(__name__)


class TransactionService:
    @staticmethod
    def get_user_transactions(user, status=None):
        qs = Transaction.objects.filter(user=user).select_related('plan')
        if status:
            qs = qs.filter(status=status)
        return qs.order_by('-created_at')

    @staticmethod
    def get_admin_transactions(status=None, search=None, date_from=None, date_to=None):
        qs = Transaction.objects.select_related('user', 'plan')
        if status:
            qs = qs.filter(status=status)
        if search:
            qs = qs.filter(
                Q(payment_reference__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__full_name__icontains=search)
            )
        return qs.order_by('-created_at')

    @staticmethod
    def get_payment_summary():
        stats = Transaction.objects.aggregate(
            total_revenue=Sum('total_amount', filter=Q(status='completed')),
            total_transactions=Count('id'),
            completed_transactions=Count('id', filter=Q(status='completed')),
            pending_transactions=Count('id', filter=Q(status='pending')),
            failed_transactions=Count('id', filter=Q(status='failed')),
        )
        stats['total_revenue'] = stats['total_revenue'] or 0
        return stats

    @staticmethod
    def process_refund(transaction_id, reason=''):
        try:
            tx = Transaction.objects.get(id=transaction_id, status='completed')
        except Transaction.DoesNotExist:
            raise ValueError('Completed transaction not found')
        tx.status = 'refunded'
        tx.notes = reason
        tx.save(update_fields=['status', 'notes'])
        return tx
