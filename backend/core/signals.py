# newsletter/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
import logging

from .models import NewsletterSubscriber, ContactMessage, EventBooking

logger = logging.getLogger(__name__)

def send_dual_email(subject_visitor, subject_admin, template_base, context, visitor_email):
    """
    Send email to both visitor and admin
    """
    try:
        # Email to Visitor
        html_visitor = render_to_string(f'newsletter/emails/{template_base}_visitor.html', context)
        text_visitor = render_to_string(f'newsletter/emails/{template_base}_visitor.txt', context)
        
        visitor_msg = EmailMultiAlternatives(
            subject=subject_visitor,
            body=text_visitor,
            from_email=settings.NEWSLETTER_FROM_EMAIL,
            to=[visitor_email]
        )
        visitor_msg.attach_alternative(html_visitor, "text/html")
        visitor_msg.send()
        
        # Email to Admin
        html_admin = render_to_string(f'newsletter/emails/{template_base}_admin.html', context)
        text_admin = render_to_string(f'newsletter/emails/{template_base}_admin.txt', context)
        
        admin_msg = EmailMultiAlternatives(
            subject=subject_admin,
            body=text_admin,
            from_email=settings.NEWSLETTER_FROM_EMAIL,
            to=[settings.ADMIN_EMAIL]
        )
        admin_msg.attach_alternative(html_admin, "text/html")
        admin_msg.send()
        
        logger.info(f"Dual emails sent successfully to {visitor_email} and admin")
        print(f"Dual emails sent successfully to {visitor_email} and admin")
        
    except Exception as e:
        logger.error(f"Error sending dual emails: {e}")
        raise

@receiver(post_save, sender=NewsletterSubscriber)
def newsletter_subscription_notification(sender, instance, created, **kwargs):
    """
    Send welcome email to new subscriber and notification to admin
    """
    if created and instance.status == 'active':
        try:
            context = {
                'subscriber': instance,
                'site_url': settings.SITE_URL,
                'unsubscribe_url': f"{settings.SITE_URL}/newsletter/unsubscribe/{instance.unsubscribe_token}/",
                'preferences_url': f"{settings.SITE_URL}/newsletter/preferences/{instance.unsubscribe_token}/",
                'current_year': timezone.now().year,
            }
            
            send_dual_email(
                subject_visitor="Welcome to Obsidian Lifestyle - Elite Sports Newsletter",
                subject_admin=f"New Newsletter Subscription - {instance.email}",
                template_base='newsletter_welcome',
                context=context,
                visitor_email=instance.email
            )
            
            logger.info(f"Newsletter subscription emails sent for {instance.email}")
            
        except Exception as e:
            logger.error(f"Error in newsletter subscription notification: {e}")

@receiver(post_save, sender=ContactMessage)
def contact_form_notification(sender, instance, created, **kwargs):
    """
    Send confirmation to visitor and notification to admin when contact form is submitted
    """
    if created:
        try:
            context = {
                'contact': instance,
                'site_url': settings.SITE_URL,
                'current_year': timezone.now().year,
            }
            
            send_dual_email(
                subject_visitor="We've Received Your Message - Obsidian Lifestyle",
                subject_admin=f"New Contact Form Submission - {instance.name}",
                template_base='contact_form',
                context=context,
                visitor_email=instance.email
            )
            
            logger.info(f"Contact form emails sent for {instance.email}")
            
        except Exception as e:
            logger.error(f"Error in contact form notification: {e}")

@receiver(post_save, sender=EventBooking)
def event_booking_notification(sender, instance, created, **kwargs):
    """
    Send booking confirmation to visitor and notification to admin
    """
    if created:
        try:
            context = {
                'booking': instance,
                'site_url': settings.SITE_URL,
                'current_year': timezone.now().year,
            }
            
            send_dual_email(
                subject_visitor=f"Booking Request Received - {instance.event_title}",
                subject_admin=f"New Event Booking Request - {instance.event_title}",
                template_base='event_booking',
                context=context,
                visitor_email=instance.email
            )
            
            logger.info(f"Event booking emails sent for {instance.email}")
            
        except Exception as e:
            logger.error(f"Error in event booking notification: {e}")