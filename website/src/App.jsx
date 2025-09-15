import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Footer from "./components/footer";
import HomePage from "./components/home";
import ContactPage from "./components/contact";
import ObsidianEventsPage from "./components/events";
import ObsidianNewsletter from "./components/newsletter";

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
      </style>
    `
    );
  }, []);
  return null;
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
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <FontLoader />
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/newsletter" element={<ObsidianNewsletter />} />
          <Route path="/events" element={<ObsidianEventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
