# newsletter/tasks.py
from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from django.urls import reverse
from datetime import datetime, timedelta
import logging
from .models import (
    Newsletter, NewsletterSubscriber, NewsletterDelivery, 
    NewsArticle, MatchFixture, SportCategory, NewsletterTemplate
)
from core.scrappers import SportsScrapingManager

logger = logging.getLogger(__name__)

@shared_task
def scrape_sports_content():
    """Scrape sports news and fixtures"""
    try:
        manager = SportsScrapingManager()
        result = manager.run_full_scrape()
        
        total_news = sum(len(articles) for articles in result['news'].values())
        total_fixtures = sum(len(fixtures) for fixtures in result['fixtures'].values())
        
        logger.info(f"Scraped {total_news} news articles and {total_fixtures} fixtures")
        return {
            'success': True,
            'news_count': total_news,
            'fixtures_count': total_fixtures,
            'timestamp': result['timestamp']
        }
    except Exception as e:
        logger.error(f"Error in scrape_sports_content: {e}")
        return {'success': False, 'error': str(e)}

@shared_task
def generate_weekly_newsletter():
    """Generate weekly newsletter with scraped content"""
    try:
        # Check if newsletter for this week already exists
        today = timezone.now().date()
        if Newsletter.objects.filter(edition_date=today).exists():
            logger.info(f"Newsletter for {today} already exists")
            return {'success': False, 'message': 'Newsletter already exists for today'}
        
        # Get recent articles (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        recent_articles = NewsArticle.objects.filter(
            scraped_date__gte=week_ago
        ).order_by('-publish_date')
        
        # Select featured article (most recent premium article)
        featured_article = recent_articles.filter(is_premium=True).first()
        
        # Get articles for each sport category (max 2 per sport)
        newsletter_articles = []
        sport_categories = SportCategory.objects.filter(is_active=True)
        
        for category in sport_categories:
            category_articles = recent_articles.filter(
                sport_category=category
            ).exclude(id=featured_article.id if featured_article else None)[:2]
            newsletter_articles.extend(category_articles)
        
        # Get upcoming fixtures (next 14 days)
        future_fixtures = MatchFixture.objects.filter(
            match_date__gte=timezone.now(),
            match_date__lte=timezone.now() + timedelta(days=14),
            status='scheduled'
        ).order_by('match_date')[:8]
        
        # Create newsletter
        newsletter = Newsletter.objects.create(
            title=f"Obsidian Elite Sports Digest - {today.strftime('%B %d, %Y')}",
            edition_date=today,
            featured_article=featured_article,
            status='draft'
        )
        
        # Add articles and fixtures
        if newsletter_articles:
            newsletter.articles.set(newsletter_articles[:8])
        
        if future_fixtures:
            newsletter.fixtures.set(future_fixtures)
        
        newsletter.status = 'scheduled'
        newsletter.save()
        
        logger.info(f"Generated newsletter {newsletter.id} with {newsletter.articles.count()} articles")
        
        # Schedule newsletter sending
        send_newsletter_to_subscribers.delay(str(newsletter.id))
        
        return {
            'success': True,
            'newsletter_id': str(newsletter.id),
            'articles_count': newsletter.articles.count(),
            'fixtures_count': newsletter.fixtures.count()
        }
        
    except Exception as e:
        logger.error(f"Error generating newsletter: {e}")
        return {'success': False, 'error': str(e)}

@shared_task
def send_newsletter_to_subscribers(newsletter_id):
    """Send newsletter to all active subscribers"""
    try:
        newsletter = Newsletter.objects.get(id=newsletter_id)
        active_subscribers = NewsletterSubscriber.objects.filter(status='active')
        
        newsletter.total_subscribers = active_subscribers.count()
        newsletter.save()
        
        # Send to subscribers in batches
        batch_size = 100
        subscriber_batches = [
            active_subscribers[i:i + batch_size] 
            for i in range(0, active_subscribers.count(), batch_size)
        ]
        
        for batch in subscriber_batches:
            send_newsletter_batch.delay(newsletter_id, [str(sub.id) for sub in batch])
        
        logger.info(f"Scheduled newsletter {newsletter_id} for {active_subscribers.count()} subscribers")
        
        return {
            'success': True,
            'newsletter_id': newsletter_id,
            'total_subscribers': active_subscribers.count()
        }
        
    except Exception as e:
        logger.error(f"Error scheduling newsletter delivery: {e}")
        return {'success': False, 'error': str(e)}

