import pytest
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, OTPVerification, UserProfile


@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self, user_factory):
        user = user_factory(email='new@example.com', full_name='New User')
        assert user.email == 'new@example.com'
        assert user.full_name == 'New User'
        assert user.role == 'user'
        assert user.is_email_verified is True
        assert user.is_blocked is False
        assert user.pk is not None

    def test_create_admin(self, user_factory):
        admin = user_factory(email='admin@test.com', role='admin')
        assert admin.role == 'admin'
        assert admin.is_admin is True

    def test_is_verified_property(self, user_factory):
        user = user_factory(is_email_verified=True)
        assert user.is_verified is True

        user2 = user_factory(email='unverified@test.com', is_email_verified=False)
        assert user2.is_verified is False

    def test_user_str(self, user_factory):
        user = user_factory(full_name='John Doe', email='john@test.com')
        assert str(user) == 'John Doe (john@test.com)'

    def test_username_field_is_email(self):
        assert User.USERNAME_FIELD == 'email'

    def test_user_table_name(self):
        assert User._meta.db_table == 'users'

    def test_uuid_primary_key(self, user_factory):
        user = user_factory()
        assert str(user.pk).count('-') == 4


@pytest.mark.django_db
class TestOTPVerification:
    def test_create_otp(self, user_factory):
        user = user_factory()
        otp = OTPVerification.create_otp(user, 'email')
        assert otp.otp_code is not None
        assert len(otp.otp_code) == 6
        assert otp.otp_type == 'email'
        assert otp.is_verified is False
        assert otp.expires_at > timezone.now()

    def test_otp_expires(self, user_factory):
        user = user_factory()
        otp = OTPVerification.create_otp(user, 'email')
        otp.expires_at = timezone.now() - timedelta(minutes=1)
        otp.save()
        assert otp.is_expired() is True

    def test_otp_not_expired(self, user_factory):
        user = user_factory()
        otp = OTPVerification.create_otp(user, 'email')
        assert otp.is_expired() is False

    def test_create_otp_deletes_existing(self, user_factory):
        user = user_factory()
        otp1 = OTPVerification.create_otp(user, 'email')
        otp2 = OTPVerification.create_otp(user, 'email')
        assert OTPVerification.objects.filter(user=user, otp_type='email').count() == 1
        assert otp1.pk != otp2.pk

    def test_otp_is_cryptographic(self, user_factory):
        user = user_factory()
        otp = OTPVerification.create_otp(user, 'email')
        assert otp.otp_code.isdigit()
        assert len(otp.otp_code) == 6

    def test_otp_table_name(self):
        assert OTPVerification._meta.db_table == 'otp_verifications'


@pytest.mark.django_db
class TestUserProfile:
    def test_create_profile(self, user_factory):
        user = user_factory()
        profile = UserProfile.objects.get(user=user)
        assert profile.user == user
        assert profile.address == ''
        assert profile.date_of_birth is None

    def test_profile_str(self, user_factory):
        user = user_factory(full_name='Jane Doe')
        profile = UserProfile.objects.get(user=user)
        assert str(profile) == 'Profile for Jane Doe'

    def test_profile_table_name(self):
        assert UserProfile._meta.db_table == 'user_profiles'

    def test_one_to_one_relationship(self, user_factory):
        user = user_factory()
        assert hasattr(user, 'profile')
        assert isinstance(user.profile, UserProfile)
