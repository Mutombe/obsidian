from django.db import models
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q, Count, Avg
from datetime import timezone
from datetime import datetime
from django.db import models
import uuid

class ContactMessage(models.Model):
    """Contact form submissions"""
    CONTACT_METHOD_CHOICES = [
        ('email', 'Email'),
        ('phone', 'Phone'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    event = models.CharField(max_length=200, blank=True)
    guests = models.IntegerField(null=True, blank=True)
    message = models.TextField()
    contact_method = models.CharField(max_length=10, choices=CONTACT_METHOD_CHOICES, default='email')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    # Admin notes
    admin_notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        'auth.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_contacts'
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name} - {self.email} ({self.created_at.strftime('%Y-%m-%d')})"
    
    def mark_as_responded(self):
        """Mark message as responded"""
        self.status = 'resolved'
        self.responded_at = timezone.now()
        self.save()


class EventBooking(models.Model):
    """Event booking requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    CATEGORY_CHOICES = [
        ('soccer', 'Soccer'),
        ('formula1', 'Formula 1'),
        ('rugby', 'Rugby'),
        ('golf', 'Golf'),
        ('tennis', 'Tennis'),
        ('boxing', 'Boxing'),
        ('concerts', 'Concerts'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Customer Information
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Event Details
    event_title = models.CharField(max_length=200)
    event_category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    event_details = models.TextField(help_text="Specific match/event details")
    favorite_entity = models.CharField(max_length=200, blank=True, help_text="Favorite team/player/artist")
    
    # Booking Details
    number_of_guests = models.IntegerField(default=1)
    preferred_date = models.DateField(null=True, blank=True)
    special_requirements = models.TextField(blank=True)
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    # Admin fields
    admin_notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_bookings'
    )
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    booking_reference = models.CharField(max_length=50, unique=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Event Booking'
        verbose_name_plural = 'Event Bookings'
    
    def __str__(self):
        return f"{self.event_title} - {self.name} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Generate booking reference if not exists
        if not self.booking_reference:
            prefix = self.event_category[:3].upper()
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            self.booking_reference = f"OBS-{prefix}-{timestamp}"
        super().save(*args, **kwargs)
    
    def confirm_booking(self):
        """Confirm the booking"""
        self.status = 'confirmed'
        self.confirmed_at = timezone.now()
        self.save()


class CallbackRequest(models.Model):
    """Call back requests from website"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('called', 'Called'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20)
    name = models.CharField(max_length=200, blank=True)
    preferred_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    called_at = models.DateTimeField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Callback Request'
        verbose_name_plural = 'Callback Requests'
    
    def __str__(self):
        return f"{self.phone} - {self.status} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"

class NewsletterSubscriber(models.Model):
    SUBSCRIPTION_STATUS = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('unsubscribed', 'Unsubscribed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    subscription_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS, default='active')
    preferences = models.JSONField(default=dict, blank=True)  # Sports preferences
    unsubscribe_token = models.UUIDField(default=uuid.uuid4, unique=True)
    
    class Meta:
        ordering = ['-subscription_date']
    
    def __str__(self):
        return f"{self.email} - {self.status}"

class SportCategory(models.Model):
    SPORT_CHOICES = [
        ('soccer', 'Soccer'),
        ('rugby', 'Rugby'),
        ('formula1', 'Formula 1'),
        ('boxing', 'Boxing'),
        ('tennis', 'Tennis'),
        ('golf', 'Golf'),
        ('darts', 'Darts'),
        ('chess', 'Chess'),
    ]
    
    name = models.CharField(max_length=20, choices=SPORT_CHOICES, unique=True)
    display_name = models.CharField(max_length=50)
    icon = models.CharField(max_length=100, blank=True)  # Icon class or URL
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.display_name

class NewsArticle(models.Model):
    ARTICLE_TYPES = [
        ('news', 'News'),
        ('fixture', 'Fixture'),
        ('result', 'Result'),
        ('analysis', 'Analysis'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    summary = models.TextField(max_length=500)
    sport_category = models.ForeignKey(SportCategory, on_delete=models.CASCADE)
    article_type = models.CharField(max_length=20, choices=ARTICLE_TYPES, default='news')
    source_url = models.URLField(blank=True)
    source_name = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True)
    publish_date = models.DateTimeField()
    scraped_date = models.DateTimeField(auto_now_add=True)
    is_featured = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-publish_date']
        unique_together = ['title', 'source_url']
    
    def __str__(self):
        return f"{self.title} - {self.sport_category.display_name}"

class MatchFixture(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sport_category = models.ForeignKey(SportCategory, on_delete=models.CASCADE)
    home_team = models.CharField(max_length=100)
    away_team = models.CharField(max_length=100)
    match_date = models.DateTimeField()
    venue = models.CharField(max_length=200, blank=True)
    league_competition = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, default='scheduled')  # scheduled, live, finished
    home_score = models.IntegerField(null=True, blank=True)
    away_score = models.IntegerField(null=True, blank=True)
    source_url = models.URLField(blank=True)
    
    class Meta:
        ordering = ['match_date']
    
    def __str__(self):
        return f"{self.home_team} vs {self.away_team} - {self.match_date.strftime('%Y-%m-%d')}"

class Newsletter(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    edition_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    featured_article = models.ForeignKey(NewsArticle, on_delete=models.SET_NULL, 
                                       null=True, blank=True, related_name='featured_in_newsletters')
    articles = models.ManyToManyField(NewsArticle, related_name='newsletters', blank=True)
    fixtures = models.ManyToManyField(MatchFixture, related_name='newsletters', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    total_subscribers = models.IntegerField(default=0)
    template_data = models.JSONField(default=dict, blank=True)  # Store template customization
    
    class Meta:
        ordering = ['-edition_date']
    
    def __str__(self):
        return f"Newsletter - {self.edition_date.strftime('%Y-%m-%d')} ({self.status})"

class NewsletterDelivery(models.Model):
    DELIVERY_STATUS = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    newsletter = models.ForeignKey(Newsletter, on_delete=models.CASCADE)
    subscriber = models.ForeignKey(NewsletterSubscriber, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=DELIVERY_STATUS, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_links = models.JSONField(default=list, blank=True)
    click_count = models.IntegerField(default=0)
    last_clicked_at = models.DateTimeField(null=True, blank=True)

    def track_click(self, url, ip_address=None, user_agent=None):
        """Track a click on a link"""
        from .analytics_models import EmailClickTracking
       
        click = EmailClickTracking.objects.create(
            delivery=self,
            url=url,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        self.click_count += 1
        self.last_clicked_at = timezone.now()
        
        # Update clicked_links JSON field
        if url not in self.clicked_links:
            self.clicked_links.append(url)     
            self.save()
        return click
    
    class Meta:
        unique_together = ['newsletter', 'subscriber']
    
    def __str__(self):
        return f"{self.newsletter.title} -> {self.subscriber.email} ({self.status})"

class NewsletterTemplate(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    html_template = models.TextField()
    css_styles = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
class NewsletterAnalytics(models.Model):
    """Analytics summary for each newsletter"""
    newsletter = models.OneToOneField(Newsletter, on_delete=models.CASCADE, related_name='analytics')
    total_sent = models.IntegerField(default=0)
    total_delivered = models.IntegerField(default=0)
    total_opened = models.IntegerField(default=0)
    total_clicked = models.IntegerField(default=0)
    total_failed = models.IntegerField(default=0)
    total_bounced = models.IntegerField(default=0)
    unique_opens = models.IntegerField(default=0)
    unique_clicks = models.IntegerField(default=0)
    open_rate = models.FloatField(default=0.0)  # Percentage
    click_rate = models.FloatField(default=0.0)  # Percentage
    delivery_rate = models.FloatField(default=0.0)  # Percentage
    bounce_rate = models.FloatField(default=0.0)  # Percentage
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-newsletter__edition_date']
    
    def calculate_metrics(self):
        """Calculate all metrics for this newsletter"""
        deliveries = NewsletterDelivery.objects.filter(newsletter=self.newsletter)
        
        self.total_sent = deliveries.count()
        self.total_delivered = deliveries.filter(status='sent').count()
        self.total_opened = deliveries.filter(opened_at__isnull=False).count()
        self.total_failed = deliveries.filter(status='failed').count()
        self.total_bounced = deliveries.filter(status='bounced').count()
        
        # Calculate click tracking (you'll need to implement link tracking)
        self.total_clicked = deliveries.filter(clicked_links__len__gt=0).count()
        
        # Calculate rates
        if self.total_sent > 0:
            self.delivery_rate = (self.total_delivered / self.total_sent) * 100
            self.bounce_rate = (self.total_bounced / self.total_sent) * 100
            
        if self.total_delivered > 0:
            self.open_rate = (self.total_opened / self.total_delivered) * 100
            self.click_rate = (self.total_clicked / self.total_delivered) * 100
        
        self.save()

class SubscriberAnalytics(models.Model):
    """Daily subscriber analytics"""
    date = models.DateField(unique=True)
    total_subscribers = models.IntegerField(default=0)
    new_subscriptions = models.IntegerField(default=0)
    unsubscriptions = models.IntegerField(default=0)
    active_subscribers = models.IntegerField(default=0)
    growth_rate = models.FloatField(default=0.0)  # Percentage change from previous day
    
    class Meta:
        ordering = ['-date']
    
    @classmethod
    def calculate_daily_stats(cls, date=None):
        """Calculate subscriber stats for a given date"""
        if date is None:
            date = timezone.now().date()
        
        # Get stats for the date
        total_subs = NewsletterSubscriber.objects.filter(
            subscription_date__date__lte=date
        ).count()
        
        active_subs = NewsletterSubscriber.objects.filter(
            subscription_date__date__lte=date,
            status='active'
        ).count()
        
        new_subs = NewsletterSubscriber.objects.filter(
            subscription_date__date=date
        ).count()
        
        # Count unsubscriptions (you may want to track this separately)
        unsubs = NewsletterSubscriber.objects.filter(
            subscription_date__date__lte=date,
            status='unsubscribed'
        ).count()
        
        # Calculate growth rate
        previous_day = date - timedelta(days=1)
        try:
            previous_stats = cls.objects.get(date=previous_day)
            if previous_stats.total_subscribers > 0:
                growth_rate = ((total_subs - previous_stats.total_subscribers) / previous_stats.total_subscribers) * 100
            else:
                growth_rate = 0.0
        except cls.DoesNotExist:
            growth_rate = 0.0
        
        # Create or update record
        stats, created = cls.objects.get_or_create(
            date=date,
            defaults={
                'total_subscribers': total_subs,
                'new_subscriptions': new_subs,
                'unsubscriptions': unsubs,
                'active_subscribers': active_subs,
                'growth_rate': growth_rate
            }
        )
        
        if not created:
            stats.total_subscribers = total_subs
            stats.new_subscriptions = new_subs
            stats.unsubscriptions = unsubs
            stats.active_subscribers = active_subs
            stats.growth_rate = growth_rate
            stats.save()
        
        return stats

class SportAnalytics(models.Model):
    """Analytics by sport category"""
    date = models.DateField()
    sport_category = models.ForeignKey('SportCategory', on_delete=models.CASCADE)
    subscriber_count = models.IntegerField(default=0)
    article_count = models.IntegerField(default=0)
    engagement_score = models.FloatField(default=0.0)
    
    class Meta:
        unique_together = ['date', 'sport_category']
        ordering = ['-date', 'sport_category']

class EmailClickTracking(models.Model):
    """Track individual email clicks"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    delivery = models.ForeignKey(NewsletterDelivery, on_delete=models.CASCADE)
    url = models.URLField()
    clicked_at = models.DateTimeField(default=datetime.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-clicked_at']

class AdminUser(models.Model):
    """Extended admin user model for dashboard access"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Administrator'),
        ('editor', 'Editor'),
        ('viewer', 'Viewer')
    ], default='viewer')
    last_login_at = models.DateTimeField(null=True, blank=True)
    permissions = models.JSONField(default=dict)
    
    def __str__(self):
        return f"{self.user.username} ({self.role})"


    

    
