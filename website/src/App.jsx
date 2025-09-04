import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Mail, Phone, MapPin, Calendar, Users, Shield, Star, ArrowRight, Menu, X, Check } from 'lucide-react';

// Custom font loading component
const FontLoader = () => {
  useEffect(() => {
    // Load custom fonts and fallback fonts
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
        
        /* Font utility classes */
        .gravesend-sans {
          font-family: 'Gravesend Sans', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .roboto-font {
          font-family: 'Roboto', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
      </style>
    `);
  }, []);

  return null;
};

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full bg-black/90 backdrop-blur-lg z-50 border-b border-yellow-600/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
              <img src="/logo4.png" alt="Obsidian Lifestyle Logo" className="w-40 h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`roboto-font transition-all duration-300 ${
                isActive('/') 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-white hover:text-yellow-300'
              } pb-1`}
            >
              Home
            </Link>
            <Link 
              to="/newsletter" 
              className={`roboto-font transition-all duration-300 ${
                isActive('/newsletter') 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-white hover:text-yellow-300'
              } pb-1`}
            >
              Newsletter
            </Link>
            <Link 
              to="/events" 
              className={`roboto-font transition-all duration-300 ${
                isActive('/events') 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-white hover:text-yellow-300'
              } pb-1`}
            >
              Upcoming Events
            </Link>
            <Link 
              to="/contact" 
              className={`roboto-font transition-all duration-300 ${
                isActive('/contact') 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-white hover:text-yellow-300'
              } pb-1`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-yellow-600/20">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-yellow-300 roboto-font" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/newsletter" className="text-white hover:text-yellow-300 roboto-font" onClick={() => setIsMenuOpen(false)}>Newsletter</Link>
              <Link to="/events" className="text-white hover:text-yellow-300 roboto-font" onClick={() => setIsMenuOpen(false)}>Upcoming Events</Link>
              <Link to="/contact" className="text-white hover:text-yellow-300 roboto-font" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
                </div>
              </div>
              <span className="gravesend-sans text-xl font-bold">Obsidian Lifestyle</span>
            </div>
            <p className="roboto-font text-gray-300 leading-relaxed">
              Elite Access. Unforgettable Experiences. Your gateway to premier sporting entertainment.
            </p>
          </div>
          
          <div>
            <h3 className="gravesend-sans text-lg font-semibold mb-4 text-yellow-400">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-yellow-400" />
                <span className="roboto-font text-gray-300">+263 70 000 0000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-yellow-400" />
                <span className="roboto-font text-gray-300">hello@obsidian.lifestyle</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-yellow-400" />
                <span className="roboto-font text-gray-300">1st Floor, My Building, No. 50 Street<br />Some Road, Harare, Zimbabwe</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="gravesend-sans text-lg font-semibold mb-4 text-yellow-400">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="roboto-font text-gray-300 hover:text-yellow-300 transition-colors block">Home</Link>
              <Link to="/newsletter" className="roboto-font text-gray-300 hover:text-yellow-300 transition-colors block">Newsletter</Link>
              <Link to="/events" className="roboto-font text-gray-300 hover:text-yellow-300 transition-colors block">Upcoming Events</Link>
              <Link to="/contact" className="roboto-font text-gray-300 hover:text-yellow-300 transition-colors block">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="roboto-font text-gray-400">
            © 2025 Obsidian Lifestyle, a product of Bard Santner Markets. All rights reserved.
          </p>
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
      icon: Shield,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises. What you see is what you pay."
    },
    {
      icon: Users,
      title: "Group Bookings",
      description: "All seats together, even for large group bookings. No one gets left behind."
    },
    {
      icon: Star,
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
          <p className="roboto-font text-xl text-gray-300 max-w-3xl mx-auto">
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
              <p className="roboto-font text-gray-300 leading-relaxed">{feature.description}</p>
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
      <Hero />
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
                <p className="roboto-font text-gray-300 text-sm leading-relaxed">{offering.description}</p>
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
            <p className="roboto-font text-xl text-gray-300">
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
                <p className="roboto-font text-gray-300 leading-relaxed">{step.description}</p>
                
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
          <p className="roboto-font text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Join the Obsidian Lifestyle insider list and gain priority access to official VIP packages for 
            Premier League football, Formula 1, golf, rugby, and more.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-yellow-600/20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="roboto-font text-white">Exclusive event alerts</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="roboto-font text-white">Private hospitality offers</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="roboto-font text-white">Tailored experiences</span>
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
              <p className="text-green-400 roboto-font">Successfully subscribed! Welcome to Obsidian Lifestyle.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="roboto-font text-lg text-gray-300 mb-4">
            Your front-row seat to unforgettable moments starts here.
          </p>
          <p className="roboto-font text-yellow-400 font-semibold">
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
          <p className="roboto-font text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our exclusive collection of premium sporting events with VIP hospitality packages.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full roboto-font font-medium transition-all duration-300 ${
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
                    <span className="roboto-font text-gray-300 text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-yellow-400" />
                    <span className="roboto-font text-gray-300 text-sm">{event.venue}</span>
                  </div>
                </div>
                
                <p className="roboto-font text-gray-300 text-sm leading-relaxed mb-4">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {event.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check size={14} className="text-yellow-400" />
                      <span className="roboto-font text-gray-300 text-xs">{feature}</span>
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
                    <span className="roboto-font text-white">{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-yellow-400" />
                    <span className="roboto-font text-white">{selectedEvent.venue}</span>
                  </div>
                </div>

                <p className="roboto-font text-gray-300 leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>

                <div className="mb-8">
                  <h3 className="gravesend-sans text-xl font-semibold text-white mb-4">Package Includes:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEvent.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check size={16} className="text-yellow-400" />
                        <span className="roboto-font text-gray-300">{feature}</span>
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
          <p className="roboto-font text-gray-300">We'll contact you within 24 hours to discuss your booking.</p>
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
            <p className="roboto-font text-white mb-2">Preferred Contact Method:</p>
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
                <span className="roboto-font text-gray-300">Phone</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-full font-semibold text-lg roboto-font transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105"
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
          <p className="roboto-font text-xl text-gray-300 max-w-3xl mx-auto">
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
                    <p className="roboto-font text-gray-300">+263 70 000 0000</p>
                    <p className="roboto-font text-sm text-gray-400">Monday - Friday, 9AM - 6PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-black" />
                  </div>
                  <div>
                    <h3 className="gravesend-sans text-xl font-semibold text-white mb-2">Email</h3>
                    <p className="roboto-font text-gray-300">hello@obsidian.lifestyle</p>
                    <p className="roboto-font text-gray-300">info@obsidianlifestyle.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-black" />
                  </div>
                  <div>
                    <h3 className="gravesend-sans text-xl font-semibold text-white mb-2">Address</h3>
                    <p className="roboto-font text-gray-300">
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
              <p className="roboto-font text-gray-300 mb-6">
                Leave your number and our team will call you back within 2 hours during business hours.
              </p>
              <div className="flex space-x-4">
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="flex-1 px-4 py-3 bg-black/50 border border-yellow-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors roboto-font"
                />
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg font-semibold roboto-font hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300">
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
                <p className="roboto-font text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
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