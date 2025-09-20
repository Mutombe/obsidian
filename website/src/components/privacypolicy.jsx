import React, { useEffect } from 'react';
import { trackObsidianPageView, resetObsidianCookieConsent } from './cookieManager';
const ObsidianPrivacyPolicy = () => {
  useEffect(() => {
    trackObsidianPageView('/privacy-policy', 'Obsidian Privacy Policy');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="gravesend-sans font-light text-5xl mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="century-gothic text-lg text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 century-gothic text-gray-300">
          
          <section>
            <h2 className="gravesend-sans font-light text-3xl mb-6 text-yellow-400">
              Cookie Policy
            </h2>
            <div className="space-y-6">
              <p className="leading-relaxed">
                At Obsidian, we use cookies and similar technologies to enhance your luxury experience, 
                provide personalized service recommendations, and analyze our premium offerings.
              </p>
              
              <h3 className="font-medium text-xl text-white">
                Types of Cookies We Use:
              </h3>
              
              <div className="ml-6 space-y-4">
                <div className="p-4 border border-yellow-400/20 rounded-lg bg-yellow-400/5">
                  <strong className="text-yellow-400">Essential Cookies:</strong>
                  <p className="mt-2">Required for secure booking functionality, account management, and website security. These cookies ensure your VIP experience runs smoothly and cannot be disabled.</p>
                </div>
                
                <div className="p-4 border border-yellow-400/20 rounded-lg bg-yellow-400/5">
                  <strong className="text-yellow-400">Analytics Cookies:</strong>
                  <p className="mt-2">Help us understand event preferences, popular packages, and how to improve our luxury service offerings. All data is analyzed anonymously to enhance your experience.</p>
                </div>
                
                <div className="p-4 border border-yellow-400/20 rounded-lg bg-yellow-400/5">
                  <strong className="text-yellow-400">Marketing Cookies:</strong>
                  <p className="mt-2">Used for personalized event recommendations, exclusive VIP offers, and targeted luxury hospitality advertising across premium platforms.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="gravesend-sans font-light text-3xl mb-6 text-yellow-400">
              Data Collection
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                We collect information you provide when booking VIP experiences, subscribing to our exclusive 
                newsletter, or contacting us for luxury hospitality services.
              </p>
              <p className="leading-relaxed">
                We also automatically collect certain information about your device and preferences to 
                personalize your luxury experience and recommend suitable VIP packages.
              </p>
            </div>
          </section>

          <section>
            <h2 className="gravesend-sans font-light text-3xl mb-6 text-yellow-400">
              Your Privacy Rights
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                You can also withdraw your consent for cookie usage and data processing.
              </p>
              <p className="leading-relaxed">
                For VIP clients, we provide dedicated privacy support to ensure your luxury experience 
                maintains the highest standards of confidentiality.
              </p>
            </div>
          </section>

          <section>
            <h2 className="gravesend-sans font-light text-3xl mb-6 text-yellow-400">
              Contact Information
            </h2>
            <div className="p-6 border border-yellow-400/30 rounded-lg bg-gradient-to-r from-yellow-400/10 to-yellow-600/10">
              <p className="leading-relaxed">
                For privacy inquiries or to exercise your rights, contact our dedicated privacy team:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> privacy@obsidianvip.com</p>
                <p><strong>Phone:</strong> +1 (555) VIP-LUXE</p>
                <p><strong>Address:</strong> Obsidian VIP Services, Luxury Privacy Department</p>
              </div>
            </div>
          </section>
        </div>

        {/* Cookie Preferences Button */}
        <div className="mt-16 pt-8 border-t border-yellow-400/20 text-center">
          <button
            onClick={resetObsidianCookieConsent}
            className="px-8 py-4 rounded-lg font-light century-gothic transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500"
          >
            Update Cookie Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObsidianPrivacyPolicy;

// Example 6: Don't forget to add the privacy policy route to your App.js
// Add this route to your Routes component:

