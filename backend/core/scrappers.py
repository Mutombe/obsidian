# newsletter/scrapers.py
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta
import logging
from typing import List, Dict, Optional
from django.conf import settings
import re
from .models import NewsArticle, MatchFixture, SportCategory

logger = logging.getLogger(__name__)

class BaseSportsScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text.strip())
    
    def save_article(self, article_data: Dict, sport_name: str) -> Optional[NewsArticle]:
        """Save article to database"""
        try:
            sport_category = SportCategory.objects.get(name=sport_name)
            
            # Check if article already exists
            if NewsArticle.objects.filter(
                title=article_data['title'],
                source_url=article_data.get('source_url', '')
            ).exists():
                return None
            
            article = NewsArticle.objects.create(
                title=article_data['title'],
                content=article_data.get('content', ''),
                summary=article_data.get('summary', ''),
                sport_category=sport_category,
                article_type=article_data.get('type', 'news'),
                source_url=article_data.get('source_url', ''),
                source_name=article_data.get('source_name', ''),
                image_url=article_data.get('image_url', ''),
                publish_date=article_data.get('publish_date', datetime.now()),
                is_featured=article_data.get('is_featured', False),
                is_premium=article_data.get('is_premium', False)
            )
            return article
        except Exception as e:
            logger.error(f"Error saving article: {e}")
            return None
    
    def save_fixture(self, fixture_data: Dict, sport_name: str) -> Optional[MatchFixture]:
        """Save fixture to database"""
        try:
            sport_category = SportCategory.objects.get(name=sport_name)
            
            fixture, created = MatchFixture.objects.get_or_create(
                home_team=fixture_data['home_team'],
                away_team=fixture_data['away_team'],
                match_date=fixture_data['match_date'],
                sport_category=sport_category,
                defaults={
                    'venue': fixture_data.get('venue', ''),
                    'league_competition': fixture_data.get('league', ''),
                    'status': fixture_data.get('status', 'scheduled'),
                    'home_score': fixture_data.get('home_score'),
                    'away_score': fixture_data.get('away_score'),
                    'source_url': fixture_data.get('source_url', ''),
                }
            )
            return fixture if created else None
        except Exception as e:
            logger.error(f"Error saving fixture: {e}")
            return None

class SoccerScraper(BaseSportsScraper):
    def __init__(self):
        super().__init__()
        self.api_key = getattr(settings, 'FOOTBALL_API_KEY', None)
    
    def scrape_premier_league_news(self) -> List[Dict]:
        """Scrape Premier League news from BBC Sport"""
        articles = []
        try:
            url = "https://www.bbc.com/sport/football/premier-league"
            response = self.session.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find article containers
            article_containers = soup.find_all('div', class_=re.compile('gs-c-promo'))[:5]
            
            for container in article_containers:
                try:
                    title_elem = container.find('h3') or container.find('h2')
                    if not title_elem:
                        continue
                    
                    title = self.clean_text(title_elem.get_text())
                    link_elem = container.find('a')
                    source_url = f"https://www.bbc.com{link_elem.get('href')}" if link_elem else ""
                    
                    # Get summary
                    summary_elem = container.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200]
                    
                    # Get image
                    img_elem = container.find('img')
                    image_url = img_elem.get('src') if img_elem else ""
                    
                    articles.append({
                        'title': title,
                        'summary': summary,
                        'content': summary,  # Would need full article scraping
                        'source_url': source_url,
                        'source_name': 'BBC Sport',
                        'image_url': image_url,
                        'type': 'news',
                        'publish_date': datetime.now() - timedelta(hours=1),
                        'is_premium': True
                    })
                except Exception as e:
                    logger.error(f"Error parsing article: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping Premier League news: {e}")
        
        return articles
    
    def scrape_premier_league_fixtures(self) -> List[Dict]:
        """Scrape upcoming Premier League fixtures"""
        fixtures = []
        try:
            # Using a free football API
            url = "https://www.bbc.com/sport/football/premier-league/scores-fixtures"
            response = self.session.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find fixture containers
            fixture_containers = soup.find_all('li', class_=re.compile('gs-u-p'))[:10]
            
            for container in fixture_containers:
                try:
                    teams = container.find_all('span', class_=re.compile('sp-c-fixture__team'))
                    if len(teams) >= 2:
                        home_team = self.clean_text(teams[0].get_text())
                        away_team = self.clean_text(teams[1].get_text())
                        
                        # Get match date
                        date_elem = container.find('time')
                        match_date = datetime.now() + timedelta(days=7)  # Default to next week
                        
                        if date_elem and date_elem.get('datetime'):
                            try:
                                match_date = datetime.fromisoformat(date_elem.get('datetime').replace('Z', '+00:00'))
                            except:
                                pass
                        
                        fixtures.append({
                            'home_team': home_team,
                            'away_team': away_team,
                            'match_date': match_date,
                            'league': 'Premier League',
                            'venue': '',
                            'status': 'scheduled'
                        })
                except Exception as e:
                    logger.error(f"Error parsing fixture: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping Premier League fixtures: {e}")
        
        return fixtures

