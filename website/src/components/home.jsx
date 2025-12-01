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
import HospitalityComponents from "./hero";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { GrGroup } from "react-icons/gr";
import { IoStarOutline } from "react-icons/io5";
import { FiShield } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { SiFsecure } from "react-icons/si";
import { MdOutlineSecurity } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa6";
import { IntegratedNavigation } from "./header";
import { useNavigate } from "react-router-dom";
import {
  trackObsidianPageView,
  trackObsidianEvent,
  trackPackageView,
} from "./cookieManager";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export const LazyImage = ({ src, alt, className, style, priority = false }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref: imgRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: "50px",
  });

  useEffect(() => {
    if (priority || inView) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
    }
  }, [src, inView, priority]);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #e3180d20, #ff780520)",
          filter: imageLoaded ? "blur(0px)" : "blur(10px)",
          transition: "filter 0.3s ease",
        }}
      />
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  );
};

const ObsidianHero = () => {
  const navigate = useNavigate();

  useEffect(() => {
    trackObsidianPageView("/", "Obsidian - Elite VIP Experiences", {
      section: "home",
      userType: "visitor",
    });
  }, []);

  const handleExplorePackages = () => {
    trackObsidianEvent("explore_packages_click", {
      button_location: "hero_section",
      page: "home",
      user_intent: "package_discovery",
    });

    // Your existing navigation logic
    navigate("/newsletter");
  };

  const handleViewEvents = () => {
    trackObsidianEvent("view_events_click", {
      button_location: "hero_section",
      page: "home",
      user_intent: "event_discovery",
    });

    // Your existing navigation logic
    navigate("/events");
  };

  return (
    <section
      className="relative min-h-screen flex overflow-hidden"
      style={{ overflow: "hidden", marginTop: "0", paddingTop: "0" }}
    >
      {/* Integrated Navigation */}
      <IntegratedNavigation pageType="transparent" />

      {/* Split Background */}
      <div className="absolute inset-0 flex">
        {/* Left Half - Black & Gold */}
        <div className="w-1/2 bg-black relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rotate-45 blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-gradient-to-tl from-yellow-500 to-yellow-700 rotate-12 blur-lg"></div>
          </div>
        </div>

        {/* Right Half - White & Gold with Image */}
        <div className="w-1/2 relative">
          <LazyImage
            src="https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/pp1.jpg"
            alt="Obsidian Elite VIP Experience"
            priority={true}
            className="absolute inset-0"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/10 via-transparent to-yellow-600/20 z-10"></div>
        </div>
      </div>

      {/* Hero Content - Left Side for Desktop, Centered for Mobile */}
      <div className="relative z-10 w-full flex items-center min-h-screen">
        {/* Desktop: Content on Left Half - Aligned with logo */}
        <div className="hidden lg:block w-1/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:pl-8">
              <div className="max-w-2xl">
                {/* Main Hero Text - Large and Left Aligned */}
                <h1 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 sm:mb-8">
                  Elite Access.
                  <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Unforgettable
                    <br />
                    Experiences.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="century-gothic text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed">
                  Your gateway to premier sporting entertainment and
                  unforgettable VIP hospitality experiences
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16">
                  <button
                    className="gravesend-sans group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg font-light transition-all duration-300 flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105"
                    onClick={handleExplorePackages}
                  >
                    <span>Explore Packages</span>
                    <ArrowRight
                      size={18}
                      className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                    />
                  </button>

                  <button
                    className="gravesend-sans group border-2 border-yellow-400 text-yellow-400 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg font-light transition-all duration-300 hover:bg-yellow-400/10 flex items-center justify-center space-x-3"
                    onClick={handleViewEvents}
                  >
                    <Calendar size={18} className="sm:w-5 sm:h-5" />
                    <span>View Events</span>
                  </button>
                </div>

                {/* Premium Features */}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Centered Content */}
        <div className="lg:hidden w-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Hero Text - Responsive sizing */}
            <h1 className="gravesend-sans text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-none mb-6 sm:mb-8">
              <span className="text-white">ELITE</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                ACCESS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="century-gothic text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
              Your gateway to premier sporting entertainment and unforgettable
              VIP hospitality experiences
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
              <button
                className="gravesend-sans group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-light transition-all duration-300 flex items-center space-x-3 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 w-full sm:w-auto justify-center"
                onClick={() => navigate("/newsletter")}
              >
                <span>Explore Packages</span>
                <ArrowRight
                  size={18}
                  className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                className="gravesend-sans group border-2 border-yellow-400 text-yellow-400 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-light transition-all duration-300 hover:bg-yellow-400/10 flex items-center space-x-3 w-full sm:w-auto justify-center"
                onClick={() => navigate("/events")}
              >
                <Calendar size={18} className="sm:w-5 sm:h-5" />
                <span>View Events</span>
              </button>
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
      title: "No Hidden Fees",
      description:
        "Transparent pricing with no surprises. What you see is what you pay. Our commitment to honest pricing means you can book with complete confidence.",
      number: "01",
      image:
        "https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/pic5.jpg",
    },
    {
      title: "Group Bookings",
      description:
        "All seats together, even for large group bookings. No one gets left behind. Experience seamless coordination for groups of any size.",
      number: "02",
      image:
        "https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/pic16.jpg",
    },
    {
      title: "Personalized Service",
      description:
        "Dedicated customer service tailored to your specific needs and preferences. Every interaction is crafted around your unique requirements.",
      number: "03",
      image:
        "https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/pic19.jpg",
    },
    {
      title: "Premium Guarantee",
      description:
        "Quality assurance on every booking with our comprehensive satisfaction guarantee. Your peace of mind is our top priority.",
      number: "04",
      image:
        "https://bard-santner.sgp1.cdn.digitaloceanspaces.com/obsidian/pic0.jpg",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="gravesend-sans text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
            The Obsidian Lifestyle
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="century-gothic text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We guarantee premium experiences with uncompromising quality and
            attention to detail. Every touchpoint is designed to exceed your
            expectations.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div key={index}>
              <div
                className={`flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Large Number with Image Fill */}
                <div className="flex-shrink-0 relative">
                  {/* Number with LazyImage and mask */}
                  <div className="relative">
                    {/* The actual number acts as a mask */}
                    <div
                      className="relative overflow-hidden"
                      style={{ width: "280px", height: "280px" }}
                    >
                      <LazyImage
                        src={feature.image}
                        alt={`${feature.title} background`}
                        priority={true} // Load first feature immediately
                        className="absolute inset-0"
                        style={{
                          width: "100%",
                          height: "100%",
                          maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='180' font-weight='bold' font-family='Gravesend Sans'%3E${feature.number}%3C/text%3E%3C/svg%3E")`,
                          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='180' font-weight='bold' font-family='Gravesend Sans'%3E${feature.number}%3C/text%3E%3C/svg%3E")`,
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                        }}
                      />
                    </div>

                    {/* Fallback outline */}
                    <div className="gravesend-sans font-light absolute inset-0 text-[200px] lg:text-[280px] leading-none select-none text-transparent bg-gradient-to-b from-gray-400/20 to-gray-600/10 bg-clip-text -z-10">
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
                  <h3 className="gravesend-sans text-3xl lg:text-4xl font-light text-gray-900 leading-tight mb-6">
                    {feature.title}
                  </h3>
                  <p className="century-gothic text-lg lg:text-xl text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Separator line - only show between features, not after the last one */}
              {index < features.length - 1 && (
                <div className="mt-16 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="pt-20">
      <ObsidianHero />
      <Features />
      <HospitalityComponents />
    </div>
  );
};

export default HomePage;
