import logging
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from notifications.models import Notification

logger = logging.getLogger(__name__)


class NotificationService:
    @staticmethod
    def create(user, title, message, notification_type='general', action_url=''):
        notif = Notification.objects.create(
            user=user, title=title, message=message,
            notification_type=notification_type, action_url=action_url,
        )
        return notif

    @staticmethod
    def get_user_notifications(user, is_read=None):
        qs = Notification.objects.filter(user=user)
        if is_read is not None:
            qs = qs.filter(is_read=is_read)
        return qs

    @staticmethod
    def mark_read(notification_id, user):
        notif = Notification.objects.get(id=notification_id, user=user)
        notif.is_read = True
        notif.read_at = timezone.now()
        notif.save(update_fields=['is_read', 'read_at'])
        return notif

    @staticmethod
    def mark_all_read(user):
        return Notification.objects.filter(user=user, is_read=False).update(
            is_read=True, read_at=timezone.now(),
        )

    @staticmethod
    def get_unread_count(user):
        return Notification.objects.filter(user=user, is_read=False).count()


class EmailService:
    @staticmethod
    def send_notification_email(user, notification):
        try:
            send_mail(
                notification.title, notification.message,
                settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=True,
            )
        except Exception as exc:
            logger.error(f'Failed to send notification email to {user.email}: {exc}')
