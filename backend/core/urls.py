from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, dashboard_views
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'sports', views.SportCategoryViewSet)
router.register(r'admin/subscribers', dashboard_views.SubscriberManagementViewSet)
router.register(r'admin/newsletters', dashboard_views.NewsletterManagementViewSet)

urlpatterns = [
    # API endpoints
    path('api/newsletter/', include(router.urls)),
    path('api/newsletter/subscribe/', views.subscribe_newsletter, name='newsletter_subscribe'),
    path('api/newsletter/unsubscribe/', views.unsubscribe_newsletter, name='newsletter_unsubscribe'),
    path('api/newsletter/preferences/<uuid:token>/', views.newsletter_preferences, name='newsletter_preferences'),
    path('api/newsletter/latest/', views.latest_newsletter, name='latest_newsletter'),
    path('api/newsletter/news/', views.sports_news_feed, name='sports_news_feed'),
    path('api/newsletter/fixtures/', views.upcoming_fixtures, name='upcoming_fixtures'),

    path('api/newsletter/contact/', views.submit_contact_form, name='submit_contact'),
    path('api/newsletter/booking/', views.submit_event_booking, name='submit_booking'),
    path('api/newsletter/callback/', views.request_callback, name='request_callback'),

        # Admin Dashboard API endpoints
    path('api/newsletter/', include('core.dashboard_urls')),
    
    # JWT Token endpoints
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Web views
    path('newsletter/view/<uuid:newsletter_id>/', views.view_newsletter_online, name='view_newsletter_online'),
    path('newsletter/unsubscribe/<uuid:token>/', views.unsubscribe_newsletter, name='web_unsubscribe'),
    path('newsletter/preferences/<uuid:token>/', views.newsletter_preferences, name='web_preferences'),
    path('newsletter/track/open/<uuid:delivery_id>/', views.track_email_open_view, name='track_email_open'),
]
