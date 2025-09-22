import React from 'react';

const ObsidianNewsletters = ({ 
  date = "FRIDAY, DECEMBER 20, 2025",
  featuredArticle = {
    image: "Featured Image",
    category: "PREMIER LEAGUE",
    title: "Manchester City Unveils Exclusive VIP Suite Experience for 2025 Season",
    excerpt: "Experience match day like never before with unprecedented luxury amenities, private chef services, and meet-and-greet opportunities with club legends. The new Diamond Suite offers an intimate setting for just 20 guests per match.",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"
  },
  articles = [
    {
      image: "Article Image",
      title: "Formula 1 Monaco GP: Ultimate Yacht Hospitality Packages Released",
      category: "FORMULA 1",
      date: "2 DAYS AGO",
      thumbnail: "/f1.jpg"
    },
    {
      image: "Article Image",
      title: "Wimbledon 2025: Centre Court Royal Box Experience Now Available",
      category: "TENNIS",
      date: "3 DAYS AGO",
      thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"
    },
    {
      image: "Article Image",
      title: "Six Nations Championship: Private Suite Packages Announced",
      category: "RUGBY",
      date: "4 DAYS AGO",
            thumbnail: "/home.jpg",

    },
    {
      image: "Article Image",
      title: "The Masters: Augusta National Hospitality Experiences",
      category: "GOLF",
      date: "5 DAYS AGO",
      thumbnail: "/bes1.jpg",
    }
  ]
}) => {
  const styles = {
    wrapper: {
      maxWidth: '700px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      fontFamily: "'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    header: {
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      padding: '40px 30px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    headerOverlay: {
      position: 'absolute',
      top: '-50%',
      right: '-10%',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
    },
    logoSection: {
      marginBottom: '20px',
      position: 'relative',
      zIndex: 1,
    },
    logo: {
      width: '150px',
      height: 'auto',
      marginBottom: '15px',
    },
    brandName: {
      fontSize: '28px',
      fontWeight: '300',
      color: '#ffffff',
      letterSpacing: '3px',
      marginBottom: '5px',
    },
    tagline: {
      color: '#fbbf24',
      fontSize: '14px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    dateBanner: {
      background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
      padding: '15px',
      textAlign: 'center',
      color: '#000',
      fontSize: '14px',
      fontWeight: '500',
      letterSpacing: '1px',
    },
    content: {
      padding: '40px 30px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '300',
      color: '#000',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #fbbf24',
      letterSpacing: '1px',
    },
    featuredArticle: {
      marginBottom: '40px',
      border: '1px solid #e5e5e5',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease',
      cursor: 'pointer',
    },
    featuredImage: {
      width: '100%',
      height: '300px',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      paddingBottom: "20px",
      fontSize: '14px',
      marginBottom: '15px',
    },
    featuredContent: {
      padding: '25px',
    },
    articleCategory: {
      display: 'inline-block',
      background: '#000',
      color: '#fbbf24',
      padding: '5px 15px',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '15px',
    },
    featuredTitle: {
      fontSize: '22px',
      color: '#000',
      marginBottom: '15px',
      lineHeight: '1.3',
      fontWeight: '400',
    },
    featuredExcerpt: {
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    readMore: {
      display: 'inline-block',
      color: '#000',
      textDecoration: 'none',
      fontWeight: '500',
      borderBottom: '2px solid #fbbf24',
      paddingBottom: '2px',
      transition: 'all 0.3s ease',
    },
    articleGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
    },
    articleCard: {
      border: '1px solid #e5e5e5',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    articleImage: {
      width: '100%',
      height: '150px',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '12px',
            paddingBottom: "20px",

    },
    articleContent: {
      padding: '20px',
    },
    articleTitle: {
      fontSize: '16px',
      color: '#000',
      marginBottom: '10px',
      lineHeight: '1.4',
    },
    articleMeta: {
      fontSize: '12px',
      color: '#999',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    vipSection: {
      background: '#000',
      padding: '40px 30px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    vipBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
    },
    vipTitle: {
      color: '#fbbf24',
      fontSize: '24px',
      fontWeight: '300',
      marginBottom: '15px',
      letterSpacing: '2px',
    },
    vipText: {
      color: '#fff',
      marginBottom: '25px',
      lineHeight: '1.6',
    },
    vipButton: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      color: '#000',
      padding: '15px 40px',
      textDecoration: 'none',
      fontWeight: '500',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
    },
    footer: {
      background: '#1a1a1a',
      padding: '30px',
      textAlign: 'center',
      color: '#999',
      fontSize: '12px',
    },
    socialLinks: {
      marginBottom: '20px',
    },
    socialLink: {
      display: 'inline-block',
      width: '35px',
      height: '35px',
      background: '#2a2a2a',
      borderRadius: '50%',
      margin: '0 5px',
      lineHeight: '35px',
      color: '#fbbf24',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    },
    footerLinks: {
      marginBottom: '15px',
    },
    footerLink: {
      color: '#999',
      textDecoration: 'none',
      margin: '0 10px',
      fontSize: '11px',
      transition: 'color 0.3s ease',
    },
    copyright: {
      color: '#666',
      fontSize: '11px',
      marginTop: '15px',
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.logoSection}>
          <img 
            src="https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/logo4.png" 
            alt="Obsidian Lifestyle" 
            style={styles.logo} 
          />
          <div style={styles.brandName}>OBSIDIAN</div>
          <div style={styles.tagline}>Elite Sports Digest</div>
        </div>
      </div>

      {/* Date Banner */}
      <div style={styles.dateBanner}>
        WEEKLY EDITION • {date}
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Featured Article */}
        <h2 style={styles.sectionTitle}>Featured This Week</h2>
        <div 
          style={styles.featuredArticle}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={styles.featuredImage}><img src='/pic3.jpg' alt={featuredArticle.title} /></div>
          <div style={styles.featuredContent}>
            <span style={styles.articleCategory}>{featuredArticle.category}</span>
            <h3 style={styles.featuredTitle}>{featuredArticle.title}</h3>
            <p style={styles.featuredExcerpt}>{featuredArticle.excerpt}</p>
            <a 
              href={featuredArticle.link} 
              style={styles.readMore}
              onMouseEnter={(e) => {
                e.target.style.color = '#d97706';
                e.target.style.borderBottomColor = '#d97706';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#000';
                e.target.style.borderBottomColor = '#fbbf24';
              }}
            >
              Read Full Story →
            </a>
          </div>
        </div>

        {/* Latest Stories */}
        <h2 style={styles.sectionTitle}>Latest Premium Stories</h2>
        <div style={styles.articleGrid}>
          {articles.map((article, index) => (
            <div 
              key={index}
              style={styles.articleCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 3px 15px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.articleImage}><img src={article.thumbnail} alt={article.title} style={{ width: '100%', height: 'auto', paddingBottom: '7px' }} /></div>
              <div style={styles.articleContent}>
                <h4 style={styles.articleTitle}>{article.title}</h4>
                <div style={styles.articleMeta}>{article.category} • {article.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Section */}
      <div style={styles.vipSection}>
        <div style={styles.vipBorder}></div>
        <h2 style={styles.vipTitle}>EXCLUSIVE VIP PACKAGES</h2>
        <p style={styles.vipText}>
          Experience the pinnacle of sporting luxury with our curated VIP hospitality packages.<br/>
          Premier League • Formula 1 • Golf • Rugby
        </p>
        <button 
          style={styles.vipButton}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 5px 20px rgba(251, 191, 36, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
          onClick={() => window.location.href = 'https://obsidian.lifestyle/packages'}
        >
          Explore Packages
        </button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLinks}>
          {['Unsubscribe', 'Update Preferences', 'View Online'].map((link, index) => (
            <a 
              key={index}
              href="#" 
              style={styles.footerLink}
              onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
              onMouseLeave={(e) => e.target.style.color = '#999'}
            >
              {link}
            </a>
          ))}
        </div>
        <div style={styles.copyright}>
          © 2025 Obsidian Lifestyle. All rights reserved.<br/>
          A product of Bard Santner Markets
        </div>
      </div>
    </div>
  );
};

export default ObsidianNewsletters;