# newsletter/generator_v2.py
"""
Updated Newsletter Generator Module
Handles newsletter creation using API-fetched data
"""
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from django.db.models import Q, Count
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils import timezone

from core.models import (
    Newsletter, NewsletterSubscriber, NewsArticle, 
    MatchFixture, SportCategory, NewsletterDelivery
)
from .data_fetcher import DataFetcher

logger = logging.getLogger(__name__)


class NewsletterGeneratorV2:
    """
    Enhanced newsletter generator with API integration
    """
    
    def __init__(self):
        self.template_path = 'newsletter/email_template.html'
        self.plain_template_path = 'newsletter/email_template.txt'
        self.data_fetcher = DataFetcher()
    
    def refresh_data(self, sports: List[str] = None) -> Dict:
        """
        Refresh data from APIs before generating newsletter
        """
        logger.info("Refreshing data from APIs...")
        return self.data_fetcher.fetch_all_data(sports=sports)
    
    def get_recent_articles(self, days: int = 7, limit: int = 20) -> List[NewsArticle]:
        """Get recent premium articles"""
        cutoff_date = timezone.now() - timedelta(days=days)
        
        articles = NewsArticle.objects.filter(
            publish_date__gte=cutoff_date,
            article_type='news'
        ).select_related('sport_category').order_by(
            '-is_premium',  # Premium articles first
            '-is_featured',
            '-publish_date'
        )[:limit]
        
        return list(articles)
    
    def get_top_articles_by_sport(self, days: int = 7, limit_per_sport: int = 5) -> Dict:
        """Get top articles grouped by sport"""
        cutoff_date = timezone.now() - timedelta(days=days)
        
        articles_by_sport = {}
        
        for category in SportCategory.objects.filter(is_active=True):
            articles = NewsArticle.objects.filter(
                sport_category=category,
                publish_date__gte=cutoff_date,
                article_type='news'
            ).order_by('-is_premium', '-is_featured', '-publish_date')[:limit_per_sport]
            
            if articles:
                articles_by_sport[category.name] = list(articles)
        
        return articles_by_sport
    
    def get_upcoming_fixtures(self, days: int = 14, limit: int = 20) -> List[MatchFixture]:
        """Get upcoming fixtures"""
        end_date = timezone.now() + timedelta(days=days)
        
        fixtures = MatchFixture.objects.filter(
            match_date__gte=timezone.now(),
            match_date__lte=end_date,
            status__in=['scheduled', 'postponed']
        ).select_related('sport_category').order_by('match_date')[:limit]
        
        return list(fixtures)
    
    def get_fixtures_by_sport(self, days: int = 14, limit_per_sport: int = 5) -> Dict:
        """Get upcoming fixtures grouped by sport"""
        end_date = timezone.now() + timedelta(days=days)
        
        fixtures_by_sport = {}
        
        for category in SportCategory.objects.filter(is_active=True):
            fixtures = MatchFixture.objects.filter(
                sport_category=category,
                match_date__gte=timezone.now(),
                match_date__lte=end_date,
                status__in=['scheduled', 'postponed']
            ).order_by('match_date')[:limit_per_sport]
            
            if fixtures:
                fixtures_by_sport[category.name] = list(fixtures)
        
        return fixtures_by_sport
    
    def get_featured_content(self, days: int = 7) -> Dict:
        """Get featured and premium content"""
        cutoff_date = timezone.now() - timedelta(days=days)
        
        featured_articles = NewsArticle.objects.filter(
            is_featured=True,
            publish_date__gte=cutoff_date
        ).select_related('sport_category').order_by('-publish_date')[:5]
        
        premium_articles = NewsArticle.objects.filter(
            is_premium=True,
            publish_date__gte=cutoff_date
        ).select_related('sport_category').order_by('-publish_date')[:10]
        
        return {
            'featured': list(featured_articles),
            'premium': list(premium_articles)
        }
    
    def get_highlights_of_week(self) -> Dict:
        """Get highlights: most premium articles and biggest upcoming matches"""
        
        # Top 3 premium articles
        top_articles = NewsArticle.objects.filter(
            is_premium=True,
            publish_date__gte=timezone.now() - timedelta(days=7)
        ).order_by('-publish_date')[:3]
        
        # Biggest upcoming matches (next 7 days)
        big_matches = MatchFixture.objects.filter(
            match_date__gte=timezone.now(),
            match_date__lte=timezone.now() + timedelta(days=7),
            status='scheduled'
        ).order_by('match_date')[:5]
        
        return {
            'top_stories': list(top_articles),
            'big_matches': list(big_matches)
        }
    
    def create_newsletter_content(self, refresh_data: bool = False) -> Dict:
        """
        Create the content structure for the newsletter
        
        Args:
            refresh_data: Whether to refresh data from APIs first
        """
        
        # Optionally refresh data
        if refresh_data:
            fetch_results = self.refresh_data()
            logger.info(f"Data refresh results: {fetch_results}")
        
        # Get all content
        articles = self.get_recent_articles(days=7, limit=20)
        articles_by_sport = self.get_top_articles_by_sport(days=7, limit_per_sport=5)
        fixtures = self.get_upcoming_fixtures(days=14, limit=20)
        fixtures_by_sport = self.get_fixtures_by_sport(days=14, limit_per_sport=5)
        featured = self.get_featured_content(days=7)
        highlights = self.get_highlights_of_week()
        
        # Get data summary
        data_summary = self.data_fetcher.get_data_summary()
        
        # Create content structure
        content = {
            'headline': 'Your Weekly Sports Digest',
            'date': timezone.now(),
            'edition': f"Week {timezone.now().isocalendar()[1]}, {timezone.now().year}",
            'articles': articles,
            'articles_by_sport': articles_by_sport,
            'fixtures': fixtures,
            'fixtures_by_sport': fixtures_by_sport,
            'featured_articles': featured['featured'],
            'premium_articles': featured['premium'],
            'top_stories': highlights['top_stories'],
            'big_matches': highlights['big_matches'],
            'total_articles': len(articles),
            'total_fixtures': len(fixtures),
            'sports_covered': list(articles_by_sport.keys()),
            'data_summary': data_summary
        }
        
        return content
    
    def generate_weekly_newsletter(self, refresh_data: bool = True) -> Optional[Newsletter]:
        """
        Generate the weekly newsletter with fresh API data
        
        Args:
            refresh_data: Whether to fetch new data from APIs before generating
        """
        try:
            logger.info("Starting weekly newsletter generation")
            
            # Create content (will refresh data if requested)
            content = self.create_newsletter_content(refresh_data=refresh_data)
            
            # Check if we have enough content
            if content['total_articles'] == 0:
                logger.warning("No articles available for newsletter")
                # Still create newsletter for testing/preview
            
            # Create newsletter object
            newsletter = Newsletter.objects.create(
                title=f"{content['headline']} - {timezone.now().strftime('%B %d, %Y')}",
                edition_date=timezone.now().date(),
                status='draft',
                template_used='default',
                metadata={
                    'generated_at': timezone.now().isoformat(),
                    'edition': content['edition'],
                    'content_stats': {
                        'articles': content['total_articles'],
                        'fixtures': content['total_fixtures'],
                        'sports': content['sports_covered'],
                        'featured': len(content['featured_articles']),
                        'premium': len(content['premium_articles'])
                    },
                    'data_refreshed': refresh_data
                }
            )
            
            # Add articles and fixtures to newsletter
            if content['articles']:
                newsletter.articles.set(content['articles'])
            
            if content['fixtures']:
                newsletter.fixtures.set(content['fixtures'])
            
            # Generate preview content
            preview_content = self.generate_preview_content(content)
            newsletter.content = preview_content
            newsletter.save()
            
            logger.info(f"Newsletter generated successfully: {newsletter.id}")
            return newsletter
            
        except Exception as e:
            logger.error(f"Error generating newsletter: {e}")
            raise
    
    def generate_preview_content(self, content: Dict) -> str:
        """Generate a markdown preview of the newsletter"""
        preview = f"# {content['headline']}\n"
        preview += f"**{content['edition']}** | {content['date'].strftime('%B %d, %Y')}\n\n"
        preview += "---\n\n"
        
        # Highlights
        if content['top_stories']:
            preview += "## 🌟 This Week's Top Stories\n\n"
            for article in content['top_stories']:
                preview += f"### {article.title}\n"
                preview += f"*{article.sport_category.display_name}* | {article.source_name}\n"
                if article.summary:
                    preview += f"{article.summary[:150]}...\n"
                preview += "\n"
        
        # Articles by sport
        if content['articles_by_sport']:
            preview += "## 📰 Latest News by Sport\n\n"
            for sport, articles in content['articles_by_sport'].items():
                sport_cat = SportCategory.objects.get(name=sport)
                preview += f"### {sport_cat.display_name}\n\n"
                for article in articles[:3]:
                    preview += f"**{article.title}**\n"
                    if article.summary:
                        preview += f"{article.summary[:100]}...\n"
                    preview += f"*Source: {article.source_name}*\n\n"
        
        # Big upcoming matches
        if content['big_matches']:
            preview += "## 🏆 Don't Miss These Matches\n\n"
            for fixture in content['big_matches']:
                preview += f"**{fixture.home_team} vs {fixture.away_team}**\n"
                preview += f"*{fixture.sport_category.display_name}* | "
                preview += f"{fixture.match_date.strftime('%A, %B %d at %H:%M')}\n"
                if fixture.venue:
                    preview += f"📍 {fixture.venue}\n"
                if fixture.league_competition:
                    preview += f"🏅 {fixture.league_competition}\n"
                preview += "\n"
        
        # Upcoming fixtures by sport
        if content['fixtures_by_sport']:
            preview += "## 📅 Upcoming Fixtures\n\n"
            for sport, fixtures in content['fixtures_by_sport'].items():
                sport_cat = SportCategory.objects.get(name=sport)
                preview += f"### {sport_cat.display_name}\n\n"
                for fixture in fixtures[:3]:
                    preview += f"• {fixture.home_team} vs {fixture.away_team}\n"
                    preview += f"  {fixture.match_date.strftime('%b %d, %H:%M')}"
                    if fixture.league_competition:
                        preview += f" | {fixture.league_competition}"
                    preview += "\n"
                preview += "\n"
        
        # Stats
        preview += "\n---\n\n"
        preview += f"*This newsletter contains {content['total_articles']} articles "
        preview += f"and {content['total_fixtures']} upcoming fixtures "
        preview += f"across {len(content['sports_covered'])} sports.*\n"
        
        return preview
    
    def send_newsletter_to_subscribers(self, newsletter: Newsletter,
                                      test_mode: bool = False,
                                      test_email: str = None) -> Dict:
        """
        Send newsletter to subscribers
        
        Args:
            newsletter: Newsletter to send
            test_mode: If True, only send to test_email
            test_email: Email for test mode
        """
        results = {
            'sent': 0,
            'failed': 0,
            'errors': []
        }
        
        try:
            # Get subscribers
            if test_mode and test_email:
                # Test mode: create temporary subscriber
                subscribers = [type('obj', (object,), {
                    'email': test_email,
                    'name': 'Test User',
                    'preferences': {},
                    'unsubscribe_token': 'test-token'
                })]
                logger.info(f"Test mode: sending to {test_email}")
            else:
                subscribers = NewsletterSubscriber.objects.filter(
                    status='active'
                )
                logger.info(f"Sending to {subscribers.count()} subscribers")
            
            # Send to each subscriber
            for subscriber in subscribers:
                try:
                    self.send_newsletter_email(newsletter, subscriber)
                    results['sent'] += 1
                    
                    # Track delivery (skip for test mode)
                    if not test_mode:
                        NewsletterDelivery.objects.create(
                            newsletter=newsletter,
                            subscriber=subscriber,
                            status='sent',
                            sent_at=timezone.now()
                        )
                    
                except Exception as e:
                    results['failed'] += 1
                    results['errors'].append({
                        'email': subscriber.email,
                        'error': str(e)
                    })
                    logger.error(f"Failed to send to {subscriber.email}: {e}")
            
            # Update newsletter status (skip for test mode)
            if not test_mode and results['sent'] > 0:
                newsletter.status = 'sent'
                newsletter.sent_at = timezone.now()
                newsletter.sent_to_count = results['sent']
                newsletter.save()
            
            logger.info(f"Newsletter delivery complete: {results['sent']} sent, {results['failed']} failed")
            
        except Exception as e:
            logger.error(f"Error sending newsletter: {e}")
            results['errors'].append({
                'email': 'general',
                'error': str(e)
            })
        
        return results
    
    def send_newsletter_email(self, newsletter: Newsletter, subscriber):
        """Send newsletter email to a single subscriber"""
        
        # Get subscriber preferences
        preferences = getattr(subscriber, 'preferences', {}) or {}
        preferred_sports = preferences.get('sports', [])
        
        # Filter content based on preferences
        articles = newsletter.articles.all()
        if preferred_sports:
            articles = articles.filter(
                sport_category__name__in=preferred_sports
            )
        
        fixtures = newsletter.fixtures.all()
        if preferred_sports:
            fixtures = fixtures.filter(
                sport_category__name__in=preferred_sports
            )
        
        # Get featured and premium articles
        featured_articles = articles.filter(is_featured=True)[:5]
        premium_articles = articles.filter(is_premium=True)[:10]
        
        # Get highlights
        top_stories = articles.filter(is_premium=True)[:3]
        big_matches = fixtures.filter(
            match_date__gte=timezone.now(),
            match_date__lte=timezone.now() + timedelta(days=7)
        )[:5]
        
        # Organize content by sport
        articles_by_sport = {}
        for article in articles[:15]:
            sport = article.sport_category.name
            if sport not in articles_by_sport:
                articles_by_sport[sport] = []
            articles_by_sport[sport].append(article)
        
        fixtures_by_sport = {}
        for fixture in fixtures[:15]:
            sport = fixture.sport_category.name
            if sport not in fixtures_by_sport:
                fixtures_by_sport[sport] = []
            fixtures_by_sport[sport].append(fixture)
        
        # Prepare context for the new template
        context = {
            'newsletter': newsletter,
            'subscriber': subscriber,
            'articles': list(articles[:10]),
            'fixtures': list(fixtures[:10]),
            'articles_by_sport': articles_by_sport,
            'fixtures_by_sport': fixtures_by_sport,
            'featured_articles': list(featured_articles),
            'premium_articles': list(premium_articles),
            'top_stories': list(top_stories),
            'big_matches': list(big_matches),
            'unsubscribe_url': f"{settings.SITE_URL}/newsletter/unsubscribe/{getattr(subscriber, 'unsubscribe_token', 'token')}/",
            'view_online_url': f"{settings.SITE_URL}/newsletter/view/{newsletter.id}/",
            'preferences_url': f"{settings.SITE_URL}/newsletter/preferences/{getattr(subscriber, 'unsubscribe_token', 'token')}/",
            'current_year': timezone.now().year,
            'site_name': 'Obsidian Sports Newsletter',
        }
        
        # Render email templates
        try:
            html_content = render_to_string(self.template_path, context)
            text_content = render_to_string(self.plain_template_path, context)
        except Exception as e:
            logger.warning(f"Failed to render template: {e}, using fallback")
            # Fallback to simple template
            html_content = self.create_fallback_html_email(context)
            text_content = self.create_simple_text_email(context)
        
        # Create and send email
        subject = newsletter.title
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = subscriber.email
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=[to_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
    
    def create_fallback_html_email(self, context: Dict) -> str:
        """Create a simple fallback HTML email (in case template doesn't load)"""
        newsletter = context['newsletter']
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{newsletter.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #000; color: #fff; padding: 30px; text-align: center;">
                <h1 style="margin: 0;">OBSIDIAN</h1>
                <p style="color: #fbbf24; margin: 10px 0 0 0;">Elite Sports Digest</p>
            </div>
            
            <div style="background: #fbbf24; padding: 15px; text-align: center; color: #000;">
                WEEKLY EDITION • {newsletter.edition_date.strftime('%A, %B %d, %Y').upper()}
            </div>
            
            <div style="padding: 30px;">
        """
        
        # Add featured articles
        if context.get('featured_articles'):
            html += '<h2 style="color: #000; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Featured This Week</h2>'
            for article in context['featured_articles'][:1]:
                html += f"""
                <div style="border: 1px solid #e5e5e5; padding: 20px; margin: 20px 0;">
                    <span style="background: #000; color: #fbbf24; padding: 5px 15px; font-size: 11px; text-transform: uppercase;">
                        {article.sport_category.display_name}
                    </span>
                    <h3 style="color: #000; margin: 15px 0;">
                        <a href="{article.source_url}" style="color: #000; text-decoration: none;">{article.title}</a>
                    </h3>
                    <p style="color: #666;">{article.summary[:150] if article.summary else ''}...</p>
                    <a href="{article.source_url}" style="color: #000; font-weight: bold; text-decoration: none; border-bottom: 2px solid #fbbf24;">
                        Read Full Story →
                    </a>
                </div>
                """
        
        # Add big matches
        if context.get('big_matches'):
            html += '<h2 style="color: #000; border-bottom: 2px solid #fbbf24; padding-bottom: 10px; margin-top: 30px;">🏆 Don\'t Miss These Matches</h2>'
            for fixture in context['big_matches'][:4]:
                html += f"""
                <div style="padding: 15px; border-bottom: 1px solid #e5e5e5;">
                    <div style="font-weight: bold; font-size: 16px; color: #000;">{fixture.home_team} vs {fixture.away_team}</div>
                    <div style="font-size: 13px; color: #666;">
                        {fixture.sport_category.display_name} | {fixture.match_date.strftime('%A, %B %d at %H:%M')}
                    </div>
                    {f'<div style="font-size: 12px; color: #999;">📍 {fixture.venue}</div>' if fixture.venue else ''}
                </div>
                """
        
        # Footer
        html += f"""
            </div>
            
            <div style="background: #1a1a1a; padding: 30px; text-align: center; color: #999; font-size: 12px;">
                <p>
                    <a href="{context['unsubscribe_url']}" style="color: #999; text-decoration: none; margin: 0 10px;">Unsubscribe</a> |
                    <a href="{context['preferences_url']}" style="color: #999; text-decoration: none; margin: 0 10px;">Update Preferences</a> |
                    <a href="{context['view_online_url']}" style="color: #999; text-decoration: none; margin: 0 10px;">View Online</a>
                </p>
                <p style="color: #666; margin-top: 15px; padding-top: 15px; border-top: 1px solid #2a2a2a;">
                    © {context['current_year']} Obsidian Lifestyle. All rights reserved.
                </p>
            </div>
        </body>
        </html>
        """
        return html
    
    def create_simple_text_email(self, context: Dict) -> str:
        """Create simple text email"""
        newsletter = context['newsletter']
        text = f"{context['site_name']}\n"
        text += f"{newsletter.edition_date.strftime('%B %d, %Y')}\n"
        text += "=" * 60 + "\n\n"
        
        # Articles
        if context.get('articles_by_sport'):
            text += "LATEST NEWS\n" + "-" * 60 + "\n\n"
            for sport, articles in list(context['articles_by_sport'].items())[:3]:
                sport_cat = SportCategory.objects.get(name=sport)
                text += f"\n{sport_cat.display_name.upper()}\n\n"
                for article in articles[:3]:
                    text += f"• {article.title}\n"
                    if article.summary:
                        text += f"  {article.summary[:100]}...\n"
                    text += f"  Source: {article.source_name}\n\n"
        
        # Fixtures
        if context.get('fixtures_by_sport'):
            text += "\nUPCOMING FIXTURES\n" + "-" * 60 + "\n\n"
            for sport, fixtures in list(context['fixtures_by_sport'].items())[:3]:
                sport_cat = SportCategory.objects.get(name=sport)
                text += f"\n{sport_cat.display_name.upper()}\n\n"
                for fixture in fixtures[:5]:
                    text += f"• {fixture.home_team} vs {fixture.away_team}\n"
                    text += f"  {fixture.match_date.strftime('%A, %B %d at %H:%M')}\n"
                    if fixture.venue:
                        text += f"  Venue: {fixture.venue}\n"
                    text += "\n"
        
        text += "\n" + "=" * 60 + "\n"
        text += f"View online: {context['view_online_url']}\n"
        text += f"Manage preferences: {context['preferences_url']}\n"
        text += f"Unsubscribe: {context['unsubscribe_url']}\n"
        
        return text