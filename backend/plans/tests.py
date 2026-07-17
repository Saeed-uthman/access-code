import pytest
from plans.models import Plan


@pytest.mark.django_db
class TestPlanModel:
    def test_create_plan(self, plan_factory):
        plan = plan_factory(name='Monthly Plan', plan_type='individual', cost=5000, validity='monthly')
        assert plan.name == 'Monthly Plan'
        assert plan.plan_type == 'individual'
        assert plan.cost == 5000
        assert plan.validity == 'monthly'
        assert plan.validity_days == 30
        assert plan.is_active is True

    def test_plan_str(self, plan_factory):
        plan = plan_factory(name='House Plan', plan_type='house', cost=2000)
        assert 'House Plan' in str(plan)

    def test_plan_table_name(self):
        assert Plan._meta.db_table == 'plans'

    def test_plan_choices(self):
        plan_types = [choice[0] for choice in Plan.PLAN_TYPES]
        assert 'house' in plan_types
        assert 'individual' in plan_types
        assert 'business' in plan_types

    def test_validity_choices(self):
        validities = [choice[0] for choice in Plan.VALIDITY_CHOICES]
        assert 'hourly' in validities
        assert 'monthly' in validities
        assert 'yearly' in validities
