from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category

        fields = [
            "id",
            "category_name",
            "category_description",
            "category_image",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_category_name(self, value):

        queryset = Category.objects.filter(
            category_name=value
        )

        # During update, don't consider the current category
        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "Category already exists."
            )

        return value


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product

        fields = [
            "id",
            "vendor",
            "category",
            "product_name",
            "product_description",
            "product_price",
            "product_image",
            "product_stock",
            "is_available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "vendor",
            "created_at",
            "updated_at",
        ]

    def validate_product_name(self, value):

        request = self.context.get("request")

        vendor = None

        if request and request.user.is_authenticated:

            vendor = getattr(
                request.user,
                "vendor_profile",
                None
            )

        queryset = Product.objects.filter(
            product_name=value
        )

        if vendor:
            queryset = queryset.filter(
                vendor=vendor
            )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():

            raise serializers.ValidationError(
                "Product already exists for this vendor."
            )

        return value