class Formula1Scraper(BaseSportsScraper):
    def scrape_f1_news(self) -> List[Dict]:
        """Scrape Formula 1 news"""
        articles = []
        try:
            url = "https://www.formula1.com/en/latest/all.html"
            response = self.session.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            article_containers = soup.find_all('div', class_=re.compile('f1-latest-listing'))[:5]
            
            for container in article_containers:
                try:
                    title_elem = container.find('h2') or container.find('h3')
                    if not title_elem:
                        continue
                    
                    title = self.clean_text(title_elem.get_text())
                    link_elem = title_elem.find('a') or container.find('a')
                    source_url = f"https://www.formula1.com{link_elem.get('href')}" if link_elem else ""
                    
                    summary_elem = container.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200]
                    
                    img_elem = container.find('img')
                    image_url = img_elem.get('src') if img_elem else ""
                    
                    articles.append({
                        'title': title,
                        'summary': summary,
                        'content': summary,
                        'source_url': source_url,
                        'source_name': 'Formula1.com',
                        'image_url': image_url,
                        'type': 'news',
                        'publish_date': datetime.now() - timedelta(hours=2),
                        'is_premium': True
                    })
                except Exception as e:
                    logger.error(f"Error parsing F1 article: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping F1 news: {e}")
        
        return articles
    
    def scrape_f1_calendar(self) -> List[Dict]:
        """Scrape F1 race calendar"""
        fixtures = []
        try:
            url = "https://www.formula1.com/en/racing/2025.html"
            response = self.session.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            race_containers = soup.find_all('div', class_=re.compile('race-listing'))[:5]
            
            for container in race_containers:
                try:
                    title_elem = container.find('h2') or container.find('h3')
                    if not title_elem:
                        continue
                    
                    race_name = self.clean_text(title_elem.get_text())
                    date_elem = container.find('time')
                    
                    match_date = datetime.now() + timedelta(days=30)  # Default
                    if date_elem and date_elem.get('datetime'):
                        try:
                            match_date = datetime.fromisoformat(date_elem.get('datetime').replace('Z', '+00:00'))
                        except:
                            pass
                    
                    venue_elem = container.find('span', class_=re.compile('venue'))
                    venue = self.clean_text(venue_elem.get_text()) if venue_elem else ""
                    
                    fixtures.append({
                        'home_team': race_name,
                        'away_team': 'F1 Race',
                        'match_date': match_date,
                        'league': 'Formula 1 Championship',
                        'venue': venue,
                        'status': 'scheduled'
                    })
                except Exception as e:
                    logger.error(f"Error parsing F1 race: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping F1 calendar: {e}")
        
        return fixtures

class RugbyScraper(BaseSportsScraper):
    def scrape_rugby_news(self) -> List[Dict]:
        """Scrape rugby news from Planet Rugby"""
        articles = []
        try:
            url = "https://www.planetrugby.com/news/"
            response = self.session.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            article_containers = soup.find_all('article', class_=re.compile('post'))[:5]
            
            for container in article_containers:
                try:
                    title_elem = container.find('h2') or container.find('h3')
                    if not title_elem:
                        continue
                    
                    title_link = title_elem.find('a')
                    title = self.clean_text(title_link.get_text() if title_link else title_elem.get_text())
                    source_url = title_link.get('href') if title_link else ""
                    
                    summary_elem = container.find('div', class_=re.compile('excerpt'))
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200]
                    
                    img_elem = container.find('img')
                    image_url = img_elem.get('src') if img_elem else ""
                    
                    articles.append({
                        'title': title,
                        'summary': summary,
                        'content': summary,
                        'source_url': source_url,
                        'source_name': 'Planet Rugby',
                        'image_url': image_url,
                        'type': 'news',
                        'publish_date': datetime.now() - timedelta(hours=3),
                        'is_premium': True
                    })
                except Exception as e:
                    logger.error(f"Error parsing rugby article: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping rugby news: {e}")
        
        return articles

