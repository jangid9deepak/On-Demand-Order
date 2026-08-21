from .views import ( ProfileAPIView, RegisterAPIView, RegisterVendor, VendorProfileAPIView, LoginView)

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [

    # User registration
    path("users/register/", RegisterAPIView.as_view(), name="register"),

    # Logged-in user profile
    path("users/profile/", ProfileAPIView.as_view(), name="profile"),


    # Vendor registration
    path("vendors/register/", RegisterVendor.as_view(), name="vendor-register"),


    # Logged-in vendor profile
    path("vendors/profile/", VendorProfileAPIView.as_view(), name="vendor-profile"),


    # JWT authentication
    path("login/", LoginView.as_view(), name="login"),

    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]