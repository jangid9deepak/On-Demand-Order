from django.db import models
from accounts.models import CustomUser
from orders.models import Order


class Payment(models.Model):

    class PaymentMethod(models.TextChoices):
        COD = "COD", "Cash On Delivery"
        RAZORPAY = "RAZORPAY", "Razorpay"

    class PaymentStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="payments")

    order = models.OneToOneField( Order, on_delete=models.CASCADE, related_name="payment")

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices)

    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)

    transaction_id = models.CharField(max_length=255, blank=True, null=True)

    paid_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField( auto_now_add=True)

    updated_at = models.DateTimeField( auto_now=True)

    def __str__(self):
        return f"Payment #{self.id} - {self.order.id}"