from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class LoginThrottle(AnonRateThrottle):
    scope = 'login'
    rate = '10/minute'


class OTPThrottle(AnonRateThrottle):
    scope = 'otp'
    rate = '5/minute'


class PasswordChangeThrottle(UserRateThrottle):
    scope = 'password_change'
    rate = '5/hour'


class PaymentThrottle(UserRateThrottle):
    scope = 'payment'
    rate = '20/hour'


class WebhookThrottle(AnonRateThrottle):
    scope = 'webhook'
    rate = '500/hour'
