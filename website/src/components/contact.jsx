// Contact Form Component
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Check,
  Globe,
  Award,
  Loader2,
  AlertCircle
} from "lucide-react";
import { IntegratedNavigation } from "./header";
import axios from "axios";

const ContactForm = ({ eventTitle = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: eventTitle,
    guests: "",
    message: "",
    contactMethod: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${
           "http://127.0.0.1:8000"
        }/api/newsletter/contact/`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event: formData.event,
          guests: formData.guests ? parseInt(formData.guests) : null,
          message: formData.message,
          contact_method: formData.contactMethod,
        }
      );

      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          event: eventTitle,
          guests: "",
          message: "",
          contactMethod: "email",
        });
      }, 5000);
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        err.response?.data?.error ||
          Object.values(err.response?.data || {}).flat()[0] ||
          "Failed to submit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 sm:p-6 shadow-sm">
      <h3 className="gravesend-sans text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Book Your Experience
      </h3>

      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h4 className="gravesend-sans text-xl font-semibold text-gray-900 mb-2">
            Request Submitted!
          </h4>
          <p className="century-gothic text-gray-600">
            Check your email for confirmation. We'll contact you within 24
            hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
              required
              disabled={isSubmitting}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
              required
              disabled={isSubmitting}
            />
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              placeholder="Number of Guests"
              min="1"
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
              disabled={isSubmitting}
            />
          </div>

          {!eventTitle && (
            <input
              type="text"
              name="event"
              value={formData.event}
              onChange={handleChange}
              placeholder="Event of Interest"
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
              disabled={isSubmitting}
            />
          )}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Special Requirements or Questions"
            rows="4"
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-none"
            required
            disabled={isSubmitting}
          ></textarea>

          <div>
            <p className="text-gray-900 mb-2 font-medium">
              Preferred Contact Method:
            </p>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={formData.contactMethod === "email"}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span className="text-gray-700">Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={formData.contactMethod === "phone"}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span className="text-gray-700">Phone</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Booking Request"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

// Contact Page
const ContactPage = () => {
  return (
    <div className="pt-36 sm:pt-36 min-h-screen bg-white">
      <IntegratedNavigation pageType="dark" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="gravesend-sans text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="century-gothic text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Ready to experience elite sporting hospitality? Get in touch with
            our team to discuss your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="gravesend-sans text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Get In Touch
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-black sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="gravesend-sans text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                      Phone
                    </h3>
                    <p className="century-gothic text-gray-700 text-sm sm:text-base">
                      +263 70 000 0000
                    </p>
                    <p className="century-gothic text-xs sm:text-sm text-gray-500">
                      Monday - Friday, 9AM - 6PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-black sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="gravesend-sans text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                      Email
                    </h3>
                    <p className="century-gothic text-gray-700 text-sm sm:text-base break-all">
                      info@obsidianlifestyle.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-black sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="gravesend-sans text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                      Address
                    </h3>
                    <p className="century-gothic text-gray-700 text-sm sm:text-base">
                      1st Floor, My Building, No. 50 Street
                      <br />
                      Some Road, Harare, Zimbabwe
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Back Feature */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 border border-yellow-200 p-6 sm:p-8">
              <h3 className="gravesend-sans text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Prefer a Call Back?
              </h3>
              <p className="century-gothic text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Leave your number and our team will call you back within 2 hours
                during business hours.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="century-gothic flex-1 px-3 sm:px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors roboto-font text-sm sm:text-base"
                />
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 sm:px-6 py-3 font-semibold century-gothic hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 text-sm sm:text-base whitespace-nowrap">
                  Call Me
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-20">
          <h2 className="gravesend-sans text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                question: "How do I receive my tickets?",
                answer:
                  "E-tickets and event details are sent via email usually within 72 hours before the event.",
              },
              {
                question: "Are there any hidden fees?",
                answer:
                  "No, we guarantee transparent pricing with no hidden fees. What you see is what you pay.",
              },
              {
                question: "Can you accommodate large groups?",
                answer:
                  "Yes, we ensure all seats are together even for large group bookings. No one gets left behind.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, bank transfers, and can arrange bespoke payment terms for corporate bookings.",
              },
              {
                question: "Do you provide additional services?",
                answer:
                  "Yes, we offer full concierge services including airport transfers, chauffeur service, and accommodation.",
              },
              {
                question: "How far in advance should I book?",
                answer:
                  "We recommend booking as early as possible, especially for premium events. Some packages sell out months in advance.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="gravesend-sans text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  {faq.question}
                </h3>
                <p className="century-gothic text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
