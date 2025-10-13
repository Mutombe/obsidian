# newsletter/dashboard_urls.py - Backend URLs for Admin Dashboard
from django.urls import path
from . import dashboard_views

urlpatterns = [
    # Authentication
    path('admin/login/', dashboard_views.admin_login, name='admin_login'),
    path('admin/logout/', dashboard_views.admin_logout, name='admin_logout'),
    path('admin/profile/', dashboard_views.admin_profile, name='admin_profile'),
    
    # Dashboard Analytics
    path('admin/dashboard/overview/', dashboard_views.dashboard_overview, name='dashboard_overview'),
    path('admin/subscriber-analytics/', dashboard_views.subscriber_analytics, name='subscriber_analytics'),
    path('admin/newsletter-analytics/', dashboard_views.newsletter_analytics, name='newsletter_analytics'),
    path('admin/content-analytics/', dashboard_views.content_analytics, name='content_analytics'),
    
    # Management ViewSets - add to router
    # path('admin/subscribers/', include(router.urls)),
    # path('admin/newsletters/', include(router.urls)),
]