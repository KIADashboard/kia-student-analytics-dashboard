import React from 'react';

export const LandingPage: React.FC<{ onNavigateToLogin: () => void }> = ({ onNavigateToLogin }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0d1c13]">
      {/* Full-screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 scale-[1.02]"
        style={{ backgroundImage: "url('/kia-campus.jpg')" }}
      />
      
      {/* Full-screen Subtle Glass & Forest Green Gradient Overlay */}
      <div className="absolute inset-0 bg-[#0a170e]/50 backdrop-blur-[6px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a170e]/80 via-[#153320]/60 to-[#0a170e]/90 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a170e] via-transparent to-[#0a170e]/40" />

      {/* Main Content */}
      <div className="relative z-10 w-full px-6 md:px-12 flex flex-col items-center justify-center text-center">
        
        {/* Logo */}
        <div className="mb-8 p-5 rounded-3xl bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <img 
            src="/kiwal.png" 
            alt="KIA Logo" 
            className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#faf9f6] font-medium leading-tight tracking-wide drop-shadow-xl mb-6">
          Kumaraguru Institute of <span className="text-[#faf9f6] block sm:inline mt-2 sm:mt-0">Agriculture</span>
        </h1>
        
        {/* Thin Gold Divider */}
        <div className="w-16 h-[2px] bg-[#c5a059] mb-8 shadow-sm" />

        {/* Tagline */}
        <p className="text-lg md:text-xl text-[#e6e4dc] font-light leading-relaxed mb-12 max-w-3xl drop-shadow-lg px-4">
          Pioneering agricultural education and academic excellence. 
          Empowering the next generation of leaders to cultivate a sustainable future.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
          <button 
            onClick={onNavigateToLogin}
            className="w-full sm:w-auto px-10 py-3.5 bg-[#c5a059] hover:bg-[#d1ad66] text-[#0a170e] font-semibold text-lg tracking-wide rounded shadow-md hover:shadow-xl border border-transparent hover:border-white/40 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            Login
          </button>
          
          <button 
            onClick={() => window.open('https://kia.ac.in', '_blank')}
            className="w-full sm:w-auto px-10 py-3.5 bg-white/5 hover:bg-white/10 text-[#faf9f6] border border-white/20 hover:border-white/50 backdrop-blur-md font-medium text-lg tracking-wide rounded shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            Admissions
          </button>
        </div>

      </div>
    </div>
  );
};
