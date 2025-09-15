import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { TbBrandGoogleHome } from "react-icons/tb";
import { BsEnvelopeAt } from "react-icons/bs";
import { MdOutlineEventNote } from "react-icons/md";
import { IoIosContact } from "react-icons/io";

export const IntegratedNavigation = ({ 
  pageType = "transparent", // "transparent", "dark", or "light"
  className = ""
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Get current page from URL
  const getCurrentPage = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  };

  const isActive = (path) => getCurrentPage() === path;

  const navItems = [
    { path: "/", label: "Home", icon: TbBrandGoogleHome },
     { path: "/events", label: "Events", icon: MdOutlineEventNote },
    { path: "/newsletter", label: "Newsletter", icon: BsEnvelopeAt },
    { path: "/contact", label: "Contact", icon: IoIosContact },
  ];

  // Get navigation background based on scroll and page type
  const getNavigationBackground = () => {
    // When scrolled, always show dark gradient
    if (scrolled) {
      return "bg-gradient-to-r from-black/95 via-slate-900/95 to-black/95 backdrop-blur-xl border-b border-yellow-400/30 shadow-2xl shadow-yellow-500/10";
    }
    
    // When not scrolled, use pageType
    switch (pageType) {
      case "dark":
        return "bg-gradient-to-r from-black/90 via-slate-900/90 to-black/90 backdrop-blur-md border-b border-yellow-400/20";
      case "light":
        return "bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm";
      case "transparent":
      default:
        return "bg-transparent";
    }
  };

  // Get text colors based on current state
  const getTextColors = () => {
    const isLightBg = !scrolled && pageType === "light";
    
    if (isLightBg) {
      return {
        navText: "text-gray-800",
        navHover: "hover:text-yellow-600",
        activeText: "text-yellow-600",
        buttonBg: "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/40",
        buttonIcon: "text-yellow-600"
      };
    }
    
    // Dark or transparent background
    return {
      navText: "text-white",
      navHover: "hover:text-yellow-300",
      activeText: "text-yellow-400",
      buttonBg: "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/30",
      buttonIcon: "text-yellow-400"
    };
  };

  const textColors = getTextColors();

  console.log('Navigation state:', { pageType, scrolled, textColors }); // Debug log

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${getNavigationBackground()} ${className}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="group flex items-center space-x-3 relative">
              <div className="absolute -inset-2  bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative">
                <img
                  src="/logo4.png"
                  alt="Obsidian Lifestyle Logo"
                  className="w-40 h-13 transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map(({ path, label }) => (
                <a
                  key={path}
                  href={path}
                  className={`relative gravesend-sans font-light transition-all duration-500 group pb-1 ${
                    isActive(path)
                      ? textColors.activeText
                      : `${textColors.navText} ${textColors.navHover}`
                  }`}
                >
                  <span className="relative z-10">{label}</span>
                  {isActive(path) && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  )}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-300 group-hover:w-full"></div>
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden relative w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 ${textColors.buttonBg}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div
                className={`relative w-6 h-6 transform transition-all duration-300 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              >
                {isMenuOpen ? (
                  <MdOutlineCloseFullscreen
                    size={20}
                    className={textColors.buttonIcon}
                  />
                ) : (
                  <CiMenuFries size={20} className={textColors.buttonIcon} />
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10"></div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400/50 animate-bounce"></div>
          <div
            className="absolute top-32 right-16 w-1 h-1 bg-yellow-500/70 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-yellow-300/60 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Navigation Content */}
          <div className="relative z-10 p-8 pt-28 h-full flex flex-col justify-center overflow-y-auto">
            <nav className="space-y-8">
              {navItems.map(({ path, label, icon: IconComponent }, index) => (
                <a
                  key={path}
                  href={path}
                  className={`group flex items-center space-x-6 p-4 transition-all duration-500 transform hover:scale-105 ${
                    isActive(path)
                      ? "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40 shadow-2xl shadow-yellow-500/20"
                      : "hover:bg-yellow-400/10 hover:border hover:border-yellow-400/30"
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: isMenuOpen
                      ? "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                      : "none",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div
                    className={`text-3xl transition-all duration-300 group-hover:scale-110 ${
                      isActive(path) ? "filter drop-shadow-lg" : ""
                    }`}
                  >
                    <IconComponent
                      size={32}
                      className={
                        isActive(path) ? "text-yellow-400" : "text-yellow-300"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`gravesend-sans text-2xl font-semibold transition-all duration-300 ${
                        isActive(path)
                          ? "text-yellow-400"
                          : "text-white group-hover:text-yellow-300"
                      }`}
                    >
                      {label}
                    </div>
                    {isActive(path) && (
                      <div className="text-sm text-yellow-400/80 century-gothic">
                        Currently viewing
                      </div>
                    )}
                  </div>
                  <ArrowRight
                    className={`w-6 h-6 transition-all duration-300 group-hover:translate-x-2 ${
                      isActive(path)
                        ? "text-yellow-400"
                        : "text-gray-400 group-hover:text-yellow-400"
                    }`}
                  />
                </a>
              ))}
            </nav>

            {/* Contact Info in Mobile Menu */}
            <div className="mt-12 pt-8 border-t border-yellow-400/20">
              <div className="text-center">
                <p className="century-gothic text-yellow-400/80 text-sm mb-2">
                  Ready to book your experience?
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="century-gothic">Get in Touch</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
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
      `}</style>
    </>
  );
};