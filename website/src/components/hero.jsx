import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, Calendar, Star, Trophy, Crown } from 'lucide-react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { GrGroup } from 'react-icons/gr';
import { IoStarOutline } from 'react-icons/io5';

export const IntegratedNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/newsletter", label: "Newsletter" },
    { path: "/events", label: "Events" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 absolute w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-transparent" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl px-8 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Aligned with hero content */}
          <div className="flex items-center space-x-3 lg:pl-8">
            <img src="/logo4.png" alt="Logo" className="w-40 h-13" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label }) => (
              <a
                key={path}
                href={path}
                className="gravesend-sans text-white hover:text-yellow-400 transition-colors duration-300 font-light text-sm tracking-wide"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-yellow-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};


const ObsidianHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <IntegratedNavigation />
      {/* Overall Background Image */}
      <div className="absolute inset-0">
        <img
          src="/p27.jpg"
          alt="Luxury Background"
          className="absolute inset-0 object-cover w-full h-full"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Split Background Overlays */}
      <div className="absolute inset-0 flex">
        {/* Left Half - Black & Gold Overlay */}
        <div className="w-1/2 relative">
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Gold accent elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-none rotate-45 blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-tl from-yellow-500 to-yellow-700 rounded-none rotate-12 blur-lg"></div>
          </div>
        </div>
        
        {/* Right Half - Light Overlay */}
        <div className="w-1/2 relative">
          <div className="absolute inset-0 bg-white/20"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/10 via-transparent to-yellow-600/20"></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Black/Gold Side Content */}
          <div className="text-left space-y-6 sm:space-y-8 relative">
            
            {/* Main Headline */}
            <h1 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
              Elite Access.
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Unforgettable 
                <br />Experiences.
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="century-gothic text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl font-light">
              Obsidian Lifestyle is your gateway to the world of premier sporting entertainment. 
              We specialise in providing official VIP hospitality packages across elite sports.
            </p>
            
            {/* Action Buttons */}
            <div className="gravesend-sans flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button className="gravesend-sans group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 sm:px-8 py-3 sm:py-4 font-light text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105">
                <span>Explore Packages</span>
                <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="gravesend-sans group border-2 border-yellow-400 text-yellow-400 px-6 sm:px-8 py-3 sm:py-4 font-light text-sm sm:text-base lg:text-lg transition-all duration-300 hover:bg-yellow-400/10 flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                <Calendar size={16} className="sm:w-5 sm:h-5" />
                <span>View Events</span>
              </button>
            </div>
            
            {/* Premium Features */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm text-gray-200">
              {['No Hidden Fees', 'Group Bookings', 'Personalized Service'].map((feature, index) => (
                <div key={feature} className="flex items-center space-x-2">
                  <IoStarOutline size={16} className="text-yellow-400" />
                  <span className='century-gothic'>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - White/Gold Side Content */}
          <div className="text-left space-y-6 sm:space-y-8 relative">

          </div>

        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
    </section>
  );
};

export const ObsidianHero2 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Split Background - Absolutely positioned */}
      <div className="absolute inset-0 flex">
        {/* Left Half - Deep Black with Gold */}
        <div className="w-1/2 bg-black relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div 
            className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-gradient-radial from-yellow-400/15 via-yellow-500/5 to-transparent rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px)`,
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          />
          <div 
            className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-gradient-radial from-yellow-600/10 to-transparent rounded-full blur-2xl"
            style={{
              transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`,
              transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          />
          
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        {/* Right Half - Premium White */}
        <div className="w-1/2 bg-white relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-yellow-50/20" />
          
          {/* Glass morphism shapes */}
          <div 
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-white/40 backdrop-blur-3xl rounded-3xl rotate-12 border border-gray-200/20"
            style={{
              transform: `rotate(12deg) translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
              transition: 'transform 0.6s ease-out'
            }}
          />
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-yellow-100/20 to-white/30 backdrop-blur-2xl rounded-2xl -rotate-6 border border-yellow-200/20" />
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>

      {/* Split Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="flex h-24">
          {/* Left Nav - on black side */}
          <div className="w-1/2 flex items-center px-8 lg:px-12">
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors duration-300 text-sm tracking-wide uppercase">Home</a>
              <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors duration-300 text-sm tracking-wide uppercase">Events</a>
              <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors duration-300 text-sm tracking-wide uppercase">About</a>
            </nav>
          </div>
          
          {/* Right Nav - on white side */}
          <div className="w-1/2 flex items-center justify-end px-8 lg:px-12">
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-yellow-600 transition-colors duration-300 text-sm tracking-wide uppercase">Tours</a>
              <a href="#" className="text-gray-600 hover:text-yellow-600 transition-colors duration-300 text-sm tracking-wide uppercase">Contact</a>
              <button className="text-gray-600 hover:text-yellow-600 transition-colors duration-300">
                <Menu size={24} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Center Content - Overlapping both sides */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-6 max-w-6xl mx-auto">
          {/* Small label */}
          <div 
            className={`flex items-center justify-center space-x-4 mb-8 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-400" />
            <p className="text-yellow-400 text-xs tracking-[0.4em] uppercase font-light">
              Obsidian Lifestyle
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-400" />
          </div>
          
          {/* Main Hero Text - Split color */}
          <h1 
            className={`relative transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Using absolute positioning for split effect */}
            <div className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-thin leading-[0.85] tracking-tighter">
              {/* Left side text - white */}
              <div className="absolute inset-0 flex justify-center">
                <div className="w-1/2 overflow-hidden">
                  <div className="text-white text-left pl-[50%]">
                    <div>ELITE</div>
                    <div>ACCESS</div>
                  </div>
                </div>
              </div>
              
              {/* Right side text - black */}
              <div className="absolute inset-0 flex justify-center">
                <div className="w-1/2 overflow-hidden translate-x-full">
                  <div className="text-black text-right pr-[50%]">
                    <div>ELITE</div>
                    <div>ACCESS</div>
                  </div>
                </div>
              </div>
              
              {/* Invisible text for spacing */}
              <div className="invisible">
                <div>ELITE</div>
                <div>ACCESS</div>
              </div>
            </div>
            
            {/* Subtitle with gradient */}
            <div className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                UNFORGETTABLE
              </span>
            </div>
          </h1>
          
          {/* Description */}
          <p 
            className={`mt-8 text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Your gateway to the world of premier sporting entertainment. 
            We specialise in providing official VIP hospitality packages across elite sports.
          </p>
          
          {/* CTA Buttons - Split style */}
          <div 
            className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Black button for left side */}
            <button className="group relative px-10 py-5 bg-white text-black border border-white overflow-hidden transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative flex items-center space-x-3 font-light tracking-wider uppercase text-sm">
                <span>Explore Packages</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
            
            {/* White button for right side */}
            <button className="group relative px-10 py-5 bg-black text-white border border-black overflow-hidden transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative flex items-center space-x-3 font-light tracking-wider uppercase text-sm group-hover:text-black transition-colors duration-500">
                <Calendar size={18} />
                <span>View Events</span>
              </span>
            </button>
          </div>
          
          {/* Feature badges */}
          <div 
            className={`mt-16 flex items-center justify-center space-x-12 transition-all duration-1000 delay-800 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-wider text-gray-500">Premium Access</p>
            </div>
            <div className="text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-wider text-gray-500">VIP Experience</p>
            </div>
            <div className="text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-wider text-gray-500">Elite Members</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logo in center of split */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-12 h-12 bg-black border border-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-yellow-400 font-bold text-lg">O</span>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <ChevronDown className="text-yellow-400/50" size={32} />
      </div>
      
      {/* Center dividing line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent z-10" />
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: VscWorkspaceTrusted,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises. What you see is what you pay.",
    },
    {
      icon: GrGroup,
      title: "Group Bookings",
      description: "All seats together, even for large group bookings. No one gets left behind.",
    },
    {
      icon: IoStarOutline,
      title: "Personalized Service",
      description: "Dedicated customer service tailored to your specific needs and preferences.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            The Obsidian Lifestyle Experience
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            We guarantee premium experiences with uncompromising quality and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 sm:p-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:shadow-2xl group-hover:shadow-yellow-500/30 transition-all duration-300">
                <feature.icon size={24} className="text-black sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObsidianHero;