import React from 'react';

export const HeroSection: React.FC<{ onNavigateToLogin?: () => void }> = ({ onNavigateToLogin }) => {
  return (
    <section className="relative w-full lg:min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row border-t border-[#0C342C]/10">
      
      {/* Left Typography & CTAs Block */}
      <div className="w-full lg:w-5/12 bg-[#0C342C] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-20 lg:py-0 text-[#FFFDEE] relative z-10">
        
        <div className="flex items-center gap-6 mb-12">
          <span className="w-12 h-px bg-[#E2FBCE]/40"></span>
          <span className="text-[#E2FBCE] font-semibold tracking-[0.25em] text-[10px] uppercase">
            Institutional Analytics
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-serif leading-[1.1] tracking-tight mb-8">
          Cultivating<br />
          <span className="italic font-light text-[#E2FBCE]">Excellence</span><br />
          Through Data.
        </h1>
        
        <p className="text-lg text-[#FFFDEE]/70 leading-relaxed max-w-md mb-14 font-light">
          Empowering the Kumaraguru Institute of Agriculture with comprehensive historical data, academic performance metrics, and institutional insights to nurture the next generation of agricultural leaders.
        </p>
        
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <button
            onClick={onNavigateToLogin}
            className="px-10 py-5 bg-[#FFFDEE] text-[#0C342C] border border-[#FFFDEE] text-xs font-bold tracking-[0.15em] uppercase hover:bg-transparent hover:text-[#FFFDEE] transition-colors duration-300 rounded-none w-full sm:w-auto text-center"
          >
            Explore Analytics
          </button>
          
          <a
            href="#admissions"
            className="px-10 py-5 bg-transparent border border-[#FFFDEE]/30 text-[#FFFDEE] text-xs font-bold tracking-[0.15em] uppercase hover:border-[#FFFDEE] transition-colors duration-300 rounded-none w-full sm:w-auto text-center"
          >
            Admissions
          </a>
        </div>
      </div>

      {/* Right Cinematic Image Block */}
      <div className="w-full lg:w-7/12 relative min-h-[60vh] lg:min-h-0 bg-[#06231D]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="/kia-campus.jpg"
            alt="Kumaraguru Institute of Agriculture Campus"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-[30s] ease-out"
          />
          {/* Subtle multiplying overlay to deepen shadows and unify with branding */}
          <div className="absolute inset-0 bg-[#0C342C]/20 mix-blend-multiply"></div>
        </div>
        
        {/* Cinematic inner frame overlay */}
        <div className="absolute inset-4 sm:inset-8 border border-[#FFFDEE]/20 pointer-events-none z-10 hidden lg:block"></div>
        
        {/* Caption */}
        <div className="absolute bottom-12 right-12 z-20 text-[#FFFDEE]/80 text-[10px] uppercase tracking-[0.25em] font-bold hidden lg:block">
          Sakthi Nagar, Erode District
        </div>
      </div>
      
    </section>
  );
};
