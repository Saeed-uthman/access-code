import logging
import secrets
from django.conf import settings
from django.db import transaction as db_transaction

from transactions.gateways.base import PaymentInitializationError, PaymentVerificationError
from transactions.gateways.paystack import PaystackGateway
from transactions.models import Transaction

logger = logging.getLogger(__name__)


class PaymentService:
    def __init__(self, gateway=None):
        self.gateway = gateway or PaystackGateway()

    def initialize_payment(self, user, plan):
        reference = self._generate_reference()
        with db_transaction.atomic():
            tx = Transaction.objects.create(
                user=user, plan=plan, amount=plan.cost,
                total_amount=plan.cost, payment_reference=reference,
                status='pending', payment_method='paystack',
            )
        try:
            result = self.gateway.initialize_payment(
                amount=int(tx.total_amount * 100),
                reference=reference,
                email=user.email,
                callback_url=getattr(settings, 'PAYMENT_CALLBACK_URL', ''),
                metadata={'transaction_id': str(tx.id)},
            )
        except PaymentInitializationError:
            tx.status = 'failed'
            tx.save(update_fields=['status'])
            raise
        return {
            'authorization_url': result['authorization_url'],
            'access_code': result['access_code'],
            'payment_reference': reference,
            'transaction_id': tx.id,
        }

    def verify_payment(self, payment_reference):
        try:
            tx = Transaction.objects.get(payment_reference=payment_reference)
        except Transaction.DoesNotExist:
            raise ValueError(f'Transaction with reference {payment_reference} not found')
        if tx.status == 'completed':
            return tx
        try:
            result = self.gateway.verify_payment(payment_reference)
        except PaymentVerificationError:
            tx.status = 'failed'
            tx.save(update_fields=['status'])
            raise
        if result['status'] == 'success':
            tx.status = 'completed'
            tx.gateway_reference = result.get('gateway_reference', '')
            tx.paid_at = result.get('paid_at')
            tx.save(update_fields=['status', 'gateway_reference', 'paid_at'])
        else:
            tx.status = 'failed'
            tx.save(update_fields=['status'])
        return tx

    @staticmethod
    def _generate_reference():
        return f'YAR_{secrets.token_hex(16).upper()}'
