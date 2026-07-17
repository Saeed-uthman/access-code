import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_factory(db):
    from accounts.models import User, UserProfile
    _counter = [0]

    def _create_user(
        email=None,
        password='TestPass123!',
        full_name='Test User',
        phone_number=None,
        role='user',
        is_email_verified=True,
        is_blocked=False,
    ):
        _counter[0] += 1
        suffix = _counter[0]
        if email is None:
            email = f'test{suffix}@example.com'
        if phone_number is None:
            phone_number = f'+234801234{suffix:04d}'
        user = User.objects.create_user(
            email=email,
            username=email.split('@')[0] + str(suffix),
            password=password,
            full_name=full_name,
            phone_number=phone_number,
            role=role,
            is_email_verified=is_email_verified,
            is_blocked=is_blocked,
        )
        UserProfile.objects.create(user=user)
        return user

    return _create_user


@pytest.fixture
def admin_user(user_factory):
    return user_factory(full_name='Admin User', role='admin')


@pytest.fixture
def regular_user(user_factory):
    return user_factory(full_name='Regular User')


@pytest.fixture
def auth_client(api_client, regular_user):
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(regular_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def plan_factory(db):
    from plans.models import Plan

    def _create_plan(
        name='Test Plan',
        plan_type='individual',
        cost=1000.00,
        validity='monthly',
        validity_days=30,
        is_active=True,
    ):
        return Plan.objects.create(
            name=name, plan_type=plan_type, cost=cost,
            validity=validity, validity_days=validity_days, is_active=is_active,
        )

    return _create_plan


@pytest.fixture
def access_code_factory(db):
    from access_code.models import AccessCode

    def _create_code(code='TEST-CODE-001', plan=None, status='available'):
        if plan is None:
            raise ValueError("plan is required")
        return AccessCode.objects.create(code=code, plan=plan, status=status)

    return _create_code
