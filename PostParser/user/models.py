from django.contrib.auth.models import User
from django.db import models

class UserIP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    @property
    def amount_ips(self):
        return len(self.ips.all())
    

class IP(models.Model):
    user = models.ForeignKey(UserIP, on_delete=models.CASCADE, related_name="ips", verbose_name="Пользователь")
    ip = models.CharField(max_length=30, verbose_name="IP Пользователя")

    class Meta:
        verbose_name = "IP"
        verbose_name_plural="IPs"