import logging
import requests as _requests
from requests.exceptions import RequestException
from django.conf import settings

from transactions.gateways.base import (
    PaymentGateway, PaymentInitializationError, PaymentVerificationError,
)

logger = logging.getLogger(__name__)


class PaystackGateway(PaymentGateway):
    BASE_URL = 'https://api.paystack.co'

    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.public_key = settings.PAYSTACK_PUBLIC_KEY
        self.headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }

    @property
    def _verify_url(self):
        return f'{self.BASE_URL}/transaction/verify'

    def initialize_payment(self, amount, reference, email, callback_url='', metadata=None):
        payload = {
            'amount': int(amount),
            'reference': reference,
            'email': email,
            'callback_url': callback_url,
        }
        if metadata:
            payload['metadata'] = metadata
        try:
            response = _requests.post(
                f'{self.BASE_URL}/transaction/initialize',
                json=payload, headers=self.headers, timeout=30,
            )
            response.raise_for_status()
        except RequestException as exc:
            raise PaymentInitializationError(str(exc)) from exc
        data = response.json()
        if not data.get('status'):
            raise PaymentInitializationError(data.get('message', 'Payment initialization failed'))
        return {
            'authorization_url': data['data']['authorization_url'],
            'access_code': data['data']['access_code'],
        }

    def verify_payment(self, reference):
        try:
            response = _requests.get(
                f'{self._verify_url}/{reference}',
                headers=self.headers, timeout=30,
            )
            response.raise_for_status()
        except RequestException as exc:
            raise PaymentVerificationError(str(exc)) from exc
        data = response.json()
        if not data.get('status'):
            raise PaymentVerificationError(data.get('message', 'Payment verification failed'))
        tx_data = data['data']
        return {
            'status': tx_data.get('status'),
            'amount': tx_data.get('amount'),
            'gateway_reference': tx_data.get('reference'),
            'paid_at': tx_data.get('paid_at'),
            'channel': tx_data.get('channel'),
            'raw_response': data,
        }

    def verify_webhook_signature(self, payload, signature):
        import hmac
        import hashlib
        computed = hmac.new(
            settings.PAYSTACK_WEBHOOK_SECRET.encode('utf-8'),
            payload,
            hashlib.sha512,
        ).hexdigest()
        return hmac.compare_digest(computed, signature)
