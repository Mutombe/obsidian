import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Check, X, Star, Trophy, Crown, Users } from 'lucide-react';
import { IntegratedNavigation } from './header';

const ObsidianEventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const events = [
    {
      id: 1,
      title: "Premier League: Manchester United vs Liverpool",
      date: "15",
      month: "MAR",
      year: "2025",
      venue: "Old Trafford",
      price: "From £850",
      category: "Soccer",
      description: "Experience the greatest rivalry in English Soccer with premium hospitality at Old Trafford.",
      features: ["VIP Seating", "Gourmet Dining", "Meet & Greet", "Exclusive Lounge Access"],
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
      gradient: "from-red-500/20 to-blue-500/20"
    },
    {
      id: 2,
      title: "Formula 1: Monaco Grand Prix",
      date: "25",
      month: "MAY",
      year: "2025",
      venue: "Circuit de Monaco",
      price: "From £2,500",
      category: "Formula 1",
      description: "The jewel in the F1 calendar with unparalleled luxury and glamour.",
      features: ["Paddock Access", "Yacht Hospitality", "Champagne Reception", "Grid Walk"],
      image: "/home3.jpg",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      id: 3,
      title: "Rugby World Cup Final",
      date: "28",
      month: "OCT",
      year: "2025",
      venue: "Stade de France",
      price: "From £1,200",
      category: "Rugby",
      description: "Witness rugby history at the most prestigious tournament final.",
      features: ["Premium Seats", "Fine Dining", "Former Player Meet", "Trophy Viewing"],
      image: "/home.jpg",
      gradient: "from-green-500/20 to-blue-500/20"
    },
    {
      id: 4,
      title: "The Masters Tournament",
      date: "10",
      month: "APR",
      year: "2025",
      venue: "Augusta National",
      price: "From £3,000",
      category: "Golf",
      description: "Golf's most coveted tournament with exclusive clubhouse access.",
      features: ["Course Access", "Augusta Dining", "Pro-Am Viewing", "Gift Shop Access"],
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    {
      id: 5,
      title: "FA Cup Final",
      date: "17",
      month: "MAY",
      year: "2025",
      venue: "Wembley Stadium",
      price: "From £650",
      category: "Soccer",
      description: "English football's oldest competition at the home of Soccer.",
      features: ["Wembley Suite", "Three-Course Meal", "Bar Package", "Stadium Tour"],
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: 6,
      title: "Wimbledon Championships",
      date: "06",
      month: "JUL",
      year: "2025",
      venue: "All England Club",
      price: "From £950",
      category: "Tennis",
      description: "The most prestigious tennis tournament with traditional hospitality.",
      features: ["Centre Court", "Strawberries & Cream", "Pimm's Reception", "Player Practice"],
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
      gradient: "from-green-500/20 to-yellow-500/20"
    }
  ];

  const categories = ["All", "Soccer", "Formula 1", "Rugby", "Golf", "Tennis"];

  const filteredEvents = activeCategory === "All" 
    ? events 
    : events.filter((event) => event.category === activeCategory);

  return (
    <div className="min-h-screen">
      <IntegratedNavigation pageType="dark" />
      
      {/* Hero Section with Creative Typography - Keep Dark */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-16 lg:pt-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="relative">
            {/* Large Background Text */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 0.03, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <h1 className="gravesend-sans text-[8rem] sm:text-[12rem] lg:text-[20rem] text-white leading-none select-none font-bold">
                Events
              </h1>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="gravesend-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Elite
                  <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    {" "}Events
                  </span>
                </h1>
                <p className="century-gothic text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                  Discover our exclusive collection of premium sporting events with VIP hospitality packages
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Category Filter - Keep Dark */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`gravesend-sans px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-400/25"
                    : "bg-gray-800/50 text-white hover:bg-gray-700/50 border border-yellow-600/20 hover:border-yellow-400/40"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* White-themed Events Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Events Grid - White Theme */}
          <div className="space-y-8 sm:space-y-12 py-8 sm:py-16 lg:py-20">
            {filteredEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index} 
                onSelect={setSelectedEvent}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const EventCard = ({ event, index, onSelect }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`min-h-[40vh] lg:min-h-[60vh] flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}
    >
      {/* Image Section */}
      <motion.div 
        className={`relative group overflow-hidden h-64 sm:h-80 lg:h-96 w-full ${isEven ? '' : 'lg:col-start-2'}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} z-10`} />
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Floating Date */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/95 backdrop-blur-sm p-3 sm:p-4 text-center z-20 shadow-lg"
        >
          <div className="gravesend-sans text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{event.date}</div>
          <div className="gravesend-sans text-xs sm:text-sm text-gray-600">{event.month}</div>
          <div className="gravesend-sans text-xs text-gray-500">{event.year}</div>
        </motion.div>

        {/* Category Badge */}
        <div className="gravesend-sans absolute bottom-4 sm:bottom-6 left-4 sm:left-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/95 backdrop-blur-sm text-yellow-600 text-xs sm:text-sm font-semibold z-20 border border-yellow-400/30 shadow-lg">
          {event.category}
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
      </motion.div>

      {/* Content Section - White Theme */}
      <div className={`space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-0 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" />
            <span className="gravesend-sans text-yellow-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
              Premium Event
            </span>
          </div>

          <h2 className="gravesend-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4 leading-tight">
            {event.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-yellow-600 flex-shrink-0" />
              <span className="gravesend-sans text-gray-700 text-sm sm:text-base">{event.venue}</span>
            </div>
          </div>

          <p className="century-gothic text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
            {event.description}
          </p>

          {/* Features Grid - White Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {event.features.slice(0, 4).map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 border border-gray-200 hover:border-yellow-300 transition-colors"
              >
                <Check size={14} className="text-yellow-600 flex-shrink-0" />
                <span className="gravesend-sans text-gray-700 text-xs sm:text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(event)}
            className="century-gothic group bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/30 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center"
          >
            <span>Reserve Your Experience</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EventModal = ({ event, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 transition-colors z-10 shadow-lg"
          >
            <X size={16} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>

          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
            <span className="gravesend-sans px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-yellow-400 text-xs sm:text-sm font-semibold border border-yellow-400/30 rounded">
              {event.category}
            </span>
            <h2 className="gravesend-sans text-xl sm:text-2xl lg:text-3xl font-bold mt-2 sm:mt-3 mb-1">{event.title}</h2>
          </div>
        </div>

        {/* Modal Content - White Theme */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="gravesend-sans text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Event Details</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar size={18} className="text-yellow-600 flex-shrink-0" />
                  <span className="gravesend-sans text-gray-700 text-sm sm:text-base">{event.date} {event.month} {event.year}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin size={18} className="text-yellow-600 flex-shrink-0" />
                  <span className="gravesend-sans text-gray-700 text-sm sm:text-base">{event.venue}</span>
                </div>
              </div>
              
              <p className="century-gothic text-gray-600 leading-relaxed mt-4 sm:mt-6 text-sm sm:text-base">
                {event.description}
              </p>
            </div>

            <div>
              <h3 className="gravesend-sans text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Package Includes</h3>
              <div className="grid gap-2 sm:gap-3">
                {event.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 border border-gray-200"
                  >
                    <Check size={14} className="text-yellow-600 flex-shrink-0" />
                    <span className="gravesend-sans text-gray-700 text-sm sm:text-base">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section - White Theme */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <h3 className="gravesend-sans text-xl sm:text-2xl font-bold text-black">Ready to Experience Excellence?</h3>
                <p className="century-gothic text-gray-600 text-sm sm:text-base">Secure your VIP package today</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="century-gothic px-6 sm:px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors text-sm sm:text-base"
                >
                  More Info
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="century-gothic px-6 sm:px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Book Now <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ObsidianEventsPage;