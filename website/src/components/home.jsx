import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Star, Trophy, Crown } from 'lucide-react';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { GrGroup } from 'react-icons/gr';
import { IoStarOutline } from 'react-icons/io5';

// Enhanced Particle Field with Obsidian branding
const ObsidianParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsla(${Math.random() * 60 + 30}, 80%, 60%, 0.8)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

// Spotlight Effect targeting the main text
const WindowLight = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] lg:w-[900px] h-[500px] sm:h-[700px] lg:h-[900px] bg-gradient-radial from-yellow-400/30 via-yellow-500/15 to-transparent rounded-full"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, delay: 0.3 }}
        className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[700px] h-[400px] sm:w-[500px] lg:h-[700px] bg-gradient-radial from-yellow-300/25 via-yellow-400/10 to-transparent rounded-full"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute left-4 sm:left-8 lg:left-16 top-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[500px] h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-radial from-yellow-400/40 via-yellow-500/20 to-transparent rounded-full"
      />
    </div>
  );
};

// Ultra Smooth Section Transition Component
const SmoothSection = ({ children, className = "", gradientFrom, gradientVia, gradientTo, sectionId }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform values for ultra smooth transitions
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 1.05]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [5, 0, 0, 5]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ 
        opacity,
        scale,
        filter: blur.get() ? `blur(${blur.get()}px)` : 'none'
      }}
      className={`relative min-h-[120vh] ${className}`}
    >
      {/* Massive gradient blending layers */}
      <div className="absolute inset-0 -top-32 -bottom-32">
        <div className={`absolute inset-0 bg-gradient-to-b ${gradientFrom} via-transparent to-transparent opacity-90`} />
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${gradientVia} to-transparent opacity-70`} />
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${gradientTo} opacity-90`} />
      </div>

      {/* Ultra smooth top fade - massive area */}
      <div className="absolute -top-32 left-0 right-0 h-64 bg-gradient-to-b from-black/0 via-black/10 via-black/30 via-black/60 to-black/90 pointer-events-none z-20" />
      
      {/* Ultra smooth bottom fade - massive area */}
      <div className="absolute -bottom-32 left-0 right-0 h-64 bg-gradient-to-t from-black/0 via-black/10 via-black/30 via-black/60 to-black/90 pointer-events-none z-20" />

      {/* Content with extra padding for breathing room */}
      <div className="relative z-10 py-32">
        {children}
      </div>
    </motion.section>
  );
};

