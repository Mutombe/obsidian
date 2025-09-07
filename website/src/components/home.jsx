import React, { useRef, useEffect, useState } from 'react';
import ObsidianHero from './hero';
import { Features, HospitalityOfferings, HowItWorks } from './features';

const HomePage = () => {
  return (
    <div className="pt-20">
      <ObsidianHero />
      <Features />

      {/* Hospitality Offerings */}
      <HospitalityOfferings />

      {/* How It Works */}
      <HowItWorks />
    </div>
  );
};

export default HomePage;
