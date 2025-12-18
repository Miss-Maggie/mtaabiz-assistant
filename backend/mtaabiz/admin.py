from django.contrib import admin
from .models import Invoice, MessageTemplate

# Register your models here.
admin.site.register(Invoice)
admin.site.register(MessageTemplate)
