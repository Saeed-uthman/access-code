from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.UserTransactionListView.as_view(), name='user-transactions'),
    path('<uuid:pk>/', views.UserTransactionDetailView.as_view(), name='user-transaction-detail'),
    path('create/', views.CreateTransactionView.as_view(), name='create-transaction'),
    path('initialize-payment/', views.initialize_payment_view, name='initialize-payment'),
    path('verify-payment/', views.verify_payment_view, name='verify-payment'),
    path('webhook/', views.payment_webhook_view, name='payment-webhook'),
    path('admin/', views.AdminTransactionListView.as_view(), name='admin-transactions'),
    path('admin/<uuid:pk>/', views.AdminTransactionDetailView.as_view(), name='admin-transaction-detail'),
    path('admin/stats/', views.admin_transaction_stats_view, name='admin-transaction-stats'),
]
