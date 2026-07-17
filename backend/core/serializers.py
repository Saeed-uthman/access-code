from rest_framework import serializers
from .models import SystemSettings, ActivityLog, SystemHealth, GalleryPhoto


class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = ['id', 'key', 'value', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action_type', 'description', 'ip_address', 'user_agent', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']


class SystemHealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemHealth
        fields = ['id', 'component', 'status', 'message', 'details', 'checked_at']
        read_only_fields = ['id', 'checked_at']


class GalleryPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPhoto
        fields = ['id', 'photo', 'date_uploaded']
        read_only_fields = ['id', 'date_uploaded']
