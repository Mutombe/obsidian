# newsletter/management/commands/setup_newsletter.py
from django.core.management.base import BaseCommand
from django.core.management import call_command
from core.models import SportCategory, NewsletterTemplate

class Command(BaseCommand):
    help = 'Complete setup for Obsidian newsletter system'
    
    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🚀 Starting Obsidian Newsletter Setup...')
        )
        
        # Setup sport categories
        self.stdout.write('\n📝 Setting up sport categories...')
        call_command('setup_sports_categories')
        
        # Run migrations
        self.stdout.write('\n🗄️ Running database migrations...')
        call_command('migrate')
        
        # Create default newsletter template
        self.stdout.write('\n📧 Creating newsletter template...')
        template, created = NewsletterTemplate.objects.get_or_create(
            name='default_obsidian',
            defaults={
                'description': 'Default Obsidian Lifestyle newsletter template',
                'html_template': '<!-- HTML template will be loaded from file -->',
                'css_styles': '',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS('✅ Newsletter template created')
            )
        else:
            self.stdout.write(
                self.style.WARNING('⚠️ Newsletter template already exists')
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                '\n🎉 Newsletter setup completed successfully!'
                '\n\n📋 Next steps:'
                '\n1. Start Redis server: redis-server'
                '\n2. Start Celery worker: celery -A your_project worker -l info'
                '\n3. Start Celery beat: celery -A your_project beat -l info'
                '\n4. Test the system: python manage.py test_newsletter_system'
                '\n5. Generate newsletter: python manage.py generate_newsletter'
                '\n\n🌐 Admin panel: http://localhost:8000/admin/'
                '\n📊 Add superuser: python manage.py createsuperuser'
            )
        )