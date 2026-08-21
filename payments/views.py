from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from .models import Payment
from .serializers import PaymentSerializer


class PaymentCreateAPIView(GenericAPIView):

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save(user=request.user)

        return Response(
            {
                "message": "Payment created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
        
class PaymentAPIView(GenericAPIView):

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            payment = Payment.objects.get(
                pk=pk,
                user=request.user,
            )

        except Payment.DoesNotExist:
            return Response(
                {
                    "message": "Payment not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(payment)

        return Response(
            {
                "message": "Payment fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
        

class PaymentListAPIView(ListAPIView):

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            user=self.request.user
        )        