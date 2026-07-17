from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
import uuid
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    phone_number = PhoneNumberField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user', db_index=True)
    is_email_verified = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name', 'phone_number']
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['role', 'is_blocked'], name='idx_user_role_blocked'),
            models.Index(fields=['created_at'], name='idx_user_created'),
        ]
        
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_verified(self):
        return self.is_email_verified


class OTPVerification(models.Model):
    OTP_TYPES = [
        ('email', 'Email'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_verifications')
    otp_type = models.CharField(max_length=10, choices=OTP_TYPES)
    otp_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'otp_verifications'
        unique_together = ['user', 'otp_type']
    
    def __str__(self):
        return f"OTP for {self.user.email} ({self.otp_type})"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    @classmethod
    def create_otp(cls, user, otp_type):
        import secrets
        otp_code = f"{secrets.randbelow(1000000):06d}"
        expires_at = timezone.now() + timedelta(minutes=10)
        
        # Delete existing OTP for this user and type
        cls.objects.filter(user=user, otp_type=otp_type).delete()
        
        return cls.objects.create(
            user=user,
            otp_type=otp_type,
            otp_code=otp_code,
            expires_at=expires_at
        )


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"Profile for {self.user.full_name}"