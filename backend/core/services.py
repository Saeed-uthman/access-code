import logging
from django.db.models import Count, Q, Sum
from django.utils import timezone

from access_code.models import AccessCode
from accounts.models import User
from plans.models import Plan
from transactions.models import Transaction

logger = logging.getLogger(__name__)


class DashboardService:
    @staticmethod
    def get_admin_stats():
        now = timezone.now()
        thirty_days_ago = now - timezone.timedelta(days=30)
        return {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True, is_blocked=False).count(),
            'blocked_users': User.objects.filter(is_blocked=True).count(),
            'total_plans': Plan.objects.count(),
            'active_plans': Plan.objects.filter(is_active=True).count(),
            'total_codes': AccessCode.objects.count(),
            'available_codes': AccessCode.objects.filter(status='available').count(),
            'assigned_codes': AccessCode.objects.filter(status='assigned').count(),
            'total_transactions': Transaction.objects.count(),
            'completed_transactions': Transaction.objects.filter(status='completed').count(),
            'pending_transactions': Transaction.objects.filter(status='pending').count(),
            'failed_transactions': Transaction.objects.filter(status='failed').count(),
            'total_revenue': Transaction.objects.filter(status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'monthly_revenue': Transaction.objects.filter(
                status='completed', created_at__gte=thirty_days_ago,
            ).aggregate(total=Sum('amount'))['total'] or 0,
        }

    @staticmethod
    def get_user_stats(user):
        now = timezone.now()
        return {
            'total_purchases': Transaction.objects.filter(user=user, status='completed').count(),
            'total_spent': Transaction.objects.filter(
                user=user, status='completed',
            ).aggregate(total=Sum('amount'))['total'] or 0,
            'active_codes': AccessCode.objects.filter(
                assigned_to=user, status='assigned', expires_at__gt=now,
            ).count(),
            'expired_codes': AccessCode.objects.filter(
                assigned_to=user, status='expired',
            ).count(),
        }

    @staticmethod
    def get_analytics():
        return {
            'daily_transactions': list(
                Transaction.objects.filter(status='completed')
                .extra(select={'day': "DATE(created_at)"})
                .values('day')
                .annotate(count=Count('id'), revenue=Sum('amount'))
                .order_by('-day')[:30]
            ),
            'top_plans': list(
                Plan.objects.annotate(
                    transaction_count=Count('transactions', filter=Q(transactions__status='completed'))
                ).order_by('-transaction_count')[:5].values('id', 'name', 'plan_type', 'cost', 'transaction_count')
            ),
            'payment_methods': list(
                Transaction.objects.filter(status='completed')
                .values('payment_method')
                .annotate(count=Count('id'), revenue=Sum('amount'))
            ),
            'user_registrations': list(
                User.objects.extra(select={'day': "DATE(date_joined)"})
                .values('day')
                .annotate(count=Count('id'))
                .order_by('-day')[:30]
            ),
        }
