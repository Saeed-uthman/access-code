from unittest.mock import patch, MagicMock

from django.test import TestCase
from django.contrib.auth import get_user_model

from transactions.gateways.base import PaymentGateway, PaymentInitializationError, PaymentVerificationError
from transactions.gateways.paystack import PaystackGateway
from transactions.services.payment_service import PaymentService
from transactions.services.transaction_service import TransactionService
from transactions.models import Transaction

User = get_user_model()


class PaymentGatewayInterfaceTest(TestCase):
    def test_cannot_instantiate_abstract(self):
        with self.assertRaises(TypeError):
            PaymentGateway()


class PaystackGatewayTest(TestCase):
    def setUp(self):
        self.gateway = PaystackGateway()

    @patch('transactions.gateways.paystack._requests.post')
    def test_initialize_payment_success(self, mock_post):
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {
            'status': True,
            'data': {
                'authorization_url': 'https://checkout.paystack.com/abc',
                'access_code': 'access_code_xyz',
            }
        }
        mock_post.return_value = mock_response
        result = self.gateway.initialize_payment(amount=10000, reference='TEST_REF', email='test@example.com')
        self.assertEqual(result['authorization_url'], 'https://checkout.paystack.com/abc')

    @patch('transactions.gateways.paystack._requests.post')
    def test_initialize_payment_failure(self, mock_post):
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {'status': False, 'message': 'Invalid amount'}
        mock_post.return_value = mock_response
        with self.assertRaises(PaymentInitializationError):
            self.gateway.initialize_payment(amount=10000, reference='TEST_REF', email='test@example.com')


class TransactionServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@test.com', username='user',
            password='pass', full_name='Test User',
            phone_number='+2348019999006'
        )
        from plans.models import Plan
        self.plan = Plan.objects.create(
            name='Test Plan', plan_type='individual',
            cost=5000, validity='monthly', validity_days=30
        )
        self.tx = Transaction.objects.create(
            user=self.user, plan=self.plan, amount=5000,
            total_amount=5000, payment_reference='TX_TEST_001',
            status='completed', payment_method='paystack',
        )

    def test_get_user_transactions(self):
        txs = TransactionService.get_user_transactions(self.user)
        self.assertEqual(txs.count(), 1)

    def test_get_payment_summary(self):
        stats = TransactionService.get_payment_summary()
        self.assertEqual(stats['total_transactions'], 1)
        self.assertEqual(stats['completed_transactions'], 1)

    def test_process_refund(self):
        tx = TransactionService.process_refund(self.tx.id, 'Customer request')
        self.assertEqual(tx.status, 'refunded')

    def test_process_refund_nonexistent(self):
        with self.assertRaises(ValueError):
            TransactionService.process_refund(99999, 'reason')


class PaymentServiceTest(TestCase):
    def test_generate_reference_format(self):
        ref = PaymentService._generate_reference()
        self.assertTrue(ref.startswith('YAR_'))
        self.assertEqual(len(ref), 36)
