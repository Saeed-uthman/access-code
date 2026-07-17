from django.db import models
import uuid


class Plan(models.Model):
    PLAN_TYPES = [
        ('house', 'House'),
        ('individual', 'Individual'),
        ('business', 'Business'),
    ]
    
    VALIDITY_CHOICES = [
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    validity = models.CharField(max_length=20, choices=VALIDITY_CHOICES)
    validity_days = models.IntegerField(help_text="Number of days the plan is valid")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'plans'
        ordering = ['plan_type', 'cost']
        indexes = [
            models.Index(fields=['plan_type', 'is_active'], name='idx_plan_type_active'),
            models.Index(fields=['is_active'], name='idx_plan_active'),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.get_plan_type_display()} (₦{self.cost})"
    
    @property
    def available_codes_count(self):
        return self.access_codes.filter(is_used=False).count()
    
    @property
    def sold_codes_count(self):
        return self.access_codes.filter(is_used=True).count()
    
    def save(self, *args, **kwargs):
        # Set validity_days based on validity choice
        validity_mapping = {
            'hourly': 1,
            'daily': 1,
            'weekly': 7,
            'monthly': 30,
            'yearly': 365,
        }
        
        if not self.validity_days and self.validity in validity_mapping:
            self.validity_days = validity_mapping[self.validity]
        
        super().save(*args, **kwargs)
