from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<uuid:pk>/read/', views.mark_notification_read_view, name='mark-notification-read'),
    path('read-all/', views.mark_all_notifications_read_view, name='mark-all-read'),
    path('unread-count/', views.unread_count_view, name='unread-count'),
    path('admin/', views.AdminNotificationListView.as_view(), name='admin-notification-list'),
    path('admin/bulk/', views.AdminBulkNotificationCreateView.as_view(), name='admin-bulk-notification'),
]
