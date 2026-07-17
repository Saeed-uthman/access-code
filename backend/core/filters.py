from django.db import models
import django_filters
from django.contrib.auth import get_user_model
from transactions.models import Transaction
from access_code.models import AccessCode
from notifications.models import Notification

User = get_user_model()


class UserFilter(django_filters.FilterSet):
    email = django_filters.CharFilter(lookup_expr='icontains')
    role = django_filters.ChoiceFilter(choices=User.ROLE_CHOICES)
    is_active = django_filters.BooleanFilter()
    is_blocked = django_filters.BooleanFilter()
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = User
        fields = ['role', 'is_active', 'is_blocked']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(email__icontains=value)
            | models.Q(full_name__icontains=value)
            | models.Q(username__icontains=value)
        )


class TransactionFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Transaction.STATUS_CHOICES)
    payment_method = django_filters.ChoiceFilter(choices=Transaction.PAYMENT_METHOD_CHOICES)
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Transaction
        fields = ['status', 'payment_method']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(payment_reference__icontains=value)
            | models.Q(user__email__icontains=value)
        )


class AccessCodeFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=AccessCode.STATUS_CHOICES)
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = AccessCode
        fields = ['status']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(code__icontains=value)
            | models.Q(assigned_to__email__icontains=value)
        )


class NotificationFilter(django_filters.FilterSet):
    notification_type = django_filters.ChoiceFilter(choices=Notification.NOTIFICATION_TYPES)
    is_read = django_filters.BooleanFilter()

    class Meta:
        model = Notification
        fields = ['notification_type', 'is_read']
