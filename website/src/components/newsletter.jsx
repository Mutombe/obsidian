import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, User, Crown, Trophy, Star, ArrowRight, Leaf, Droplets, Heart, Sparkles, Globe, Users, ChevronDown, Menu, X,Calendar } from 'lucide-react';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { SiFsecure } from "react-icons/si";
import { MdOutlineSecurity } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa6";

import { IntegratedNavigation } from './header';

const ObsidianNewsletter = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubscribed, setIsSubscribed] = useState(false);

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
    <div className="min-h-screen relative overflow-hidden">
      <IntegratedNavigation />
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/p27.jpg')`,
          }}
        />
        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="gravesend-sans text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight"
              >
                Elite Access.
                <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent font-normal">
                  Exclusive Updates.
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="century-gothic text-lg text-gray-200 leading-relaxed max-w-lg"
              >
                Stay ahead with insider access to premier sporting events, VIP hospitality packages, 
                luxury adventures, and exclusive networking opportunities. Your gateway to extraordinary experiences.
              </motion.p>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.8 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your Name"
                        className="century-gothic w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors duration-300 focus:bg-white/20"
                        required
                      />
                    </div>
                    
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email "
                        className="century-gothic w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors duration-300 focus:bg-white/20"
                        required
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="century-gothic bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-8 py-3 font-medium tracking-wider hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
                    >
                      SUBSCRIBE
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8 bg-black/50 backdrop-blur-sm border border-yellow-400/30"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={32} className="text-black" />
                  </motion.div>
                  <h3 className="gravesend-sans text-2xl font-light text-white mb-2">Welcome to Elite Access!</h3>
                  <p className="century-gothic text-gray-300">You're now part of the Obsidian Lifestyle community</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-2 gap-4 pt-6"
            >
              {[
                { icon: Trophy, text: "VIP Sporting Events" },
                { icon: Globe, text: "Global Adventures" },
                { icon: Users, text: "Elite Networking" },
                { icon: Crown, text: "Luxury Experiences" }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + (index * 0.1) }}
                  className="flex items-center gap-3 text-gray-300 bg-black/30 backdrop-blur-sm p-3 border border-white/10"
                >
                  <benefit.icon size={18} className="text-yellow-400" />
                  <span className="text-sm font-light">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Additional CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex items-center gap-4 pt-4"
            >
              <button className="century-gothic group flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
                <Calendar size={16} />
                <span>View Upcoming Events</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - Decorative Elements */}

        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
    </div>
  );
};

export default ObsidianNewsletter;