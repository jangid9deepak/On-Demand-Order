from decimal import Decimal
from django.db import transaction
from rest_framework import status
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from cart.models import Cart, CartItem
from products.models import Product
from notifications.services import notify_order_created
from .models import (
    ShippingAddress,
    Order,
    OrderItem,
    PaymentMethod,
)

from .serializers import (
    ShippingSerializer,
    OrderSerializer,
    OrderItemSerializer,
)


# ============================================================
# SHIPPING ADDRESS CREATE
# ============================================================

class ShippingAddressCreateAPIView(GenericAPIView):

    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        shipping_address = serializer.save(
            user=request.user
        )

        return Response(
            {
                "message": "Shipping address created successfully.",
                "data": self.get_serializer(
                    shipping_address
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# SHIPPING ADDRESS DETAIL
# ============================================================

class ShippingAddressAPIView(GenericAPIView):

    serializer_class = ShippingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return ShippingAddress.objects.filter(
            user=self.request.user
        )

    def get(self, request, pk):

        try:

            shipping_address = self.get_queryset().get(
                pk=pk
            )

        except ShippingAddress.DoesNotExist:

            return Response(
                {
                    "message": "Shipping address not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            shipping_address
        )

        return Response(
            {
                "message": "Shipping address fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        try:

            shipping_address = self.get_queryset().get(
                pk=pk
            )

        except ShippingAddress.DoesNotExist:

            return Response(
                {
                    "message": "Shipping address not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            shipping_address,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Shipping address updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        try:

            shipping_address = self.get_queryset().get(
                pk=pk
            )

        except ShippingAddress.DoesNotExist:

            return Response(
                {
                    "message": "Shipping address not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            shipping_address,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Shipping address updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        try:

            shipping_address = self.get_queryset().get(
                pk=pk
            )

        except ShippingAddress.DoesNotExist:

            return Response(
                {
                    "message": "Shipping address not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        shipping_address.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


# ============================================================
# CREATE ORDER
# ============================================================

class OrderCreateAPIView(GenericAPIView):

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        order = serializer.save(
            user=request.user
        )

        return Response(
            {
                "message": "Order created successfully.",
                "data": self.get_serializer(order).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# ORDER LIST
# ============================================================

class OrderListAPIView(ListAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


# ============================================================
# ORDER DETAIL
# ============================================================

class OrderAPIView(GenericAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        )

    def get(self, request, pk):

        try:

            order = self.get_queryset().get(
                pk=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "message": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(order)

        return Response(
            {
                "message": "Order fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        try:

            order = self.get_queryset().get(
                pk=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "message": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            order,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Order updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        try:

            order = self.get_queryset().get(
                pk=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "message": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            order,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Order updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        try:

            order = self.get_queryset().get(
                pk=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "message": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        order.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


# ============================================================
# CREATE ORDER ITEM
# ============================================================

class OrderItemCreateAPIView(GenericAPIView):

    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        order = serializer.validated_data.get(
            "order"
        )

        if order.user != request.user:

            return Response(
                {
                    "message": "You cannot add items to another user's order."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        order_item = serializer.save()

        return Response(
            {
                "message": "Order item created successfully.",
                "data": self.get_serializer(
                    order_item
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# ORDER ITEM LIST
# ============================================================

class OrderItemListAPIView(ListAPIView):

    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return OrderItem.objects.filter(
            order__user=self.request.user
        ).order_by("-created_at")


# ============================================================
# ORDER ITEM DETAIL
# ============================================================

class OrderItemAPIView(GenericAPIView):

    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return OrderItem.objects.filter(
            order__user=self.request.user
        )

    def get(self, request, pk):

        try:

            order_item = self.get_queryset().get(
                pk=pk
            )

        except OrderItem.DoesNotExist:

            return Response(
                {
                    "message": "Order item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            order_item
        )

        return Response(
            {
                "message": "Order item fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        try:

            order_item = self.get_queryset().get(
                pk=pk
            )

        except OrderItem.DoesNotExist:

            return Response(
                {
                    "message": "Order item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            order_item,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Order item updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        try:

            order_item = self.get_queryset().get(
                pk=pk
            )

        except OrderItem.DoesNotExist:

            return Response(
                {
                    "message": "Order item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            order_item,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message": "Order item updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        try:

            order_item = self.get_queryset().get(
                pk=pk
            )

        except OrderItem.DoesNotExist:

            return Response(
                {
                    "message": "Order item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        order_item.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


# ============================================================
# CHECKOUT
# ============================================================

class CheckoutAPIView(GenericAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        # ----------------------------------------------------
        # 1. GET CART
        # ----------------------------------------------------

        try:

            cart = Cart.objects.get(
                user=request.user
            )

        except Cart.DoesNotExist:

            return Response(
                {
                    "message": "Cart not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        # ----------------------------------------------------
        # 2. GET CART ITEMS
        # ----------------------------------------------------

        cart_items = CartItem.objects.filter(
            cart=cart
        ).select_related(
            "product"
        )

        if not cart_items.exists():

            return Response(
                {
                    "message": "Your cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        # ----------------------------------------------------
        # 3. SHIPPING ADDRESS
        # ----------------------------------------------------

        shipping_address_id = request.data.get(
            "shipping_address"
        )

        if not shipping_address_id:

            return Response(
                {
                    "message": "Shipping address is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            shipping_address = ShippingAddress.objects.get(
                pk=shipping_address_id,
                user=request.user,
            )

        except ShippingAddress.DoesNotExist:

            return Response(
                {
                    "message": "Shipping address not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        # ----------------------------------------------------
        # 4. PAYMENT METHOD
        # ----------------------------------------------------

        payment_method = request.data.get(
            "payment_method",
            PaymentMethod.CASH_ON_DELIVERY,
        )

        valid_payment_methods = [
            choice[0]
            for choice in PaymentMethod.choices
        ]

        if payment_method not in valid_payment_methods:

            return Response(
                {
                    "message": "Invalid payment method."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        # ----------------------------------------------------
        # 5. LOCK PRODUCTS + CHECK STOCK
        # ----------------------------------------------------

        products = {}

        for item in cart_items:

            product = Product.objects.select_for_update().get(
                pk=item.product.pk
            )

            products[item.product.pk] = product

            if item.quantity <= 0:

                return Response(
                    {
                        "message": (
                            f"Invalid quantity for "
                            f"{product.product_name}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if item.quantity > product.product_stock:

                return Response(
                    {
                        "message": (
                            f"Only {product.product_stock} "
                            f"{product.product_name} available."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )


        # ----------------------------------------------------
        # 6. CREATE ORDER
        # ----------------------------------------------------

        order = Order.objects.create(
            user=request.user,
            shipping_address=shipping_address,
            payment_method=payment_method,
            total_amount=Decimal("0.00"),
        )


        total_amount = Decimal("0.00")


        # ----------------------------------------------------
        # 7. CREATE ORDER ITEMS
        # ----------------------------------------------------

        for item in cart_items:

            product = products[item.product.pk]

            subtotal = (
                product.product_price *
                item.quantity
            )

            OrderItem.objects.create(
                order=order,
                product=product,
                vendor=product.vendor,
                quantity=item.quantity,
                price_at_purchase=product.product_price,
                subtotal=subtotal,
            )

            total_amount += subtotal

            # Reduce stock
            product.product_stock -= item.quantity

            product.save(
                update_fields=["product_stock"]
            )


        # ----------------------------------------------------
        # 8. UPDATE ORDER TOTAL
        # ----------------------------------------------------

        order.total_amount = total_amount

        order.save(
            update_fields=["total_amount"]
        )


        # ----------------------------------------------------
        # 9. SEND ORDER NOTIFICATION
        # ----------------------------------------------------

        try:

            notify_order_created(order)

        except Exception as e:

            print(
                "Order notification error:",
                e
            )


        # ----------------------------------------------------
        # 10. CLEAR CART
        # ----------------------------------------------------

        cart_items.delete()


        # ----------------------------------------------------
        # 11. RETURN RESPONSE
        # ----------------------------------------------------

        serializer = self.get_serializer(
            order
        )

        return Response(
            {
                "message": "Order placed successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )