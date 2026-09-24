import React from 'react';
import { ArrowRight, BookOpen, LineChart } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#FFFDEE] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Content Area (Editorial & Typography Focus) */}
          <div className="flex-1 w-full flex flex-col justify-center z-10">
            
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-px bg-[#076653]"></div>
              <span className="text-[#076653] font-semibold tracking-[0.2em] text-xs uppercase">
                KIA Academic Analytics
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#0C342C] leading-[1.15] tracking-tight mb-8">
              Cultivating Excellence <br className="hidden lg:block" />
              Through Data.
            </h1>
            
            <p className="text-lg text-[#06231D]/80 leading-relaxed max-w-xl mb-12 font-light">
              Empowering the Kumaraguru Institute of Agriculture with comprehensive historical data, academic performance metrics, and institutional insights to nurture the next generation of agricultural leaders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="#platform"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-[#FFFDEE] bg-[#0C342C] hover:bg-[#076653] transition-colors rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FFFDEE] focus:ring-[#076653]"
              >
                Explore Analytics
                <ArrowRight className="ml-3 h-4 w-4" />
              </a>
              
              <a
                href="#admissions"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-[#0C342C] bg-transparent border border-[#0C342C] hover:bg-[#E2FBCE] transition-colors rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FFFDEE] focus:ring-[#0C342C]"
              >
                Admissions
              </a>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#0C342C]/10 pt-10">
              <div>
                <div className="flex items-center gap-3 text-[#076653] mb-4">
                  <LineChart className="w-5 h-5 stroke-[1.5]" />
                  <h3 className="font-semibold text-xs uppercase tracking-[0.15em] text-[#0C342C]">Performance</h3>
                </div>
                <p className="text-[#06231D]/75 text-sm leading-relaxed font-light">
                  Monitor real-time academic metrics and progressive cohort analysis precisely.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 text-[#076653] mb-4">
                  <BookOpen className="w-5 h-5 stroke-[1.5]" />
                  <h3 className="font-semibold text-xs uppercase tracking-[0.15em] text-[#0C342C]">Historical Data</h3>
                </div>
                <p className="text-[#06231D]/75 text-sm leading-relaxed font-light">
                  Discover longitudinal insights spanning across all semesters and departments.
                </p>
              </div>
            </div>
            
          </div>

          {/* Right Image Area (Structured Asset Container) */}
          <div className="flex-1 w-full relative">
            <div className="relative aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden border border-[#076653]/30 shadow-xl shadow-[#0C342C]/5 bg-[#E2FBCE]">
              <img
                src="/kia-campus.jpg"
                alt="Kumaraguru Institute of Agriculture Campus"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Subtle decorative offset border to reinforce agricultural identity layout */}
            <div className="absolute -z-10 -bottom-5 -right-5 w-full h-full rounded-2xl border border-[#076653]/15 bg-[#FFFDEE]"></div>
          </div>

        </div>
      </div>
    </section>
  );
};
