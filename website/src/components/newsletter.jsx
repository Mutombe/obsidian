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
import axios from "axios";


const ObsidianNewsletter = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:8000"
        }/api/newsletter/subscribe/`,
        formData
      );

      setIsSubscribed(true);

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setFormData({ name: "", email: "" });
      }, 5000);
    } catch (err) {
      console.error("Subscription error:", err);
      setError(
        err.response?.data?.email?.[0] ||
          err.response?.data?.error ||
          "Failed to subscribe. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <IntegratedNavigation pageType="dark" />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url('https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/bg1.jpg')`,
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
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      <span className="text-sm">{error}</span>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your Name"
                      className="century-gothic w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      required
                      disabled={isSubmitting}
                    />

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                      className="century-gothic w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      required
                      disabled={isSubmitting}
                    />

                    <motion.button
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      type="submit"
                      disabled={isSubmitting}
                      className="century-gothic bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-8 py-3 font-medium tracking-wider hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          SUBSCRIBING...
                        </>
                      ) : (
                        "SUBSCRIBE"
                      )}
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
                  <h3 className="gravesend-sans text-2xl font-light text-white mb-2">
                    Welcome to Elite Access!
                  </h3>
                  <p className="century-gothic text-gray-300 px-4">
                    Check your email for a welcome message with exclusive
                    content!
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
                  <benefit.icon
                    size={16}
                    className="text-yellow-400 sm:w-5 sm:h-5 flex-shrink-0"
                  />
                  <span className="century-gothic text-xs sm:text-sm font-light">
                    {benefit.text}
                  </span>
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
