# backend/celery.py
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Define beat schedule
app.conf.beat_schedule = {
    # Fetch sports data every 6 hours
    'fetch-sports-data-regular': {
        'task': 'core.fetch_sports_data',
        'schedule': 21600.0,  # seconds is fine for intervals
        'args': (None, False),
    },
    
    # Fetch trending news twice daily
    'fetch-trending-news': {
        'task': 'core.fetch_sports_data',
        'schedule': 43200.0,
        'args': (None, True),
    },
    
    # Generate and send weekly newsletter (Monday 6 AM)
    'generate-weekly-newsletter': {
        'task': 'core.generate_weekly_newsletter',
        'schedule': crontab(hour=6, minute=0, day_of_week=1),
        'args': (True, True),
    },
    
    # Cleanup old data (Sunday 2 AM)
    'cleanup-old-data': {
        'task': 'core.cleanup_old_data',
        'schedule': crontab(hour=2, minute=0, day_of_week=0),
        'args': (30,),
    },
    
    # Calculate analytics daily (1 AM)
    'calculate-analytics': {
        'task': 'core.calculate_newsletter_analytics',
        'schedule': crontab(hour=1, minute=0),
        'args': (None,),
    },
    
    # Health check every hour
    'health-check': {
        'task': 'core.health_check',
        'schedule': 3600.0,
    },
}