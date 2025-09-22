
# SETUP_GUIDE.md
"""
# Obsidian Lifestyle Newsletter System Setup Guide

## Prerequisites

1. Python 3.9+
2. Django 4.2+
3. Redis (for Celery)
4. PostgreSQL (recommended for production)

## Installation Steps

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in your project root:

```env
# Email Configuration
EMAIL_PASSWORD=your_gmail_app_password
NEWSLETTER_FROM_EMAIL=simbamtombe@gmail.com

# API Keys (optional)
FOOTBALL_API_KEY=your_football_api_key
SPORTS_API_KEY=your_sports_api_key

# URLs
SITE_URL=https://obsidian.lifestyle
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
REDIS_URL=redis://127.0.0.1:6379/1

# Development
DEBUG=True
```

### 3. Database Setup

```bash
python manage.py makemigrations newsletter
python manage.py migrate
```

### 4. Newsletter System Setup

```bash
python manage.py setup_newsletter
```

This command will:
- Create sport categories
- Setup newsletter template
- Run necessary migrations

### 5. Start Required Services

#### Redis Server
```bash
redis-server
```

#### Celery Worker (separate terminal)
```bash
celery -A your_project worker -l info
```

#### Celery Beat Scheduler (separate terminal)
```bash
celery -A your_project beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

### 6. Test the System

```bash
python manage.py test_newsletter_system --test-email your@email.com
```

### 7. Manual Newsletter Generation

```bash
python manage.py generate_newsletter
```

## Frontend Integration

### 1. Add Newsletter Components to Your React App

```javascript
// In your main component or page
import NewsletterSubscription from './components/Newsletter/NewsletterSubscription';
import { SportsNewsFeed, NewsletterPreview } from './components/Newsletter/SportsNewsFeed';

function YourPage() {
  return (
    <div>
      <NewsletterSubscription showPreferences={true} />
      <SportsNewsFeed limit={12} showFixtures={true} />
      <NewsletterPreview />
    </div>
  );
}
```

### 2. Redux Store Integration

Add to your store configuration:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import newsletterReducer from './slices/newsletterSlice';

export const store = configureStore({
  reducer: {
    newsletter: newsletterReducer,
    // ... your other reducers
  },
});
```

## Production Deployment

### 1. Environment Variables

Set these in production:
- `DEBUG=False`
- `SITE_URL=https://your-domain.com`
- `EMAIL_PASSWORD` (Gmail app password or SendGrid key)
- Database credentials
- Redis URL

### 2. Celery Configuration

Use a process manager like Supervisor or systemd:

```ini
# /etc/supervisor/conf.d/celery.conf
[program:celery-worker]
command=celery -A your_project worker -l info
directory=/path/to/your/project
user=your_user
autostart=true
autorestart=true

[program:celery-beat]
command=celery -A your_project beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
directory=/path/to/your/project
user=your_user
autostart=true
autorestart=true
```

### 3. Web Server Configuration

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/newsletter/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /newsletter/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Scheduled Tasks

The system automatically schedules:

1. **Content Scraping**: Every 6 hours
2. **Newsletter Generation**: Every Friday at 5 PM
3. **Cleanup**: Weekly cleanup of old newsletters

## API Endpoints

### Public Endpoints:
- `POST /api/newsletter/subscribe/` - Subscribe to newsletter
- `GET /api/newsletter/sports/` - Get sport categories
- `GET /api/newsletter/news/` - Get recent sports news
- `GET /api/newsletter/fixtures/` - Get upcoming fixtures
- `GET /api/newsletter/latest/` - Get latest newsletter

### Management Endpoints:
- `GET /newsletter/view/{id}/` - View newsletter online
- `GET /newsletter/unsubscribe/{token}/` - Unsubscribe
- `GET /newsletter/preferences/{token}/` - Manage preferences

## Monitoring & Maintenance

### 1. Check System Status

```bash
python manage.py test_newsletter_system --skip-scraping
```

### 2. Monitor Logs

```bash
tail -f newsletter.log
```

### 3. Database Cleanup

```bash
# Clean up old newsletters (automated weekly)
python manage.py cleanup_old_newsletters
```

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check Gmail app password and 2FA settings
2. **Celery not working**: Ensure Redis is running
3. **Scraping failures**: Check internet connection and target websites
4. **Template errors**: Verify HTML template syntax

### Debug Commands:

```bash
# Test email sending
python manage.py send_test_newsletter --email test@example.com

# Check celery workers
celery -A your_project inspect active

# Test scraping
python manage.py generate_newsletter --scrape-only
```

## Support

For issues or questions:
1. Check the logs first
2. Verify all services are running
3. Test with the provided management commands
4. Check environment variables

The system is designed to be robust and self-healing, with comprehensive error handling and logging throughout.
"""