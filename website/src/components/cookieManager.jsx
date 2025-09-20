// utils/obsidianCookieManager.js
// Luxury cookie management utility for Obsidian VIP experiences

/**
 * Get current cookie consent preferences for Obsidian
 * @returns {Object|null} Cookie preferences or null if not set
 */
export const getObsidianCookieConsent = () => {
  try {
    const consent = localStorage.getItem('obsidian-cookie-consent');
    if (!consent) return null;
    
    if (consent === 'accepted' || consent === 'declined') {
      return { type: consent };
    }
    
    return JSON.parse(consent);
  } catch (error) {
    console.error('Error reading Obsidian cookie consent:', error);
    return null;
  }
};

/**
 * Check if a specific cookie type is allowed for Obsidian
 * @param {string} cookieType - 'essential', 'analytics', or 'marketing'
 * @returns {boolean}
 */
export const isObsidianCookieAllowed = (cookieType) => {
  const consent = getObsidianCookieConsent();
  
  if (!consent) return false;
  
  // Essential cookies are always allowed
  if (cookieType === 'essential') return true;
  
  // If user accepted all
  if (consent.type === 'accepted') return true;
  
  // If user declined all
  if (consent.type === 'declined') return false;
  
  // Check specific preference
  return consent[cookieType] === true;
};

/**
 * Initialize luxury tracking services based on cookie consent
 */
export const initializeObsidianTracking = () => {
  const consent = getObsidianCookieConsent();
  
  if (!consent) {
    console.log('No Obsidian cookie consent found');
    return;
  }

  // Initialize luxury analytics
  if (isObsidianCookieAllowed('analytics')) {
    initializeObsidianAnalytics();
  }

  // Initialize VIP marketing tools
  if (isObsidianCookieAllowed('marketing')) {
    initializeObsidianMarketing();
  }

  console.log('Obsidian luxury tracking initialized with consent:', consent);
};

/**
 * Initialize Google Analytics for luxury hospitality tracking
 */
const initializeObsidianAnalytics = () => {
  // Replace with your actual Google Analytics ID
  const GA_MEASUREMENT_ID = 'G-OBSIDIAN_ID';
  
  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag with luxury-focused settings
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    // Privacy-friendly settings for luxury clientele
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Custom dimensions for hospitality tracking
    custom_map: {
      'custom_dimension_1': 'event_type',
      'custom_dimension_2': 'package_tier',
      'custom_dimension_3': 'client_type'
    }
  });

  console.log('Obsidian Analytics initialized for luxury tracking');
};

/**
 * Initialize luxury marketing tools
 */
const initializeObsidianMarketing = () => {
  // Facebook Pixel for luxury hospitality
  const FACEBOOK_PIXEL_ID = 'OBSIDIAN_PIXEL_ID';
  
  if (FACEBOOK_PIXEL_ID && FACEBOOK_PIXEL_ID !== 'OBSIDIAN_PIXEL_ID') {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    window.fbq('init', FACEBOOK_PIXEL_ID);
    window.fbq('track', 'PageView');
    
    console.log('Obsidian Marketing Pixel initialized');
  }

  // LinkedIn Insight Tag for B2B luxury events
  initializeLinkedInInsight();
  
  // Google Ads conversion tracking for luxury bookings
  initializeGoogleAdsTracking();
};

/**
 * Initialize LinkedIn Insight Tag for corporate hospitality
 */
const initializeLinkedInInsight = () => {
  const LINKEDIN_PARTNER_ID = 'YOUR_LINKEDIN_ID';
  
  if (LINKEDIN_PARTNER_ID && LINKEDIN_PARTNER_ID !== 'YOUR_LINKEDIN_ID') {
    window._linkedin_partner_id = LINKEDIN_PARTNER_ID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(script);
    
    console.log('LinkedIn Insight Tag initialized for corporate events');
  }
};

/**
 * Initialize Google Ads conversion tracking
 */
const initializeGoogleAdsTracking = () => {
  const GOOGLE_ADS_ID = 'AW-XXXXXXXXX';
  
  if (GOOGLE_ADS_ID && GOOGLE_ADS_ID !== 'AW-XXXXXXXXX') {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    script.async = true;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GOOGLE_ADS_ID);
    
    console.log('Google Ads tracking initialized for luxury conversions');
  }
};

/**
 * Track luxury hospitality events
 * @param {string} eventName - Name of the event
 * @param {Object} eventData - Event data specific to luxury hospitality
 */
export const trackObsidianEvent = (eventName, eventData = {}) => {
  if (!isObsidianCookieAllowed('analytics')) {
    console.log('Analytics cookies not allowed, skipping Obsidian event:', eventName);
    return;
  }

  // Enhanced event data for luxury hospitality
  const enhancedData = {
    ...eventData,
    brand: 'Obsidian',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
  };

  // Google Analytics event tracking
  if (window.gtag) {
    window.gtag('event', eventName, {
      ...enhancedData,
      event_category: 'luxury_hospitality',
      event_label: eventData.package_type || 'general'
    });
  }

  // Facebook Pixel event tracking
  if (window.fbq && isObsidianCookieAllowed('marketing')) {
    // Map to Facebook standard events where applicable
    const fbEventMap = {
      'package_view': 'ViewContent',
      'booking_initiated': 'InitiateCheckout',
      'booking_completed': 'Purchase',
      'newsletter_signup': 'CompleteRegistration',
      'contact_form_submit': 'Lead'
    };
    
    const fbEventName = fbEventMap[eventName] || eventName;
    window.fbq('track', fbEventName, enhancedData);
  }

  // LinkedIn conversion tracking for corporate events
  if (window.lintrk && isObsidianCookieAllowed('marketing')) {
    window.lintrk('track', { conversion_id: 'LINKEDIN_CONVERSION_ID' });
  }

  console.log('Obsidian event tracked:', eventName, enhancedData);
};

/**
 * Track luxury package views
 * @param {Object} packageData - Package information
 */
export const trackPackageView = (packageData) => {
  trackObsidianEvent('package_view', {
    package_name: packageData.name,
    package_tier: packageData.tier, // VIP, Premium, Elite
    package_price: packageData.price,
    event_type: packageData.eventType, // Sports, Entertainment, Corporate
    venue: packageData.venue
  });
};

/**
 * Track booking flow events
 * @param {string} step - Booking step
 * @param {Object} bookingData - Booking information
 */
export const trackBookingFlow = (step, bookingData = {}) => {
  const steps = {
    'initiated': 'booking_initiated',
    'details_entered': 'booking_details',
    'payment_started': 'payment_initiated',
    'completed': 'booking_completed',
    'failed': 'booking_failed'
  };
  
  trackObsidianEvent(steps[step] || step, {
    booking_step: step,
    package_type: bookingData.packageType,
    total_value: bookingData.totalValue,
    guest_count: bookingData.guestCount,
    event_date: bookingData.eventDate
  });
};

/**
 * Track VIP newsletter signups
 * @param {Object} signupData - Signup information
 */
export const trackNewsletterSignup = (signupData = {}) => {
  trackObsidianEvent('newsletter_signup', {
    signup_source: signupData.source || 'website',
    user_type: signupData.userType || 'prospect',
    interests: signupData.interests || []
  });
};

/**
 * Track luxury page views with enhanced data
 * @param {string} pagePath - Path of the page
 * @param {string} pageTitle - Title of the page
 * @param {Object} pageData - Additional page data
 */
export const trackObsidianPageView = (pagePath, pageTitle, pageData = {}) => {
  if (!isObsidianCookieAllowed('analytics')) return;

  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: pagePath,
      page_title: pageTitle,
      custom_dimension_1: pageData.section || 'general',
      custom_dimension_2: pageData.userType || 'visitor'
    });
  }

  console.log('Obsidian page view tracked:', pagePath, pageTitle);
};

/**
 * Clear all luxury tracking cookies and data
 */
export const clearObsidianTrackingData = () => {
  // Clear Google Analytics cookies
  const gaCookies = document.cookie
    .split(';')
    .filter(cookie => cookie.trim().startsWith('_ga'));
  
  gaCookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  // Clear Facebook Pixel cookies
  document.cookie = '_fbp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Clear LinkedIn cookies
  document.cookie = '_linkedin_data_partner_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  console.log('Obsidian tracking data cleared');
};

/**
 * Reset Obsidian cookie consent (useful for testing)
 */
export const resetObsidianCookieConsent = () => {
  localStorage.removeItem('obsidian-cookie-consent');
  clearObsidianTrackingData();
  console.log('Obsidian cookie consent reset');
  
  // Reload page to show banner again
  window.location.reload();
};

/**
 * Get user preferences for personalization (if allowed)
 * @returns {Object} User preferences
 */
export const getObsidianUserPreferences = () => {
  if (!isObsidianCookieAllowed('analytics')) {
    return { personalization: false };
  }
  
  try {
    const prefs = localStorage.getItem('obsidian-user-preferences');
    return prefs ? JSON.parse(prefs) : {};
  } catch (error) {
    console.error('Error reading user preferences:', error);
    return {};
  }
};

/**
 * Save user preferences for luxury experience personalization
 * @param {Object} preferences - User preferences
 */
export const saveObsidianUserPreferences = (preferences) => {
  if (!isObsidianCookieAllowed('analytics')) {
    console.log('Cannot save preferences - analytics cookies not allowed');
    return;
  }
  
  try {
    localStorage.setItem('obsidian-user-preferences', JSON.stringify({
      ...preferences,
      updated: new Date().toISOString()
    }));
    console.log('Obsidian user preferences saved');
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

// Initialize tracking when the module loads (after DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
  // Delay to ensure all components are loaded and cookie banner is handled
  setTimeout(initializeObsidianTracking, 1000);
});

// Export for external use
export default {
  getConsent: getObsidianCookieConsent,
  isAllowed: isObsidianCookieAllowed,
  trackEvent: trackObsidianEvent,
  trackPageView: trackObsidianPageView,
  trackPackageView,
  trackBookingFlow,
  trackNewsletterSignup,
  reset: resetObsidianCookieConsent,
  clearData: clearObsidianTrackingData,
  getPreferences: getObsidianUserPreferences,
  savePreferences: saveObsidianUserPreferences
};