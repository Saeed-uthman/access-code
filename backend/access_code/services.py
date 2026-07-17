import logging
from django.db import transaction
from django.utils import timezone

from access_code.models import AccessCode

logger = logging.getLogger(__name__)


class CodeService:
    @staticmethod
    def assign_codes_for_transaction(tx, count=1):
        codes = AccessCode.objects.filter(
            plan=tx.plan, status='available',
        ).order_by('created_at')[:count]
        assigned = []
        for code in codes:
            code.assigned_to = tx.user
            code.status = 'assigned'
            code.assigned_at = timezone.now()
            code.expires_at = timezone.now() + timezone.timedelta(days=tx.plan.validity_days)
            code.save()
            assigned.append(code)
        return assigned

    @staticmethod
    def expire_codes():
        expired = AccessCode.objects.filter(
            status__in=['assigned', 'used'],
            expires_at__lte=timezone.now(),
        ).update(status='expired')
        return expired

    @staticmethod
    def get_user_active_codes(user):
        return AccessCode.objects.filter(
            assigned_to=user, status='assigned',
            expires_at__gt=timezone.now(),
        ).select_related('plan').order_by('-assigned_at')

    @staticmethod
    def bulk_upload(codes_data, plan):
        created = []
        for code_text in codes_data:
            obj, was_created = AccessCode.objects.get_or_create(
                code=code_text, plan=plan,
                defaults={'status': 'available'},
            )
            if was_created:
                created.append(obj)
        return created
