from rest_framework import serializers
from notifications.models import Notification, BulkNotification, EmailTemplate


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'is_read', 'read_at',
            'action_url', 'action_text', 'metadata', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class BulkNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulkNotification
        fields = [
            'id', 'title', 'message', 'target_audience', 'notification_type',
            'status', 'total_recipients', 'sent_count', 'created_at', 'sent_at',
        ]
        read_only_fields = ['id', 'created_at', 'sent_at']


class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = ['id', 'name', 'template_type', 'subject', 'html_content', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
