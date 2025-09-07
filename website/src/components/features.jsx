import React from 'react';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { GrGroup } from 'react-icons/gr';
import { IoStarOutline } from 'react-icons/io5';

const Features = () => {
  const features = [
    {
      icon: VscWorkspaceTrusted,
      title: "No Hidden Fees",
      description:
        "Transparent pricing with no surprises. What you see is what you pay.",
    },
    {
      icon: GrGroup,
      title: "Group Bookings",
      description:
        "All seats together, even for large group bookings. No one gets left behind.",
    },
    {
      icon: IoStarOutline,
      title: "Personalized Service",
      description:
        "Dedicated customer service tailored to your specific needs and preferences.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            The Obsidian Lifestyle Experience
          </h2>
          <p className="century-gothic text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            We guarantee premium experiences with uncompromising quality and
            attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 sm:p-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl sm:rounded-2xl border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:shadow-2xl group-hover:shadow-yellow-500/30 transition-all duration-300">
                <feature.icon size={24} className="text-black sm:w-8 sm:h-8" />
              </div>
              <h3 className="gravesend-sans text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                {feature.title}
              </h3>
              <p className="century-gothic text-sm sm:text-base text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HospitalityOfferings = () => {
  return (
    <section 
      className="py-12 sm:py-16 lg:py-20"
      style={{
        background: 'linear-gradient(to bottom, #111827 0%, #000000 50%, #111827 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Hospitality Offerings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            {
              title: "Premier League Football",
              description:
                "VIP matchday packages with gourmet dining and premium seating",
              image: "🏈",
            },
            {
              title: "Wembley Events",
              description:
                "Official hospitality experiences at the iconic Wembley Stadium",
              image: "🏟️",
            },
            {
              title: "Formula 1",
              description:
                "Exclusive paddock access and luxury hospitality suites",
              image: "🏎️",
            },
            {
              title: "Golf Championships",
              description:
                "Elite golf tournament experiences with hospitality lounges",
              image: "⛳",
            },
            {
              title: "Rugby Events",
              description:
                "Premium rugby hospitality with fine dining and entertainment",
              image: "🏉",
            },
            {
              title: "Bespoke Experiences",
              description:
                "Custom tailored hospitality packages for any sporting event",
              image: "✨",
            },
          ].map((offering, index) => (
            <div
              key={index}
              className="group relative p-4 sm:p-6 bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-lg sm:rounded-xl border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{offering.image}</div>
              <h3 className="gravesend-sans text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                {offering.title}
              </h3>
              <p className="century-gothic text-gray-300 text-sm leading-relaxed">
                {offering.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section 
      className="py-12 sm:py-16 lg:py-20"
      style={{
        background: 'linear-gradient(to bottom, #111827 0%, #000000 50%, #111827 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="gravesend-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl shadow-yellow-500/30">
                <span className="gravesend-sans text-xl sm:text-2xl font-bold text-black">
                  {step.step}
                </span>
              </div>
              <h3 className="gravesend-sans text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
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
      <div className="mt-6 sm:mt-8 w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mx-auto group-hover:via-yellow-400 transition-colors duration-300"></div>
    </section>
  );
};

export { Features, HospitalityOfferings, HowItWorks };