class TennisScraper(BaseSportsScraper):
    def scrape_tennis_news(self) -> List[Dict]:
        """Scrape tennis news from Tennis.com"""
        articles = []
        try:
            url = "https://www.tennis.com/news"
            response = self.session.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            article_containers = soup.find_all('div', class_=re.compile('article'))[:5]
            
            for container in article_containers:
                try:
                    title_elem = container.find('h2') or container.find('h3')
                    if not title_elem:
                        continue
                    
                    title_link = title_elem.find('a')
                    title = self.clean_text(title_link.get_text() if title_link else title_elem.get_text())
                    source_url = title_link.get('href') if title_link else ""
                    
                    if source_url and not source_url.startswith('http'):
                        source_url = f"https://www.tennis.com{source_url}"
                    
                    summary_elem = container.find('p')
                    summary = self.clean_text(summary_elem.get_text()) if summary_elem else title[:200]
                    
                    img_elem = container.find('img')
                    image_url = img_elem.get('src') if img_elem else ""
                    
                    articles.append({
                        'title': title,
                        'summary': summary,
                        'content': summary,
                        'source_url': source_url,
                        'source_name': 'Tennis.com',
                        'image_url': image_url,
                        'type': 'news',
                        'publish_date': datetime.now() - timedelta(hours=4),
                        'is_premium': True
                    })
                except Exception as e:
                    logger.error(f"Error parsing tennis article: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping tennis news: {e}")
        
        return articles

class SportsScrapingManager:
    def __init__(self):
        self.scrapers = {
            'soccer': SoccerScraper(),
            'formula1': Formula1Scraper(),
            'rugby': RugbyScraper(),
            'tennis': TennisScraper(),
            # Add more scrapers as needed
        }
    
    def scrape_all_sports_news(self) -> Dict[str, List]:
        """Scrape news for all sports"""
        all_news = {}
        
        for sport, scraper in self.scrapers.items():
            try:
                if hasattr(scraper, f'scrape_{sport}_news'):
                    news = getattr(scraper, f'scrape_{sport}_news')()
                    all_news[sport] = news
                    
                    # Save to database
                    for article_data in news:
                        scraper.save_article(article_data, sport)
                        
                    logger.info(f"Scraped {len(news)} {sport} articles")
            except Exception as e:
                logger.error(f"Error scraping {sport} news: {e}")
                all_news[sport] = []
        
        return all_news
    
    def scrape_all_fixtures(self) -> Dict[str, List]:
        """Scrape fixtures for all sports"""
        all_fixtures = {}
        
        for sport, scraper in self.scrapers.items():
            try:
                if hasattr(scraper, f'scrape_{sport}_fixtures') or hasattr(scraper, f'scrape_{sport}_calendar'):
                    method_name = f'scrape_{sport}_fixtures' if hasattr(scraper, f'scrape_{sport}_fixtures') else f'scrape_{sport}_calendar'
                    fixtures = getattr(scraper, method_name)()
                    all_fixtures[sport] = fixtures
                    
                    # Save to database
                    for fixture_data in fixtures:
                        scraper.save_fixture(fixture_data, sport)
                        
                    logger.info(f"Scraped {len(fixtures)} {sport} fixtures")
            except Exception as e:
                logger.error(f"Error scraping {sport} fixtures: {e}")
                all_fixtures[sport] = []
        
        return all_fixtures
    
    def run_full_scrape(self) -> Dict:
        """Run complete scraping for news and fixtures"""
        news = self.scrape_all_sports_news()
        fixtures = self.scrape_all_fixtures()
        
        return {
            'news': news,
            'fixtures': fixtures,
            'timestamp': datetime.now()
        }