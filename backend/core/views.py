# newsletter/views.py
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.template.loader import render_to_string
from django.utils import timezone
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import cache_page
import logging

from .models import (
    NewsletterSubscriber,
    SportCategory,
    NewsArticle,
    MatchFixture,
    Newsletter,
    NewsletterDelivery,
)
from .serializers import (
    NewsletterSubscriptionSerializer,
    SportCategorySerializer,
    NewsArticleSerializer,
    MatchFixtureSerializer,
    NewsletterSerializer,
    UnsubscribeSerializer,
    PreferencesUpdateSerializer,
    NewsletterSubscriberSerializer,
)
from core.tasks import track_email_open
from .models import ContactMessage, EventBooking, CallbackRequest
from .serializers import (
    ContactMessageSerializer,
    EventBookingSerializer,
    CallbackRequestSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def submit_contact_form(request):
    """Submit contact form"""
    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        try:
            contact = serializer.save()

            logger.info(f"New contact form submission: {contact.email}")

            return Response(
                {
                    "message": "Thank you for your message! We will respond within 24 hours.",
                    "contact_id": str(contact.id),
                    "status": "success",
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.error(f"Error saving contact form: {e}")
            return Response(
                {"error": "Failed to submit contact form. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def submit_event_booking(request):
    """Submit event booking request"""
    serializer = EventBookingSerializer(data=request.data)

    if serializer.is_valid():
        try:
            booking = serializer.save()

            logger.info(f"New event booking: {booking.event_title} - {booking.email}")

            return Response(
                {
                    "message": "Booking request received! We will contact you within 24 hours.",
                    "booking_id": str(booking.id),
                    "booking_reference": booking.booking_reference,
                    "status": "success",
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.error(f"Error saving event booking: {e}")
            return Response(
                {"error": "Failed to submit booking. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def request_callback(request):
    """Submit callback request"""
    serializer = CallbackRequestSerializer(data=request.data)

    if serializer.is_valid():
        try:
            callback = serializer.save()

            logger.info(f"New callback request: {callback.phone}")

            # Send admin notification email
            from django.core.mail import send_mail

            send_mail(
                subject=f"New Callback Request - {callback.phone}",
                message=f"New callback request from {callback.phone}\nName: {callback.name}\nTime: {timezone.now()}",
                from_email=settings.NEWSLETTER_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=True,
            )

            return Response(
                {
                    "message": "Callback request received! We will call you within 2 hours during business hours.",
                    "status": "success",
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.error(f"Error saving callback request: {e}")
            return Response(
                {"error": "Failed to submit callback request. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


logger = logging.getLogger(__name__)


class SportCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SportCategory.objects.filter(is_active=True)
    serializer_class = SportCategorySerializer
    permission_classes = [AllowAny]


@api_view(["POST"])
@permission_classes([AllowAny])
def subscribe_newsletter(request):
    """Subscribe to newsletter"""
    serializer = NewsletterSubscriptionSerializer(data=request.data)

    if serializer.is_valid():
        try:
            subscriber = serializer.save()

            # Log subscription
            logger.info(f"New newsletter subscription: {subscriber.email}")

            # TODO: Send welcome email
            # send_welcome_email.delay(str(subscriber.id))

            return Response(
                {
                    "message": "Successfully subscribed to newsletter!",
                    "subscriber_id": str(subscriber.id),
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.error(f"Error creating subscription: {e}")
            return Response(
                {"error": "Failed to create subscription"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def unsubscribe_newsletter(request):
    """Unsubscribe from newsletter"""
    serializer = UnsubscribeSerializer(data=request.data)

    if serializer.is_valid():
        try:
            token = serializer.validated_data["token"]
            subscriber = NewsletterSubscriber.objects.get(unsubscribe_token=token)
            subscriber.status = "unsubscribed"
            subscriber.save()

            logger.info(f"Newsletter unsubscription: {subscriber.email}")

            return Response(
                {"message": "Successfully unsubscribed from newsletter"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error unsubscribing: {e}")
            return Response(
                {"error": "Failed to unsubscribe"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT"])
@permission_classes([AllowAny])
def newsletter_preferences(request, token):
    """Get or update newsletter preferences"""
    try:
        subscriber = get_object_or_404(
            NewsletterSubscriber, unsubscribe_token=token, status="active"
        )
    except:
        return Response(
            {"error": "Invalid token or subscriber not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = NewsletterSubscriberSerializer(subscriber)
        sport_categories = SportCategorySerializer(
            SportCategory.objects.filter(is_active=True), many=True
        )

        return Response(
            {"subscriber": serializer.data, "available_sports": sport_categories.data}
        )

    elif request.method == "PUT":
        data = request.data.copy()
        data["token"] = token

        serializer = PreferencesUpdateSerializer(data=data)
        if serializer.is_valid():
            subscriber.preferences = serializer.validated_data["preferences"]
            subscriber.save()

            return Response({"message": "Preferences updated successfully"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
@cache_page(60 * 15)  # Cache for 15 minutes
def latest_newsletter(request):
    """Get the latest newsletter"""
    try:
        newsletter = Newsletter.objects.filter(status="sent").latest("sent_at")
        serializer = NewsletterSerializer(newsletter)
        return Response(serializer.data)
    except Newsletter.DoesNotExist:
        return Response(
            {"message": "No newsletters available"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["GET"])
@permission_classes([AllowAny])
def view_newsletter_online(request, newsletter_id):
    """View newsletter in browser"""
    try:
        newsletter = get_object_or_404(Newsletter, id=newsletter_id)

        # Render newsletter as HTML
        context = {
            "newsletter": newsletter,
            "featured_article": newsletter.featured_article,
            "articles": newsletter.articles.all()[:8],
            "fixtures": newsletter.fixtures.all()[:6],
            "newsletter_date": newsletter.edition_date.strftime(
                "%A, %B %d, %Y"
            ).upper(),
            "is_web_view": True,
        }

        html_content = render_to_string("newsletter/web_view.html", context)
        return HttpResponse(html_content)

    except Exception as e:
        logger.error(f"Error viewing newsletter online: {e}")
        raise Http404("Newsletter not found")


@api_view(["GET"])
@permission_classes([AllowAny])
def track_email_open_view(request, delivery_id):
    """Track email open via pixel"""
    try:
        # Trigger async task to track open
        track_email_open.delay(delivery_id)

        # Return 1x1 transparent pixel
        pixel_data = b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3b"
        return HttpResponse(pixel_data, content_type="image/gif")

    except Exception as e:
        logger.error(f"Error tracking email open: {e}")
        # Still return pixel even if tracking fails
        pixel_data = b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3b"
        return HttpResponse(pixel_data, content_type="image/gif")


@api_view(["GET"])
@permission_classes([AllowAny])
@cache_page(60 * 30)  # Cache for 30 minutes
def sports_news_feed(request):
    """Get recent sports news for public display"""
    sport = request.GET.get("sport", None)
    limit = min(int(request.GET.get("limit", 10)), 50)  # Max 50 articles

    queryset = NewsArticle.objects.all()

    if sport:
        try:
            sport_category = SportCategory.objects.get(name=sport, is_active=True)
            queryset = queryset.filter(sport_category=sport_category)
        except SportCategory.DoesNotExist:
            return Response(
                {"error": f"Invalid sport category: {sport}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    articles = queryset.order_by("-publish_date")[:limit]
    serializer = NewsArticleSerializer(articles, many=True)

    return Response(
        {"articles": serializer.data, "total": articles.count(), "sport_filter": sport}
    )


@api_view(["GET"])
@permission_classes([AllowAny])
@cache_page(60 * 30)  # Cache for 30 minutes
def upcoming_fixtures(request):
    """Get upcoming sports fixtures"""
    sport = request.GET.get("sport", None)
    days = min(int(request.GET.get("days", 14)), 30)  # Max 30 days

    end_date = timezone.now() + timezone.timedelta(days=days)
    queryset = MatchFixture.objects.filter(
        match_date__gte=timezone.now(), match_date__lte=end_date, status="scheduled"
    )

    if sport:
        try:
            sport_category = SportCategory.objects.get(name=sport, is_active=True)
            queryset = queryset.filter(sport_category=sport_category)
        except SportCategory.DoesNotExist:
            return Response(
                {"error": f"Invalid sport category: {sport}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    fixtures = queryset.order_by("match_date")[:20]
    serializer = MatchFixtureSerializer(fixtures, many=True)

    return Response(
        {"fixtures": serializer.data, "total": fixtures.count(), "sport_filter": sport}
    )
