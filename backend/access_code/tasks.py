import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task
def expire_old_codes():
    from access_code.services import CodeService
    count = CodeService.expire_codes()
    return f'Expired {count} access codes'
