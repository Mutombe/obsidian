from django.db import models
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import uuid
from datetime import datetime, timezone

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