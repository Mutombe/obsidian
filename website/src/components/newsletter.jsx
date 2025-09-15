import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Mail,
  User,
  Crown,
  Trophy,
  Star,
  ArrowRight,
  Leaf,
  Droplets,
  Heart,
  Sparkles,
  Globe,
  Users,
  ChevronDown,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { SiFsecure } from "react-icons/si";
import { MdOutlineSecurity } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IntegratedNavigation } from "./header";

const ObsidianNewsletter = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setFormData({ name: "", email: "" });
    }, 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <IntegratedNavigation pageType="dark" />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/news.jpg')`,
          }}
        />
        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-screen">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 pt-20 sm:pt-0"
          >
            <div className="space-y-4 sm:space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="gravesend-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight"
              >
                Experience  
                <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent font-normal">
                  Elite Sporting Hospitality
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="century-gothic text-base sm:text-lg text-gray-200 leading-relaxed max-w-lg"
              >
                Join the Obsidian Lifestyle insider list and gain priority
                access to official VIP packages for Premier League football,
                Formula 1, golf, rugby, and more.
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
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter your Name"
                        className="century-gothic w-full px-3 sm:px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors duration-300 focus:bg-white/20 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email"
                        className="century-gothic w-full px-3 sm:px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors duration-300 focus:bg-white/20 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="century-gothic bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 sm:px-8 py-3 font-medium tracking-wider hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 text-sm sm:text-base"
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
                  className="text-center py-6 sm:py-8 bg-black/50 backdrop-blur-sm border border-yellow-400/30"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  >
                    <Check size={24} className="text-black sm:w-8 sm:h-8" />
                  </motion.div>
                  <h3 className="gravesend-sans text-xl sm:text-2xl font-light text-white mb-2">
                    Welcome to Elite Access!
                  </h3>
                  <p className="century-gothic text-gray-300 text-sm sm:text-base px-4">
                    You're now part of the Obsidian Lifestyle community
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6"
            >
              {[
                { icon: Trophy, text: "Exclusive event alerts" },
                { icon: Globe, text: "Private hospitality offers" },
                { icon: Users, text: "Tailored experiences curated for you" },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="flex items-center gap-3 text-gray-300 bg-black/30 backdrop-blur-sm p-3 sm:p-3 border border-white/10"
                >
                  <benefit.icon size={16} className="text-yellow-400 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="century-gothic text-xs sm:text-sm font-light">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Additional CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4"
            >
              <button 
                className="century-gothic group flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm"
                onClick={() => navigate("/events")}
              >
                <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span>View Upcoming Events</span>
                <ArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4"
                />
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - Decorative Elements - Hidden on mobile */}
          <div className="hidden lg:block">
            {/* Add any decorative content here if needed */}
          </div>
        </div>
      </div>

      {/* Bottom accent 
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>*/}
    </div>
  );
};

export default ObsidianNewsletter;