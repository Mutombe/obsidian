# newsletter/dashboard_views.py
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count, Avg, Sum
from datetime import datetime, timedelta
import logging

from .models import (
    Newsletter, NewsletterSubscriber, NewsletterDelivery, 
    NewsArticle, MatchFixture, SportCategory
)
from .models import (
    NewsletterAnalytics, SubscriberAnalytics, SportAnalytics, 
    EmailClickTracking, AdminUser
)
from .serializers import (
    NewsletterSerializer, NewsletterSubscriberSerializer,
    NewsArticleSerializer, MatchFixtureSerializer
)

logger = logging.getLogger(__name__)

# Authentication Views
@api_view(['POST'])
@permission_classes([])
def admin_login(request):
    """Admin login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user and user.is_active:
        # Check if user has admin access
        try:
            admin_user = AdminUser.objects.get(user=user)
        except AdminUser.DoesNotExist:
            # Create admin user if doesn't exist and user is superuser
            if user.is_superuser:
                admin_user = AdminUser.objects.create(
                    user=user,
                    role='admin',
                    permissions={
                        'can_view_analytics': True,
                        'can_manage_subscribers': True,
                        'can_send_newsletters': True,
                        'can_manage_content': True
                    }
                )
            else:
                return Response(
                    {'error': 'Admin access required'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Update last login
        admin_user.last_login_at = timezone.now()
        admin_user.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': admin_user.role,
                'permissions': admin_user.permissions
            }
        })
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    """Admin logout endpoint"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_profile(request):
    """Get current admin user profile"""
    try:
        admin_user = AdminUser.objects.get(user=request.user)
        return Response({
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'role': admin_user.role,
                'permissions': admin_user.permissions,
                'last_login': admin_user.last_login_at
            }
        })
    except AdminUser.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=status.HTTP_404_NOT_FOUND)

