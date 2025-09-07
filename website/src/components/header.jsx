import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  ArrowRight,
} from "lucide-react";
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { TbBrandGoogleHome } from "react-icons/tb";
import { BsEnvelopeAt } from "react-icons/bs";
import { MdOutlineEventNote } from "react-icons/md";
import { IoIosContact } from "react-icons/io";

// Enhanced Header Component with Fixed Mobile Navigation
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: TbBrandGoogleHome },
    { path: "/newsletter", label: "Newsletter", icon: BsEnvelopeAt },
    { path: "/events", label: "Events", icon: MdOutlineEventNote },
    { path: "/contact", label: "Contact", icon: IoIosContact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-yellow-400/30 shadow-2xl shadow-yellow-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <Link to="/" className="group flex items-center space-x-3 relative">
              <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative">
                <img
                  src="/logo4.png"
                  alt="Obsidian Lifestyle Logo"
                  className="w-40 h-13 transition-all duration-300 group-hover:scale-105"
                />
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
                      ? "text-yellow-400"
                      : "text-white hover:text-yellow-300"
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
              <div
                className={`relative w-6 h-6 transform transition-all duration-300 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              >
                {isMenuOpen ? (
                  <MdOutlineCloseFullscreen
                    size={20}
                    className="text-yellow-400"
                  />
                ) : (
                  <CiMenuFries size={20} className="text-yellow-400" />
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Separate Mobile Navigation Overlay - Fixed positioning */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10"></div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400/50 rounded-full animate-bounce"></div>
          <div
            className="absolute top-32 right-16 w-1 h-1 bg-yellow-500/70 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-yellow-300/60 rounded-full animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Navigation Content - Adjusted for full screen coverage */}
          <div className="relative z-10 p-8 pt-28 h-full flex flex-col justify-center overflow-y-auto">
            <nav className="space-y-8">
              {navItems.map(({ path, label, icon: IconComponent }, index) => (
                <Link
                  key={path}
                  to={path}
                  className={`group flex items-center space-x-6 p-4 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
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
                      <div className="text-sm text-yellow-400/80 roboto-font">
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
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Add required CSS for animations */}
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


export default Header;