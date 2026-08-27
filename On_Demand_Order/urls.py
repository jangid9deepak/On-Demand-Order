from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path
from django.views.static import serve


urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),


    # ========================================================
    # ACCOUNTS
    # ========================================================

    path(
        "accounts/",
        include("accounts.urls")
    ),


    # ========================================================
    # PRODUCTS
    # ========================================================

    path(
        "products/",
        include("products.urls")
    ),


    # ========================================================
    # CART
    # ========================================================

    path(
        "cart/",
        include("cart.urls")
    ),


    # ========================================================
    # ORDERS
    # ========================================================

    path(
        "orders/",
        include("orders.urls")
    ),


    # ========================================================
    # PAYMENTS
    # ========================================================

    path(
        "payments/",
        include("payments.urls")
    ),
]


urlpatterns += [
    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {"document_root": settings.MEDIA_ROOT},
    )
]