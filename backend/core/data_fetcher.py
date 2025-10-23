# newsletter/data_fetcher.py
"""
Unified Data Fetcher
Combines API-Sports and NewsData.io to fetch and store sports data
"""
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from django.db import transaction
from django.utils import timezone

from .api_sports import SportsAPIManager
from .api_news import SportsNewsManager
from core.models import NewsArticle, MatchFixture, SportCategory, Newsletter

logger = logging.getLogger(__name__)


class DataFetcher:
    """
    Unified data fetching and storage manager
    """

    def __init__(self):
        self.sports_api = SportsAPIManager()
        self.news_api = SportsNewsManager()

    def fetch_all_data(self, sports: List[str] = None) -> Dict:
        """
        Fetch all data (news + fixtures) for specified sports

        Args:
            sports: List of sports to fetch (None = all)

        Returns:
            Dictionary with fetch results
        """
        if sports is None:
            sports = ["soccer", "formula1", "rugby", "tennis", "golf", "boxing"]

        results = {
            "news": {},
            "fixtures": {},
            "errors": [],
            "timestamp": datetime.now(),
        }

        # Fetch news for all sports
        logger.info("Fetching news articles...")
        try:
            all_news = self.news_api.get_all_sports_news(
                max_per_sport=10, sports=sports
            )

            for sport, articles in all_news.items():
                saved_count = self._save_news_articles(articles, sport)
                results["news"][sport] = {
                    "fetched": len(articles),
                    "saved": saved_count,
                }

        except Exception as e:
            logger.error(f"Error fetching news: {e}")
            results["errors"].append(f"News fetch error: {str(e)}")

        # Fetch fixtures
        logger.info("Fetching fixtures...")
        try:
            # Formula 1
            if "formula1" in sports:
                f1_races = self.sports_api.f1.get_upcoming_races(limit=10)
                saved = self._save_f1_fixtures(f1_races)
                results["fixtures"]["formula1"] = {
                    "fetched": len(f1_races),
                    "saved": saved,
                }

            # Football
            if "soccer" in sports:
                pl_fixtures = self.sports_api.football.get_premier_league_fixtures(
                    next_n=15
                )
                saved = self._save_football_fixtures(pl_fixtures, "Premier League")
                results["fixtures"]["soccer"] = {
                    "fetched": len(pl_fixtures),
                    "saved": saved,
                }

            # Rugby
            if "rugby" in sports:
                rugby_fixtures = self.sports_api.rugby.get_fixtures()
                saved = self._save_rugby_fixtures(rugby_fixtures)
                results["fixtures"]["rugby"] = {
                    "fetched": len(rugby_fixtures),
                    "saved": saved,
                }

        except Exception as e:
            logger.error(f"Error fetching fixtures: {e}")
            results["errors"].append(f"Fixtures fetch error: {str(e)}")

        return results

    def _save_news_articles(self, articles: List[Dict], sport: str) -> int:
        """Save news articles to database"""
        saved_count = 0

        try:
            sport_category = SportCategory.objects.get(name=sport)
        except SportCategory.DoesNotExist:
            logger.error(f"Sport category '{sport}' does not exist")
            return 0

        for article_data in articles:
            try:
                # Check if article already exists
                if NewsArticle.objects.filter(
                    title=article_data["title"],
                    source_url=article_data.get("source_url", ""),
                ).exists():
                    continue

                # Create article
                article = NewsArticle.objects.create(
                    title=article_data["title"][:200],
                    content=article_data.get("content", ""),
                    summary=article_data.get("summary", ""),
                    sport_category=sport_category,
                    article_type=article_data.get("type", "news"),
                    source_url=article_data.get("source_url", ""),
                    link_url=article_data.get("link"),
                    source_name=article_data.get("source_name", ""),
                    image_url=article_data.get("image_url")
                    or "https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/bg1.jpg",
                    publish_date=(
                        timezone.make_aware(article_data.get("publish_date"))
                        if article_data.get("publish_date")
                        and not timezone.is_aware(article_data.get("publish_date"))
                        else article_data.get("publish_date", timezone.now())
                    ),
                    is_featured=article_data.get("is_featured", True),
                    is_premium=article_data.get("is_premium", False),
                )
                saved_count += 1

            except Exception as e:
                logger.error(
                    f"Error saving article '{article_data.get('title', 'Unknown')}': {e}"
                )
                continue

        logger.info(f"Saved {saved_count} {sport} articles")
        return saved_count

    def _save_f1_fixtures(self, races: List[Dict]) -> int:
        """Save Formula 1 fixtures to database"""
        saved_count = 0
        
        try:
            sport_category = SportCategory.objects.get(name='formula1')
        except SportCategory.DoesNotExist:
            logger.error("Formula1 sport category does not exist")
            print("Formula1 sport category does not exist")
            return 0
        
        for race in races:
            try:
                # Parse race date
                try:
                    race_date = datetime.fromisoformat(race['date'].replace('Z', '+00:00'))
                    if not timezone.is_aware(race_date):
                        race_date = timezone.make_aware(race_date)
                except Exception as date_error:

                    logger.error(f"F1 date parsing error: {date_error}")
                    print(f"F1 date parsing error: {date_error}")
                    race_date = timezone.now() + timedelta(days=30)
                
                race_name = race.get('competition', {}).get('name', 'F1 Race')
                location = race.get('competition', {}).get('location', {})
                city = location.get('city', '')
                country = location.get('country', '')
                venue = f"{city}, {country}" if city and country else city or country or 'TBD'
                
                logger.info(f"Attempting to save F1 race: {race_name} at {venue} on {race_date}")
                print(f"Attempting to save F1 race: {race_name} at {venue} on {race_date}")
                
                # Create or update fixture - TRUNCATE TO MODEL LIMITS
                fixture, created = MatchFixture.objects.update_or_create(
                    home_team=race_name[:100],  # Model limit is 100
                    away_team='Formula 1 Race'[:100],  # Model limit is 100
                    match_date=race_date,
                    sport_category=sport_category,
                    defaults={
                        'venue': venue[:200],  # Model limit is 200
                        'league_competition': 'Formula 1 World Championship'[:100],  # Model limit is 100
                        'status': str(race.get('status', 'scheduled'))[:50],  # Model limit is 50
                        'source_url': ''
                    }
                )
                
                if created:
                    saved_count += 1
                    logger.info(f"✓ Saved F1 race: {race_name}")
                    print(f"✓ Saved F1 race: {race_name}")
                else:
                    logger.info(f"- F1 race already exists: {race_name}")
                    print(f"- F1 race already exists: {race_name}")
                    
            except Exception as e:
                logger.error(f"✗ Error saving F1 race '{race.get('competition', {}).get('name', 'Unknown')}': {e}")
                print(f"✗ Error saving F1 race '{race.get('competition', {}).get('name', 'Unknown')}': {e}")
                import traceback
                logger.error(traceback.format_exc())
                print(traceback.format_exc())
                continue
        
        logger.info(f"F1 Summary: {saved_count} new fixtures saved")
        print(f"F1 Summary: {saved_count} new fixtures saved")
        return saved_count

    def _save_football_fixtures(self, fixtures: List[Dict], league_name: str) -> int:
        """Save football fixtures to database"""
        saved_count = 0
        
        try:
            sport_category = SportCategory.objects.get(name='soccer')
        except SportCategory.DoesNotExist:
            logger.error("Soccer sport category does not exist")
            print("Soccer sport category does not exist")
            return 0
        
        for fixture in fixtures:
            try:
                # Extract teams
                teams = fixture.get('teams', {})
                home_team = teams.get('home', {}).get('name', 'TBD')
                away_team = teams.get('away', {}).get('name', 'TBD')
                
                # Parse date
                fixture_date_str = fixture.get('fixture', {}).get('date')
                if not fixture_date_str:
                    logger.warning(f"No date for fixture: {home_team} vs {away_team}")
                    print(f"No date for fixture: {home_team} vs {away_team}")
                    continue
                    
                try:
                    fixture_date = datetime.fromisoformat(fixture_date_str.replace('Z', '+00:00'))
                    if not timezone.is_aware(fixture_date):
                        fixture_date = timezone.make_aware(fixture_date)
                except Exception as date_error:
                    logger.error(f"Football date parsing error: {date_error}")
                    print(f"Football date parsing error: {date_error}")
                    continue
                
                venue = fixture.get('fixture', {}).get('venue', {}).get('name', 'TBD')
                
                # Get scores
                goals = fixture.get('goals', {})
                home_score = goals.get('home')
                away_score = goals.get('away')
                
                status = fixture.get('fixture', {}).get('status', {}).get('short', 'NS')
                status_map = {
                    'NS': 'scheduled',
                    'LIVE': 'live',
                    'FT': 'completed',
                    'PST': 'postponed',
                    'CANC': 'cancelled'
                }
                
                logger.info(f"Attempting to save football: {home_team} vs {away_team}")
                print(f"Attempting to save football: {home_team} vs {away_team}")
                
                # Create or update fixture - TRUNCATE TO MODEL LIMITS
                match_fixture, created = MatchFixture.objects.update_or_create(
                    home_team=home_team[:100],  # Model limit is 100
                    away_team=away_team[:100],  # Model limit is 100
                    match_date=fixture_date,
                    sport_category=sport_category,
                    defaults={
                        'venue': venue[:200],  # Model limit is 200
                        'league_competition': league_name[:100],  # Model limit is 100
                        'status': status_map.get(status, 'scheduled')[:50],  # Model limit is 50
                        'home_score': home_score,
                        'away_score': away_score,
                        'source_url': ''
                    }
                )
                
                if created:
                    saved_count += 1
                    logger.info(f"✓ Saved football: {home_team} vs {away_team}")
                    print(f"✓ Saved football: {home_team} vs {away_team}")
                else:
                    logger.info(f"- Football fixture already exists: {home_team} vs {away_team}")
                    print(f"- Football fixture already exists: {home_team} vs {away_team}")
                    
            except Exception as e:
                logger.error(f"✗ Error saving football fixture: {e}")
                print(f"✗ Error saving football fixture: {e}")
                import traceback
                logger.error(traceback.format_exc())
                print(traceback.format_exc())
                continue
        
        logger.info(f"Football Summary: {saved_count} new {league_name} fixtures saved")
        print(f"Football Summary: {saved_count} new {league_name} fixtures saved")
        return saved_count

    def _save_rugby_fixtures(self, fixtures: List[Dict]) -> int:
        """Save rugby fixtures to database"""
        saved_count = 0
        
        try:
            sport_category = SportCategory.objects.get(name='rugby')
        except SportCategory.DoesNotExist:
            logger.error("Rugby sport category does not exist")
            print("Rugby sport category does not exist")
            return 0
        
        for fixture in fixtures:
            try:
                # Extract teams
                teams = fixture.get('teams', {})
                home_team = teams.get('home', {}).get('name', 'TBD')
                away_team = teams.get('away', {}).get('name', 'TBD')
                
                # Parse date
                fixture_date_str = fixture.get('date')
                if not fixture_date_str:
                    logger.warning(f"No date for rugby fixture: {home_team} vs {away_team}")
                    print(f"No date for rugby fixture: {home_team} vs {away_team}")
                    continue
                    
                try:
                    fixture_date = datetime.fromisoformat(fixture_date_str.replace('Z', '+00:00'))
                    if not timezone.is_aware(fixture_date):
                        fixture_date = timezone.make_aware(fixture_date)
                except Exception as date_error:
                    logger.error(f"Rugby date parsing error: {date_error}")
                    print(f"Rugby date parsing error: {date_error}")
                    continue
                
                venue = fixture.get('venue', 'TBD') or 'TBD'
                league = fixture.get('league', {}).get('name', 'Rugby Match') or 'Rugby Match'
                
                # Get status
                status_obj = fixture.get('status', {})
                if isinstance(status_obj, dict):
                    status = status_obj.get('short', 'scheduled')
                else:
                    status = str(status_obj) if status_obj else 'scheduled'
                
                logger.info(f"Attempting to save rugby: {home_team} vs {away_team}")
                print(f"Attempting to save rugby: {home_team} vs {away_team}")
                
                # Create or update fixture - TRUNCATE TO MODEL LIMITS
                match_fixture, created = MatchFixture.objects.update_or_create(
                    home_team=home_team[:100],  # Model limit is 100
                    away_team=away_team[:100],  # Model limit is 100
                    match_date=fixture_date,
                    sport_category=sport_category,
                    defaults={
                        'venue': venue[:200],  # Model limit is 200
                        'league_competition': league[:100],  # Model limit is 100
                        'status': status[:50],  # Model limit is 50
                        'source_url': ''
                    }
                )
                
                if created:
                    saved_count += 1
                    logger.info(f"✓ Saved rugby: {home_team} vs {away_team}")
                    print(f"✓ Saved rugby: {home_team} vs {away_team}")
                else:
                    logger.info(f"- Rugby fixture already exists: {home_team} vs {away_team}")
                    print(f"- Rugby fixture already exists: {home_team} vs {away_team}")
                    
            except Exception as e:
                logger.error(f"✗ Error saving rugby fixture: {e}")
                print(f"✗ Error saving rugby fixture: {e}")
                import traceback
                logger.error(traceback.format_exc())
                continue
        
        logger.info(f"Rugby Summary: {saved_count} new fixtures saved")
        print(f"Rugby Summary: {saved_count} new fixtures saved")
        return saved_count

    def fetch_trending_news(self, limit: int = 20) -> Dict:
        """Fetch and save trending sports news"""

        try:
            articles = self.news_api.get_trending_news(limit=limit)

            results = {}
            for sport in set(article["sport"] for article in articles):
                sport_articles = [a for a in articles if a["sport"] == sport]
                saved = self._save_news_articles(sport_articles, sport)
                results[sport] = {"fetched": len(sport_articles), "saved": saved}

            return results

        except Exception as e:
            logger.error(f"Error fetching trending news: {e}")
            print(f"Error fetching trending news: {e}")
            return {}

    def get_data_summary(self) -> Dict:
        """Get summary of available data in database"""

        summary = {
            "articles": {},
            "fixtures": {},
            "total_articles": 0,
            "total_fixtures": 0,
            "last_article_date": None,
            "last_fixture_date": None,
        }

        # Count articles by sport
        for category in SportCategory.objects.filter(is_active=True):
            article_count = NewsArticle.objects.filter(sport_category=category).count()

            fixture_count = MatchFixture.objects.filter(
                sport_category=category, match_date__gte=timezone.now()
            ).count()

            summary["articles"][category.name] = article_count
            summary["fixtures"][category.name] = fixture_count

            summary["total_articles"] += article_count
            summary["total_fixtures"] += fixture_count

        # Get latest dates
        latest_article = NewsArticle.objects.order_by("-publish_date").first()
        if latest_article:
            summary["last_article_date"] = latest_article.publish_date

        latest_fixture = MatchFixture.objects.order_by("-match_date").first()

        if latest_fixture:
            summary["last_fixture_date"] = latest_fixture.match_date

        return summary

    def cleanup_old_data(self, days: int = 30) -> Dict:
        """Remove old articles and completed fixtures"""

        cutoff_date = timezone.now() - timedelta(days=days)

        deleted_articles = NewsArticle.objects.filter(
            publish_date__lt=cutoff_date, article_type="news"
        ).delete()

        deleted_fixtures = MatchFixture.objects.filter(
            match_date__lt=cutoff_date, status="completed"
        ).delete()

        return {
            "deleted_articles": deleted_articles[0],
            "deleted_fixtures": deleted_fixtures[0],
            "cutoff_date": cutoff_date,
        }

    def health_check(self) -> Dict:
        """Check health of all data sources"""

        return {
            "sports_api": self.sports_api.health_check(),
            "news_api": self.news_api.health_check(),
            "database": self._check_database_health(),
        }

    def _check_database_health(self) -> bool:
        """Check if database has recent data"""
        try:
            recent_articles = NewsArticle.objects.filter(
                publish_date__gte=timezone.now() - timedelta(days=7)
            ).count()

            upcoming_fixtures = MatchFixture.objects.filter(
                match_date__gte=timezone.now()
            ).count()

            return recent_articles > 0 and upcoming_fixtures > 0
        except:
            return False
