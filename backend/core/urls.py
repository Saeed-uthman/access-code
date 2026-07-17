from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard_stats_view, name='dashboard-stats'),
    path('system-stats/', views.system_stats_view, name='system-stats'),
    path('system-health/', views.system_health_view, name='system-health'),
    path('admin/settings/', views.AdminSystemSettingsListView.as_view(), name='admin-system-settings'),
    path('admin/settings/<uuid:pk>/', views.AdminSystemSettingsDetailView.as_view(), name='admin-system-setting-detail'),
    path('admin/activities/', views.AdminActivityLogListView.as_view(), name='admin-activity-logs'),
    path('gallery-photos/', views.PublicGalleryPhotoListView.as_view(), name='gallery-photo-list'),
    path('admin/gallery-photos/', views.AdminGalleryPhotoListCreateView.as_view(), name='admin-gallery-photo-list'),
    path('analytics/', views.analytics_overview_view, name='analytics-overview'),
]
