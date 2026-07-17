from django.conf import settings
from django.db.models import Count, Sum
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.models import User
from accounts.permissions import IsAdminUser
from accounts.serializers import UserSerializer
from access_code.models import AccessCode
from plans.models import Plan
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer

from .models import ActivityLog, GalleryPhoto, SystemHealth, SystemSettings
from .serializers import (
    ActivityLogSerializer, GalleryPhotoSerializer,
    SystemHealthSerializer, SystemSettingsSerializer,
)
from .services import DashboardService
from .utils import check_system_health


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats_view(request):
    if request.user.is_admin:
        stats = DashboardService.get_admin_stats()
        return Response(stats)
    else:
        stats = DashboardService.get_user_stats(request.user)
        return Response(stats)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def system_stats_view(request):
    from notifications.models import Notification
    stats = DashboardService.get_admin_stats()
    return Response({
        'users_stats': {
            'total_users': stats['total_users'],
            'admin_users': User.objects.filter(role='admin').count(),
            'regular_users': User.objects.filter(role='user').count(),
            'blocked_users': stats['blocked_users'],
        },
        'plans_stats': {
            'total_plans': Plan.objects.count(),
            'active_plans': stats['active_plans'],
        },
        'transactions_stats': {
            'total_transactions': stats['total_transactions'],
            'completed_transactions': stats['completed_transactions'],
            'total_revenue': stats['total_revenue'],
        },
        'access_codes_stats': {
            'total_codes': stats['total_codes'],
            'available_codes': stats['available_codes'],
        },
    })


class AdminSystemSettingsListView(generics.ListCreateAPIView):
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        return SystemSettings.objects.all().order_by('key')


class AdminSystemSettingsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAdminUser]
    queryset = SystemSettings.objects.all()


class AdminActivityLogListView(generics.ListAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        return ActivityLog.objects.all().order_by('-created_at')


class PublicGalleryPhotoListView(generics.ListAPIView):
    serializer_class = GalleryPhotoSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    def get_queryset(self):
        return GalleryPhoto.objects.all().order_by('-date_uploaded')


class AdminGalleryPhotoListCreateView(generics.ListCreateAPIView):
    serializer_class = GalleryPhotoSerializer
    permission_classes = [IsAdminUser]
    pagination_class = None
    def get_queryset(self):
        return GalleryPhoto.objects.all().order_by('-date_uploaded')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def system_health_view(request):
    health_checks = check_system_health()
    for check in health_checks:
        SystemHealth.objects.create(
            component=check['component'], status=check['status'],
            message=check['message'],
        )
    return Response(health_checks)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_overview_view(request):
    analytics = DashboardService.get_analytics()
    return Response(analytics)
