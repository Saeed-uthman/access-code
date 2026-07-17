from django.contrib import admin
from .models import Notification, BulkNotification, EmailTemplate


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'user__email']
    ordering = ['-created_at']


@admin.register(BulkNotification)
class BulkNotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'target_audience', 'status', 'sent_count', 'created_at']
    list_filter = ['status', 'target_audience', 'created_at']
    ordering = ['-created_at']


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'template_type', 'subject', 'is_active', 'created_at']
    list_filter = ['template_type', 'is_active']
    ordering = ['template_type']
