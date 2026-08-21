from rest_framework import serializers
from .models import CustomUser, Vendor


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = [
        "username",
        "email",
        "password",
        "phone",
        "address",
        "role",
    ]

    read_only_fields = [
        "role",
    ]
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    

class VendorRegisterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Vendor
        fields = [
            "gst_number",
            "pan_number",
            "upi_id",
           "business_name",
            "business_address"                    
        ]
            
    def create(self, validate_data):
        vendor = Vendor.objects.create(**validate_data)
        return vendor
    
    
    