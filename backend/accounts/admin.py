from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, OTPVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'username', 'role', 'is_verified', 'is_blocked', 'created_at']
    list_filter = ['role', 'is_email_verified', 'is_blocked', 'created_at']
    search_fields = ['email', 'full_name', 'username']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'username', 'phone_number')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'is_blocked')}),
        ('Verification', {'fields': ('is_email_verified',)}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'username', 'phone_number', 'password1', 'password2', 'role'),
        }),
    )

    readonly_fields = ['created_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'address', 'date_of_birth', 'created_at']
    search_fields = ['user__email', 'user__full_name']
    list_filter = ['created_at']


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'otp_type', 'otp_code', 'is_verified', 'expires_at', 'created_at']
    list_filter = ['otp_type', 'is_verified', 'created_at']
    search_fields = ['user__email', 'user__full_name']
    readonly_fields = ['otp_code']
