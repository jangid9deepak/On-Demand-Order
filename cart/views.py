from products.models import Product

from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


class RegisterCartAPIView(GenericAPIView):

    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        if not created:
            return Response(
                {
                    "message": "Cart already exists."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(cart)

        return Response(
            {
                "message": "Cart created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class CartAPIView(GenericAPIView):

    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:
            cart = Cart.objects.get(user=request.user)

        except Cart.DoesNotExist:
            return Response(
                {
                    "message": "Cart not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(cart)

        return Response(
            {
                "message": "Cart fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request):

        try:
            cart = Cart.objects.get(user=request.user)

        except Cart.DoesNotExist:
            return Response(
                {
                    "message": "Cart not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        cart.delete()

        return Response(
            {
                "message": "Cart deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )


class RegisterCartItemAPIView(GenericAPIView):

    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        try:
            product = Product.objects.get(
                pk=request.data["product"]
            )

        except Product.DoesNotExist:

            return Response(
                {
                    "message": "Product not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        quantity = int(request.data.get("quantity", 1))

        if quantity <= 0:

            return Response(
                {
                    "message": "Quantity must be greater than zero."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity > product.product_stock:

            return Response(
                {
                    "message": f"Only {product.product_stock} items available."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item = CartItem.objects.filter(
            cart=cart,
            product=product,
        ).first()

        if cart_item:

            new_quantity = cart_item.quantity + quantity

            if new_quantity > product.product_stock:

                return Response(
                    {
                        "message": f"Only {product.product_stock} items available."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart_item.quantity = new_quantity
            cart_item.save()

            serializer = self.get_serializer(cart_item)

            return Response(
                {
                    "message": "Cart updated successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        serializer.save(
            cart=cart
        )

        return Response(
            {
                "message": "Product added to cart successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class CartItemAPIView(GenericAPIView):

    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        cart_item = self.get_object()

        if cart_item.cart.user != request.user:

            return Response(
                {
                    "message": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(cart_item)

        return Response(
            {
                "message": "Cart item fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        cart_item = self.get_object()

        if cart_item.cart.user != request.user:

            return Response(
                {
                    "message": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            cart_item,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data.get(
            "quantity",
            cart_item.quantity,
        )

        if quantity > cart_item.product.product_stock:

            return Response(
                {
                    "message": f"Only {cart_item.product.product_stock} items available."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()

        return Response(
            {
                "message": "Cart item updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        cart_item = self.get_object()

        if cart_item.cart.user != request.user:

            return Response(
                {
                    "message": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            cart_item,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data.get(
            "quantity",
            cart_item.quantity,
        )

        if quantity > cart_item.product.product_stock:

            return Response(
                {
                    "message": f"Only {cart_item.product.product_stock} items available."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()

        return Response(
            {
                "message": "Cart item updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        cart_item = self.get_object()

        if cart_item.cart.user != request.user:

            return Response(
                {
                    "message": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        cart_item.delete()

        return Response(
            {
                "message": "Cart item deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )