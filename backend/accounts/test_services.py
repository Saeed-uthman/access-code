from unittest.mock import patch, MagicMock

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from accounts.models import OTPVerification, UserProfile
from accounts.services import AuthService

User = get_user_model()


class AuthServiceTest(TestCase):
    def setUp(self):
        self.email = 'test@example.com'
        self.username = 'testuser'
        self.full_name = 'Test User'
        self.phone = '+2348019999001'
        self.password = 'testpass123'

    @patch('accounts.tasks.send_otp_email.delay')
    def test_register_user_creates_user_and_otp(self, mock_send):
        user = AuthService.register_user(
            self.email, self.username, self.full_name, self.phone, self.password
        )
        self.assertEqual(user.email, self.email)
        self.assertTrue(user.check_password(self.password))
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        self.assertEqual(OTPVerification.objects.filter(user=user).count(), 1)
        mock_send.assert_called_once()

    @patch('accounts.tasks.send_otp_email.delay')
    def test_register_user_returns_user_with_correct_fields(self, mock_send):
        user = AuthService.register_user(
            self.email, self.username, self.full_name, self.phone, self.password
        )
        self.assertEqual(user.full_name, self.full_name)
        self.assertEqual(str(user.phone_number), self.phone)
        self.assertFalse(user.is_email_verified)

    @patch('accounts.tasks.send_otp_email.delay')
    def test_verify_otp_success(self, mock_send):
        user = AuthService.register_user(
            self.email, self.username, self.full_name, self.phone, self.password
        )
        otp = OTPVerification.objects.filter(user=user, otp_type='email').first()
        success, tokens = AuthService.verify_otp(user, otp.otp_code, 'email')
        self.assertTrue(success)
        self.assertIn('access', tokens)
        self.assertIn('refresh', tokens)
        user.refresh_from_db()
        self.assertTrue(user.is_email_verified)

    def test_verify_otp_invalid_code(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone
        )
        success, error = AuthService.verify_otp(user, '000000', 'email')
        self.assertFalse(success)
        self.assertEqual(error, 'Invalid OTP')

    def test_verify_otp_expired_code(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone
        )
        otp = OTPVerification.create_otp(user, 'email')
        otp.expires_at = timezone.now() - timedelta(minutes=5)
        otp.save()
        success, error = AuthService.verify_otp(user, otp.otp_code, 'email')
        self.assertFalse(success)
        self.assertEqual(error, 'OTP has expired')

    @patch('accounts.tasks.send_otp_email.delay')
    def test_resend_otp(self, mock_send):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone
        )
        success, message = AuthService.resend_otp(user, 'email')
        self.assertTrue(success)
        self.assertIn('OTP sent', message)
        self.assertEqual(OTPVerification.objects.filter(user=user).count(), 1)

    def test_resend_otp_already_verified(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone, is_email_verified=True
        )
        success, message = AuthService.resend_otp(user, 'email')
        self.assertFalse(success)
        self.assertEqual(message, 'Email already verified')

    def test_authenticate_user_success(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone, is_email_verified=True
        )
        result = AuthService.authenticate_user(self.email, self.password)
        self.assertEqual(result, user)

    def test_authenticate_user_wrong_password(self):
        User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone
        )
        result = AuthService.authenticate_user(self.email, 'wrongpassword')
        self.assertIsNone(result)

    def test_authenticate_user_not_found(self):
        result = AuthService.authenticate_user('nobody@example.com', 'pass')
        self.assertIsNone(result)

    def test_authenticate_user_blocked(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone, is_blocked=True
        )
        result = AuthService.authenticate_user(self.email, self.password)
        self.assertEqual(result, 'blocked')

    def test_authenticate_user_unverified(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone, is_email_verified=False
        )
        result = AuthService.authenticate_user(self.email, self.password)
        self.assertEqual(result, 'unverified')

    def test_generate_tokens(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone
        )
        tokens = AuthService.generate_tokens(user)
        self.assertIn('access', tokens)
        self.assertIn('refresh', tokens)
        self.assertIsInstance(tokens['access'], str)

    def test_logout_invalid_token(self):
        result = AuthService.logout('invalid.token.here')
        self.assertFalse(result)

    def test_change_password(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone
        )
        AuthService.change_password(user, 'newpass456')
        user.refresh_from_db()
        self.assertTrue(user.check_password('newpass456'))
        self.assertFalse(user.check_password(self.password))

    def test_block_user(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone
        )
        AuthService.block_user(user)
        user.refresh_from_db()
        self.assertTrue(user.is_blocked)

    def test_unblock_user(self):
        user = User.objects.create_user(
            email=self.email, username=self.username,
            password=self.password, full_name=self.full_name,
            phone_number=self.phone, is_blocked=True
        )
        AuthService.unblock_user(user)
        user.refresh_from_db()
        self.assertFalse(user.is_blocked)
