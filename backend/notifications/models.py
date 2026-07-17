from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('payment_success', 'Payment Success'),
        ('payment_failed', 'Payment Failed'),
        ('payment_reminder', 'Payment Reminder'),
        ('codes_assigned', 'Access Codes Assigned'),
        ('expiry_warning', 'Expiry Warning'),
        ('low_stock', 'Low Stock Alert'),
        ('system_announcement', 'System Announcement'),
        ('account_update', 'Account Update'),
        ('general', 'General'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES, db_index=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional fields for rich notifications
    action_url = models.URLField(blank=True)
    action_text = models.CharField(max_length=50, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read'], name='idx_notif_user_read'),
            models.Index(fields=['user', 'notification_type'], name='idx_notif_user_type'),
            models.Index(fields=['created_at'], name='idx_notif_created'),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.full_name}"
    
    def mark_as_read(self):
        if not self.is_read:
            from django.utils import timezone
            self.is_read = True
            self.read_at = timezone.now()
            self.save()


class BulkNotification(models.Model):
    TARGET_AUDIENCE_CHOICES = [
        ('all_users', 'All Users'),
        ('admin_users', 'Admin Users'),
        ('regular_users', 'Regular Users'),
        ('house_plan_users', 'House Plan Users'),
        ('individual_plan_users', 'Individual Plan Users'),
        ('business_plan_users', 'Business Plan Users'),
        ('verified_users', 'Verified Users'),
        ('unverified_users', 'Unverified Users'),
    ]
    NOTIFICATION_TYPE_CHOICES = Notification.NOTIFICATION_TYPES
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bulk_notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    target_audience = models.CharField(max_length=30, choices=TARGET_AUDIENCE_CHOICES)
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES, default='system_announcement')
    
    # Sending details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_recipients = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    
    # Optional fields
    action_url = models.URLField(blank=True)
    action_text = models.CharField(max_length=50, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'bulk_notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Bulk: {self.title} - {self.get_target_audience_display()}"


class EmailTemplate(models.Model):
    TEMPLATE_TYPES = [
        ('welcome', 'Welcome Email'),
        ('otp_verification', 'OTP Verification'),
        ('payment_success', 'Payment Success'),
        ('payment_failed', 'Payment Failed'),
        ('expiry_warning', 'Expiry Warning'),
        ('bulk_announcement', 'Bulk Announcement'),
        ('password_reset', 'Password Reset'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=30, choices=TEMPLATE_TYPES)
    subject = models.CharField(max_length=200)
    html_content = models.TextField()
    text_content = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Template variables (JSON field to store available variables)
    available_variables = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'email_templates'
        ordering = ['template_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"