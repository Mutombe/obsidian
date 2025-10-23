# core/management/commands/test_newsletter_sync.py
"""
Test command that runs newsletter tasks synchronously without Celery
Place this file in: backend/core/management/commands/
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import NewsletterSubscriber, Newsletter, NewsArticle, MatchFixture, SportCategory
from datetime import datetime, timedelta
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Test the newsletter system without Celery (runs synchronously)'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--test-email',
            type=str,
            help='Email address to use for testing',
            default='simbamtombe@gmail.com'
        )
        parser.add_argument(
            '--skip-scraping',
            action='store_true',
            help='Skip the scraping step and use existing data',
        )
        parser.add_argument(
            '--create-sample-data',
            action='store_true',
            help='Create sample data if database is empty',
        )
    
    def create_sample_data(self):
        """Create sample data for testing"""
        self.stdout.write('📝 Creating sample data...')
        
        # Ensure sport categories exist
        sports = ['soccer', 'formula1', 'rugby', 'tennis']
        for sport_name in sports:
            SportCategory.objects.get_or_create(
                name=sport_name,
                defaults={'display_name': sport_name.title()}
            )
        
        # Create sample articles
        soccer_cat = SportCategory.objects.get(name='soccer')
        
        articles_created = 0
        for i in range(3):
            article, created = NewsArticle.objects.get_or_create(
                title=f"Sample Soccer Article {i+1}",
                defaults={
                    'content': f"This is sample content for article {i+1}. It contains exciting news about soccer.",
                    'summary': f"Summary of article {i+1}",
                    'sport_category': soccer_cat,
                    'article_type': 'news',
                    'source_name': 'Test Source',
                    'publish_date': timezone.now() - timedelta(hours=i),
                    'is_featured': i == 0,
                }
            )
            if created:
                articles_created += 1
        
        # Create sample fixtures
        fixtures_created = 0
        for i in range(2):
            fixture, created = MatchFixture.objects.get_or_create(
                home_team=f"Team {i*2+1}",
                away_team=f"Team {i*2+2}",
                match_date=timezone.now() + timedelta(days=i+1),
                sport_category=soccer_cat,
                defaults={
                    'venue': f"Stadium {i+1}",
                    'league_competition': 'Test League',
                    'status': 'scheduled',
                }
            )
            if created:
                fixtures_created += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Created {articles_created} articles and {fixtures_created} fixtures'
            )
        )
    
    def scrape_sports_content_sync(self):
        """Synchronous version of scrape_sports_content task"""
        try:
            from core.scrappers import SportsScrapingManager
            
            self.stdout.write('🔄 Running sports content scraping...')
            manager = SportsScrapingManager()
            result = manager.run_full_scrape()
            
            news_count = sum(len(articles) for articles in result.get('news', {}).values())
            fixtures_count = sum(len(fixtures) for fixtures in result.get('fixtures', {}).values())
            
            return {
                'success': True,
                'news_count': news_count,
                'fixtures_count': fixtures_count
            }
        except ImportError:
            self.stdout.write(
                self.style.WARNING('⚠️ Scrapers module not found, using sample data instead')
            )
            self.create_sample_data()
            return {
                'success': True,
                'news_count': NewsArticle.objects.count(),
                'fixtures_count': MatchFixture.objects.count()
            }
        except Exception as e:
            logger.error(f"Error in scraping: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_weekly_newsletter_sync(self):
        """Synchronous version of generate_weekly_newsletter task"""
        try:
            from core.generator import NewsletterGenerator
            
            self.stdout.write('📰 Generating newsletter...')
            generator = NewsletterGenerator()
            newsletter = generator.generate_weekly_newsletter()
            
            if newsletter:
                return {
                    'success': True,
                    'newsletter_id': newsletter.id
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to generate newsletter'
                }
        except ImportError:
            # Fallback if generator module doesn't exist
            self.stdout.write(
                self.style.WARNING('⚠️ Generator module not found, creating simple newsletter')
            )
            
            # Create a basic newsletter
            newsletter = Newsletter.objects.create(
                title=f"Weekly Sports Newsletter - {timezone.now().strftime('%B %d, %Y')}",
                edition_date=timezone.now().date(),
                status='draft'
            )
            
            # Add available articles and fixtures
            articles = NewsArticle.objects.all()[:5]
            fixtures = MatchFixture.objects.filter(
                match_date__gte=datetime.now()
            )[:5]
            
            newsletter.articles.set(articles)
            newsletter.fixtures.set(fixtures)
            
            return {
                'success': True,
                'newsletter_id': newsletter.id
            }
        except Exception as e:
            logger.error(f"Error generating newsletter: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def handle(self, *args, **options):
        test_email = options['test_email']
        
        self.stdout.write(
            self.style.SUCCESS('🚀 Starting Obsidian Newsletter System Test (Synchronous Mode)')
        )
        
        # 1. Create test subscriber
        self.stdout.write('\n1️⃣ Creating test subscriber...')
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=test_email,
            defaults={
                'name': 'Test Subscriber',
                'status': 'active',
                'preferences': {
                    'sports': ['soccer', 'formula1', 'rugby'],
                    'frequency': 'weekly',
                    'premium_content': True
                }
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'✅ Created test subscriber: {test_email}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'⚠️ Test subscriber already exists: {test_email}')
            )
        
        # 2. Check if we need sample data
        if options['create_sample_data'] or (not NewsArticle.objects.exists() and not options['skip_scraping']):
            self.create_sample_data()
        
        # 3. Test scraping (synchronously)
        if not options['skip_scraping']:
            self.stdout.write('\n2️⃣ Testing sports content scraping...')
            result = self.scrape_sports_content_sync()
            
            if result['success']:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Scraping completed:'
                        f'\n   📰 News: {result["news_count"]} articles'
                        f'\n   ⚽ Fixtures: {result["fixtures_count"]} fixtures'
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'❌ Scraping failed: {result.get("error", "Unknown error")}')
                )
                # Don't exit, try to continue with existing data
        else:
            self.stdout.write(
                self.style.WARNING('\n2️⃣ Skipping scraping step...')
            )
        
        # 4. Check database state
        article_count = NewsArticle.objects.count()
        fixture_count = MatchFixture.objects.count()
        
        self.stdout.write(
            f'\n📊 Database Status:'
            f'\n   Articles: {article_count}'
            f'\n   Fixtures: {fixture_count}'
        )
        
        if article_count == 0 and fixture_count == 0:
            self.stdout.write(
                self.style.WARNING(
                    '\n⚠️ No data in database. Creating sample data...'
                )
            )
            self.create_sample_data()
        
        # 5. Test newsletter generation (synchronously)
        self.stdout.write('\n3️⃣ Testing newsletter generation...')
        result = self.generate_weekly_newsletter_sync()
        
        if result['success']:
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Newsletter generated: {result["newsletter_id"]}'
                )
            )
            
            # Get the newsletter and display info
            try:
                newsletter = Newsletter.objects.get(id=result['newsletter_id'])
                self.stdout.write(
                    f'   📄 Title: {newsletter.title}\n'
                    f'   📅 Edition Date: {newsletter.edition_date}\n'
                    f'   📰 Articles: {newsletter.articles.count()}\n'
                    f'   ⚽ Fixtures: {newsletter.fixtures.count()}'
                )
                
                # Provide URLs for testing
                self.stdout.write(
                    f'\n   🔗 View Online: http://localhost:8000/newsletter/view/{newsletter.id}/'
                    f'\n   🔗 Admin Panel: http://localhost:8000/admin/core/newsletter/{newsletter.id}/change/'
                )
            except Newsletter.DoesNotExist:
                pass
            
        else:
            self.stdout.write(
                self.style.ERROR(f'❌ Newsletter generation failed: {result.get("error", "Unknown error")}')
            )
        
        # 6. Summary
        self.stdout.write(
            self.style.SUCCESS(
                '\n🎉 Newsletter system test completed!'
                '\n\n📋 Next Steps:'
                '\n• To set up Celery for production, install RabbitMQ or Redis'
                '\n• Run migrations if needed: python manage.py migrate'
                '\n• Start development server: python manage.py runserver'
                '\n• Visit admin panel: http://localhost:8000/admin/'
            )
        )