from django.contrib import admin
from .models import Plan


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'plan_type', 'cost', 'validity', 'validity_days',
        'is_active', 'available_codes_count', 'sold_codes_count', 'created_at',
    ]
    list_filter = ['plan_type', 'validity', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['plan_type', 'cost']
    readonly_fields = ['created_at', 'updated_at', 'available_codes_count', 'sold_codes_count']
