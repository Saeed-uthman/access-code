from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from notifications.models import Notification, BulkNotification
from notifications.serializers import NotificationSerializer, BulkNotificationSerializer
from notifications.services import NotificationService
from accounts.permissions import IsAdminUser


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read_view(request, pk):
    notif = NotificationService.mark_read(pk, request.user)
    return Response({'message': 'Marked as read'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read_view(request):
    count = NotificationService.mark_all_read(request.user)
    return Response({'message': f'{count} notifications marked as read'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count_view(request):
    count = NotificationService.get_unread_count(request.user)
    return Response({'unread_count': count})


class AdminNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Notification.objects.all().order_by('-created_at')


class AdminBulkNotificationCreateView(generics.CreateAPIView):
    serializer_class = BulkNotificationSerializer
    permission_classes = [IsAdminUser]
