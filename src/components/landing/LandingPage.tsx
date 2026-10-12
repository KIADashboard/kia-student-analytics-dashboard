import React from 'react';

export const LandingPage: React.FC<{ onNavigateToLogin: () => void }> = ({ onNavigateToLogin }) => {
  return (
    <div className="kia-landing relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#060f08]">

      {/* ── Background: blurred campus photo with deep forest-green overlay ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.04]"
        style={{ backgroundImage: "url('/kia-campus.jpg')", filter: 'blur(6px) brightness(0.55)' }}
      />
      {/* Dark green gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060f08]/70 via-[#0a1a0c]/55 to-[#060f08]/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#060f08]/60 via-transparent to-[#0d2010]/50" />
      {/* Bottom-heavy vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(4,10,5,0.85)_0%,transparent_70%)]" />
      {/* Subtle top vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_30%_at_50%_0%,rgba(4,10,5,0.65)_0%,transparent_70%)]" />

      {/* ── Ambient decorative particles (gold tones) ── */}
      <div className="absolute top-[15%] left-[8%] w-72 h-72 rounded-full bg-[#c5a059]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[18%] right-[6%] w-96 h-96 rounded-full bg-[#c5a059]/4 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-[#1a4020]/40 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[30%] left-[12%] w-56 h-56 rounded-full bg-[#1a4020]/30 blur-2xl pointer-events-none" />

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center py-20">

        {/* Shield Logo */}
        <div className="mb-7 p-4 rounded-2xl bg-white/[0.05] border border-white/[0.09] shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <img
            src="/kiwal.png"
            alt="KIA Shield Logo"
            className="w-20 h-20 md:w-[100px] md:h-[100px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Institution Name */}
        <h1 className="text-4xl md:text-5xl lg:text-[4.25rem] font-serif text-[#faf9f6] font-normal leading-[1.12] tracking-[0.01em] drop-shadow-2xl mb-5">
          Kumaraguru Institute of Agriculture
        </h1>

        {/* Thin gold divider */}
        <div className="w-16 h-[2px] bg-[#c5a059] mb-6 opacity-90 shadow-[0_0_12px_rgba(197,160,89,0.4)]" />

        {/* Slogan */}
        <p className="text-base md:text-[1.125rem] text-[#e8e6de]/85 font-light leading-relaxed mb-12 max-w-2xl drop-shadow-lg tracking-[0.01em]">
          Pioneering agricultural education and academic excellence.<br className="hidden sm:block" />
          Empowering the next generation of leaders to cultivate a sustainable future.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
          {/* Gold Login button */}
          <button
            id="landing-login-btn"
            onClick={onNavigateToLogin}
            className="kia-btn-gold w-full sm:w-auto min-w-[11rem] px-10 py-[0.9rem] bg-[#c5a059] hover:bg-[#d6b36a] active:bg-[#b89048] text-[#0a150c] font-semibold text-base tracking-wide rounded-lg shadow-[0_4px_20px_rgba(197,160,89,0.35)] hover:shadow-[0_6px_28px_rgba(197,160,89,0.5)] border border-[#c5a059]/60 transform hover:-translate-y-0.5 transition-all duration-200 ease-out"
          >
            Login
          </button>

          {/* Dark transparent Admissions button */}
          <button
            id="landing-admissions-btn"
            onClick={() => window.open('https://kia.ac.in', '_blank')}
            className="w-full sm:w-auto min-w-[11rem] px-10 py-[0.9rem] bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.16] text-[#faf9f6] border border-white/20 hover:border-white/40 backdrop-blur-md font-medium text-base tracking-wide rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-out"
          >
            Admissions
          </button>
        </div>
      </div>

      {/* ── Footer watermark ── */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-white/30 tracking-[0.15em] uppercase font-medium z-10 whitespace-nowrap">
        Kumaraguru Institute of Agriculture &nbsp;·&nbsp; Academic Portal
      </p>
    </div>
  );
};
