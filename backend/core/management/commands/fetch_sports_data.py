# newsletter/management/commands/fetch_sports_data.py
"""
Django management command to fetch sports data from APIs
Usage: python manage.py fetch_sports_data [--sports soccer formula1 rugby]
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.data_fetcher import DataFetcher
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Fetch sports news and fixtures from APIs'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--sports',
            nargs='+',
            type=str,
            help='Specific sports to fetch (e.g., soccer formula1 rugby)',
            default=None
        )
        
        parser.add_argument(
            '--news-only',
            action='store_true',
            help='Fetch only news articles'
        )
        
        parser.add_argument(
            '--fixtures-only',
            action='store_true',
            help='Fetch only fixtures'
        )
        
        parser.add_argument(
            '--trending',
            action='store_true',
            help='Fetch trending sports news'
        )
        
        parser.add_argument(
            '--cleanup',
            action='store_true',
            help='Clean up old data after fetching'
        )
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting data fetch...'))
        
        fetcher = DataFetcher()
        sports = options.get('sports')
        
        try:
            # Fetch trending news
            if options.get('trending'):
                self.stdout.write('Fetching trending sports news...')
                results = fetcher.fetch_trending_news(limit=20)
                self.stdout.write(self.style.SUCCESS(
                    f'Trending news results: {results}'
                ))
            
            # Normal data fetch
            else:
                if sports:
                    self.stdout.write(f'Fetching data for: {", ".join(sports)}')
                else:
                    self.stdout.write('Fetching data for all sports...')
                
                results = fetcher.fetch_all_data(sports=sports)
                
                # Display results
                self.stdout.write(self.style.SUCCESS('\nFetch Results:'))
                self.stdout.write('-' * 50)
                
                # News results
                if results.get('news'):
                    self.stdout.write('\nNews Articles:')
                    for sport, stats in results['news'].items():
                        self.stdout.write(
                            f"  {sport}: {stats['fetched']} fetched, "
                            f"{stats['saved']} saved"
                        )
                
                # Fixtures results
                if results.get('fixtures'):
                    self.stdout.write('\nFixtures:')
                    for sport, stats in results['fixtures'].items():
                        self.stdout.write(
                            f"  {sport}: {stats['fetched']} fetched, "
                            f"{stats['saved']} saved"
                        )
                
                # Errors
                if results.get('errors'):
                    self.stdout.write(self.style.ERROR('\nErrors:'))
                    for error in results['errors']:
                        self.stdout.write(self.style.ERROR(f"  - {error}"))
            
            # Cleanup old data if requested
            if options.get('cleanup'):
                self.stdout.write('\nCleaning up old data...')
                cleanup_results = fetcher.cleanup_old_data(days=30)
                self.stdout.write(self.style.SUCCESS(
                    f"Deleted {cleanup_results['deleted_articles']} old articles "
                    f"and {cleanup_results['deleted_fixtures']} old fixtures"
                ))
            
            # Show data summary
            self.stdout.write('\nCurrent Data Summary:')
            summary = fetcher.get_data_summary()
            self.stdout.write(f"  Total articles: {summary['total_articles']}")
            self.stdout.write(f"  Total fixtures: {summary['total_fixtures']}")
            
            if summary['last_article_date']:
                self.stdout.write(
                    f"  Latest article: {summary['last_article_date'].strftime('%Y-%m-%d %H:%M')}"
                )
            
            self.stdout.write(self.style.SUCCESS('\n✓ Data fetch completed successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n✗ Error during data fetch: {e}'))
            logger.error(f"Data fetch error: {e}", exc_info=True)
            raise