from django.urls import path
from . import views

urlpatterns = [
    path('', views.PlanListView.as_view(), name='plan-list'),
    path('<uuid:pk>/', views.PlanDetailView.as_view(), name='plan-detail'),
    path('admin/', views.AdminPlanListView.as_view(), name='admin-plan-list'),
    path('admin/create/', views.AdminPlanCreateView.as_view(), name='admin-plan-create'),
    path('admin/<uuid:pk>/', views.AdminPlanDetailView.as_view(), name='admin-plan-detail'),
    path('admin/<uuid:pk>/update/', views.AdminPlanUpdateView.as_view(), name='admin-plan-update'),
    path('admin/<uuid:pk>/delete/', views.AdminPlanDeleteView.as_view(), name='admin-plan-delete'),
    path('admin/<uuid:plan_id>/toggle-status/', views.toggle_plan_status_view, name='toggle-plan-status'),
    path('admin/stats/', views.admin_plan_stats_view, name='admin-plan-stats'),
]
