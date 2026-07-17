from django.db import models
from django.contrib.auth import get_user_model
from plans.models import Plan
from access_code.models import AccessCode
import uuid
from decimal import Decimal

User = get_user_model()


class Transaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('paystack', 'Paystack'),
        ('flutterwave', 'Flutterwave'),
        ('bank_transfer', 'Bank Transfer'),
        ('card', 'Card Payment'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', null=True, blank=True)
    anon_email = models.EmailField(null=True, blank=True)
    anon_phone = models.CharField(max_length=32, null=True, blank=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='transactions')
    access_code = models.ForeignKey(AccessCode, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    
    # Transaction details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment details
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_reference = models.CharField(max_length=100, unique=True)
    gateway_reference = models.CharField(max_length=100, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Status and timestamps
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    paid_at = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional fields
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at'], name='idx_txn_status_created'),
            models.Index(fields=['user', 'status'], name='idx_txn_user_status'),
            models.Index(fields=['plan', 'status'], name='idx_txn_plan_status'),
            models.Index(fields=['payment_method', 'status'], name='idx_txn_method_status'),
            models.Index(fields=['paid_at'], name='idx_txn_paid_at'),
        ]
    
    def __str__(self):
        user_str = str(self.user) if self.user else (self.anon_email or self.anon_phone or 'Anonymous')
        return f"Transaction {self.payment_reference} - {user_str} - ₦{self.total_amount}"
    
    def save(self, *args, **kwargs):
        # Calculate total amount
        self.total_amount = self.amount * self.quantity
        super().save(*args, **kwargs)
    
    @property
    def is_successful(self):
        return self.status == 'completed'
    
    @property
    def can_be_refunded(self):
        return self.status == 'completed' and not self.access_code.is_used if self.access_code else False


class PaymentLog(models.Model):
    LOG_TYPES = [
        ('webhook', 'Webhook'),
        ('api_call', 'API Call'),
        ('manual', 'Manual'),
        ('system', 'System'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='payment_logs')
    log_type = models.CharField(max_length=20, choices=LOG_TYPES)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payment_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.log_type} - {self.transaction.payment_reference}"


class RefundRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processed', 'Processed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='refund_request')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refund_requests')
    reason = models.TextField()
    admin_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_refunds')
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'refund_requests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Refund Request - {self.transaction.payment_reference} - ₦{self.refund_amount}"