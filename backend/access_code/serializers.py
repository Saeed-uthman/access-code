from rest_framework import serializers
from .models import AccessCode, AccessCodeUpload
from plans.serializers import PlanSerializer
from accounts.serializers import UserSerializer


class AccessCodeSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    used_by = UserSerializer(read_only=True)
    days_until_expiry = serializers.ReadOnlyField()
    
    class Meta:
        model = AccessCode
        fields = [
            'id', 'code', 'plan', 'status', 'is_used', 'assigned_to', 'used_by',
            'assigned_at', 'used_at', 'expires_at', 'days_until_expiry',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'code', 'plan', 'created_at', 'updated_at', 'assigned_to', 'used_by']


class AccessCodeUploadSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = AccessCodeUpload
        fields = [
            'id', 'uploaded_by', 'file_name', 'total_codes', 'successful_imports',
            'failed_imports', 'upload_status', 'error_log', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class UserAccessCodeSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    days_until_expiry = serializers.ReadOnlyField()
    
    class Meta:
        model = AccessCode
        fields = ['id', 'code', 'plan', 'status', 'assigned_at', 'expires_at', 'days_until_expiry']
        read_only_fields = ['id', 'code', 'plan', 'status', 'assigned_at', 'expires_at']
