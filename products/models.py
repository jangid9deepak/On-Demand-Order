from django.db import models
from accounts.models import Vendor


class Category(models.Model):

    category_name = models.CharField(max_length=50)

    category_description = models.TextField()

    category_image = models.ImageField(
        upload_to="categories/")

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category_name


class Product(models.Model):

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="products"
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    product_name = models.CharField(max_length=100)

    product_description = models.TextField()

    product_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    product_image = models.ImageField(
        upload_to="products/")

    product_stock = models.PositiveIntegerField()

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name