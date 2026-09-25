import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

export const HeroSection: React.FC<{ onNavigateToLogin?: () => void }> = ({ onNavigateToLogin }) => {
  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-start overflow-hidden">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/kia-campus.jpg"
          alt="Kumaraguru Institute of Agriculture Campus"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-[40s] ease-out"
        />
        {/* Subtle dark treatment for overall readability and cinematic feel */}
        <div className="absolute inset-0 bg-[#0C342C]/20 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 w-full max-w-[95rem] mx-auto px-6 sm:px-12 lg:px-16 py-24">
        
        {/* Premium Dark-Green Glassmorphism Panel */}
        <div className="w-full max-w-[42rem] backdrop-blur-xl bg-[#0C342C]/50 border border-white/10 rounded-3xl p-10 sm:p-14 lg:p-16 shadow-2xl shadow-black/30">
          
          <div className="flex items-center gap-6 mb-10">
            <span className="w-12 h-px bg-[#E2FBCE]/60"></span>
            <span className="text-[#E2FBCE] font-bold tracking-[0.25em] text-[10px] uppercase">
              Institutional Analytics
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-serif leading-[1.05] tracking-tight mb-8 text-[#FFFDEE]">
            Cultivating<br />
            <span className="italic font-light text-[#E2FBCE]">Excellence</span><br />
            Through Data.
          </h1>
          
          <p className="text-lg lg:text-xl text-[#FFFDEE]/90 leading-relaxed max-w-xl mb-14 font-light">
            Empowering the Kumaraguru Institute of Agriculture with comprehensive historical data, academic performance metrics, and institutional insights to nurture the next generation of agricultural leaders.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              onClick={onNavigateToLogin}
              className="flex items-center justify-center gap-3 px-10 py-5 bg-[#FFFDEE] text-[#0C342C] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#E2FBCE] transition-colors duration-300 rounded-sm w-full sm:w-auto"
            >
              Explore Analytics
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              href="#admissions"
              className="px-10 py-5 bg-transparent border border-[#FFFDEE]/30 text-[#FFFDEE] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#FFFDEE]/10 hover:border-[#FFFDEE]/60 transition-colors duration-300 rounded-sm w-full sm:w-auto text-center"
            >
              Admissions
            </a>
          </div>
        </div>

      </div>

      {/* Floating Location Caption at bottom right */}
      <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-16 z-10 flex items-center gap-3 text-[#FFFDEE]/90 font-bold text-[10px] lg:text-xs uppercase tracking-[0.2em] drop-shadow-md">
        <div className="hidden sm:block w-8 h-px bg-[#FFFDEE]/40 mr-2"></div>
        <MapPin className="w-4 h-4" />
        <span>Sakthi Nagar, Erode District</span>
      </div>
      
    </section>
  );
};
