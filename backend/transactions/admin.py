from django.contrib import admin
from .models import Transaction, PaymentLog, RefundRequest


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['payment_reference', 'user', 'plan', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['payment_reference', 'user__full_name', 'user__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'total_amount']


@admin.register(PaymentLog)
class PaymentLogAdmin(admin.ModelAdmin):
    list_display = ['transaction', 'log_type', 'message', 'created_at']
    list_filter = ['log_type', 'created_at']
    ordering = ['-created_at']


@admin.register(RefundRequest)
class RefundRequestAdmin(admin.ModelAdmin):
    list_display = ['transaction', 'user', 'refund_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    ordering = ['-created_at']
