from celery import shared_task
import logging

from .emails import (
    send_registration_email,
    send_order_confirmation_email,
    send_payment_success_email,
    send_order_shipped_email,
    send_order_delivered_email,
    send_password_reset_email,
)
from accounts.models import CustomUser
from orders.models import Order
from payments.models import Payment

logger = logging.getLogger(__name__)



@shared_task(bind=True, max_retries=3)
def send_registration_email_task(self, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        send_registration_email(user)

    except CustomUser.DoesNotExist:
        # No point retrying — this user will never exist no matter how many times we try.
        # Just log it and stop.
        logger.warning(f"User {user_id} does not exist. Skipping email.")

    except Exception as e:
        # Anything else (SMTP down, network issue, etc.) is worth retrying.
        raise self.retry(exc=e, countdown=10)            


@shared_task(bind=True, max_retries=3)
def send_order_confirmation_email_task(self, order_id):
    try:
        order = Order.objects.get(id=order_id)
        send_order_confirmation_email(order.user, order)

    except Order.DoesNotExist:
        # Order will never appear by retrying — not retryable.
        logger.warning(f"Order {order_id} does not exist. Skipping confirmation email.")

    except Exception as e:
        # SMTP/network issues — worth retrying.
        raise self.retry(exc=e, countdown=10)
    

@shared_task(bind=True, max_retries=3)
def send_payment_success_email_task(self, payment_id):
    try:

        payment = Payment.objects.get(id=payment_id)

        send_payment_success_email(payment.user, payment)
    
    except Payment.DoesNotExist:
        logger.warning(f"Payment Id {payment_id} does not exist. Skipping confirmation email.")
 
    except Exception as e:
        # SMTP/network issues — worth retrying.
        raise self.retry(exc=e, countdown=10)
         
        

@shared_task(bind=True, max_retries=3)
def send_order_shipped_email_task(self, order_id):
    
    try:

        order = Order.objects.get(id=order_id)

        send_order_shipped_email(order.user, order)
    
    except Order.DoesNotExist:
        # Order will never appear by retrying — not retryable.
        logger.warning(f"Order {order_id} does not exist. Skipping confirmation email.")

    except Exception as e:
        # SMTP/network issues — worth retrying.
        raise self.retry(exc=e, countdown=10)
        

@shared_task(bind=True, max_retries=3)
def send_order_delivered_email_task(self, order_id):
    
    try:

        order = Order.objects.get(id=order_id)

        send_order_delivered_email(order.user, order)

    except Order.DoesNotExist:
        # Order will never appear by retrying — not retryable.
        logger.warning(f"Order {order_id} does not exist. Skipping confirmation email.")

    except Exception as e:
        # SMTP/network issues — worth retrying.
        raise self.retry(exc=e, countdown=10)


@shared_task(bind=True, max_retries=3)
def send_password_reset_email_task(self, user_id, reset_link):
    
    try:

        user = CustomUser.objects.get(id=user_id)

        send_password_reset_email(user, reset_link)

    except CustomUser.DoesNotExist:
        # No point retrying — this user will never exist no matter how many times we try.
        # Just log it and stop.
        logger.warning(f"User {user_id} does not exist. Skipping email.")

    except Exception as e:
        # Anything else (SMTP down, network issue, etc.) is worth retrying.
        raise self.retry(exc=e, countdown=10)            
        