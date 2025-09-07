import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, User, Crown, Trophy, Star, ArrowRight } from 'lucide-react';

const ObsidianNewsletter = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [cardVariant, setCardVariant] = useState('light'); // light or dark

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setFormData({ name: '', email: '' });
    }, 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-700 to-slate-300 flex items-center justify-center p-4 sm:p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating golden particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl w-full pt-16 sm:pt-20 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center pt-20">
          
          {/* Light Card - Left */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/50 backdrop-blur-sm transform group-hover:scale-[1.02] transition-all duration-500">
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl">
                {/* Elegant botanical illustration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute top-4 right-4 sm:top-8 sm:right-8"
                >
                  <svg width="80" height="100" viewBox="0 0 120 140" className="text-slate-300 sm:w-[120px] sm:h-[140px]">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      d="M60 120 Q40 80 45 60 Q50 40 60 30 Q70 40 75 60 Q80 80 60 120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <motion.ellipse
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 1 }}
                      cx="45" cy="55" rx="12" ry="25"
                      fill="currentColor"
                      opacity="0.6"
                    />
                    <motion.ellipse
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                      cx="75" cy="55" rx="12" ry="25"
                      fill="currentColor"
                      opacity="0.4"
                    />
                    <motion.ellipse
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      cx="35" cy="75" rx="10" ry="20"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </svg>
                </motion.div>
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Crown size={20} className="text-yellow-500 sm:w-6 sm:h-6" />
                    <span className="gravesend-sans text-xs sm:text-sm font-semibold text-slate-600 tracking-wider uppercase">
                      Exclusive Access
                    </span>
                  </div>
                  <h2 className="gravesend-sans text-xl sm:text-2xl font-bold text-slate-800 mb-3">
                    Join the Elite Circle
                  </h2>
                  <p className="century-gothic text-sm sm:text-base text-slate-600 leading-relaxed">
                    Get exclusive access to premium sporting events and VIP hospitality packages
                  </p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {!isSubscribed ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-3 sm:space-y-4"
                    >
                      <div className="relative">
                        <User size={16} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 sm:w-[18px] sm:h-[18px]" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your name"
                          className="century-gothic w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 sm:w-[18px] sm:h-[18px]" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="century-gothic w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                          required
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="gravesend-sans w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg"
                      >
                        Subscribe
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-6 sm:py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Check size={24} className="text-white sm:w-8 sm:h-8" />
                      </motion.div>
                      <h3 className="gravesend-sans text-lg sm:text-xl font-bold text-slate-800 mb-2">Welcome Aboard!</h3>
                      <p className="century-gothic text-sm sm:text-base text-slate-600">You're now part of the exclusive Obsidian circle</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="century-gothic mt-4 sm:mt-6 text-center"
                >
                  <p className="text-xs text-slate-500">
                    Priority access to elite sporting events
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Dark Card - Right */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-yellow-400/20 backdrop-blur-sm transform group-hover:scale-[1.02] transition-all duration-500 overflow-hidden">
              
              {/* Decorative Background */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-40 sm:h-40 border border-yellow-400/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-8 -left-8 sm:-bottom-10 sm:-left-10 w-24 h-24 sm:w-32 sm:h-32 border border-yellow-400/5 rounded-full"
                />
                
                {/* Premium botanical elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute top-4 right-4 sm:top-8 sm:right-8"
                >
                  <svg width="70" height="85" viewBox="0 0 100 120" className="text-yellow-400/20 sm:w-[100px] sm:h-[120px]">
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2.5, delay: 0.7 }}
                      d="M50 100 Q30 60 35 40 Q40 20 50 10 Q60 20 65 40 Q70 60 50 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <motion.ellipse
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1, delay: 1.5 }}
                      cx="35" cy="45" rx="8" ry="18"
                      fill="currentColor"
                    />
                    <motion.ellipse
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1, delay: 1.7 }}
                      cx="65" cy="45" rx="8" ry="18"
                      fill="currentColor"
                    />
                  </svg>
                </motion.div>
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6 sm:mb-8"
                >
                  <h2 className="gravesend-sans text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                    Stay Tuned
                  </h2>
                  <p className="century-gothic text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
                    Get insider access to premium sporting hospitality packages and exclusive events
                  </p>
                  
                  {/* Premium features */}
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {[
                      { icon: Trophy, text: "VIP Event Access" },
                      { icon: Star, text: "Priority Booking" },
                      { icon: Crown, text: "Exclusive Offers" }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (index * 0.1) }}
                        className="flex items-center gap-3"
                      >
                        <feature.icon size={14} className="text-yellow-400 sm:w-4 sm:h-4" />
                        <span className="text-gray-300 text-xs sm:text-sm">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 234, 156, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.querySelector('input[type="text"]')?.focus()}
                  className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span className='gravesend-sans'>Join Elite Circle</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" />
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="century-gothic mt-4 sm:mt-6 text-center"
                >
                  <p className="text-xs text-gray-500">
                    Premium sporting experiences await
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 sm:mt-12 px-4"
        >
          <p className="century-gothic text-slate-600 text-base sm:text-lg mb-2">
            Your front-row seat to unforgettable moments starts here
          </p>
          <p className="century-gothic text-yellow-400 font-semibold text-sm sm:text-base">
            Elevate your sporting experience with Obsidian Lifestyle
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Newsletter Page
const NewsletterPage = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail("");
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
            Join the Obsidian Lifestyle insider list and gain priority access to
            official VIP packages for Premier League football, Formula 1, golf,
            rugby, and more.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-yellow-600/20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="century-gothic text-white">
                Exclusive event alerts
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="century-gothic text-white">
                Private hospitality offers
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="text-yellow-400" size={20} />
              <span className="century-gothic text-white">
                Tailored experiences
              </span>
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
              <p className="text-green-400 century-gothic">
                Successfully subscribed! Welcome to Obsidian Lifestyle.
              </p>
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

export default ObsidianNewsletter;