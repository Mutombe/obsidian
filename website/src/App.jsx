// App.js - Updated with Obsidian Cookie Consent
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Footer from "./components/footer";
import HomePage from "./components/home";
import ContactPage from "./components/contact";
import ObsidianEventsPage from "./components/events";
import ObsidianNewsletter from "./components/newsletter";
import ObsidianCookieConsent from "./components/consent";
import ObsidianPrivacyPolicy from "./components/privacypolicy";
const FontLoader = () => {
  useEffect(() => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        
        /* Gravesend Sans Font Faces */
        @font-face {
          font-family: 'Gravesend Sans';
          src: url('./fonts/fonnts.com-Gravesend_Sans_Light.otf') format('opentype');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Gravesend Sans';
          src: url('./fonts/fonnts.com-Gravesend_Sans_Medium.otf') format('opentype');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Gravesend Sans';
          src: url('./fonts/fonnts.com-Gravesend_Sans_Bold.otf') format('opentype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        
        /* Century Gothic Font Face */
        @font-face {
          font-family: 'Century Gothic Custom';
          src: url('./fonts/weezerfont.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        /* Font utility classes */
        .gravesend-sans {
          font-family: 'Gravesend Sans', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .roboto-font {
          font-family: 'Roboto', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .century-gothic {
          font-family: 'Century Gothic Custom', 'Century Gothic', 'Arial', sans-serif;
        }
        
        .page-transition {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .magical-glow {
          animation: magicalGlow 4s ease-in-out infinite alternate;
        }
        @keyframes magicalGlow {
          0% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.3); }
          100% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.6); }
        }
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .luxury-gradient {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #92400e 100%);
        }
        .hospitality-card {
          backdrop-filter: blur(20px);
          background: rgba(17, 24, 39, 0.7);
          border: 1px solid rgba(250, 204, 21, 0.2);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hospitality-card:hover {
          transform: translateY(-10px) scale(1.02);
          background: rgba(17, 24, 39, 0.9);
          border: 1px solid rgba(250, 204, 21, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .entertainment-slideshow {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          background-size: cover;
          background-position: center;
          animation: slideshow 20s infinite;
        }
        @keyframes slideshow {
          0%, 20% { opacity: 0.1; }
          25%, 45% { opacity: 0.3; }
          50%, 70% { opacity: 0.1; }
          75%, 95% { opacity: 0.2; }
          100% { opacity: 0.1; }
        }
        
        /* Loading Screen Animations */
        @keyframes obsidian-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(250, 204, 21, 0.5),
                        0 0 60px rgba(250, 204, 21, 0.3),
                        0 0 90px rgba(250, 204, 21, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(250, 204, 21, 0.8),
                        0 0 80px rgba(250, 204, 21, 0.5),
                        0 0 120px rgba(250, 204, 21, 0.2);
          }
        }
        
        @keyframes loading-fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes gold-sweep {
          0% {
            transform: translateX(-100%) skewX(-25deg);
          }
          100% {
            transform: translateX(400%) skewX(-25deg);
          }
        }
        
        @keyframes luxury-pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }
      </style>
    `
    );
  }, []);
  return null;
};

// Luxury Loading Screen for Obsidian
const ObsidianLoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating Gold Particles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rotate-45 blur-3xl opacity-20 floating-element"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-tl from-yellow-500 to-yellow-700 rotate-12 blur-2xl opacity-15 floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/6 w-16 h-16 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full blur-xl opacity-25 floating-element" style={{ animationDelay: '4s' }}></div>
        
        {/* Sweeping Gold Lines */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div 
            className="absolute top-1/3 -left-20 w-80 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"
            style={{ animation: 'gold-sweep 3s ease-in-out infinite' }}
          ></div>
          <div 
            className="absolute bottom-1/3 -left-20 w-60 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-20"
            style={{ animation: 'gold-sweep 4s ease-in-out infinite', animationDelay: '1.5s' }}
          ></div>
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo Container */}
        <div className="relative mb-12">
          <div 
            className="w-40 h-40 mx-auto rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-yellow-400/30"
            style={{ 
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
              animation: 'obsidian-glow 3s ease-in-out infinite'
            }}
          >
            {/* Logo Image */}
            <img
              src="/logo.png"
              alt="Obsidian Logo"
              className="w-24 h-24 object-contain relative z-10"
              style={{ 
                filter: 'brightness(1.2) contrast(1.1)',
                animation: 'luxury-pulse 2s ease-in-out infinite'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            
            {/* Fallback logo if image fails to load */}
            <div 
              className="w-full h-full items-center justify-center flex-col space-y-2"
              style={{ display: 'none' }}
            >
              <div className="gravesend-sans text-4xl font-light bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                O
              </div>
              <div className="gellix-font text-xs font-light tracking-widest text-yellow-400/80">
                OBSIDIAN
              </div>
            </div>
            
            {/* Rotating Ring */}
            <div className="absolute inset-0 rounded-full">
              <div 
                className="w-full h-full rounded-full border-2 opacity-50"
                style={{ 
                  borderColor: 'transparent',
                  borderTopColor: '#fbbf24',
                  borderRightColor: '#f59e0b',
                  animation: 'spin 3s linear infinite'
                }}
              />
            </div>
            
            {/* Inner Glow */}
            <div 
              className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent"
              style={{ animation: 'loading-fade 2s ease-in-out infinite' }}
            ></div>
          </div>
        </div>

        {/* Brand Text */}
        <div className="space-y-6">
          <h1 className="gravesend-sans text-4xl lg:text-5xl font-light text-white tracking-wide">
            OBSIDIAN
          </h1>
          
          <div className="space-y-2">
            <p className="century-gothic text-lg text-yellow-400/90 tracking-widest font-light">
              ELITE ACCESS
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto opacity-60"></div>
            <p className="century-gothic text-sm text-gray-400 tracking-wider">
              UNFORGETTABLE EXPERIENCES
            </p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mt-12 space-y-6">
          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-3">
            {[0, 0.3, 0.6].map((delay, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                style={{ 
                  animation: `loading-fade 1.8s ease-in-out ${delay}s infinite`
                }}
              />
            ))}
          </div>
          
          {/* Loading Bar */}
          <div className="w-80 max-w-sm mx-auto">
            <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full"
                style={{ 
                  width: '100%',
                  animation: 'gold-sweep 2.5s ease-in-out infinite'
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 century-gothic tracking-wider">
              Preparing your luxury experience...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page Wrapper with Loading State
const PageWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) {
    return <ObsidianLoadingScreen />;
  }

  return (
    <div className="page-transition">
      {children}
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Component
const App = () => {
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Initial app loading
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoad) {
    return <ObsidianLoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <FontLoader />
        <ScrollToTop />
        
        <PageWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/newsletter" element={<ObsidianNewsletter />} />
            <Route path="/events" element={<ObsidianEventsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<ObsidianPrivacyPolicy />} />
            <Route path="/cookie-policy" element={<ObsidianPrivacyPolicy />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Footer />
        </PageWrapper>
        
        {/* Add Obsidian Cookie Consent Banner - appears on all pages */}
        <ObsidianCookieConsent />
      </div>
    </Router>
  );
};

export default App;