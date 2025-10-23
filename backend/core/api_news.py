# newsletter/api_news.py
"""
NewsData.io API Integration - CORRECT VERSION based on actual API
Handles fetching sports news articles
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


class NewsDataAPI:
    """NewsData.io API client for sports news"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or getattr(settings, 'NEWSDATA_API_KEY', 'pub_7590c5ed9a334f5ea6a014ddef761eaf')
        self.base_url = "https://newsdata.io/api/1"
        self.session = requests.Session()
        self.rate_limit_calls = 200  # Free tier limit
        self.rate_limit_window = 86400  # 24 hours
        
    def _get_rate_limit_key(self) -> str:
        """Get cache key for rate limiting"""
        return f"newsdata_rate_limit_{datetime.now().strftime('%Y%m%d')}"
    
    def _check_rate_limit(self) -> bool:
        """Check if we've hit rate limit"""
        key = self._get_rate_limit_key()
        calls = safe_cache_get(key, 0)
        return calls < self.rate_limit_calls
    
    def _increment_rate_limit(self):
        """Increment rate limit counter"""
        key = self._get_rate_limit_key()
        calls = safe_cache_get(key, 0)
        safe_cache_set(key, calls + 1, self.rate_limit_window)
    
    def _make_request(self, endpoint: str, params: Dict) -> Optional[Dict]:
        """Make API request with error handling"""
        
        if not self._check_rate_limit():
            logger.warning("NewsData.io rate limit exceeded")
            return None
        
        url = f"{self.base_url}/{endpoint}"
        params['apikey'] = self.api_key
        
        try:
            time.sleep(0.3)  # Rate limiting delay
            
            logger.info(f"NewsData.io request: {url} with params: {params}")
            response = self.session.get(url, params=params, timeout=15)
            self._increment_rate_limit()
            
            logger.info(f"NewsData.io response status: {response.status_code}")
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 422:
                logger.error(f"NewsData.io 422 error - Invalid parameters: {params}")
                logger.error(f"Response: {response.text}")
                return None
            elif response.status_code == 429:
                logger.warning("NewsData.io rate limit hit")
                return None
            else:
                logger.error(f"NewsData.io request failed: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"NewsData.io request exception: {e}")
            return None
        except Exception as e:
            logger.error(f"NewsData.io unexpected error: {e}")
            return None
    
    def get_latest_news(self, query: str = None, language: str = "en",
                       category: str = "sports") -> Dict:
        """
        Get latest news articles - THIS IS THE CORRECT ENDPOINT
        Based on working API: /latest?apikey=XXX&q=f1&language=en&category=sports
        
        Args:
            query: Search query (e.g., "f1", "soccer")
            language: Language code (default: "en")
            category: News category (default: "sports")
        """
        params = {
            'language': language,
            'category': category,
        }
        
        # Only add query if provided
        if query:
            params['q'] = query
        
        return self._make_request('latest', params)


class SportsNewsManager:
    """
    Manages fetching news for different sports
    """
    
    SPORTS_QUERIES = {
        'soccer': ['soccer', 'premier league', 'champions league'],
        'formula1': ['f1', 'formula 1', 'formula one'],
        'rugby': ['rugby'],
        'tennis': ['tennis', 'atp', 'wta'],
        'golf': ['golf', 'pga'],
        'boxing': ['boxing', 'ufc'],
        'basketball': ['nba', 'basketball'],
        'cricket': ['cricket']
    }
    
    def __init__(self):
        self.api = NewsDataAPI()
    
    def get_sport_news(self, sport: str, max_articles: int = 10) -> List[Dict]:
        """
        Get news articles for a specific sport
        
        Args:
            sport: Sport name (e.g., 'soccer', 'formula1')
            max_articles: Maximum number of articles to return
        """
        cache_key = f"sport_news_{sport}"
        cached = safe_cache_get(cache_key)
        if cached:
            logger.info(f"Using cached news for {sport}")
            return cached
        
        queries = self.SPORTS_QUERIES.get(sport.lower(), [sport])
        all_articles = []
        seen_titles = set()
        
        for query in queries[:2]:  # Limit to 2 queries per sport
            try:
                logger.info(f"Fetching news for {sport} with query: {query}")
                
                # Use the correct API call format
                response = self.api.get_latest_news(
                    query=query,
                    language='en',
                    category='sports'
                )
                
                if response and response.get('status') == 'success':
                    articles = response.get('results', [])
                    logger.info(f"Got {len(articles)} articles for query '{query}'")
                    
                    for article in articles:
                        title = article.get('title', '')
                        
                        # Avoid duplicates
                        if title and title not in seen_titles:
                            seen_titles.add(title)
                            all_articles.append(self._format_article(article, sport))
                            
                            if len(all_articles) >= max_articles:
                                break
                else:
                    logger.warning(f"No success response for {sport} with query '{query}'")
                
                if len(all_articles) >= max_articles:
                    break
                    
                # Small delay between queries
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"Error fetching {sport} news with query '{query}': {e}")
                continue
        
        logger.info(f"Total articles fetched for {sport}: {len(all_articles)}")
        
        # Sort by publish date
        all_articles.sort(key=lambda x: x.get('publish_date', datetime.min), reverse=True)
        
        # Cache for 1 hour
        safe_cache_set(cache_key, all_articles[:max_articles], 3600)
        
        return all_articles[:max_articles]
    
    def _format_article(self, article: Dict, sport: str) -> Dict:
        """Format article data for database storage"""
        
        # Parse publish date
        pub_date_str = article.get('pubDate', '')
        try:
            publish_date = datetime.strptime(pub_date_str, '%Y-%m-%d %H:%M:%S')
        except:
            publish_date = datetime.now()
        
        return {
            'title': article.get('title', ''),
            'content': article.get('content') or article.get('description', ''),
            'summary': article.get('description', '')[:500] if article.get('description') else '',
            'source_url': article.get('link', ''),
            'source_name': article.get('source_name', article.get('source_id', '')),
            'image_url': article.get('image_url', ''),
            'publish_date': publish_date,
            'sport': sport,
            'type': 'news',
            'is_featured': False,
            'is_premium': self._is_premium_source(article.get('source_name', '')),
            'sentiment': article.get('sentiment', 'neutral'),
            'category': article.get('category', []),
            'keywords': article.get('keywords', []) or [],
            'creator': article.get('creator', []),
            'country': article.get('country', []),
            'language': article.get('language', 'english')
        }
    
    def _is_premium_source(self, source_name: str) -> bool:
        """Determine if source is premium/trusted"""
        premium_sources = [
            'BBC', 'ESPN', 'Sky Sports', 'The Guardian', 'Reuters',
            'AP', 'The Athletic', 'Sports Illustrated', 'CNN',
            'The Telegraph', 'The Independent', 'France 24'
        ]
        
        return any(premium in source_name for premium in premium_sources)
    
    def get_all_sports_news(self, max_per_sport: int = 5,
                           sports: List[str] = None) -> Dict[str, List[Dict]]:
        """
        Get news for all sports
        
        Args:
            max_per_sport: Maximum articles per sport
            sports: List of sports to fetch (None = all)
        """
        if sports is None:
            sports = list(self.SPORTS_QUERIES.keys())
        
        all_news = {}
        
        for sport in sports:
            try:
                articles = self.get_sport_news(sport, max_articles=max_per_sport)
                all_news[sport] = articles
                logger.info(f"Fetched {len(articles)} articles for {sport}")
            except Exception as e:
                logger.error(f"Error fetching news for {sport}: {e}")
                all_news[sport] = []
        
        return all_news
    
    def get_trending_news(self, limit: int = 20) -> List[Dict]:
        """Get trending sports news across all categories"""
        
        try:
            # Get latest sports news without specific query
            response = self.api.get_latest_news(
                language='en',
                category='sports'
            )
            
            if response and response.get('status') == 'success':
                articles = response.get('results', [])
                
                formatted = []
                for article in articles[:limit]:
                    # Try to categorize by sport
                    sport = self._categorize_article(article)
                    formatted.append(self._format_article(article, sport))
                
                return formatted
            
        except Exception as e:
            logger.error(f"Error fetching trending news: {e}")
        
        return []
    
    def _categorize_article(self, article: Dict) -> str:
        """Attempt to categorize article by sport"""
        title = article.get('title', '').lower()
        description = article.get('description', '').lower()
        content = (title + ' ' + description).lower()
        
        # Check each sport's keywords
        for sport, keywords in self.SPORTS_QUERIES.items():
            for keyword in keywords:
                if keyword.lower() in content:
                    return sport
        
        return 'general'
    
    def health_check(self) -> bool:
        """Check if NewsData.io API is responding"""
        try:
            response = self.api.get_latest_news(category='sports')
            return response is not None and response.get('status') == 'success'
        except:
            return False