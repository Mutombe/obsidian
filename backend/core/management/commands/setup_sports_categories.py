# newsletter/management/commands/setup_sports_categories.py
from django.core.management.base import BaseCommand
from core.models import SportCategory

class Command(BaseCommand):
    help = 'Setup initial sport categories'
    
    def handle(self, *args, **options):
        sports = [
            ('soccer', 'Soccer', '⚽'),
            ('rugby', 'Rugby', '🏉'),
            ('formula1', 'Formula 1', '🏎️'),
            ('boxing', 'Boxing', '🥊'),
            ('tennis', 'Tennis', '🎾'),
            ('golf', 'Golf', '⛳'),
            ('darts', 'Darts', '🎯'),
            ('chess', 'Chess', '♟️'),
        ]
        
        for name, display_name, icon in sports:
            sport, created = SportCategory.objects.get_or_create(
                name=name,
                defaults={
                    'display_name': display_name,
                    'icon': icon,
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created sport category: {display_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Sport category already exists: {display_name}')
                )