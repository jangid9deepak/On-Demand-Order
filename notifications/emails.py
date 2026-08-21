from django.conf import settings
from django.core.mail import send_mail


def send_registration_email(user):

    subject = "Welcome to Our E-Commerce Platform"

    message = f"""
        Hi {user.username},

        Welcome to our E-Commerce Platform.

        Your account has been created successfully.

        Happy Shopping!

        Regards,
        Deepak Jangid,
        E-Commerce Team
        """

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_order_confirmation_email(user, order):

    subject = f"Order #{order.id} Confirmed"

    message = f"""
        Hi {user.username},

        Your order has been placed successfully.

        Order ID : {order.id}

        Total Amount : ₹{order.total_amount}

        Current Status : {order.order_status}

        Thank you for shopping with us.

        Regards,
        Deepak Jangid,
        E-Commerce Team
        """

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_payment_success_email(user, payment):

    subject = "Payment Successful"

    message = f"""
        Hi {user.username},

        Your payment has been received successfully.

        Payment ID : {payment.id}

        Amount : ₹{payment.amount}

        Payment Method : {payment.payment_method}

        Transaction ID : {payment.transaction_id}

        Thank you for your purchase.

        Regards,
        Deepak Jangid,
        E-Commerce Team
        """

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_order_shipped_email(user, order):

    subject = f"Order #{order.id} Shipped"

    message = f"""
        Hi {user.username},

        Good News!

        Your order has been shipped.

        Order ID : {order.id}

        Current Status : {order.order_status}

        Your order is on the way.

        Regards,
        Deepak Jangid,
        E-Commerce Team
        """

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_order_delivered_email(user, order):

    subject = f"Order #{order.id} Delivered"

    message = f"""
        Hi {user.username},

        Your order has been delivered successfully.

        Order ID : {order.id}

        We hope you enjoy your purchase.

        Thank you for shopping with us.

        Regards,
        Deepak Jangid,
        E-Commerce Team
        """

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_password_reset_email(user, reset_link):

    subject = "Reset Your Password"

    message = f"""
        Hi {user.username},

        We received a request to reset your password.

        Click the link below to reset it:

        {reset_link}

        If you did not request a password reset, you can safely ignore this email.

        Regards,
        Deepak Jangid,
        E-Commerce Team
        """

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )