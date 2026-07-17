from rest_framework import serializers
from .models import Plan


class PlanSerializer(serializers.ModelSerializer):
    available_codes_count = serializers.ReadOnlyField()
    sold_codes_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'plan_type', 'cost', 'validity', 'validity_days',
            'description', 'is_active', 'available_codes_count',
            'sold_codes_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PlanCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['name', 'plan_type', 'cost', 'validity', 'validity_days', 'description', 'is_active']
