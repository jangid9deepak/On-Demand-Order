from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):

    class Role(models.TextChoices):
        CUSTOMER = "CUSTOMER", "Customer"
        VENDOR = "VENDOR", "Vendor"

    role = models.CharField(max_length=20,choices=Role.choices,default=Role.CUSTOMER)
    phone = models.CharField(max_length=15)
    profile_image = models.ImageField(upload_to="profiles/",blank=True,null=True)
    address = models.TextField()

    def __str__(self):
        return self.username
    


class Vendor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="vendor_profile")
    gst_number = models.CharField(max_length=15)
    pan_number = models.CharField(max_length=10)
    upi_id = models.CharField(max_length=20)
    business_name = models.CharField(max_length=30)
    business_address = models.TextField()

    
    def __str__(self):
        return self.business_name