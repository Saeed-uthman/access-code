from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


def _swagger_permission_classes():
    if settings.DEBUG:
        return [permissions.AllowAny]
    return [permissions.IsAdminUser]


schema_view = get_schema_view(
    openapi.Info(
        title="YAROTECH API",
        default_version='v1',
        description="API documentation for YAROTECH WiFi Access System",
    ),
    public=True,
    permission_classes=_swagger_permission_classes(),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/plans/', include('plans.urls')),
    path('api/v1/access-codes/', include('access_code.urls')),
    path('api/v1/transactions/', include('transactions.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
    path('api/v1/core/', include('core.urls')),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
