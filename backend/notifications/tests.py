import pytest
from notifications.models import Notification, BulkNotification, EmailTemplate


@pytest.mark.django_db
class TestNotification:
    def test_create_notification(self, regular_user):
        notif = Notification.objects.create(
            user=regular_user, notification_type='payment_success',
            title='Payment Successful', message='Your payment was successful.',
        )
        assert notif.user == regular_user
        assert notif.is_read is False

    def test_mark_as_read(self, regular_user):
        notif = Notification.objects.create(
            user=regular_user, notification_type='general',
            title='Test', message='Test message',
        )
        notif.mark_as_read()
        notif.refresh_from_db()
        assert notif.is_read is True

    def test_table_name(self):
        assert Notification._meta.db_table == 'notifications'


@pytest.mark.django_db
class TestEmailTemplate:
    def test_create_template(self):
        template = EmailTemplate.objects.create(
            name='Welcome Email', template_type='welcome',
            subject='Welcome to YAROTECH', html_content='<h1>Welcome!</h1>',
            is_active=True,
        )
        assert template.name == 'Welcome Email'

    def test_table_name(self):
        assert EmailTemplate._meta.db_table == 'email_templates'
