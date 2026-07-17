from rest_framework import serializers
from transactions.models import Transaction, PaymentLog, RefundRequest
from plans.serializers import PlanSerializer
from accounts.serializers import UserSerializer


class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    plan = PlanSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'plan', 'access_code', 'amount', 'quantity', 'total_amount',
            'payment_method', 'payment_reference', 'gateway_reference', 'status',
            'paid_at', 'created_at', 'updated_at', 'description', 'notes',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_amount']


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['plan', 'quantity', 'payment_method', 'description']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value


class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = [
            'id', 'transaction', 'user', 'reason', 'status', 'refund_amount', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PaymentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentLog
        fields = ['id', 'log_type', 'message', 'data', 'created_at']
        read_only_fields = ['id', 'created_at']
