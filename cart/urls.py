from django.urls import path

from .views import (RegisterCartAPIView, CartAPIView, RegisterCartItemAPIView, CartItemAPIView)

urlpatterns = [

    
    path("cart/", RegisterCartAPIView.as_view(), name="register-cart"),

    path("cart/details/", CartAPIView.as_view(), name="cart-details"),

    # Cart Item APIs
    path("cart/items/", RegisterCartItemAPIView.as_view(), name="add-cart-item"),

    path("cart/items/<int:pk>/", CartItemAPIView.as_view(), name="cart-item"),
]