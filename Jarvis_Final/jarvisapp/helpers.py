from django.core.mail import send_mail
import uuid
from django.conf import settings

def send_forget_email(email, token):
    subject = 'Forget Password link'
    message = f'Click on the link to reset your password http://127.0.0.1:8000/authrization/change_password/{token}/'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    
    try:
        send_mail(subject, message, email_from, recipient_list)
        return True
    except Exception as e:
        print(e)  # Print the error for debugging
        return False
