# newsletter/management/commands/generate_newsletter.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.tasks import scrape_sports_content, generate_weekly_newsletter

class Command(BaseCommand):
    help = 'Generate and send weekly newsletter'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--scrape-only',
            action='store_true',
            help='Only scrape content, do not generate newsletter',
        )
        parser.add_argument(
            '--no-scrape',
            action='store_true',
            help='Generate newsletter without scraping new content',
        )
    
    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS(
                f'📰 Starting newsletter generation at {timezone.now()}'
            )
        )
        
        if not options['no_scrape']:
            self.stdout.write('🔍 Scraping sports content...')
            scrape_result = scrape_sports_content.delay()
            result = scrape_result.get(timeout=300)  # 5 minutes timeout
            
            if result['success']:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✅ Scraped {result['news_count']} articles and {result['fixtures_count']} fixtures"
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f"❌ Scraping failed: {result.get('error', 'Unknown error')}")
                )
                if not options['scrape_only']:
                    return
        else:
            self.stdout.write(
                self.style.WARNING('⏭️ Skipping scraping step...')
            )
        
        if not options['scrape_only']:
            self.stdout.write('📧 Generating newsletter...')
            newsletter_result = generate_weekly_newsletter.delay()
            result = newsletter_result.get(timeout=180)  # 3 minutes timeout
            
            if result['success']:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✅ Newsletter generated: {result['newsletter_id']}"
                        f"\n   📰 Articles: {result['articles_count']}"
                        f"\n   ⚽ Fixtures: {result['fixtures_count']}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f"❌ Newsletter generation failed: {result.get('error', 'Unknown error')}")
                )
        
        self.stdout.write(
            self.style.SUCCESS('🎉 Newsletter process completed!')
        )