from django.contrib import admin
from .models import SystemSettings, ActivityLog, SystemHealth, GalleryPhoto


@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ['key', 'value', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['key', 'value']


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action_type', 'description', 'ip_address', 'created_at']
    list_filter = ['action_type', 'created_at']
    ordering = ['-created_at']


@admin.register(SystemHealth)
class SystemHealthAdmin(admin.ModelAdmin):
    list_display = ['component', 'status', 'message', 'checked_at']
    list_filter = ['status', 'component']
    ordering = ['-checked_at']


@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ['id', 'photo', 'date_uploaded']
    ordering = ['-date_uploaded']
