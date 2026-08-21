from rest_framework import serializers

from .models import (
    ShippingAddress,
    Order,
    OrderItem,
)


class ShippingSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingAddress

        fields = [
            "id",
            "user",
            "full_name",
            "phone_number",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "pincode",
            "country",
            "is_default",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order

        fields = [
            "id",
            "user",
            "shipping_address",
            "total_amount",
            "payment_method",
            "payment_status",
            "order_status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "total_amount",
            "payment_status",
            "order_status",
            "created_at",
            "updated_at",
        ]


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "order",
            "product",
            "vendor",
            "quantity",
            "price_at_purchase",
            "subtotal",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "price_at_purchase",
            "subtotal",
            "created_at",
        ]