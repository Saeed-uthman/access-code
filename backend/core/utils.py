from core.models import ActivityLog


def log_activity(user=None, action_type='system', description='', ip_address=None, user_agent='', metadata=None):
    if metadata is None:
        metadata = {}
    ActivityLog.objects.create(
        user=user, action_type=action_type, description=description,
        ip_address=ip_address, user_agent=user_agent, metadata=metadata,
    )


def check_system_health():
    health_checks = []
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_checks.append({'component': 'database', 'status': 'healthy', 'message': 'Database connection is working'})
    except Exception as e:
        health_checks.append({'component': 'database', 'status': 'critical', 'message': f'Database connection failed: {str(e)}'})
    return health_checks


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')
