import React, { useState, useEffect } from 'react';
import { X, Shield, BarChart, Target, Crown } from 'lucide-react';

const ObsidianCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('obsidian-cookie-consent');
    if (!consent) {
      // Small delay to ensure page has loaded and doesn't interfere with loading screen
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('obsidian-cookie-consent', 'accepted');
    setShowBanner(false);
    // Initialize analytics/tracking
    initializeTracking('all');
  };

  const handleDecline = () => {
    localStorage.setItem('obsidian-cookie-consent', 'declined');
    setShowBanner(false);
    // Only essential cookies
    initializeTracking('essential');
  };

  const handleAcceptSelected = () => {
    const essential = document.getElementById('essential-cookies')?.checked || true;
    const analytics = document.getElementById('analytics-cookies')?.checked || false;
    const marketing = document.getElementById('marketing-cookies')?.checked || false;
    
    const preferences = {
      essential,
      analytics,
      marketing,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('obsidian-cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    initializeTracking(preferences);
  };

  const initializeTracking = (consent) => {
    // Add your actual tracking initialization here
    if (consent === 'all' || (typeof consent === 'object' && consent.analytics)) {
      // Initialize Google Analytics, etc.
      console.log('Analytics cookies enabled for Obsidian');
      // gtag('config', 'GA_MEASUREMENT_ID');
    }
    
    if (consent === 'all' || (typeof consent === 'object' && consent.marketing)) {
      // Initialize marketing cookies
      console.log('Marketing cookies enabled for Obsidian');
      // Facebook Pixel, etc.
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 transition-opacity duration-500"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        onClick={() => setShowDetails(false)}
      />
      
      {/* Luxury Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-700 ease-out">
        <div 
          className="mx-2 mb-2 sm:mx-4 sm:mb-4 rounded-lg shadow-2xl backdrop-blur-md border overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(17, 17, 17, 0.98) 100%)',
            borderColor: 'rgba(251, 191, 36, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(251, 191, 36, 0.2)'
          }}
        >
          {/* Gold accent line */}
          <div 
            className="h-1 w-full"
            style={{ 
              background: 'linear-gradient(90deg, transparent 0%, #fbbf24 20%, #f59e0b 50%, #d97706 80%, transparent 100%)'
            }}
          />
          
          <div className="p-4 sm:p-6">
            {!showDetails ? (
              // Simple banner view
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)'
                      }}
                    >
                      <Crown size={18} className="text-black" />
                      {/* Subtle glow animation */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-50"
                        style={{ 
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          animation: 'pulse 2s ease-in-out infinite'
                        }}
                      />
                    </div>
                    <h3 className="gravesend-sans font-light text-xl text-white">
                      Privacy & Experience
                    </h3>
                  </div>
                  <p className="century-gothic text-sm leading-relaxed text-gray-300">
                    We use cookies to enhance your luxury experience, provide personalized 
                    service recommendations, and analyze our premium offerings. Your privacy 
                    matters to us.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => setShowDetails(true)}
                    className="px-4 py-2 text-sm font-light rounded transition-all duration-300 century-gothic border hover:bg-white/5"
                    style={{ 
                      color: '#fbbf24',
                      borderColor: 'rgba(251, 191, 36, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2 text-sm font-light rounded transition-all duration-300 century-gothic hover:bg-gray-800"
                    style={{ 
                      color: '#9ca3af',
                      backgroundColor: 'rgba(55, 55, 55, 0.8)'
                    }}
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-6 py-2 text-sm font-light rounded transition-all duration-300 century-gothic shadow-lg hover:shadow-xl relative overflow-hidden group"
                    style={{ 
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                      color: '#000'
                    }}
                  >
                    <span className="relative z-10">Accept All</span>
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            ) : (
              // Detailed preferences view
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="gravesend-sans font-light text-2xl text-white">
                    Privacy Preferences
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 rounded-full transition-colors hover:bg-white/10"
                    style={{ color: '#fbbf24' }}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <p className="century-gothic text-sm text-gray-300">
                  Choose which cookies you want to accept. You can change these settings at any time 
                  to maintain control over your luxury experience.
                </p>

                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div 
                    className="flex items-start space-x-4 p-4 rounded-lg border backdrop-blur-sm"
                    style={{ 
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      borderColor: 'rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Shield size={20} style={{ color: '#fbbf24' }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <label 
                            htmlFor="essential-cookies" 
                            className="century-gothic font-medium text-white"
                          >
                            Essential Cookies
                          </label>
                          <input
                            type="checkbox"
                            id="essential-cookies"
                            checked={true}
                            disabled={true}
                            className="ml-auto"
                            style={{ accentColor: '#fbbf24' }}
                          />
                        </div>
                        <p className="text-xs mt-1 text-gray-400">
                          Required for secure booking functionality and account management. Cannot be disabled.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div 
                    className="flex items-start space-x-4 p-4 rounded-lg border backdrop-blur-sm hover:bg-white/5 transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(251, 191, 36, 0.05)',
                      borderColor: 'rgba(251, 191, 36, 0.2)'
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <BarChart size={20} style={{ color: '#f59e0b' }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <label 
                            htmlFor="analytics-cookies" 
                            className="century-gothic font-medium text-white"
                          >
                            Analytics Cookies
                          </label>
                          <input
                            type="checkbox"
                            id="analytics-cookies"
                            defaultChecked={false}
                            className="ml-auto"
                            style={{ accentColor: '#fbbf24' }}
                          />
                        </div>
                        <p className="text-xs mt-1 text-gray-400">
                          Help us understand event preferences and improve our luxury service offerings.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div 
                    className="flex items-start space-x-4 p-4 rounded-lg border backdrop-blur-sm hover:bg-white/5 transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(251, 191, 36, 0.05)',
                      borderColor: 'rgba(251, 191, 36, 0.2)'
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Target size={20} style={{ color: '#d97706' }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <label 
                            htmlFor="marketing-cookies" 
                            className="century-gothic font-medium text-white"
                          >
                            Marketing Cookies
                          </label>
                          <input
                            type="checkbox"
                            id="marketing-cookies"
                            defaultChecked={false}
                            className="ml-auto"
                            style={{ accentColor: '#fbbf24' }}
                          />
                        </div>
                        <p className="text-xs mt-1 text-gray-400">
                          Used for personalized event recommendations and exclusive VIP offers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'rgba(251, 191, 36, 0.2)' }}>
                  <div className="text-xs space-x-4 text-gray-500">
                    <a href="/privacy-policy" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
                    <a href="/cookie-policy" className="hover:text-yellow-400 transition-colors">Cookie Policy</a>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDecline}
                      className="px-4 py-2 text-sm font-light rounded transition-all duration-300 century-gothic hover:bg-gray-800"
                      style={{ 
                        color: '#9ca3af',
                        backgroundColor: 'rgba(55, 55, 55, 0.8)'
                      }}
                    >
                      Decline All
                    </button>
                    <button
                      onClick={handleAcceptSelected}
                      className="px-4 py-2 text-sm font-light rounded transition-all duration-300 century-gothic shadow-lg hover:shadow-xl relative overflow-hidden group"
                      style={{ 
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                        color: '#000'
                      }}
                    >
                      <span className="relative z-10">Save Preferences</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
};

export default ObsidianCookieConsent;