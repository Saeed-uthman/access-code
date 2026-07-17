import json
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('audit')


class AdminAuditMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return response
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return response
        if not getattr(request.user, 'role', '') == 'admin':
            return response
        audit_data = {
            'event': 'admin_action',
            'user_id': str(request.user.id),
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
        }
        logger.info(json.dumps(audit_data))
        return response
