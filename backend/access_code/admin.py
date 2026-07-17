from django.contrib import admin
from .models import AccessCode, AccessCodeUpload


@admin.register(AccessCode)
class AccessCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'plan', 'status', 'assigned_to', 'used_by', 'expires_at', 'created_at']
    list_filter = ['status', 'plan__plan_type', 'plan', 'created_at']
    search_fields = ['code', 'assigned_to__full_name', 'assigned_to__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(AccessCodeUpload)
class AccessCodeUploadAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'uploaded_by', 'total_codes', 'successful_imports', 'failed_imports', 'upload_status', 'created_at']
    list_filter = ['upload_status', 'created_at']
    ordering = ['-created_at']
