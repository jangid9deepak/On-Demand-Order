from django.contrib import admin
from .models import Vendor, CustomUser

admin.site.register(CustomUser)
admin.site.register(Vendor)