// Hero Section with seamless flow
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
    <div className="relative min-h-[150vh] bg-gradient-to-b from-black via-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Continuous particle background that flows throughout */}
      <div className="absolute inset-0 -top-32 -bottom-32 opacity-80">
        <ObsidianParticleField />
      </div>
      
      {/* Window Light Effect */}
      <WindowLight />

      {/* Seamless flowing gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent via-transparent to-gray-900/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 via-gray-800/40 to-black/90" />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left space-y-6 sm:space-y-8 relative"
            >
              <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gradient-radial from-yellow-400/5 via-transparent to-transparent rounded-3xl" />
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}
              >
                Elite Access.
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
                >
                  Unforgettable 
                  <br />Experiences.
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light"
                style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}
              >
                Obsidian Lifestyle is your gateway to the world of premier sporting entertainment. 
                We specialise in providing official VIP hospitality packages across elite sports.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 234, 156, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto"
                  style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}
                >
                  <span>Explore Packages</span>
                  <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 234, 156, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  className="group border-2 border-yellow-400 text-yellow-400 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20 flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto"
                  style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}
                >
                  <Calendar size={16} className="sm:w-5 sm:h-5" />
                  <span>View Events</span>
                </motion.button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="relative z-20 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm text-gray-300"
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}
              >
                {['No Hidden Fees', 'Group Bookings', 'Personalized Service'].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 + (index * 0.1) }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Section with seamless blending
const Features = () => {
  const features = [
    {
      icon: VscWorkspaceTrusted,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises. What you see is what you pay."
    },
    {
      icon: GrGroup,
      title: "Group Bookings", 
      description: "All seats together, even for large group bookings. No one gets left behind."
    },
    {
      icon: IoStarOutline,
      title: "Personalized Service",
      description: "Dedicated customer service tailored to your specific needs and preferences."
    }
  ];

  return (
    <SmoothSection
      gradientFrom="from-black/90"
      gradientVia="via-gray-800/80"
      gradientTo="to-gray-700/90"
      className="relative"
    >
      {/* Seamless background continuation */}
      <div className="absolute inset-0 -top-64 -bottom-64 bg-gradient-to-b from-gray-900/50 via-gray-800/70 via-gray-700/80 to-gray-600/50" />
      
      {/* Flowing background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}>
              The Obsidian Lifestyle Experience
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}>
              We guarantee premium experiences with uncompromising quality and attention to detail.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group relative p-8 bg-gradient-to-b from-gray-800/40 to-gray-900/60 rounded-2xl border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-500 hover:transform hover:scale-105 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 group-hover:shadow-2xl group-hover:shadow-yellow-500/30 transition-all duration-300">
                  <feature.icon size={32} className="text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SmoothSection>
  );
};

// Hospitality Offerings with seamless flow
const HospitalityOfferings = () => {
  const offerings = [
    {
      title: "Premier League Football",
      description: "VIP matchday packages with gourmet dining and premium seating",
      image: "🏈"
    },
    {
      title: "Wembley Events",
      description: "Official hospitality experiences at the iconic Wembley Stadium", 
      image: "🏟️"
    },
    {
      title: "Formula 1",
      description: "Exclusive paddock access and luxury hospitality suites",
      image: "🏎️"
    },
    {
      title: "Golf Championships",
      description: "Elite golf tournament experiences with hospitality lounges",
      image: "⛳"
    },
    {
      title: "Rugby Events",
      description: "Premium rugby hospitality with fine dining and entertainment",
      image: "🏉"
    },
    {
      title: "Bespoke Experiences",
      description: "Custom tailored hospitality packages for any sporting event",
      image: "✨"
    }
  ];

  return (
    <SmoothSection
      gradientFrom="from-gray-700/80"
      gradientVia="via-gray-600/70"
      gradientTo="to-gray-500/80"
      className="relative"
    >
      {/* Ultra smooth background flow */}
      <div className="absolute inset-0 -top-64 -bottom-64">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/40 via-gray-700/60 via-gray-600/70 via-gray-500/60 to-gray-400/40" />
      </div>

      {/* Continuous flowing animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-64 -left-64 w-96 h-96 bg-gradient-to-br from-yellow-400/8 to-yellow-600/4 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-64 -right-64 w-80 h-80 bg-gradient-to-tl from-yellow-500/8 to-yellow-300/4 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}
            >
              Hospitality Offerings
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative p-6 bg-gradient-to-b from-gray-700/30 to-gray-800/50 rounded-xl border border-yellow-600/20 hover:border-yellow-400/40 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {offering.image}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}>
                    {offering.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}>
                    {offering.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SmoothSection>
  );
};

// How It Works with seamless ending
const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Event",
      description: "Select from our curated collection of premium sporting events and hospitality packages."
    },
    {
      step: "02", 
      title: "Secure Booking",
      description: "Complete your booking with our secure payment system and receive immediate confirmation."
    },
    {
      step: "03",
      title: "VIP Experience", 
      description: "Arrive, relax, and enjoy top-tier hospitality with our full concierge service."
    }
  ];

  return (
    <SmoothSection
      gradientFrom="from-gray-600/70"
      gradientVia="via-gray-500/80"
      gradientTo="to-black/90"
      className="relative"
    >
      {/* Ultra smooth ending transition */}
      <div className="absolute inset-0 -top-64 -bottom-64 bg-gradient-to-b from-gray-700/30 via-gray-600/50 via-gray-500/60 via-black/70 to-black/90" />

      {/* Flowing final background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/3 to-transparent"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300"
              style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}
            >
              Simple. Seamless. Sophisticated.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/30 group-hover:shadow-yellow-400/50 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold text-black" style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}>
                    {step.step}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'Gravesend Sans, system-ui, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed max-w-sm mx-auto" style={{ fontFamily: 'Century Gothic, system-ui, sans-serif' }}>
                  {step.description}
                </p>
                
                {index < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: (index + 1) * 0.3 }}
                    viewport={{ once: true }}
                    className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transform origin-left"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SmoothSection>
  );
};

// Main HomePage Component
const HomePage = () => {
  return (
    <div className="pt-20 relative bg-black">
      {/* Global continuous background */}
      <div className="fixed inset-0 opacity-50 pointer-events-none" />
      
      <ObsidianHero />
      <Features />
      <HospitalityOfferings />
      <HowItWorks />
    </div>
  );
};

export default HomePage;