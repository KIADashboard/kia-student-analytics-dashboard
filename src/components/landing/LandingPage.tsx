import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDEE]">
      <Navbar />
      <HeroSection />
    </div>
  );
};
