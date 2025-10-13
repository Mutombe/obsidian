# newsletter/serializers.py
from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import (
    NewsletterSubscriber, SportCategory, NewsArticle, 
    MatchFixture, Newsletter, NewsletterDelivery
)
from .models import ContactMessage, EventBooking, CallbackRequest

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'event', 'guests', 'message', 'contact_method']
    
    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format")
        return value
    
    def validate_phone(self, value):
        # Basic phone validation
        if not value or len(value.strip()) < 6:
            raise serializers.ValidationError("Please provide a valid phone number")
        return value.strip()
    
    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters")
        return value.strip()

class EventBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventBooking
        fields = [
            'name', 'email', 'phone', 'event_title', 'event_category',
            'event_details', 'favorite_entity', 'number_of_guests',
            'preferred_date', 'special_requirements'
        ]
    
    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format")
        return value
    
    def validate_event_details(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Please provide more details about the event you want to attend")
        return value.strip()
    
    def validate_number_of_guests(self, value):
        if value < 1 or value > 100:
            raise serializers.ValidationError("Number of guests must be between 1 and 100")
        return value

class CallbackRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallbackRequest
        fields = ['phone', 'name', 'preferred_time']
    
    def validate_phone(self, value):
        if not value or len(value.strip()) < 6:
            raise serializers.ValidationError("Please provide a valid phone number")
        return value.strip()


class SportCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SportCategory
        fields = ['name', 'display_name', 'icon', 'is_active']

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    preferences = serializers.JSONField(required=False)
    
    class Meta:
        model = NewsletterSubscriber
        fields = ['email', 'name', 'preferences']
    
    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format")
        
        # Check if email already exists
        if NewsletterSubscriber.objects.filter(
            email=value, 
            status='active'
        ).exists():
            raise serializers.ValidationError("Email already subscribed")
        
        return value
    
    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long")
        return value.strip()
    
    def create(self, validated_data):
        # Set default preferences if not provided
        if 'preferences' not in validated_data:
            validated_data['preferences'] = {
                'sports': [cat.name for cat in SportCategory.objects.filter(is_active=True)],
                'frequency': 'weekly',
                'premium_content': True
            }
        
        return super().create(validated_data)

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'name', 'subscription_date', 'status', 'preferences']
        read_only_fields = ['id', 'subscription_date']

class NewsArticleSerializer(serializers.ModelSerializer):
    sport_category = SportCategorySerializer(read_only=True)
    
    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'summary', 'sport_category', 'article_type',
            'source_name', 'image_url', 'publish_date', 'is_featured', 'is_premium'
        ]

class MatchFixtureSerializer(serializers.ModelSerializer):
    sport_category = SportCategorySerializer(read_only=True)
    
    class Meta:
        model = MatchFixture
        fields = [
            'id', 'sport_category', 'home_team', 'away_team', 'match_date',
            'venue', 'league_competition', 'status', 'home_score', 'away_score'
        ]

class NewsletterSerializer(serializers.ModelSerializer):
    featured_article = NewsArticleSerializer(read_only=True)
    articles = NewsArticleSerializer(many=True, read_only=True)
    fixtures = MatchFixtureSerializer(many=True, read_only=True)
    
    class Meta:
        model = Newsletter
        fields = [
            'id', 'title', 'edition_date', 'status', 'featured_article',
            'articles', 'fixtures', 'sent_at', 'total_subscribers'
        ]

class UnsubscribeSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    
    def validate_token(self, value):
        try:
            subscriber = NewsletterSubscriber.objects.get(unsubscribe_token=value)
            if subscriber.status == 'unsubscribed':
                raise serializers.ValidationError("Already unsubscribed")
        except NewsletterSubscriber.DoesNotExist:
            raise serializers.ValidationError("Invalid unsubscribe token")
        
        return value

class PreferencesUpdateSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    preferences = serializers.JSONField()
    
    def validate_token(self, value):
        try:
            NewsletterSubscriber.objects.get(unsubscribe_token=value, status='active')
        except NewsletterSubscriber.DoesNotExist:
            raise serializers.ValidationError("Invalid token or subscriber not found")
        
        return value
    
    def validate_preferences(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Preferences must be a dictionary")
        
        # Validate sports preferences
        if 'sports' in value:
            valid_sports = list(SportCategory.objects.filter(is_active=True).values_list('name', flat=True))
            for sport in value['sports']:
                if sport not in valid_sports:
                    raise serializers.ValidationError(f"Invalid sport: {sport}")
        
        return value
