from unittest.mock import patch

from django.test import TestCase
from django.contrib.auth import get_user_model

from notifications.services import NotificationService
from notifications.models import Notification

User = get_user_model()


class NotificationServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='notif@test.com', username='notifuser',
            password='pass', full_name='Notif User',
            phone_number='+2348010000002'
        )

    def test_create_notification(self):
        notif = NotificationService.create(
            self.user, 'Test Title', 'Test Message', notification_type='general'
        )
        self.assertEqual(notif.title, 'Test Title')
        self.assertEqual(notif.user, self.user)

    def test_get_user_notifications(self):
        Notification.objects.create(user=self.user, title='N1', message='M1', notification_type='general')
        Notification.objects.create(user=self.user, title='N2', message='M2', notification_type='general')
        qs = NotificationService.get_user_notifications(self.user)
        self.assertEqual(qs.count(), 2)

    def test_mark_read(self):
        notif = Notification.objects.create(
            user=self.user, title='Read Me', message='...', notification_type='general'
        )
        result = NotificationService.mark_read(notif.id, self.user)
        result.refresh_from_db()
        self.assertTrue(result.is_read)

    def test_mark_all_read(self):
        Notification.objects.create(user=self.user, title='A', message='...', notification_type='general')
        Notification.objects.create(user=self.user, title='B', message='...', notification_type='general', is_read=True)
        count = NotificationService.mark_all_read(self.user)
        self.assertEqual(count, 1)

    def test_get_unread_count(self):
        Notification.objects.create(user=self.user, title='A', message='...', notification_type='general')
        Notification.objects.create(user=self.user, title='B', message='...', notification_type='general', is_read=True)
        self.assertEqual(NotificationService.get_unread_count(self.user), 1)
