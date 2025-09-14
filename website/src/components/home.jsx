import React, { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Star,
  Trophy,
  Crown,
  Users,
  X,
  Menu,
} from "lucide-react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GrGroup } from "react-icons/gr";
import { IoStarOutline } from "react-icons/io5";
import { FiShield } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { SiFsecure } from "react-icons/si";
import { MdOutlineSecurity } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa6";

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
  return (
    <section
      className="relative min-h-screen flex overflow-hidden"
      style={{ overflow: "hidden", marginTop: "0", paddingTop: "0" }}
    >
      {/* Integrated Navigation */}
      <IntegratedNavigation />

      {/* Split Background */}
      <div
        className="absolute inset-0 flex"
        style={{
          backgroundImage: `url('/pic2.jpg')`,
          overflow: "hidden",
          marginTop: "0",
          paddingTop: "0",
        }}
      >
        {/* Left Half - Black & Gold */}
        <div className="w-1/2 bg-black relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rotate-45 blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-tl from-yellow-500 to-yellow-700 rotate-12 blur-lg"></div>
          </div>
        </div>

        {/* Right Half - White & Gold with Image */}
        <div
          className="w-1/2 relative bg-cover bg-center"
          style={{
            backgroundImage: `url('/pp1.jpg')`,
          }}
        >
          <div className="absolute inset-0"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/10 via-transparent to-yellow-600/20"></div>
        </div>
      </div>

      {/* Hero Content - Left Side for Desktop, Centered for Mobile */}
      <div className="relative z-10 w-full flex items-center min-h-screen">
        {/* Desktop: Content on Left Half - Aligned with logo */}
        <div className="hidden lg:block w-1/2">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="lg:pl-8">
              <div className="max-w-2xl">
                {/* Main Hero Text - Large and Left Aligned */}
                <h1 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                  Elite Access.
                  <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Unforgettable
                    <br />
                    Experiences.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="century-gothic text-xl text-gray-300 mb-12 leading-relaxed">
                  Your gateway to premier sporting entertainment and
                  unforgettable VIP hospitality experiences
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 mb-16">
                  <button className="gravesend-sans group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-10 py-5 text-lg font-light transition-all duration-300 flex items-center space-x-3 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105">
                    <span>Explore Packages</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>

                  <button className="gravesend-sans group border-2 border-yellow-400 text-yellow-400 px-10 py-5 text-lg font-light transition-all duration-300 hover:bg-yellow-400/10 flex items-center space-x-3">
                    <Calendar size={20} />
                    <span>View Events</span>
                  </button>
                </div>

                {/* Premium Features */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MdOutlineSecurity size={16} className="text-yellow-400" />
                    <span className="gravesend-sans font-light">
                      No Hidden Fees
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineUserGroup size={16} className="text-yellow-400" />
                    <span className="gravesend-sans font-light">
                      Group Bookings
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaPeopleArrows size={16} className="text-yellow-400" />
                    <span className="gravesend-sans font-light">
                      Personalized Service
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Centered Content (Original Layout) */}
        <div className="lg:hidden w-full flex items-center justify-center">
          <div className="text-center max-w-6xl mx-auto px-8">
            {/* Main Hero Text - Large and Centered */}
            <h1 className="gravesend-sans text-6xl md:text-8xl font-light leading-none mb-8">
              <span className="text-white">ELITE</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                ACCESS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="century-gothic text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your gateway to premier sporting entertainment and unforgettable
              VIP hospitality experiences
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="gravesend-sans group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-10 py-5 text-lg font-light transition-all duration-300 flex items-center space-x-3 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105">
                <span>Explore Packages</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button className="gravesend-sans group border-2 border-yellow-400 text-yellow-400 px-10 py-5 text-lg font-light transition-all duration-300 hover:bg-yellow-400/10 flex items-center space-x-3">
                <Calendar size={20} />
                <span>View Events</span>
              </button>
            </div>

            {/* Premium Features - Centered */}
            <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <HiOutlineUserGroup size={16} className="text-yellow-400" />
                <span className="gravesend-sans font-light">
                  No Hidden Fees
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MdOutlineSecurity size={16} className="text-yellow-400" />
                <span className="gravesend-sans font-light">
                  Group Bookings
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPeopleArrows size={16} className="text-yellow-400" />
                <span className="gravesend-sans font-light">
                  Personalized Service
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: HiOutlineUserGroup,
      title: "No Hidden Fees",
      description:
        "Transparent pricing with no surprises. What you see is what you pay. Our commitment to honest pricing means you can book with complete confidence.",
      number: "01",
      image: "/pic5.jpg",
    },
    {
      icon: MdOutlineSecurity,
      title: "Group Bookings",
      description:
        "All seats together, even for large group bookings. No one gets left behind. Experience seamless coordination for groups of any size.",
      number: "02",
      image: "/pic16.jpg",
    },
    {
      icon: FaPeopleArrows,
      title: "Personalized Service",
      description:
        "Dedicated customer service tailored to your specific needs and preferences. Every interaction is crafted around your unique requirements.",
      number: "03",
      image: "/pic19.jpg",
    },
    {
      icon: SiFsecure,
      title: "Premium Guarantee",
      description:
        "Quality assurance on every booking with our comprehensive satisfaction guarantee. Your peace of mind is our top priority.",
      number: "04",
      image: "/pic0.jpg",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-transparent to-yellow-400/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="gravesend-sans inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-400/20 mb-6">
            <span className="text-yellow-400 text-sm font-light tracking-wide uppercase">
              Experience
            </span>
          </div>
          <h2 className="gravesend-sans text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
            The Obsidian Lifestyle
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="century-gothic text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We guarantee premium experiences with uncompromising quality and
            attention to detail. Every touchpoint is designed to exceed your
            expectations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Large Number with Image Fill */}
              <div className="flex-shrink-0 relative">
                <div className="relative">
                  {/* Number with image fill using background-clip */}
                  <div
                    className="gravesend-sans font-bold text-[200px] lg:text-[280px]  leading-none select-none bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${feature.image})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {feature.number}
                  </div>

                  {/* Fallback/outline for browsers that don't support background-clip */}
                  <div className="gravsend-sans font-light absolute inset-0 text-[200px] lg:text-[280px] leading-none select-none text-transparent bg-gradient-to-b from-gray-600/20 to-gray-800/10 bg-clip-text -z-10">
                    {feature.number}
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-3 h-3 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent rounded-full opacity-60"></div>
                <div className="absolute top-1/2 -left-6 w-2 h-2 bg-yellow-500 rounded-full opacity-40"></div>
                <div className="absolute bottom-8 right-12 w-4 h-4 border-2 border-yellow-400/30 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left max-w-2xl">
                <div className="flex items-center gap-4 justify-center lg:justify-start mb-6">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl shadow-yellow-500/20">
                    <feature.icon
                      size={24}
                      className="text-black lg:w-8 lg:h-8"
                    />
                  </div>
                  <h3 className="gravesend-sans text-3xl lg:text-4xl font-light text-white leading-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="century-gothic text-lg lg:text-xl text-gray-300 leading-relaxed mb-8">
                  {feature.description}
                </p>

                {/* Decorative line */}
                <div
                  className={`w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent ${
                    index % 2 === 1 ? "lg:ml-auto" : "mx-auto lg:mx-0"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-32">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold  hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 cursor-pointer group">
            <span className="century-gothic text-lg">
              Experience the Difference
            </span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const HospitalityOfferings = () => {
  const offerings = [
    {
      title: "Premier League Football",
      description:
        "VIP matchday packages with gourmet dining and premium seating",
      image: "/home5.jpeg",
    },
    {
      title: "Wembley Events",
      description:
        "Official hospitality experiences at the iconic Wembley Stadium",
      image: "/pic24.jpg",
    },
    {
      title: "Formula 1",
      description: "Exclusive paddock access and luxury hospitality suites",
      image: "/home2.jpg",
    },
    {
      title: "Golf Championships",
      description: "Elite golf tournament experiences with hospitality lounges",
      image: "/bes1.jpg",
    },
    {
      title: "Rugby Events",
      description:
        "Premium rugby hospitality with fine dining and entertainment",
      image: "/home.jpg",
    },
    {
      title: "Bespoke Experiences",
      description:
        "Custom tailored hospitality packages for any sporting event",
      image: "/bes.jpg",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6">
            Hospitality Offerings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {offerings.map((offering, index) => (
            <div
              key={index}
              className="group relative p-0 bg-gradient-to-b from-gray-800/30 to-gray-900/30 border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${offering.image}')`,
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-end">
                <h3 className="gravesend-sans text-lg sm:text-xl v text-white mb-2 sm:mb-3">
                  {offering.title}
                </h3>
                <p className="century-gothic text-gray-300 text-sm leading-relaxed">
                  {offering.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6">
            How It Works
          </h2>
          <p className="century-gothic text-lg sm:text-xl text-gray-300">
            Simple. Seamless. Sophisticated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {[
            {
              step: "01",
              title: "Choose Your Event",
              description:
                "Select from our curated collection of premium sporting events and hospitality packages.",
            },
            {
              step: "02",
              title: "Secure Booking",
              description:
                "Complete your booking with our secure payment system and receive immediate confirmation.",
            },
            {
              step: "03",
              title: "VIP Experience",
              description:
                "Arrive, relax, and enjoy top-tier hospitality with our full concierge service.",
            },
          ].map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl shadow-yellow-500/30">
                <span className="gravesend-sans text-xl sm:text-2xl font-bold text-black">
                  {step.step}
                </span>
              </div>
              <h3 className="gravesend-sans text-xl sm:text-2xl font-light text-white mb-3 sm:mb-4">
                {step.title}
              </h3>
              <p className="century-gothic text-sm sm:text-base text-gray-300 leading-relaxed px-2">
                {step.description}
              </p>

              {index < 2 && (
                <div className="hidden md:block absolute top-8 sm:top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 sm:mt-8 w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mx-auto transition-colors duration-300"></div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="pt-20">
      <ObsidianHero />
      <Features />
      <HospitalityOfferings />
      <HowItWorks />
    </div>
  );
};

export default HomePage;
