from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    NewsletterSubscriber, SportCategory, NewsArticle, 
    MatchFixture, Newsletter, NewsletterDelivery, NewsletterTemplate
)

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'status', 'subscription_date', 'sports_count']
    list_filter = ['status', 'subscription_date']
    search_fields = ['email', 'name']
    readonly_fields = ['id', 'subscription_date', 'unsubscribe_token']
    
    def sports_count(self, obj):
        if obj.preferences and 'sports' in obj.preferences:
            return len(obj.preferences['sports'])
        return 0
    sports_count.short_description = 'Sports Interests'

@admin.register(SportCategory)
class SportCategoryAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'name', 'icon', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'display_name']

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'sport_category', 'source_name', 'publish_date', 'is_featured', 'is_premium']
    list_filter = ['sport_category', 'article_type', 'is_featured', 'is_premium', 'publish_date']
    search_fields = ['title', 'summary', 'source_name']
    readonly_fields = ['id', 'scraped_date']
    date_hierarchy = 'publish_date'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'summary', 'content', 'sport_category', 'article_type')
        }),
        ('Source Information', {
            'fields': ('source_name', 'source_url', 'image_url')
        }),
        ('Dates', {
            'fields': ('publish_date', 'scraped_date')
        }),
        ('Flags', {
            'fields': ('is_featured', 'is_premium')
        }),
    )

@admin.register(MatchFixture)
class MatchFixtureAdmin(admin.ModelAdmin):
    list_display = ['fixture_display', 'sport_category', 'match_date', 'league_competition', 'status']
    list_filter = ['sport_category', 'status', 'match_date']
    search_fields = ['home_team', 'away_team', 'league_competition', 'venue']
    readonly_fields = ['id']
    date_hierarchy = 'match_date'
    
    def fixture_display(self, obj):
        return f"{obj.home_team} vs {obj.away_team}"
    fixture_display.short_description = 'Fixture'

class NewsletterDeliveryInline(admin.TabularInline):
    model = NewsletterDelivery
    extra = 0
    readonly_fields = ['subscriber', 'status', 'sent_at', 'opened_at']
    can_delete = False

@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['title', 'edition_date', 'status', 'total_subscribers', 'sent_at', 'view_online_link']
    list_filter = ['status', 'edition_date']
    search_fields = ['title']
    readonly_fields = ['id', 'created_at', 'sent_at', 'view_online_link']
    filter_horizontal = ['articles', 'fixtures']
    inlines = [NewsletterDeliveryInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'edition_date', 'status')
        }),
        ('Content', {
            'fields': ('featured_article', 'articles', 'fixtures')
        }),
        ('Delivery Info', {
            'fields': ('total_subscribers', 'sent_at', 'view_online_link')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'template_data'),
            'classes': ('collapse',)
        }),
    )
    
    def view_online_link(self, obj):
        if obj.id:
            url = reverse('view_newsletter_online', args=[obj.id])
            return format_html('<a href="{}" target="_blank">View Online</a>', url)
        return "-"
    view_online_link.short_description = 'Online View'

@admin.register(NewsletterDelivery)
class NewsletterDeliveryAdmin(admin.ModelAdmin):
    list_display = ['newsletter_title', 'subscriber_email', 'status', 'sent_at', 'opened_at']
    list_filter = ['status', 'sent_at', 'opened_at']
    search_fields = ['newsletter__title', 'subscriber__email']
    readonly_fields = ['id', 'sent_at', 'opened_at']
    
    def newsletter_title(self, obj):
        return obj.newsletter.title
    newsletter_title.short_description = 'Newsletter'
    
    def subscriber_email(self, obj):
        return obj.subscriber.email
    subscriber_email.short_description = 'Subscriber'

@admin.register(NewsletterTemplate)
class NewsletterTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']

# Customize admin site
admin.site.site_header = "Obsidian Lifestyle Newsletter Admin"
admin.site.site_title = "Newsletter Admin"
admin.site.index_title = "Newsletter Management"