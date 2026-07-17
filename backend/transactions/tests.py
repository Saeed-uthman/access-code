import pytest
from transactions.models import Transaction, PaymentLog, RefundRequest


@pytest.mark.django_db
class TestTransactionModel:
    def test_create_transaction(self, user_factory, plan_factory):
        user = user_factory()
        plan = plan_factory(cost=5000)
        tx = Transaction.objects.create(
            user=user, plan=plan, amount=5000, quantity=2,
            payment_method='paystack', payment_reference='MAXC_TEST123', status='pending',
        )
        assert tx.total_amount == 10000

    def test_is_successful(self, user_factory, plan_factory):
        user = user_factory()
        plan = plan_factory()
        tx = Transaction.objects.create(
            user=user, plan=plan, amount=1000, quantity=1,
            payment_method='paystack', payment_reference='MAXC_SUCCESS', status='completed',
        )
        assert tx.is_successful is True

    def test_table_name(self):
        assert Transaction._meta.db_table == 'transactions'
