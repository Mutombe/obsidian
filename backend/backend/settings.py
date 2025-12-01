from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-!j_03(_4wh_4tt2if)%of7&!&9170)&y9*b^gg1fxb=c1hmqrj'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'hsp.co.zw',
    'obsidian-back3nd.onrender.com',
    'obsidian-backend-n9jq.onrender.com'
    'obsidian-obvg.onrender.com',
    'localhost',
    '127.0.0.1'
]

CORS_ALLOWED_ORIGINS = [
    'https://hsp.co.zw',
    'https://obsidian-obvg.onrender.com',
    'https://obsidian-back3nd.onrender.com',
    'https://obsidian-backend-n9jq.onrender.com'
    'http://localhost:5175',
    'http://127.0.0.1:5175'
]

CORS_TRUSTED_ORIGINS = [
    'https://hsp.co.zw',
    'https://obsidian-obvg.onrender.com',
    'https://obsidian-back3nd.onrender.com',
    'https://obsidian-backend-n9jq.onrender.com'
    'http://localhost:5175',
    'http://127.0.0.1:5175'
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = ['content-type', 'authorization']

# Security settings for production
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [
    'https://hsp.co.zw',
    'https://obsidian-obvg.onrender.com',
    'https://obsidian-back3nd.onrender.com',
    'https://obsidian-backend-n9jq.onrender.com'
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'core',
    'rest_framework',
    "rest_framework_simplejwt",
    'django_filters',
    'corsheaders',
    'celery',
    'django_celery_beat',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Add this line
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}


# Email Configuration (Development)
# settings.py

NEWSLETTER_FROM_EMAIL = 'simbamtombe@gmail.com'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'simbamtombe@gmail.com'  # Your Gmail address
EMAIL_HOST_PASSWORD = 'itzh jjkc hdmv csih'
DEFAULT_FROM_EMAIL = 'noreply@hospital.com'
ADMIN_EMAIL = 'simbamtombe@gmail.com'
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
SITE_URL = os.environ.get('SITE_URL', 'https://obsidian.co.zw')


# Sports API (API-Sports)
SPORTS_API_KEY = 'a9a2a1a3f94e00dd911b53d745c89b37'  # Your API key

# NewsData.io API
NEWSDATA_API_KEY = 'pub_7590c5ed9a334f5ea6a014ddef761eaf'  # Your API key

# =============================================================================
# CACHE CONFIGURATION
# =============================================================================

# Using Redis for caching (recommended)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'sports-data-cache',
    }
}

CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

# Celery Beat Schedule (for periodic tasks)
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    # Fetch sports data every 6 hours
    'fetch-sports-data': {
        'task': 'newsletter.fetch_sports_data',
        'schedule': 21600.0,  # 6 hours
        'args': (None, False),
    },
    
    # Fetch trending news twice daily
    'fetch-trending-news': {
        'task': 'newsletter.fetch_sports_data',
        'schedule': 43200.0,  # 12 hours
        'args': (None, True),
    },
    
    # Generate weekly newsletter (Monday 6 AM)
    'generate-weekly-newsletter': {
        'task': 'newsletter.generate_weekly_newsletter',
        'schedule': crontab(hour=6, minute=0, day_of_week=1),
        'args': (True, True),
    },
    
    # Cleanup old data (Sunday 2 AM)
    'cleanup-old-data': {
        'task': 'newsletter.cleanup_old_data',
        'schedule': crontab(hour=2, minute=0, day_of_week=0),
        'args': (30,),
    },
    
    # Calculate analytics daily (1 AM)
    'calculate-analytics': {
        'task': 'newsletter.calculate_newsletter_analytics',
        'schedule': crontab(hour=1, minute=0),
    },
    
    # Health check every hour
    'health-check': {
        'task': 'newsletter.health_check',
        'schedule': 3600.0,
    },
}

# =============================================================================
# NEWSLETTER SETTINGS
# =============================================================================


# Newsletter settings
NEWSLETTER_FROM_NAME = 'Obsidian Sports Newsletter'
NEWSLETTER_REPLY_TO = 'noreply@your-domain.com'

# Rate limiting
NEWSLETTER_MAX_EMAILS_PER_HOUR = 500
NEWSLETTER_EMAIL_DELAY = 0.1  # Delay between emails in seconds

# Data fetching settings
NEWSLETTER_FETCH_INTERVAL = 21600  # 6 hours
NEWSLETTER_CLEANUP_DAYS = 30  # Delete data older than 30 days

# =============================================================================
# LOGGING CONFIGURATION
# =============================================================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/newsletter.log',
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'newsletter': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'celery': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
# Celery Settings
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

DJANGO_SETTINGS_MODULE = 'backend.settings'

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'obsidian_teamdream',
        'USER': 'obsidian_teamdream',
        'PASSWORD': 'b8bed219fbf8eb3ecf6f97acf6621bb5a1f4c934',
        'HOST': '4jraem.h.filess.io',
        'PORT': '61008',
        'CONN_MAX_AGE': 0,
        'OPTIONS': {
            'options': '-c search_path=django_schema,public',
            'connect_timeout': 5,
        },
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
