from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    client_name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_issued = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client_name} - {self.amount}"

class MessageTemplate(models.Model):
    CATEGORY_CHOICES = (
        ('MARKETING', 'Marketing'),
        ('REMINDER', 'Payment Reminder'),
        ('FOLLOWUP', 'Follow Up'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_templates', null=True, blank=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
