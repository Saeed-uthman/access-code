import pytest
from access_code.models import AccessCode, AccessCodeUpload


@pytest.mark.django_db
class TestAccessCodeModel:
    def test_create_code(self, plan_factory, access_code_factory):
        plan = plan_factory()
        code = access_code_factory(code='WIFI-123', plan=plan)
        assert code.code == 'WIFI-123'
        assert code.plan == plan
        assert code.status == 'available'
        assert code.is_used is False

    def test_code_str(self, plan_factory, access_code_factory):
        plan = plan_factory()
        code = access_code_factory(code='WIFI-456', plan=plan)
        assert 'WIFI-456' in str(code)

    def test_code_table_name(self):
        assert AccessCode._meta.db_table == 'access_codes'

    def test_assign_to_user(self, plan_factory, access_code_factory, user_factory):
        plan = plan_factory()
        code = access_code_factory(code='WIFI-ASSIGN', plan=plan)
        user = user_factory()
        code.assign_to_user(user)
        assert code.assigned_to == user
        assert code.status == 'assigned'
        assert code.assigned_at is not None
        assert code.expires_at is not None

    def test_mark_as_used(self, plan_factory, access_code_factory, user_factory):
        plan = plan_factory()
        code = access_code_factory(code='WIFI-USED', plan=plan)
        user = user_factory()
        code.assign_to_user(user)
        code.mark_as_used(user)
        assert code.used_by == user
        assert code.is_used is True
        assert code.status == 'used'
