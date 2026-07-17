from django.db import models
from django.contrib.auth import get_user_model
from plans.models import Plan
import uuid
from django.utils import timezone

User = get_user_model()


class AccessCode(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('used', 'Used'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='access_codes')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', db_index=True)
    is_used = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_codes')
    used_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='used_codes')
    assigned_at = models.DateTimeField(null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'access_codes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at'], name='idx_code_status_created'),
            models.Index(fields=['plan', 'status'], name='idx_code_plan_status'),
            models.Index(fields=['assigned_to', 'status'], name='idx_code_user_status'),
            models.Index(fields=['expires_at', 'status'], name='idx_code_expiry_status'),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.plan.name} ({self.status})"
    
    def assign_to_user(self, user):
        """Assign this access code to a user and mark as assigned and active (not used)"""
        self.assigned_to = user
        self.status = 'assigned'  # Mark as assigned, not used
        self.is_used = False      # Not used yet
        self.assigned_at = timezone.now()
        self.used_by = None
        self.used_at = None
        self.expires_at = timezone.now() + timezone.timedelta(days=self.plan.validity_days)
        self.save()
    
    def mark_as_used(self, user):
        """Mark this access code as used by a user"""
        self.used_by = user
        self.is_used = True
        self.status = 'used'
        self.used_at = timezone.now()
        self.save()
    
    def is_expired(self):
        """Check if the access code has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def days_until_expiry(self):
        """Get days until expiry"""
        if self.expires_at:
            delta = self.expires_at - timezone.now()
            return delta.days if delta.days > 0 else 0
        return None


class AccessCodeUpload(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='code_uploads')
    file_name = models.CharField(max_length=255)
    total_codes = models.IntegerField(default=0)
    successful_imports = models.IntegerField(default=0)
    failed_imports = models.IntegerField(default=0)
    upload_status = models.CharField(max_length=20, choices=[
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ], default='processing')
    error_log = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'access_code_uploads'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Upload {self.file_name} by {self.uploaded_by.full_name}"