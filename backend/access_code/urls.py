from django.urls import path
from . import views

urlpatterns = [
    path('my-codes/', views.UserAccessCodeListView.as_view(), name='user-access-codes'),
    path('admin/stats/', views.access_code_stats_view, name='access-code-stats'),
    path('admin/assign/', views.assign_access_code_view, name='assign-access-code'),
    path('admin/bulk-upload/', views.bulk_add_access_codes_view, name='bulk-upload-codes'),
    path('admin/', views.AdminAccessCodeListView.as_view(), name='admin-access-codes'),
    path('admin/<uuid:pk>/', views.AdminAccessCodeDetailView.as_view(), name='admin-access-code-detail'),
]
