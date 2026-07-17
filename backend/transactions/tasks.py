import logging
from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db import transaction as db_transaction
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

from transactions.models import Transaction, PaymentLog
from access_code.models import AccessCode

User = get_user_model()
logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def process_payment_webhook(self, transaction_id, webhook_data):
    try:
        from notifications.services import NotificationService
        tx = Transaction.objects.get(id=transaction_id)
        PaymentLog.objects.create(
            transaction=tx, log_type='webhook',
            message='Webhook received', data=webhook_data,
        )
        event = webhook_data.get('event', '')
        if event == 'charge.success':
            tx.status = 'completed'
            tx.paid_at = timezone.now()
            tx.save()
            assign_access_codes_to_transaction.delay(tx.id)
        elif event == 'charge.failed':
            tx.status = 'failed'
            tx.save()
        return f'Webhook processed for {tx.payment_reference}'
    except Transaction.DoesNotExist:
        return 'Transaction not found'
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def assign_access_codes_to_transaction(self, transaction_id):
    try:
        from notifications.services import NotificationService
        with db_transaction.atomic():
            tx = Transaction.objects.select_for_update().get(id=transaction_id, status='completed')
            if tx.access_code:
                return f'Already assigned to {tx.payment_reference}'
            available_code = (
                AccessCode.objects.select_for_update()
                .filter(plan=tx.plan, status='available')
                .order_by('created_at').first()
            )
            if not available_code:
                return f'No available codes for {tx.plan.name}'
            available_code.assigned_to = tx.user if tx.user else None
            available_code.status = 'assigned'
            available_code.assigned_at = timezone.now()
            available_code.is_used = False
            available_code.expires_at = timezone.now() + timedelta(
                days=getattr(tx.plan, 'validity_days', 30)
            )
            available_code.save()
            tx.access_code = available_code
            tx.save()
            return f'Code {available_code.code} assigned'
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def send_access_code_email(self, recipient_email, plan_name, code, expires_at):
    from django.conf import settings as _settings
    subject = f'Your Access Code for {plan_name}'
    message = f'Thank you for your payment!\n\nYour access code for {plan_name}:\n{code}\n\nExpires at: {expires_at}'
    try:
        send_mail(subject, message, _settings.DEFAULT_FROM_EMAIL, [recipient_email], fail_silently=False)
        return f'Email sent to {recipient_email}'
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task
def cleanup_failed_transactions():
    cutoff_date = timezone.now() - timedelta(days=30)
    count = Transaction.objects.filter(
        status__in=['failed', 'cancelled'], created_at__lt=cutoff_date,
    ).delete()[0]
    return f'Cleaned up {count} old failed transactions'


@shared_task
def send_payment_reminders():
    from notifications.services import NotificationService
    cutoff_time = timezone.now() - timedelta(hours=1)
    pending = Transaction.objects.filter(
        status='pending', created_at__lt=cutoff_time,
    ).select_related('user', 'plan')
    count = 0
    for tx in pending:
        if tx.user:
            NotificationService.create(
                tx.user,
                title='Payment Reminder',
                message=f'You have a pending payment of ₦{tx.total_amount} for {tx.plan.name}. '
                        f'Please complete your payment to receive your access code.',
                notification_type='payment_reminder',
            )
            count += 1
    return f'Sent payment reminders for {count} transactions'
