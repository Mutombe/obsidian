import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ObsidianHero from './components/hero';
import { ChevronDown, Mail, Phone, MapPin, Calendar, Users, Shield, Star, ArrowRight, Menu, X, Check, Globe, Award  } from 'lucide-react';
import { GrGroup } from "react-icons/gr";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { IoStarOutline } from "react-icons/io5";


const FontLoader = () => {
  useEffect(() => {
    document.head.insertAdjacentHTML('beforeend', `
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
    `);
  }, []);
  return null;
};

// Enhanced Header Component with Magical Mobile Navigation
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/newsletter', label: 'Newsletter', icon: '📧' },
    { path: '/events', label: 'Events', icon: '🎪' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-yellow-400/30 shadow-2xl shadow-yellow-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <Link to="/" className="group flex items-center space-x-3 relative">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
            <div className="relative">
              <img src="/logo4.png" alt="Obsidian Lifestyle Logo" className="w-40 h-12 transition-all duration-300 group-hover:scale-105" />
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label }) => (
              <Link 
                key={path}
                to={path} 
                className={`relative gravesend-sans font-medium transition-all duration-500 group ${
                  isActive(path) 
                    ? 'text-yellow-400' 
                    : 'text-white hover:text-yellow-300'
                } pb-1`}
              >
                <span className="relative z-10">{label}</span>
                {isActive(path) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                )}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-300 group-hover:w-full"></div>
              </Link>
            ))}
          </nav>

          {/* Magical Mobile Menu Button */}
          <button 
            className="md:hidden relative w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 backdrop-blur-xl border border-yellow-400/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`relative w-6 h-6 transform transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
              {isMenuOpen ? (
                <X size={20} className="text-yellow-400" />
              ) : (
                <Menu size={20} className="text-yellow-400" />
              )}
            </div>
          </button>
        </div>

        {/* Magical Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-20 bg-black/95 backdrop-blur-2xl z-40">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400/50 rounded-full floating-element"></div>
            <div className="absolute top-32 right-16 w-1 h-1 bg-yellow-500/70 rounded-full floating-element" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-yellow-300/60 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-center">
              <nav className="space-y-8">
                {navItems.map(({ path, label, icon }, index) => (
                  <Link
                    key={path}
                    to={path}
                    className={`group flex items-center space-x-6 p-4 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40 shadow-2xl shadow-yellow-500/20'
                        : 'hover:bg-yellow-400/10 hover:border hover:border-yellow-400/30'
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className={`text-3xl transition-all duration-300 group-hover:scale-110 ${
                      isActive(path) ? 'filter drop-shadow-lg' : ''
                    }`}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className={`gravesend-sans text-2xl font-semibold transition-all duration-300 ${
                        isActive(path) ? 'text-yellow-400' : 'text-white group-hover:text-yellow-300'
                      }`}>
                        {label}
                      </div>
                      {isActive(path) && (
                        <div className="text-sm text-yellow-400/80 roboto-font">Currently viewing</div>
                      )}
                    </div>
                    <ArrowRight className={`w-6 h-6 transition-all duration-300 group-hover:translate-x-2 ${
                      isActive(path) ? 'text-yellow-400' : 'text-gray-400 group-hover:text-yellow-400'
                    }`} />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-black to-black text-white py-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5"></div>
      </div>
      
      {/* Floating Luxury Elements */}
      <div className="absolute top-8 left-8 w-3 h-3 bg-yellow-400/40 rounded-full floating-element"></div>
      <div className="absolute top-16 right-12 w-2 h-2 bg-yellow-500/50 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-12 left-1/4 w-2.5 h-2.5 bg-yellow-300/30 rounded-full floating-element" style={{animationDelay: '4s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-2">
            <div className="group flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/30 magical-glow">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div>
                <span className="gravesend-sans text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Obsidian Lifestyle
                </span>
                <div className="text-xs text-yellow-400/80 century-gothic">Premium Hospitality Experiences</div>
              </div>
            </div>
            <p className="century-gothic text-gray-300 leading-relaxed text-lg mb-6">
              Elite Access. Unforgettable Experiences. Your gateway to the world's most prestigious sporting events with unmatched luxury and sophistication.
            </p>
            
            {/* Live Status Indicator */}
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="century-gothic text-green-400 text-sm">
                Live Support Available • {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {/* Enhanced Contact Information */}
          <div className="space-y-6">
            <h3 className="gravesend-sans text-xl font-semibold mb-6 text-yellow-400 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Get In Touch
            </h3>
            <div className="space-y-4">
              {[
                { icon: Phone, text: '+263 70 000 0000', label: '24/7 Concierge' },
                { icon: Mail, text: 'hello@obsidian.lifestyle', label: 'Premium Support' },
                { icon: Mail, text: 'vip@obsidian.lifestyle', label: 'VIP Services' }
              ].map((contact, index) => (
                <div key={index} className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-400/5 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <contact.icon size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="century-gothic text-white group-hover:text-yellow-300 transition-colors">{contact.text}</div>
                    <div className="century-gothic text-xs text-gray-400">{contact.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Quick Links */}
          <div className="space-y-6">
            <h3 className="gravesend-sans text-xl font-semibold mb-6 text-yellow-400 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Exclusive Access
            </h3>
            <div className="space-y-3">
              {[
                { to: '/', label: 'Elite Experiences', desc: 'Premium packages' },
                { to: '/newsletter', label: 'VIP Newsletter', desc: 'Insider access' },
                { to: '/events', label: 'Upcoming Events', desc: 'Latest offerings' },
                { to: '/contact', label: 'Personal Concierge', desc: 'Bespoke service' }
              ].map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-yellow-400/5 transition-all duration-300"
                >
                  <div>
                    <div className="century-gothic text-gray-300 group-hover:text-yellow-300 transition-colors font-medium">
                      {link.label}
                    </div>
                    <div className="century-gothic text-xs text-gray-500">{link.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Footer Bottom */}
        <div className="border-t border-gradient-to-r from-transparent via-yellow-600/30 to-transparent mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="century-gothic text-gray-400 text-sm">
                © 2025 Obsidian Lifestyle, a product of Bard Santner Markets. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-full border border-yellow-400/20">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400 roboto-font">Premium Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Hero Component
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent transform rotate-12"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent transform -rotate-12"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 className="gravesend-sans text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          Elite Access.
          <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Unforgettable Experiences.
          </span>
        </h1>
        
        <p className="roboto-font text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
          Obsidian Lifestyle is your gateway to the world of premier sporting entertainment. 
          We specialise in providing official VIP hospitality packages across elite sports.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/30 hover:scale-105 flex items-center space-x-2">
            <span>Explore Packages</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="group border-2 border-yellow-400 text-yellow-400 px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-yellow-400 hover:text-black flex items-center space-x-2">
            <Calendar size={20} />
            <span>View Events</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// Features Component
const Features = () => {
  const features = [
    {
      icon: VscWorkspaceTrusted,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises. What you see is what you pay."
    },
    {
      icon: GrGroup,
      title: "Group Bookings",
      description: "All seats together, even for large group bookings. No one gets left behind."
    },
    {
      icon: IoStarOutline,
      title: "Personalized Service",
      description: "Dedicated customer service tailored to your specific needs and preferences."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="gravesend-sans text-4xl md:text-5xl font-bold text-white mb-6">
            The Obsidian Lifestyle Experience
          </h2>
          <p className="century-gothic text-xl text-gray-300 max-w-3xl mx-auto">
            We guarantee premium experiences with uncompromising quality and attention to detail.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative p-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 group-hover:shadow-2xl group-hover:shadow-yellow-500/30 transition-all duration-300">
                <feature.icon size={32} className="text-black" />
              </div>
              <h3 className="gravesend-sans text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="century-gothic text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Home Page
const HomePage = () => {
  return (
    <div className="pt-20">
      <ObsidianHero />
      <Features />
      
      {/* Hospitality Offerings */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="gravesend-sans text-4xl md:text-5xl font-bold text-white mb-6">
              Hospitality Offerings
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Premier League Football",
                description: "VIP matchday packages with gourmet dining and premium seating",
                image: "🏈"
              },
              {
                title: "Wembley Events",
                description: "Official hospitality experiences at the iconic Wembley Stadium",
                image: "🏟️"
              },
              {
                title: "Formula 1",
                description: "Exclusive paddock access and luxury hospitality suites",
                image: "🏎️"
              },
              {
                title: "Golf Championships",
                description: "Elite golf tournament experiences with hospitality lounges",
                image: "⛳"
              },
              {
                title: "Rugby Events",
                description: "Premium rugby hospitality with fine dining and entertainment",
                image: "🏉"
              },
              {
                title: "Bespoke Experiences",
                description: "Custom tailored hospitality packages for any sporting event",
                image: "✨"
              }
            ].map((offering, index) => (
              <div key={index} className="group relative p-6 bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-xl border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">{offering.image}</div>
                <h3 className="gravesend-sans text-xl font-semibold text-white mb-3">{offering.title}</h3>
                <p className="century-gothic text-gray-300 text-sm leading-relaxed">{offering.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="gravesend-sans text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="century-gothic text-xl text-gray-300">
              Simple. Seamless. Sophisticated.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Event",
                description: "Select from our curated collection of premium sporting events and hospitality packages."
              },
              {
                step: "02",
                title: "Secure Booking",
                description: "Complete your booking with our secure payment system and receive immediate confirmation."
              },
              {
                step: "03",
                title: "VIP Experience",
                description: "Arrive, relax, and enjoy top-tier hospitality with our full concierge service."
              }
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/30">
                  <span className="gravesend-sans text-2xl font-bold text-black">{step.step}</span>
                </div>
                <h3 className="gravesend-sans text-2xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="century-gothic text-gray-300 leading-relaxed">{step.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Newsletter Page
const NewsletterPage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="gravesend-sans text-5xl md:text-6xl font-bold text-white mb-6">
            Experience Elite 
            <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Sporting Hospitality
            </span>
          </h1>
          <p className="century-gothic text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Join the Obsidian Lifestyle insider list and gain priority access to official VIP packages for 
            Premier League football, Formula 1, golf, rugby, and more.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-yellow-600/20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="century-gothic text-white">Exclusive event alerts</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="century-gothic text-white">Private hospitality offers</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="century-gothic text-white">Tailored experiences</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-black border border-yellow-600/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/30 hover:scale-105 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </div>
          </form>

          {isSubscribed && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-center">
              <p className="text-green-400 century-gothic">Successfully subscribed! Welcome to Obsidian Lifestyle.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="century-gothic text-lg text-gray-300 mb-4">
            Your front-row seat to unforgettable moments starts here.
          </p>
          <p className="century-gothic text-yellow-400 font-semibold">
            Elevate your matchday experience.
          </p>
        </div>
      </div>
    </div>
  );
};

// Events Page
const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: "Premier League: Manchester United vs Liverpool",
      date: "March 15, 2025",
      venue: "Old Trafford",
      price: "From £850",
      category: "Football",
      description: "Experience the greatest rivalry in English football with premium hospitality at Old Trafford.",
      features: ["VIP Seating", "Gourmet Dining", "Meet & Greet", "Exclusive Lounge Access"]
    },
    {
      id: 2,
      title: "Formula 1: Monaco Grand Prix",
      date: "May 25, 2025",
      venue: "Circuit de Monaco",
      price: "From £2,500",
      category: "Formula 1",
      description: "The jewel in the F1 calendar with unparalleled luxury and glamour.",
      features: ["Paddock Access", "Yacht Hospitality", "Champagne Reception", "Grid Walk"]
    },
    {
      id: 3,
      title: "Rugby World Cup Final",
      date: "October 28, 2025",
      venue: "Stade de France",
      price: "From £1,200",
      category: "Rugby",
      description: "Witness rugby history at the most prestigious tournament final.",
      features: ["Premium Seats", "Fine Dining", "Former Player Meet", "Trophy Viewing"]
    },
    {
      id: 4,
      title: "The Masters Tournament",
      date: "April 10, 2025",
      venue: "Augusta National",
      price: "From £3,000",
      category: "Golf",
      description: "Golf's most coveted tournament with exclusive clubhouse access.",
      features: ["Course Access", "Augusta Dining", "Pro-Am Viewing", "Gift Shop Access"]
    },
    {
      id: 5,
      title: "FA Cup Final",
      date: "May 17, 2025",
      venue: "Wembley Stadium",
      price: "From £650",
      category: "Football",
      description: "English football's oldest competition at the home of football.",
      features: ["Wembley Suite", "Three-Course Meal", "Bar Package", "Stadium Tour"]
    },
    {
      id: 6,
      title: "Wimbledon Championships",
      date: "July 6, 2025",
      venue: "All England Club",
      price: "From £950",
      category: "Tennis",
      description: "The most prestigious tennis tournament with traditional hospitality.",
      features: ["Centre Court", "Strawberries & Cream", "Pimm's Reception", "Player Practice"]
    }
  ];

  const categories = ["All", "Football", "Formula 1", "Rugby", "Golf", "Tennis"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents = activeCategory === "All" 
    ? events 
    : events.filter(event => event.category === activeCategory);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="gravesend-sans text-5xl md:text-6xl font-bold text-white mb-6">
            Upcoming Events
          </h1>
          <p className="century-gothic text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our exclusive collection of premium sporting events with VIP hospitality packages.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full century-gothic font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                  : 'bg-gray-800/50 text-white hover:bg-gray-700/50 border border-yellow-600/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <div key={event.id} className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full">
                    {event.category}
                  </span>
                  <span className="gravesend-sans text-xl font-bold text-yellow-400">
                    {event.price}
                  </span>
                </div>
                
                <h3 className="gravesend-sans text-xl font-bold text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-yellow-400" />
                    <span className="century-gothic text-gray-300 text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-yellow-400" />
                    <span className="century-gothic text-gray-300 text-sm">{event.venue}</span>
                  </div>
                </div>
                
                <p className="century-gothic text-gray-300 text-sm leading-relaxed mb-4">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {event.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check size={14} className="text-yellow-400" />
                      <span className="century-gothic text-gray-300 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-full font-semibold roboto-font transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 flex items-center justify-center space-x-2"
                >
                  <span>Book Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-6">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-yellow-600/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm font-semibold rounded-full">
                      {selectedEvent.category}
                    </span>
                    <h2 className="gravesend-sans text-3xl font-bold text-white mt-4 mb-2">
                      {selectedEvent.title}
                    </h2>
                    <p className="gravesend-sans text-2xl font-bold text-yellow-400">
                      {selectedEvent.price}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-yellow-400" />
                    <span className="century-gothic text-white">{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-yellow-400" />
                    <span className="century-gothic text-white">{selectedEvent.venue}</span>
                  </div>
                </div>

                <p className="century-gothic text-gray-300 leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>

                <div className="mb-8">
                  <h3 className="gravesend-sans text-xl font-semibold text-white mb-4">Package Includes:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEvent.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check size={16} className="text-yellow-400" />
                        <span className="century-gothic text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ContactForm eventTitle={selectedEvent.title} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Contact Form Component
const ContactForm = ({ eventTitle = "" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event: eventTitle,
    guests: '',
    message: '',
    contactMethod: 'email'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        event: eventTitle,
        guests: '',
        message: '',
        contactMethod: 'email'
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-yellow-600/20">
      <h3 className="gravesend-sans text-2xl font-bold text-white mb-6">Book Your Experience</h3>
      
      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-400" />
          </div>
          <h4 className="gravesend-sans text-xl font-semibold text-white mb-2">Request Submitted!</h4>
          <p className="century-gothic text-gray-300">We'll contact you within 24 hours to discuss your booking.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font"
              required
            />
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              placeholder="Number of Guests"
              min="1"
              className="w-full px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font"
              required
            />
          </div>

          {!eventTitle && (
            <input
              type="text"
              name="event"
              value={formData.event}
              onChange={handleChange}
              placeholder="Event of Interest"
              className="w-full px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font"
            />
          )}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Special Requirements or Questions"
            rows="4"
            className="w-full px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font resize-none"
          ></textarea>

          <div className="mb-4">
            <p className="century-gothic text-white mb-2">Preferred Contact Method:</p>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={formData.contactMethod === 'email'}
                  onChange={handleChange}
                  className="text-yellow-400"
                />
                <span className="roboto-font text-gray-300">Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={formData.contactMethod === 'phone'}
                  onChange={handleChange}
                  className="text-yellow-400"
                />
                <span className="century-gothic text-gray-300">Phone</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-full font-semibold text-lg century-gothic transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105"
          >
            Submit Booking Request
          </button>
        </form>
      )}
    </div>
  );
};

// Contact Page
const ContactPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="gravesend-sans text-5xl md:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="century-gothic text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to experience elite sporting hospitality? Get in touch with our team to discuss your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-yellow-600/20">
              <h2 className="gravesend-sans text-3xl font-bold text-white mb-8">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Phone size={20} className="text-black" />
                  </div>
                  <div>
                    <h3 className="gravesend-sans text-xl font-semibold text-white mb-2">Phone</h3>
                    <p className="century-gothic text-gray-300">+263 70 000 0000</p>
                    <p className="century-gothic text-sm text-gray-400">Monday - Friday, 9AM - 6PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-black" />
                  </div>
                  <div>
                    <h3 className="gravesend-sans text-xl font-semibold text-white mb-2">Email</h3>
                    <p className="century-gothic text-gray-300">hello@obsidian.lifestyle</p>
                    <p className="century-gothic text-gray-300">info@obsidianlifestyle.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-black" />
                  </div>
                  <div>
                    <h3 className="gravesend-sans text-xl font-semibold text-white mb-2">Address</h3>
                    <p className="century-gothic text-gray-300">
                      1st Floor, My Building, No. 50 Street<br />
                      Some Road, Harare, Zimbabwe
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Back Feature */}
            <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-2xl p-8 border border-yellow-600/30">
              <h3 className="gravesend-sans text-2xl font-bold text-white mb-4">Prefer a Call Back?</h3>
              <p className="century-gothic text-gray-300 mb-6">
                Leave your number and our team will call you back within 2 hours during business hours.
              </p>
              <div className="flex space-x-4">
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="flex-1 px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font"
                />
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-semibold century-gothic hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300">
                  Call Me
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="gravesend-sans text-4xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I receive my tickets?",
                answer: "E-tickets and event details are sent via email usually within 72 hours before the event."
              },
              {
                question: "Are there any hidden fees?",
                answer: "No, we guarantee transparent pricing with no hidden fees. What you see is what you pay."
              },
              {
                question: "Can you accommodate large groups?",
                answer: "Yes, we ensure all seats are together even for large group bookings. No one gets left behind."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, bank transfers, and can arrange bespoke payment terms for corporate bookings."
              },
              {
                question: "Do you provide additional services?",
                answer: "Yes, we offer full concierge services including airport transfers, chauffeur service, and accommodation."
              },
              {
                question: "How far in advance should I book?",
                answer: "We recommend booking as early as possible, especially for premium events. Some packages sell out months in advance."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-yellow-600/20">
                <h3 className="gravesend-sans text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="century-gothic text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <FontLoader />
        <Header />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;