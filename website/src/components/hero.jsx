import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Zap, 
  Target, 
  Shield, 
  Star,
  ChevronRight,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { LazyImage } from './header';

const HospitalityOfferings = () => {
  const offerings = [
    {
      title: "Premier League Football",
      description: "VIP matchday packages with gourmet dining and premium seating",
      icon: Trophy,
      color: "text-green-400"
    },
    {
      title: "Wembley Events",
      description: "Official hospitality experiences at the iconic Wembley Stadium",
      icon: MapPin,
      color: "text-blue-400"
    },
    {
      title: "Formula 1",
      description: "Exclusive paddock access and luxury hospitality suites",
      icon: Zap,
      color: "text-red-400"
    },
    {
      title: "Golf Championships",
      description: "Elite golf tournament experiences with hospitality lounges",
      icon: Target,
      color: "text-emerald-400"
    },
    {
      title: "Rugby Events",
      description: "Premium rugby hospitality with fine dining and entertainment",
      icon: Shield,
      color: "text-purple-400"
    },
    {
      title: "Bespoke Experiences",
      description: "Custom tailored hospitality packages for any sporting event",
      icon: Star,
      color: "text-yellow-400"
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
          {offerings.map((offering, index) => {
            const IconComponent = offering.icon;
            return (
              <div
                key={index}
                className="group relative p-6 sm:p-8 bg-gradient-to-b from-gray-800/30 to-gray-900/30 border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden"
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-yellow-600/30 flex items-center justify-center group-hover:border-yellow-400/50 transition-all duration-300">
                    <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${offering.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="gravesend-sans text-lg sm:text-xl font-medium text-white mb-3 sm:mb-4">
                    {offering.title}
                  </h3>
                  <p className="century-gothic text-gray-300 text-sm leading-relaxed">
                    {offering.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 sm:mb-6">
            How It Works
          </h2>
          <p className="century-gothic text-lg sm:text-xl text-gray-600">
            Simple. Seamless. Sophisticated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {[
            {
              step: "01",
              title: "Choose Your Event",
              description: "Select from our curated collection of premium sporting events and hospitality packages.",
              icon: Calendar
            },
            {
              step: "02", 
              title: "Secure Booking",
              description: "Complete your booking with our secure payment system and receive immediate confirmation.",
              icon: CheckCircle
            },
            {
              step: "03",
              title: "VIP Experience", 
              description: "Arrive, relax, and enjoy top-tier hospitality with our full concierge service.",
              icon: Star
            },
          ].map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-yellow-500/20">
                  <span className="gravesend-sans text-xl sm:text-2xl font-bold text-black">
                    {step.step}
                  </span>
                </div>
                
                {/* Icon below step number */}
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-gray-600" />
                </div>
                
                <h3 className="gravesend-sans text-xl sm:text-2xl font-light text-gray-900 mb-3 sm:mb-4">
                  {step.title}
                </h3>
                <p className="century-gothic text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                  {step.description}
                </p>

                {index < 2 && (
                  <div className="hidden md:block absolute top-8 sm:top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6 sm:mt-8 w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mx-auto transition-colors duration-300"></div>
    </section>
  );
};

// Export both components
export default function HospitalityComponents() {
  return (
    <div>
      <HospitalityOfferings />
      <HowItWorks />
    </div>
  );
}