from .tasks import (
    send_registration_email_task,
    send_order_confirmation_email_task,
    send_payment_success_email_task,
    send_order_shipped_email_task,
    send_order_delivered_email_task,
    send_password_reset_email_task,
)


def notify_user_registered(user):

    send_registration_email_task.delay(user.id)


def notify_order_created(order):

    send_order_confirmation_email_task.delay(order.id)


def notify_payment_success(payment):

    send_payment_success_email_task.delay(payment.id)


def notify_order_shipped(order):

    send_order_shipped_email_task.delay(order.id)


def notify_order_delivered(order):

    send_order_delivered_email_task.delay(order.id)


def notify_password_reset(user, reset_link):

    send_password_reset_email_task.delay(
        user.id,
        reset_link,
    )