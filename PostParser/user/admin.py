from django.contrib import admin
from .models import UserIP, IP

# Register your models here.
class IPInline(admin.TabularInline):
    model = IP

@admin.register(UserIP)
class UserIPAdmin(admin.ModelAdmin):
    inlines = [IPInline,]
    list_display = ('user','amount_ips')