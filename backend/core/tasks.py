# newsletter/tasks.py
"""
Celery tasks for automated newsletter generation and data fetching
"""
from celery import shared_task
from celery.schedules import crontab
from celery.utils.log import get_task_logger
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from .data_fetcher import DataFetcher
from .generator import NewsletterGeneratorV2
from core.models import Newsletter, NewsletterAnalytics

logger = get_task_logger(__name__)


@shared_task(name='newsletter.fetch_sports_data')
def fetch_sports_data_task(sports=None, fetch_trending=False):
    """
    Celery task to fetch sports data from APIs
    
    Args:
        sports: List of sports to fetch (None = all)
        fetch_trending: Whether to fetch trending news
    
    Schedule: Every 6 hours
    """
    logger.info("Starting scheduled data fetch task")
    
    try:
        fetcher = DataFetcher()
        
        if fetch_trending:
            results = fetcher.fetch_trending_news(limit=30)
            logger.info(f"Trending news fetch results: {results}")
        else:
            results = fetcher.fetch_all_data(sports=sports)
            
            # Log results
            total_news = sum(stats['saved'] for stats in results['news'].values())
            total_fixtures = sum(stats['saved'] for stats in results['fixtures'].values())
            
            logger.info(
                f"Data fetch completed: {total_news} articles, "
                f"{total_fixtures} fixtures saved"
            )
        
        return {
            'status': 'success',
            'results': results,
            'timestamp': timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in fetch_sports_data_task: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


@shared_task(name='newsletter.generate_weekly_newsletter')
def generate_weekly_newsletter_task(refresh_data=True, send_immediately=False):
    """
    Celery task to generate weekly newsletter
    
    Args:
        refresh_data: Whether to refresh data from APIs first
        send_immediately: Whether to send immediately after generation
    
    Schedule: Every Monday at 6:00 AM
    """
    logger.info("Starting weekly newsletter generation task")
    
    try:
        generator = NewsletterGeneratorV2()
        
        # Generate newsletter
        newsletter = generator.generate_weekly_newsletter(refresh_data=refresh_data)
        
        if newsletter:
            logger.info(
                f"Newsletter generated successfully: {newsletter.id}, "
                f"{newsletter.articles.count()} articles, "
                f"{newsletter.fixtures.count()} fixtures"
            )
            
            # Send if requested
            if send_immediately:
                send_results = generator.send_newsletter_to_subscribers(newsletter)
                logger.info(
                    f"Newsletter sent: {send_results['sent']} successful, "
                    f"{send_results['failed']} failed"
                )
                
                return {
                    'status': 'success',
                    'newsletter_id': str(newsletter.id),
                    'sent': send_results['sent'],
                    'failed': send_results['failed'],
                    'timestamp': timezone.now().isoformat()
                }
            else:
                return {
                    'status': 'success',
                    'newsletter_id': str(newsletter.id),
                    'saved_as': 'draft',
                    'timestamp': timezone.now().isoformat()
                }
        else:
            logger.error("Failed to generate newsletter")
            return {
                'status': 'error',
                'error': 'Newsletter generation failed',
                'timestamp': timezone.now().isoformat()
            }
        
    except Exception as e:
        logger.error(f"Error in generate_weekly_newsletter_task: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


@shared_task(name='newsletter.send_newsletter')
def send_newsletter_task(newsletter_id):
    """
    Celery task to send a specific newsletter
    
    Args:
        newsletter_id: ID of newsletter to send
    """
    logger.info(f"Starting newsletter send task for newsletter {newsletter_id}")
    
    try:
        newsletter = Newsletter.objects.get(id=newsletter_id)
        generator = NewsletterGeneratorV2()
        
        results = generator.send_newsletter_to_subscribers(newsletter)
        
        logger.info(
            f"Newsletter {newsletter_id} sent: {results['sent']} successful, "
            f"{results['failed']} failed"
        )
        
        return {
            'status': 'success',
            'newsletter_id': str(newsletter_id),
            'sent': results['sent'],
            'failed': results['failed'],
            'timestamp': timezone.now().isoformat()
        }
        
    except Newsletter.DoesNotExist:
        logger.error(f"Newsletter {newsletter_id} not found")
        return {
            'status': 'error',
            'error': 'Newsletter not found',
            'timestamp': timezone.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in send_newsletter_task: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


@shared_task(name='newsletter.cleanup_old_data')
def cleanup_old_data_task(days=30):
    """
    Celery task to clean up old articles and fixtures
    
    Args:
        days: Delete data older than this many days
    
    Schedule: Every Sunday at 2:00 AM
    """
    logger.info(f"Starting cleanup task (removing data older than {days} days)")
    
    try:
        fetcher = DataFetcher()
        results = fetcher.cleanup_old_data(days=days)
        
        logger.info(
            f"Cleanup completed: {results['deleted_articles']} articles, "
            f"{results['deleted_fixtures']} fixtures deleted"
        )
        
        return {
            'status': 'success',
            'deleted_articles': results['deleted_articles'],
            'deleted_fixtures': results['deleted_fixtures'],
            'cutoff_date': results['cutoff_date'].isoformat(),
            'timestamp': timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in cleanup_old_data_task: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


@shared_task(name='newsletter.calculate_newsletter_analytics')
def calculate_newsletter_analytics_task(newsletter_id=None):
    """
    Celery task to calculate newsletter analytics
    
    Args:
        newsletter_id: Specific newsletter ID (None = calculate for recent newsletters)
    
    Schedule: Every day at 1:00 AM
    """
    logger.info("Starting newsletter analytics calculation")
    
    try:
        if newsletter_id:
            newsletters = Newsletter.objects.filter(id=newsletter_id, status='sent')
        else:
            # Calculate for newsletters sent in last 7 days
            cutoff = timezone.now() - timedelta(days=7)
            newsletters = Newsletter.objects.filter(
                status='sent',
                sent_at__gte=cutoff
            )
        
        calculated = 0
        for newsletter in newsletters:
            analytics, created = NewsletterAnalytics.objects.get_or_create(
                newsletter=newsletter
            )
            analytics.calculate_metrics()
            calculated += 1
        
        logger.info(f"Analytics calculated for {calculated} newsletters")
        
        return {
            'status': 'success',
            'calculated': calculated,
            'timestamp': timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in calculate_newsletter_analytics_task: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


@shared_task(name='newsletter.health_check')
def health_check_task():
    """
    Celery task to check health of all systems
    
    Schedule: Every hour
    """
    logger.info("Running health check")
    
    try:
        fetcher = DataFetcher()
        health = fetcher.health_check()
        
        # Log any issues
        for service, status in health.items():
            if not status:
                logger.warning(f"Health check failed for {service}")
        
        return {
            'status': 'success',
            'health': health,
            'timestamp': timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in health_check_task: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


# Periodic task scheduling configuration
# Add this to your celery.py or celerybeat schedule

CELERY_BEAT_SCHEDULE = {
    # Fetch sports data every 6 hours
    'fetch-sports-data-regular': {
        'task': 'newsletter.fetch_sports_data',
        'schedule': 21600.0,  # 6 hours in seconds
        'args': (None, False),  # (sports, fetch_trending)
    },
    
    # Fetch trending news twice daily
    'fetch-trending-news': {
        'task': 'newsletter.fetch_sports_data',
        'schedule': 43200.0,  # 12 hours
        'args': (None, True),
    },
    
    # Generate and send weekly newsletter (Monday 6 AM)
'generate-weekly-newsletter': {
        'task': 'newsletter.generate_weekly_newsletter',
        'schedule': crontab(hour=6, minute=0, day_of_week=1),  # ✅ Correct format
        'args': (True, True),  # (refresh_data, send_immediately)
    },
    
    # Cleanup old data (Sunday 2 AM)
    'cleanup-old-data': {
        'task': 'newsletter.cleanup_old_data',
        'schedule': crontab(hour=2, minute=0, day_of_week=0),  # ✅ Correct format
        'args': (30,),
    },
    
    # Calculate analytics daily (1 AM)
    'calculate-analytics': {
        'task': 'newsletter.calculate_newsletter_analytics',
        'schedule': crontab(hour=1, minute=0),  # ✅ Correct format
        'args': (None,),
    },
    
    # Health check every hour
    'health-check': {
        'task': 'newsletter.health_check',
        'schedule': 3600.0,  # 1 hour
    },
}

# Add these tasks to your newsletter/tasks.py file

@shared_task(name='newsletter.send_welcome_email')
def send_welcome_email(subscriber_id):
    """
    Send welcome email to new subscriber
    
    Args:
        subscriber_id: ID of the new subscriber
    """
    logger.info(f"Sending welcome email to subscriber {subscriber_id}")
    
    try:
        from core.models import NewsletterSubscriber
        from django.core.mail import EmailMultiAlternatives
        from django.template.loader import render_to_string
        
        subscriber = NewsletterSubscriber.objects.get(id=subscriber_id)
        
        # Prepare context
        context = {
            'subscriber': subscriber,
            'preferences_url': f"{settings.SITE_URL}/newsletter/preferences/{subscriber.unsubscribe_token}/",
            'unsubscribe_url': f"{settings.SITE_URL}/newsletter/unsubscribe/{subscriber.unsubscribe_token}/",
            'current_year': timezone.now().year,
        }
        
        # Render email
        subject = "Welcome to Obsidian Sports Newsletter!"
        html_content = render_to_string('newsletter/welcome_email.html', context)
        text_content = f"""
Welcome to Obsidian Sports Newsletter!

Thank you for subscribing to our premium sports digest. You'll receive weekly updates with:
- Latest sports news and analysis
- Upcoming fixtures and match schedules
- Exclusive VIP packages and offers

Manage your preferences: {context['preferences_url']}
Unsubscribe: {context['unsubscribe_url']}

© {timezone.now().year} Obsidian Lifestyle
"""
        
        # Send email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[subscriber.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        logger.info(f"Welcome email sent to {subscriber.email}")
        
        return {
            'status': 'success',
            'subscriber_id': str(subscriber_id),
            'timestamp': timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error sending welcome email: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


@shared_task(name='newsletter.track_email_open')
def track_email_open(delivery_id):
    """
    Track when a newsletter email is opened
    
    Args:
        delivery_id: ID of the newsletter delivery
    """
    logger.info(f"Tracking email open for delivery {delivery_id}")
    
    try:
        from core.models import NewsletterDelivery
        
        delivery = NewsletterDelivery.objects.get(id=delivery_id)
        
        # Only track first open
        if not delivery.opened_at:
            delivery.opened_at = timezone.now()
            delivery.opened = True
            delivery.save(update_fields=['opened', 'opened_at'])
            
            logger.info(f"Email opened: delivery {delivery_id}")
        
        return {
            'status': 'success',
            'delivery_id': str(delivery_id),
            'opened_at': delivery.opened_at.isoformat() if delivery.opened_at else None,
            'timestamp': timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error tracking email open: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }


@shared_task(name='newsletter.track_email_click')
def track_email_click(delivery_id, link_url):
    """
    Track when a link in a newsletter is clicked
    
    Args:
        delivery_id: ID of the newsletter delivery
        link_url: URL that was clicked
    """
    logger.info(f"Tracking email click for delivery {delivery_id}: {link_url}")
    
    try:
        from core.models import NewsletterDelivery
        
        delivery = NewsletterDelivery.objects.get(id=delivery_id)
        
        # Track click
        if not delivery.clicked_at:
            delivery.clicked_at = timezone.now()
            delivery.clicked = True
            delivery.save(update_fields=['clicked', 'clicked_at'])
        
        # Store clicked link in metadata
        if not delivery.metadata:
            delivery.metadata = {}
        
        if 'clicked_links' not in delivery.metadata:
            delivery.metadata['clicked_links'] = []
        
        delivery.metadata['clicked_links'].append({
            'url': link_url,
            'timestamp': timezone.now().isoformat()
        })
        delivery.save(update_fields=['metadata'])
        
        logger.info(f"Email click tracked: delivery {delivery_id}")
        
        return {
            'status': 'success',
            'delivery_id': str(delivery_id),
            'link_url': link_url,
            'timestamp': timezone.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error tracking email click: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }