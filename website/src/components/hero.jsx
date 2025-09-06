import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Star, Trophy, Crown } from 'lucide-react';
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
      {/* Main spotlight on the left side where text is */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] lg:w-[900px] h-[500px] sm:h-[700px] lg:h-[900px] bg-gradient-radial from-yellow-400/30 via-yellow-500/15 to-transparent rounded-full"
      />
      
      {/* Secondary spotlight for depth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, delay: 0.3 }}
        className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[700px] h-[400px] sm:w-[500px] lg:h-[700px] bg-gradient-radial from-yellow-300/25 via-yellow-400/10 to-transparent rounded-full"
      />
      
      {/* Focused beam directly on text area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute left-4 sm:left-8 lg:left-16 top-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[500px] h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-radial from-yellow-400/40 via-yellow-500/20 to-transparent rounded-full"
      />
      
      {/* Subtle light rays emanating from the spotlight - hidden on mobile for cleaner look */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.6, scaleX: 1 }}
        transition={{ duration: 3, delay: 1.2 }}
        className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-1 bg-gradient-to-r from-yellow-400/30 via-yellow-500/15 to-transparent transform origin-left"
      />
      
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.4, scaleX: 1 }}
        transition={{ duration: 3.5, delay: 1.5 }}
        className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 translate-y-8 w-[600px] h-0.5 bg-gradient-to-r from-yellow-300/25 via-yellow-400/10 to-transparent transform origin-left"
      />
      
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.4, scaleX: 1 }}
        transition={{ duration: 3.5, delay: 1.7 }}
        className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-y-8 w-[600px] h-0.5 bg-gradient-to-r from-yellow-300/25 via-yellow-400/10 to-transparent transform origin-left"
      />
      
      {/* Ambient window glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4, delay: 0.5 }}
        className="absolute -left-16 sm:-left-24 lg:-left-32 top-0 w-[300px] sm:w-[450px] lg:w-[600px] h-full bg-gradient-to-r from-yellow-200/10 via-yellow-400/5 to-transparent"
      />
    </div>
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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Obsidian Particle Background */}
      <div className="absolute inset-0 opacity-80">
        <ObsidianParticleField />
      </div>
      
      {/* Window Light Effect - Now spotlighting the text */}
      <WindowLight />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Main Content (Now highlighted by spotlight) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left space-y-6 sm:space-y-8 relative"
          >
            {/* Additional text glow effect */}
            <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gradient-radial from-yellow-400/5 via-transparent to-transparent rounded-3xl" />
            
            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="gravesend-sans relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-white leading-tight"
            >
              Elite Access.
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="gravesend-sans block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
              >
                Unforgettable 
                <br />Experiences.
              </motion.span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="century-gothic relative text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light"
            >
              Obsidian Lifestyle is your gateway to the world of premier sporting entertainment. 
              We specialise in providing official VIP hospitality packages across elite sports.
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 234, 156, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="gravesend-sans group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto"
              >
                <span>Explore Packages</span>
                <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 234, 156, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="gravesend-sans group border-2 border-yellow-400 text-yellow-400 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20 flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto"
              >
                <Calendar size={16} className="sm:w-5 sm:h-5" />
                <span>View Events</span>
              </motion.button>
            </motion.div>
            
            {/* Premium Features - Enhanced z-index */}
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
                  <span className="gravesend-sans"><IoStarOutline size={16} className="text-yellow-400" /></span>
                  <span className="century-gothic">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default ObsidianHero;