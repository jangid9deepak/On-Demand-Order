from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notifications.services import notify_user_registered

from .models import CustomUser, Vendor
from .serializers import RegisterSerializer, VendorRegisterSerializer


from rest_framework_simplejwt.views import TokenObtainPairView
from core.throttles import LoginRateThrottle


class LoginView(TokenObtainPairView):
    throttle_classes = [LoginRateThrottle]


# =========================================================
# USER REGISTER
# =========================================================

class RegisterAPIView(GenericAPIView):

    serializer_class = RegisterSerializer

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        notify_user_registered(user)

        return Response(
            {
                "message": "User registered successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


# =========================================================
# USER PROFILE
# =========================================================

class ProfileAPIView(GenericAPIView):

    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

    # GET PROFILE
    def get(self, request):

        serializer = self.get_serializer(
            request.user
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # PUT PROFILE
    def put(self, request):

        serializer = self.get_serializer(
            request.user,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Profile updated successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    # PATCH PROFILE
    def patch(self, request):

        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Profile updated successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    # DELETE ACCOUNT
    def delete(self, request):

        request.user.delete()

        return Response(
            {
                "message": "Account deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT
        )


# =========================================================
# CREATE VENDOR
# =========================================================

class RegisterVendor(GenericAPIView):

    serializer_class = VendorRegisterSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # Check whether vendor profile already exists
        vendor_exists = Vendor.objects.filter(
            user=request.user
        ).exists()

        if vendor_exists:

            return Response(
                {
                    "message": "Vendor account already exists."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate vendor data
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # Create vendor profile
        serializer.save(
            user=request.user
        )

        # Change user role to VENDOR
        request.user.role = CustomUser.Role.VENDOR

        request.user.save(
            update_fields=["role"]
        )

        return Response(
            {
                "message": "Vendor account created successfully.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )


# =========================================================
# VENDOR PROFILE
# =========================================================

class VendorProfileAPIView(GenericAPIView):

    serializer_class = VendorRegisterSerializer
    permission_classes = [IsAuthenticated]

    # GET VENDOR PROFILE
    def get(self, request):

        try:
            vendor = request.user.vendor_profile

        except Vendor.DoesNotExist:

            return Response(
                {
                    "message": "Vendor profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            vendor
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # PUT VENDOR PROFILE
    def put(self, request):

        try:
            vendor = request.user.vendor_profile

        except Vendor.DoesNotExist:

            return Response(
                {
                    "message": "Vendor profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            vendor,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Vendor profile updated successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    # PATCH VENDOR PROFILE
    def patch(self, request):

        try:
            vendor = request.user.vendor_profile

        except Vendor.DoesNotExist:

            return Response(
                {
                    "message": "Vendor profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            vendor,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Vendor profile updated successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    # DELETE VENDOR PROFILE
    def delete(self, request):

        try:
            vendor = request.user.vendor_profile

        except Vendor.DoesNotExist:

            return Response(
                {
                    "message": "Vendor profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        vendor.delete()

        # Change role back to CUSTOMER
        request.user.role = CustomUser.Role.CUSTOMER

        request.user.save(
            update_fields=["role"]
        )

        return Response(
            {
                "message": "Vendor account removed successfully."
            },
            status=status.HTTP_204_NO_CONTENT
        )