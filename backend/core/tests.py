import pytest
from core.models import SystemSettings, ActivityLog, SystemHealth, GalleryPhoto


@pytest.mark.django_db
class TestSystemSettings:
    def test_create_setting(self):
        setting = SystemSettings.objects.create(
            key='site_name', value='YAROTECH', description='Site name', is_active=True,
        )
        assert setting.key == 'site_name'
        assert setting.value == 'YAROTECH'

    def test_table_name(self):
        assert SystemSettings._meta.db_table == 'system_settings'


@pytest.mark.django_db
class TestActivityLog:
    def test_create_log(self, regular_user):
        log = ActivityLog.objects.create(
            user=regular_user, action_type='login', description='User logged in',
        )
        assert log.user == regular_user
        assert log.action_type == 'login'

    def test_table_name(self):
        assert ActivityLog._meta.db_table == 'activity_logs'


@pytest.mark.django_db
class TestSystemHealth:
    def test_create_health(self):
        health = SystemHealth.objects.create(
            component='database', status='healthy', message='OK',
        )
        assert health.component == 'database'

    def test_table_name(self):
        assert SystemHealth._meta.db_table == 'system_health'


@pytest.mark.django_db
class TestGalleryPhoto:
    def test_photo_str(self):
        photo = GalleryPhoto.objects.create()
        assert 'Gallery photo' in str(photo)

    def test_table_name(self):
        assert GalleryPhoto._meta.db_table == 'gallery_photos'
