import logging
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import OTPVerification, UserProfile
from accounts.tasks import send_otp_email

User = get_user_model()
logger = logging.getLogger(__name__)


class AuthService:
    @staticmethod
    def register_user(email, username, full_name, phone_number, password):
        user = User.objects.create_user(
            email=email, username=username, password=password,
            full_name=full_name, phone_number=phone_number,
        )
        UserProfile.objects.create(user=user)
        otp = OTPVerification.create_otp(user, 'email')
        send_otp_email.delay(user.email, otp.otp_code)
        return user

    @staticmethod
    def verify_otp(user, otp_code, otp_type):
        try:
            otp = OTPVerification.objects.get(
                user=user, otp_type=otp_type,
                otp_code=otp_code, is_verified=False,
            )
        except OTPVerification.DoesNotExist:
            return False, 'Invalid OTP'
        if otp.is_expired():
            return False, 'OTP has expired'
        otp.is_verified = True
        otp.save()
        if otp_type == 'email':
            user.is_email_verified = True
            user.save()
        tokens = AuthService.generate_tokens(user)
        return True, tokens

    @staticmethod
    def resend_otp(user, otp_type):
        if otp_type == 'email' and user.is_email_verified:
            return False, 'Email already verified'
        otp = OTPVerification.create_otp(user, otp_type)
        if otp_type == 'email':
            send_otp_email.delay(user.email, otp.otp_code)
        return True, f'OTP sent to your {otp_type}'

    @staticmethod
    def authenticate_user(email, password):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None
        if not user.check_password(password):
            return None
        if user.is_blocked:
            return 'blocked'
        if not user.is_verified:
            return 'unverified'
        return user

    @staticmethod
    def generate_tokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @staticmethod
    def logout(refresh_token):
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return True
        except Exception:
            return False

    @staticmethod
    def change_password(user, new_password):
        user.set_password(new_password)
        user.save()

    @staticmethod
    def block_user(user):
        user.is_blocked = True
        user.save()

    @staticmethod
    def unblock_user(user):
        user.is_blocked = False
        user.save()
