import logging
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_otp_email(self, email, otp_code):
    subject = 'YAROTECH - Email Verification'
    message = (
        f'Hello,\n\n'
        f'Your email verification code is: {otp_code}\n\n'
        f'This code will expire in 10 minutes.\n\n'
        f'If you didn\'t request this verification, please ignore this email.\n\n'
        f'Best regards,\nYAROTECH Team'
    )
    try:
        send_mail(
            subject, message, settings.DEFAULT_FROM_EMAIL,
            [email], fail_silently=False,
        )
        logger.info(f'OTP email sent to {email}')
        return f'OTP email sent to {email}'
    except Exception as exc:
        logger.error(f'Failed to send OTP email to {email}: {exc}')
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_bulk_email(self, subject, message, recipient_list):
    try:
        send_mail(
            subject, message, settings.DEFAULT_FROM_EMAIL,
            recipient_list, fail_silently=False,
        )
        logger.info(f'Bulk email sent to {len(recipient_list)} recipients')
        return f'Bulk email sent to {len(recipient_list)} recipients'
    except Exception as exc:
        logger.error(f'Failed to send bulk email: {exc}')
        raise self.retry(exc=exc)
