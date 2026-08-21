from django.urls import path

from .views import (
    CategoryCreateAPIView,
    CategoryAPIView,
    CategoryListAPIView,
    ProductCreateAPIView,
    ProductAPIView,
    ProductListAPIView,
)


urlpatterns = [

    # =====================================================
    # CATEGORIES
    # =====================================================

    path(
        "categories/",
        CategoryListAPIView.as_view(),
        name="category-list",
    ),

    path(
        "categories/create/",
        CategoryCreateAPIView.as_view(),
        name="category-create",
    ),

    path(
        "categories/<int:pk>/",
        CategoryAPIView.as_view(),
        name="category-detail",
    ),

    # =====================================================
    # PRODUCTS
    # =====================================================

    path(
        "products/",
        ProductListAPIView.as_view(),
        name="product-list",
    ),

    path(
        "products/create/",
        ProductCreateAPIView.as_view(),
        name="product-create",
    ),

    path(
        "products/<int:pk>/",
        ProductAPIView.as_view(),
        name="product-detail",
    ),
]