@shared_task
def send_newsletter_batch(newsletter_id, subscriber_ids):
    """Send newsletter to a batch of subscribers"""
    try:
        newsletter = Newsletter.objects.get(id=newsletter_id)
        subscribers = NewsletterSubscriber.objects.filter(id__in=subscriber_ids)
        
        # Get newsletter template
        template = NewsletterTemplate.objects.filter(is_active=True).first()
        if not template:
            logger.error("No active newsletter template found")
            return {'success': False, 'error': 'No template found'}
        
        success_count = 0
        failed_count = 0
        
        for subscriber in subscribers:
            try:
                # Create delivery record
                delivery, created = NewsletterDelivery.objects.get_or_create(
                    newsletter=newsletter,
                    subscriber=subscriber,
                    defaults={'status': 'pending'}
                )
                
                if not created and delivery.status == 'sent':
                    continue  # Already sent
                
                # Prepare template context
                context = {
                    'newsletter': newsletter,
                    'subscriber': subscriber,
                    'featured_article': newsletter.featured_article,
                    'articles': newsletter.articles.all()[:8],
                    'fixtures': newsletter.fixtures.all()[:6],
                    'newsletter_date': newsletter.edition_date.strftime('%A, %B %d, %Y').upper(),
                    'unsubscribe_url': f"{settings.SITE_URL}/newsletter/unsubscribe/{subscriber.unsubscribe_token}/",
                    'preferences_url': f"{settings.SITE_URL}/newsletter/preferences/{subscriber.unsubscribe_token}/",
                    'view_online_url': f"{settings.SITE_URL}/newsletter/view/{newsletter.id}/",
                    'tracking_pixel_url': f"{settings.SITE_URL}/newsletter/track/open/{delivery.id}/"
                }
                
                # Render email content
                html_content = render_to_string('newsletter/email_template.html', context)
                text_content = render_to_string('newsletter/email_template.txt', context)
                
                # Create email
                subject = f"Obsidian Lifestyle - {newsletter.title}"
                from_email = settings.NEWSLETTER_FROM_EMAIL
                to_email = [subscriber.email]
                
                email = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    from_email=from_email,
                    to=to_email
                )
                email.attach_alternative(html_content, "text/html")
                
                # Send email
                email.send()
                
                # Update delivery status
                delivery.status = 'sent'
                delivery.sent_at = timezone.now()
                delivery.save()
                
                success_count += 1
                
            except Exception as e:
                logger.error(f"Error sending to {subscriber.email}: {e}")
                
                # Update delivery status
                if 'delivery' in locals():
                    delivery.status = 'failed'
                    delivery.error_message = str(e)
                    delivery.save()
                
                failed_count += 1
        
        # Update newsletter status if all batches are complete
        total_deliveries = NewsletterDelivery.objects.filter(newsletter=newsletter).count()
        sent_deliveries = NewsletterDelivery.objects.filter(
            newsletter=newsletter, 
            status='sent'
        ).count()
        
        if sent_deliveries + failed_count >= newsletter.total_subscribers:
            newsletter.status = 'sent'
            newsletter.sent_at = timezone.now()
            newsletter.save()
        
        logger.info(f"Batch complete: {success_count} sent, {failed_count} failed")
        
        return {
            'success': True,
            'sent': success_count,
            'failed': failed_count
        }
        
    except Exception as e:
        logger.error(f"Error in send_newsletter_batch: {e}")
        return {'success': False, 'error': str(e)}

@shared_task
def track_email_open(delivery_id):
    """Track when an email is opened"""
    try:
        delivery = NewsletterDelivery.objects.get(id=delivery_id)
        if not delivery.opened_at:
            delivery.opened_at = timezone.now()
            delivery.save()
            
        return {'success': True}
    except Exception as e:
        logger.error(f"Error tracking email open: {e}")
        return {'success': False, 'error': str(e)}

# Periodic tasks (to be added to celery beat schedule)
@shared_task
def cleanup_old_newsletters():
    """Clean up old newsletters and deliveries"""
    try:
        # Delete newsletters older than 3 months
        cutoff_date = timezone.now() - timedelta(days=90)
        old_newsletters = Newsletter.objects.filter(created_at__lt=cutoff_date)
        
        count = old_newsletters.count()
        old_newsletters.delete()
        
        logger.info(f"Cleaned up {count} old newsletters")
        return {'success': True, 'cleaned': count}
        
    except Exception as e:
        logger.error(f"Error cleaning up newsletters: {e}")
        return {'success': False, 'error': str(e)}

