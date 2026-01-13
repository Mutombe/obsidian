import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Shield,
  Star,
  ArrowRight,
  Menu,
  X,
  Check,
  Globe,
  Award,
  FileText,
} from "lucide-react";


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
      <div className="absolute top-8 left-8 w-3 h-3 bg-yellow-400/40 floating-element"></div>
      <div
        className="absolute top-16 right-12 w-2 h-2 bg-yellow-500/50 floating-element"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-12 left-1/4 w-2.5 h-2.5 bg-yellow-300/30 floating-element"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-1">
            <div className="group flex items-center space-x-4 mb-6">
              <div>
                <img
                  src="/logo4.png"
                  alt="Obsidian Lifestyle Logo"
                  className="w-36 h-12 transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <p className="century-gothic text-gray-300 leading-relaxed text-lg mb-6">
              Elite Access. Unforgettable Experiences. Your gateway to the
              world's most prestigious sporting events with unmatched luxury and
              sophistication.
            </p>

            {/* Live Status Indicator */}
          </div>

          {/* Enhanced Contact Information */}
          <div className="space-y-6">
            <h3 className="gravesend-sans text-xl font-semibold mb-6 text-yellow-400 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Get In Touch
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  text: "+263 861 2000 700",
                  label: "24/7 Concierge",
                },
                {
                  icon: Mail,
                  text: "info@obsidianlifestyle.com",
                  label: "Premium Support",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="group flex items-center space-x-3 p-3 hover:bg-yellow-400/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <contact.icon size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="century-gothic text-white group-hover:text-yellow-300 transition-colors">
                      {contact.text}
                    </div>
                    <div className="century-gothic text-xs text-gray-400">
                      {contact.label}
                    </div>
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
                {
                  to: "/",
                  label: "Elite Experiences",
                  desc: "Premium packages",
                },
                {
                  to: "/newsletter",
                  label: "VIP Newsletter",
                  desc: "Insider access",
                },
                {
                  to: "/events",
                  label: "Upcoming Events",
                  desc: "Latest offerings",
                },
                {
                  to: "/contact",
                  label: "Personal Concierge",
                  desc: "Bespoke service",
                },
                {
                  to: "/admin/login",
                  label: "Admin Portal",
                  desc: "Manage services",
                },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="group flex items-center justify-between p-3 hover:bg-yellow-400/5 transition-all duration-300"
                >
                  <div>
                    <div className="century-gothic text-gray-300 group-hover:text-yellow-300 transition-colors font-medium">
                      {link.label}
                    </div>
                    <div className="century-gothic text-xs text-gray-500">
                      {link.desc}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Legal & Compliance Section */}
          <div className="space-y-6">
            <h3 className="gravesend-sans text-xl font-semibold mb-6 text-yellow-400 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Legal & Privacy
            </h3>
            <div className="space-y-3">
              {[
                {
                  to: "/privacy-policy",
                  label: "Privacy Policy",
                  desc: "Data protection",
                },
                {
                  to: "/cookie-policy",
                  label: "Cookie Policy",
                  desc: "Cookie usage",
                },
                {
                  to: "/terms-conditions",
                  label: "Terms & Conditions",
                  desc: "Service terms",
                },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="group flex items-center justify-between p-3 hover:bg-yellow-400/5 transition-all duration-300"
                >
                  <div>
                    <div className="century-gothic text-gray-300 group-hover:text-yellow-300 transition-colors font-medium">
                      {link.label}
                    </div>
                    <div className="century-gothic text-xs text-gray-500">
                      {link.desc}
                    </div>
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
                &copy; {new Date().getFullYear()} Obsidian Lifestyle, a product of Bard Santner Markets.
                All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;