from abc import ABC, abstractmethod


class PaymentGateway(ABC):
    @abstractmethod
    def initialize_payment(self, amount, reference, email, callback_url='', metadata=None):
        pass

    @abstractmethod
    def verify_payment(self, reference):
        pass

    @abstractmethod
    def verify_webhook_signature(self, payload, signature):
        pass


class PaymentError(Exception):
    pass


class PaymentInitializationError(PaymentError):
    pass


class PaymentVerificationError(PaymentError):
    pass