# Dashboard Analytics Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_overview(request):
    """Get dashboard overview statistics"""
    try:
        # Date ranges
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Basic stats
        total_subscribers = NewsletterSubscriber.objects.count()
        active_subscribers = NewsletterSubscriber.objects.filter(status='active').count()
        total_newsletters = Newsletter.objects.count()
        sent_newsletters = Newsletter.objects.filter(status='sent').count()
        
        # Recent activity
        recent_subscriptions = NewsletterSubscriber.objects.filter(
            subscription_date__gte=week_ago
        ).count()
        
        recent_newsletters = Newsletter.objects.filter(
            created_at__gte=week_ago
        ).count()
        
        # Calculate engagement rates
        recent_deliveries = NewsletterDelivery.objects.filter(
            sent_at__gte=week_ago
        )
        
        total_sent = recent_deliveries.filter(status='sent').count()
        total_opened = recent_deliveries.filter(opened_at__isnull=False).count()
        
        open_rate = (total_opened / total_sent * 100) if total_sent > 0 else 0
        
        # Growth rate
        prev_week_subs = NewsletterSubscriber.objects.filter(
            subscription_date__date__lt=week_ago,
            subscription_date__date__gte=week_ago - timedelta(days=7)
        ).count()
        
        growth_rate = 0
        if prev_week_subs > 0:
            growth_rate = ((recent_subscriptions - prev_week_subs) / prev_week_subs) * 100
        
        return Response({
            'overview': {
                'total_subscribers': total_subscribers,
                'active_subscribers': active_subscribers,
                'total_newsletters': total_newsletters,
                'sent_newsletters': sent_newsletters,
                'recent_subscriptions': recent_subscriptions,
                'recent_newsletters': recent_newsletters,
                'open_rate': round(open_rate, 2),
                'growth_rate': round(growth_rate, 2)
            },
            'quick_stats': {
                'total_articles': NewsArticle.objects.count(),
                'total_fixtures': MatchFixture.objects.count(),
                'active_sports': SportCategory.objects.filter(is_active=True).count()
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting dashboard overview: {e}")
        return Response(
            {'error': 'Failed to get dashboard overview'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscriber_analytics(request):
    """Get subscriber analytics and trends"""
    try:
        days = int(request.GET.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        
        # Daily subscriber growth
        daily_stats = []
        current_date = start_date
        
        while current_date <= timezone.now().date():
            stats = SubscriberAnalytics.calculate_daily_stats(current_date)
            daily_stats.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'total_subscribers': stats.total_subscribers,
                'new_subscriptions': stats.new_subscriptions,
                'active_subscribers': stats.active_subscribers,
                'growth_rate': stats.growth_rate
            })
            current_date += timedelta(days=1)
        
        # Sport preferences analysis
        sport_preferences = {}
        for sport in SportCategory.objects.filter(is_active=True):
            count = NewsletterSubscriber.objects.filter(
                status='active',
                preferences__sports__contains=[sport.name]
            ).count()
            sport_preferences[sport.display_name] = count
        
        # Subscription sources (you may want to track this)
        subscription_sources = {
            'Website': NewsletterSubscriber.objects.filter(status='active').count(),
            'API': 0,  # Implement if you have different sources
        }
        
        return Response({
            'daily_growth': daily_stats,
            'sport_preferences': sport_preferences,
            'subscription_sources': subscription_sources,
            'total_active': NewsletterSubscriber.objects.filter(status='active').count(),
            'total_unsubscribed': NewsletterSubscriber.objects.filter(status='unsubscribed').count()
        })
        
    except Exception as e:
        logger.error(f"Error getting subscriber analytics: {e}")
        return Response(
            {'error': 'Failed to get subscriber analytics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def newsletter_analytics(request):
    """Get newsletter performance analytics"""
    try:
        # Get recent newsletters with analytics
        newsletters = Newsletter.objects.filter(status='sent').order_by('-sent_at')[:10]
        
        newsletter_stats = []
        for newsletter in newsletters:
            # Get or create analytics
            analytics, created = NewsletterAnalytics.objects.get_or_create(
                newsletter=newsletter
            )
            
            if created or not analytics.updated_at or analytics.updated_at < timezone.now() - timedelta(hours=1):
                analytics.calculate_metrics()
            
            newsletter_stats.append({
                'id': str(newsletter.id),
                'title': newsletter.title,
                'edition_date': newsletter.edition_date,
                'sent_at': newsletter.sent_at,
                'total_sent': analytics.total_sent,
                'total_opened': analytics.total_opened,
                'total_clicked': analytics.total_clicked,
                'open_rate': analytics.open_rate,
                'click_rate': analytics.click_rate,
                'delivery_rate': analytics.delivery_rate
            })
        
        # Overall performance metrics
        total_sent = sum(stat['total_sent'] for stat in newsletter_stats)
        total_opened = sum(stat['total_opened'] for stat in newsletter_stats)
        total_clicked = sum(stat['total_clicked'] for stat in newsletter_stats)
        
        overall_metrics = {
            'total_campaigns': len(newsletter_stats),
            'total_sent': total_sent,
            'total_opened': total_opened,
            'total_clicked': total_clicked,
            'avg_open_rate': sum(stat['open_rate'] for stat in newsletter_stats) / len(newsletter_stats) if newsletter_stats else 0,
            'avg_click_rate': sum(stat['click_rate'] for stat in newsletter_stats) / len(newsletter_stats) if newsletter_stats else 0
        }
        
        return Response({
            'recent_campaigns': newsletter_stats,
            'overall_metrics': overall_metrics
        })
        
    except Exception as e:
        logger.error(f"Error getting newsletter analytics: {e}")
        return Response(
            {'error': 'Failed to get newsletter analytics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def content_analytics(request):
    """Get content performance analytics"""
    try:
        # Recent articles by sport
        sport_content = {}
        for sport in SportCategory.objects.filter(is_active=True):
            articles_count = NewsArticle.objects.filter(sport_category=sport).count()
            recent_articles = NewsArticle.objects.filter(
                sport_category=sport,
                scraped_date__gte=timezone.now() - timedelta(days=7)
            ).count()
            
            sport_content[sport.display_name] = {
                'total_articles': articles_count,
                'recent_articles': recent_articles,
                'icon': sport.icon
            }
        
        # Fixture statistics
        fixture_stats = {
            'total_fixtures': MatchFixture.objects.count(),
            'upcoming_fixtures': MatchFixture.objects.filter(
                match_date__gte=timezone.now(),
                status='scheduled'
            ).count(),
            'this_week': MatchFixture.objects.filter(
                match_date__gte=timezone.now(),
                match_date__lte=timezone.now() + timedelta(days=7)
            ).count()
        }
        
        return Response({
            'sport_content': sport_content,
            'fixture_stats': fixture_stats
        })
        
    except Exception as e:
        logger.error(f"Error getting content analytics: {e}")
        return Response(
            {'error': 'Failed to get content analytics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Subscriber Management Views
class SubscriberManagementViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = NewsletterSubscriber.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Search by email or name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search) | Q(name__icontains=search)
            )
        
        # Filter by sport preference
        sport = self.request.query_params.get('sport', None)
        if sport:
            queryset = queryset.filter(preferences__sports__contains=[sport])
        
        return queryset.order_by('-subscription_date')
    
    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """Change subscriber status"""
        subscriber = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['active', 'inactive', 'unsubscribed']:
            subscriber.status = new_status
            subscriber.save()
            
            return Response({
                'message': f'Subscriber status changed to {new_status}',
                'subscriber': self.get_serializer(subscriber).data
            })
        
        return Response(
            {'error': 'Invalid status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['post'])
    def bulk_action(self, request):
        """Perform bulk actions on subscribers"""
        action_type = request.data.get('action')
        subscriber_ids = request.data.get('subscriber_ids', [])
        
        if not subscriber_ids:
            return Response(
                {'error': 'No subscribers selected'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subscribers = NewsletterSubscriber.objects.filter(id__in=subscriber_ids)
        
        if action_type == 'activate':
            subscribers.update(status='active')
            message = f'Activated {subscribers.count()} subscribers'
        elif action_type == 'deactivate':
            subscribers.update(status='inactive')
            message = f'Deactivated {subscribers.count()} subscribers'
        elif action_type == 'unsubscribe':
            subscribers.update(status='unsubscribed')
            message = f'Unsubscribed {subscribers.count()} subscribers'
        elif action_type == 'delete':
            count = subscribers.count()
            subscribers.delete()
            message = f'Deleted {count} subscribers'
        else:
            return Response(
                {'error': 'Invalid action'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({'message': message})

# Newsletter Management Views
class NewsletterManagementViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Newsletter.objects.all().order_by('-edition_date')
    
    @action(detail=True, methods=['post'])
    def send_newsletter(self, request, pk=None):
        """Manually send a newsletter"""
        newsletter = self.get_object()
        
        if newsletter.status == 'sent':
            return Response(
                {'error': 'Newsletter already sent'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Import here to avoid circular imports
        from .tasks import send_newsletter_to_subscribers
        
        # Queue newsletter for sending
        task = send_newsletter_to_subscribers.delay(str(newsletter.id))
        
        return Response({
            'message': 'Newsletter queued for sending',
            'task_id': task.id
        })
    
    @action(detail=True, methods=['get'])
    def delivery_report(self, request, pk=None):
        """Get detailed delivery report for a newsletter"""
        newsletter = self.get_object()
        
        deliveries = NewsletterDelivery.objects.filter(newsletter=newsletter)
        
        report = {
            'total_sent': deliveries.filter(status='sent').count(),
            'total_failed': deliveries.filter(status='failed').count(),
            'total_bounced': deliveries.filter(status='bounced').count(),
            'total_opened': deliveries.filter(opened_at__isnull=False).count(),
            'total_clicked': deliveries.filter(clicked_links__len__gt=0).count(),
        }
        
        # Recent failures
        recent_failures = deliveries.filter(
            status='failed'
        ).values('error_message').annotate(count=Count('error_message'))[:5]
        
        report['failure_reasons'] = list(recent_failures)
        
        return Response(report)