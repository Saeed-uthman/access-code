import logging
from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q

from notifications.models import Notification, BulkNotification, EmailTemplate

User = get_user_model()
logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def send_bulk_notification(self, bulk_notification_id):
    try:
        bulk_notification = BulkNotification.objects.get(id=bulk_notification_id)
        audience = bulk_notification.target_audience
        if audience == 'all':
            target_users = User.objects.filter(is_active=True, is_blocked=False)
        elif audience == 'active_buyers':
            from transactions.models import Transaction
            buyer_ids = Transaction.objects.filter(
                status='completed',
            ).values_list('user_id', flat=True).distinct()
            target_users = User.objects.filter(id__in=buyer_ids, is_active=True, is_blocked=False)
        elif audience == 'new_users':
            thirty_days_ago = timezone.now() - timedelta(days=30)
            target_users = User.objects.filter(
                date_joined__gte=thirty_days_ago, is_active=True, is_blocked=False,
            )
        elif audience == 'inactive_users':
            ninety_days_ago = timezone.now() - timedelta(days=90)
            target_users = User.objects.filter(
                last_login__lt=ninety_days_ago, is_active=True, is_blocked=False,
            )
        elif audience == 'admins':
            target_users = User.objects.filter(role='admin', is_active=True)
        elif audience == 'users':
            target_users = User.objects.filter(role='user', is_active=True, is_blocked=False)
        elif audience == 'blocked':
            target_users = User.objects.filter(is_blocked=True)
        else:
            target_users = User.objects.filter(is_active=True, is_blocked=False)
        sent_count = 0
        for user in target_users:
            try:
                Notification.objects.create(
                    user=user, notification_type=bulk_notification.notification_type,
                    title=bulk_notification.title, message=bulk_notification.message,
                )
                sent_count += 1
            except Exception:
                pass
        bulk_notification.sent_count = sent_count
        bulk_notification.status = 'sent'
        bulk_notification.sent_at = timezone.now()
        bulk_notification.save()
        return f'Sent {sent_count} notifications'
    except BulkNotification.DoesNotExist:
        return 'Not found'
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task
def cleanup_old_notifications():
    cutoff_date = timezone.now() - timedelta(days=90)
    count = Notification.objects.filter(is_read=True, read_at__lt=cutoff_date).delete()[0]
    return f'Cleaned up {count} old notifications'


@shared_task
def send_expiry_notifications():
    from access_code.models import AccessCode
    five_days_from_now = timezone.now() + timedelta(days=5)
    expiring_codes = AccessCode.objects.filter(
        status='assigned',
        expires_at__lte=five_days_from_now, expires_at__gt=timezone.now(),
    ).select_related('assigned_to', 'plan')
    sent_count = 0
    for code in expiring_codes:
        if code.assigned_to:
            Notification.objects.create(
                user=code.assigned_to, notification_type='expiry_warning',
                title='Access Code Expiring Soon',
                message=f'Your access code will expire in {code.days_until_expiry} days.',
            )
            sent_count += 1
    return f'Sent {sent_count} expiry notifications'
