from django.urls import path

from .views import (
    ShippingAddressCreateAPIView,
    ShippingAddressAPIView,
    OrderCreateAPIView,
    OrderListAPIView,
    OrderAPIView,
    OrderItemCreateAPIView,
    OrderItemListAPIView,
    OrderItemAPIView,
    CheckoutAPIView,
)


urlpatterns = [

    # ========================================================
    # SHIPPING ADDRESSES
    # ========================================================

    path(
        "shipping-addresses/create/",
        ShippingAddressCreateAPIView.as_view(),
        name="shipping-address-create",
    ),

    path(
        "shipping-addresses/<int:pk>/",
        ShippingAddressAPIView.as_view(),
        name="shipping-address-detail",
    ),


    # ========================================================
    # ORDERS
    # ========================================================

    path(
        "orders/create/",
        OrderCreateAPIView.as_view(),
        name="order-create",
    ),

    path(
        "orders/",
        OrderListAPIView.as_view(),
        name="order-list",
    ),

    path(
        "orders/<int:pk>/",
        OrderAPIView.as_view(),
        name="order-detail",
    ),


    # ========================================================
    # ORDER ITEMS
    # ========================================================

    path(
        "order-items/create/",
        OrderItemCreateAPIView.as_view(),
        name="order-item-create",
    ),

    path(
        "order-items/",
        OrderItemListAPIView.as_view(),
        name="order-item-list",
    ),

    path(
        "order-items/<int:pk>/",
        OrderItemAPIView.as_view(),
        name="order-item-detail",
    ),


    # ========================================================
    # CHECKOUT
    # ========================================================

    path(
        "checkout/",
        CheckoutAPIView.as_view(),
        name="checkout",
    ),
]