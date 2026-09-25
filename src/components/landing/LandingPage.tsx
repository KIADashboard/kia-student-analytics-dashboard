import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { InstitutionHighlights } from './InstitutionHighlights';

export const LandingPage: React.FC<{ onNavigateToLogin: () => void }> = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-[#FFFDEE]">
      <Navbar onNavigateToLogin={onNavigateToLogin} />
      <HeroSection onNavigateToLogin={onNavigateToLogin} />
      <InstitutionHighlights />
    </div>
  );
};
