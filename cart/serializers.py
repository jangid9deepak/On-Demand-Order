from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):

    # Product name
    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    # Product price
    product_price = serializers.DecimalField(
        source="product.product_price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    # Product description
    product_description = serializers.CharField(
        source="product.product_description",
        read_only=True
    )

    # Product image
    product_image = serializers.SerializerMethodField()

    # Quantity × price
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem

        fields = [
            "id",
            "cart",
            "product",

            "product_name",
            "product_price",
            "product_description",
            "product_image",

            "quantity",
            "subtotal",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "cart",
            "product_name",
            "product_price",
            "product_description",
            "product_image",
            "subtotal",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):

        # For POST, product comes from attrs.
        # For PATCH, product is not sent because it already exists
        # on the CartItem instance.
        product = attrs.get("product")

        if product is None and self.instance:
            product = self.instance.product

        # Same logic for quantity
        quantity = attrs.get("quantity")

        if quantity is None and self.instance:
            quantity = self.instance.quantity

        if quantity <= 0:
            raise serializers.ValidationError({
                "quantity": "Quantity must be greater than zero."
            })

        if quantity > product.product_stock:
            raise serializers.ValidationError({
                "quantity": (
                    f"Only {product.product_stock} "
                    "items are available in stock."
                )
            })

        return attrs

    def get_product_image(self, obj):

        if not obj.product.product_image:
            return None

        request = self.context.get("request")

        image_url = obj.product.product_image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url

    def get_subtotal(self, obj):

        return obj.product.product_price * obj.quantity


class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    total_items = serializers.SerializerMethodField()

    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart

        fields = [
            "id",
            "user",
            "items",
            "total_items",
            "total_amount",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "items",
            "total_items",
            "total_amount",
            "created_at",
            "updated_at",
        ]

    def get_total_items(self, obj):

        return sum(
            item.quantity
            for item in obj.items.all()
        )

    def get_total_amount(self, obj):

        return sum(
            item.product.product_price * item.quantity
            for item in obj.items.all()
        )