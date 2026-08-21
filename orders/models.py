from django.db import models
from accounts.models import CustomUser
from products.models import Product
from accounts.models import Vendor



class ShippingAddress(models.Model):

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="shipping_addresses")
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default="India")
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.city})"
    

class PaymentMethod(models.TextChoices):
    CASH_ON_DELIVERY = "COD", "Cash On Delivery"
    UPI = "UPI", "UPI"
    CREDIT_CARD = "CC", "Credit Card"
    DEBIT_CARD = "DC", "Debit Card"
    NET_BANKING = "NB", "Net Banking"


class PaymentStatus(models.TextChoices):
    PENDING = "Pending", "Pending"
    PAID = "Paid", "Paid"
    FAILED = "Failed", "Failed"
    REFUNDED = "Refunded", "Refunded"


class OrderStatus(models.TextChoices):
    PENDING = "Pending", "Pending"
    CONFIRMED = "Confirmed", "Confirmed"
    PACKED = "Packed", "Packed"
    SHIPPED = "Shipped", "Shipped"
    OUT_FOR_DELIVERY = "Out For Delivery", "Out For Delivery"
    DELIVERED = "Delivered", "Delivered"
    CANCELLED = "Cancelled", "Cancelled"


class Order(models.Model):

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="orders")
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.PROTECT, related_name="orders")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.CASH_ON_DELIVERY)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    order_status = models.CharField(max_length=30, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_items")
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.product_name} ({self.quantity})" 
    

       