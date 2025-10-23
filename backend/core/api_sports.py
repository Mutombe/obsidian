# newsletter/api_sports.py
"""
Sports API Integration - CORRECTED VERSION
Uses correct API versions: v3 for football, v1 for others
"""
import requests
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from django.conf import settings
from django.core.cache import cache
import time

logger = logging.getLogger(__name__)


def safe_cache_get(key, default=None):
    """Safely get from cache with error handling"""
    try:
        return cache.get(key, default)
    except Exception as e:
        logger.warning(f"Cache get error: {e}")
        return default


def safe_cache_set(key, value, timeout):
    """Safely set to cache with error handling"""
    try:
        cache.set(key, value, timeout)
    except Exception as e:
        logger.warning(f"Cache set error: {e}")


class SportsAPIClient:
    """Base client for API-Sports"""
    
    def __init__(self, api_key: str = None, api_version: str = "v1"):
        self.api_key = api_key or getattr(settings, 'SPORTS_API_KEY', 'a9a2a1a3f94e00dd911b53d745c89b37')
        self.api_version = api_version
        self.base_url = f"https://{api_version}.{{sport}}.api-sports.io"
        self.session = requests.Session()
        self.rate_limit_calls = 100
        self.rate_limit_window = 86400
        
    def _get_rate_limit_key(self, sport: str) -> str:
        """Get cache key for rate limiting"""
        return f"api_sports_rate_limit_{sport}_{datetime.now().strftime('%Y%m%d')}"
    
    def _check_rate_limit(self, sport: str) -> bool:
        """Check if we've hit rate limit"""
        key = self._get_rate_limit_key(sport)
        calls = safe_cache_get(key, 0)
        return calls < self.rate_limit_calls
    
    def _increment_rate_limit(self, sport: str):
        """Increment rate limit counter"""
        key = self._get_rate_limit_key(sport)
        calls = safe_cache_get(key, 0)
        safe_cache_set(key, calls + 1, self.rate_limit_window)
    
    def _make_request(self, sport: str, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Make API request with rate limiting and error handling"""
        
        if not self._check_rate_limit(sport):
            logger.warning(f"Rate limit exceeded for {sport} API")
            return None
        
        url = self.base_url.format(sport=sport) + endpoint
        headers = {
            'x-rapidapi-host': f'{self.api_version}.{sport}.api-sports.io',
            'x-rapidapi-key': self.api_key
        }
        
        try:
            time.sleep(0.5)
            
            logger.info(f"Requesting: {url} with params: {params}")
            response = self.session.get(url, headers=headers, params=params, timeout=10)
            self._increment_rate_limit(sport)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('errors') and len(data['errors']) > 0:
                    logger.error(f"API Error for {sport}: {data['errors']}")
                    return None
                
                return data
            elif response.status_code == 429:
                logger.warning(f"Rate limit hit for {sport} API")
                return None
            else:
                logger.error(f"API request failed for {sport}: {response.status_code}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request exception for {sport}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error for {sport}: {e}")
            return None


class Formula1API(SportsAPIClient):
    """Formula 1 API integration"""
    
    def __init__(self):
        super().__init__(api_version="v1")
        self.sport = "formula-1"
        # Free tier: 2021-2023 only
        self.free_season = 2023
    
    def get_competitions(self) -> List[Dict]:
        """Get all F1 Grand Prix competitions"""
        cache_key = "f1_competitions"
        cached = safe_cache_get(cache_key)
        if cached:
            return cached
        
        data = self._make_request(self.sport, "/competitions")
        
        if data and data.get('response'):
            competitions = data['response']
            safe_cache_set(cache_key, competitions, 86400)
            return competitions
        
        return []
    
    def get_races(self, season: int = None, competition: int = None) -> List[Dict]:
        """Get F1 races - using free tier season"""
        if season is None or season > 2023:
            season = self.free_season
            logger.info(f"Using season {season} (free tier)")
        
        cache_key = f"f1_races_{season}"
        cached = safe_cache_get(cache_key)
        if cached:
            return cached
        
        params = {'season': season, 'type': 'race'}
        if competition:
            params['competition'] = competition
        
        data = self._make_request(self.sport, "/races", params=params)
        
        if data and data.get('response'):
            races = data['response']
            safe_cache_set(cache_key, races, 3600)
            return races
        
        return []
    
    def get_upcoming_races(self, limit: int = 10) -> List[Dict]:
        """Get F1 races (historical data for free tier)"""
        races = self.get_races()
        return races[:limit] if races else []


class FootballAPI(SportsAPIClient):
    """Football/Soccer API integration - Uses v3 API"""
    
    def __init__(self):
        super().__init__(api_version="v3")  # CRITICAL: Football uses v3!
        self.sport = "football"
    
    def get_fixtures(self, league_id: int = None, live: str = None) -> List[Dict]:
        """Get football fixtures"""
        params = {}
        
        if live:
            params['live'] = live  # 'all' for all live matches
        elif league_id:
            params['league'] = league_id
            params['season'] = 2024  # Use 2024 season
            params['last'] = 10  # Get last 10 matches
        
        data = self._make_request(self.sport, "/fixtures", params=params)
        
        if data and data.get('response'):
            return data['response']
        
        return []
    
    def get_live_fixtures(self) -> List[Dict]:
        """Get all live football matches"""
        return self.get_fixtures(live='all')
    
    def get_premier_league_fixtures(self, next_n: int = 10) -> List[Dict]:
        """Get Premier League fixtures (League ID: 39)"""
        return self.get_fixtures(league_id=39)
    
    def get_champions_league_fixtures(self, next_n: int = 5) -> List[Dict]:
        """Get Champions League fixtures (League ID: 2)"""
        return self.get_fixtures(league_id=2)


class RugbyAPI(SportsAPIClient):
    """Rugby API integration"""
    
    def __init__(self):
        super().__init__(api_version="v1")
        self.sport = "rugby"
    
    def get_fixtures(self, game_id: int = None, league_id: int = 16) -> List[Dict]:
        """Get rugby fixtures - requires either game ID or league ID"""
        params = {}
        
        if game_id:
            params['id'] = game_id
        else:
            # Default to Top 14 league (France)
            params['league'] = league_id
            params['season'] = 2023
        
        data = self._make_request(self.sport, "/games", params=params)
        
        if data and data.get('response'):
            return data['response']
        
        return []


class BasketballAPI(SportsAPIClient):
    """Basketball API integration"""
    
    def __init__(self):
        super().__init__(api_version="v1")
        self.sport = "basketball"
    
    def get_games(self, league_id: int = 12, season: str = "2023-2024") -> List[Dict]:
        """Get basketball games - default to NBA"""
        params = {
            'league': league_id,
            'season': season
        }
        
        data = self._make_request(self.sport, "/games", params=params)
        
        if data and data.get('response'):
            return data['response']
        
        return []


class SportsAPIManager:
    """Unified manager for all sports APIs"""
    
    def __init__(self):
        self.f1 = Formula1API()
        self.football = FootballAPI()
        self.rugby = RugbyAPI()
        self.basketball = BasketballAPI()
    
    def get_all_upcoming_fixtures(self) -> Dict[str, List[Dict]]:
        """Get upcoming fixtures for all sports"""
        fixtures = {}
        
        try:
            fixtures['formula1'] = self.f1.get_upcoming_races(limit=5)
        except Exception as e:
            logger.error(f"Error fetching F1 fixtures: {e}")
            fixtures['formula1'] = []
        
        try:
            fixtures['football'] = {
                'premier_league': self.football.get_premier_league_fixtures(),
                'champions_league': self.football.get_champions_league_fixtures(),
                'live': self.football.get_live_fixtures()
            }
        except Exception as e:
            logger.error(f"Error fetching football fixtures: {e}")
            fixtures['football'] = {}
        
        try:
            fixtures['rugby'] = self.rugby.get_fixtures()
        except Exception as e:
            logger.error(f"Error fetching rugby fixtures: {e}")
            fixtures['rugby'] = []
        
        try:
            fixtures['basketball'] = self.basketball.get_games()
        except Exception as e:
            logger.error(f"Error fetching basketball fixtures: {e}")
            fixtures['basketball'] = []
        
        return fixtures
    
    def health_check(self) -> Dict[str, bool]:
        """Check if all APIs are responding"""
        health = {}
        
        try:
            health['formula1'] = len(self.f1.get_competitions()) > 0
        except:
            health['formula1'] = False
        
        try:
            health['football'] = len(self.football.get_live_fixtures()) >= 0
        except:
            health['football'] = False
        
        try:
            health['rugby'] = len(self.rugby.get_fixtures()) >= 0
        except:
            health['rugby'] = False
        
        try:
            health['basketball'] = len(self.basketball.get_games()) >= 0
        except:
            health['basketball'] = False
        
        return health