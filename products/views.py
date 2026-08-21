from rest_framework import status
from rest_framework.generics import (GenericAPIView, ListAPIView)

from django.core.cache import cache

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework.filters import (SearchFilter, OrderingFilter)

from django_filters.rest_framework import (DjangoFilterBackend)

from .models import Category, Product
from .serializers import (CategorySerializer, ProductSerializer)


# =========================================================
# CATEGORY CREATE
# =========================================================

class CategoryCreateAPIView(GenericAPIView):

    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Category created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


# =========================================================
# CATEGORY LIST
# =========================================================

class CategoryListAPIView(ListAPIView):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "category_name",
        "category_description",
    ]

    ordering_fields = [
        "category_name",
        "created_at",
    ]

    ordering = [
        "category_name",
    ]


# =========================================================
# CATEGORY DETAIL
# =========================================================

class CategoryAPIView(GenericAPIView):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        category = self.get_object()

        serializer = self.get_serializer(
            category
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        category = self.get_object()

        serializer = self.get_serializer(
            category,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Category updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        category = self.get_object()

        serializer = self.get_serializer(
            category,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Category updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        category = self.get_object()

        category.delete()

        return Response(
            {
                "message": "Category deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )


# =========================================================
# PRODUCT CREATE
# =========================================================

class ProductCreateAPIView(GenericAPIView):

    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        vendor = getattr(
            request.user,
            "vendor_profile",
            None
        )

        if vendor is None:

            return Response(
                {
                    "message": "Only vendors can add products."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            vendor=vendor
        )

        cache.delete_pattern("product_list:*")

        return Response(
            {
                "message": "Product created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


# =========================================================
# PRODUCT LIST
# =========================================================

class ProductListAPIView(ListAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        SearchFilter,
        DjangoFilterBackend,
        OrderingFilter,
    ]

    search_fields = [
        "product_name",
        "product_description",
        "category__category_name",
    ]

    filterset_fields = [
        "category",
        "vendor",
        "is_available",
    ]

    ordering_fields = [
        "product_price",
        "created_at",
        "product_name",
    ]

    ordering = [
        "-created_at"
    ]

    def list(self, request, *args, **kwargs):

        cache_key = f"product_list:{request.GET.urlencode()}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            print(f"CACHE Hit: {cache_key}")
            return Response(cached_data)
            
        
        
        
        print(f"CACHE MISS: {cache_key}")

        response = super().list(request, *args, **kwargs)

        cache.set(cache_key, response.data, 300)  # 300 seconds = 5 minutes TTL

        return response


# =========================================================
# PRODUCT DETAIL
# =========================================================

class ProductAPIView(GenericAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        product = self.get_object()

        serializer = self.get_serializer(
            product
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        product = self.get_object()

        vendor = getattr(
            request.user,
            "vendor_profile",
            None
        )

        if vendor is None or product.vendor != vendor:

            return Response(
                {
                    "message":
                    "You are not allowed to update this product."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            product,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        cache.delete_pattern("product_list:*")

        return Response(
            {
                "message": "Product updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        product = self.get_object()

        vendor = getattr(
            request.user,
            "vendor_profile",
            None
        )

        if vendor is None or product.vendor != vendor:

            return Response(
                {
                    "message":
                    "You are not allowed to update this product."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            product,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        cache.delete_pattern("product_list:*")

        return Response(
            {
                "message": "Product updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        product = self.get_object()

        vendor = getattr(
            request.user,
            "vendor_profile",
            None
        )

        if vendor is None or product.vendor != vendor:

            return Response(
                {
                    "message":
                    "You are not allowed to delete this product."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        product.delete()

        cache.delete_pattern("product_list:*")

        return Response(
            {
                "message": "Product deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )