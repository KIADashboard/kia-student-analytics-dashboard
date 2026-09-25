import React from 'react';

export const InstitutionHighlights: React.FC = () => {
  const highlights = [
    { label: 'Established', value: '2014' },
    { label: 'Campus Area', value: '131', suffix: 'Acres' },
    { label: 'Faculty & Scientists', value: '30+' },
    { label: 'Laboratories', value: '18' },
  ];

  return (
    <section className="w-full bg-[#FFFDEE] py-24 lg:py-32 border-b border-[#0C342C]/10">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Section Intro */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-6 mb-8">
              <span className="w-12 h-px bg-[#0C342C]/30"></span>
              <span className="text-[#076653] font-semibold tracking-[0.25em] text-[10px] uppercase">
                At a Glance
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0C342C] leading-[1.2]">
              Cultivating the next generation of <span className="italic font-light text-[#076653]">agricultural leadership</span> through rigorous academics and research.
            </h2>
          </div>
          <div className="lg:max-w-xs text-[#06231D]/70 text-sm font-light leading-relaxed">
            The Kumaraguru Institute of Agriculture has grown from its founding vision into a premier institution dedicated to transforming the agricultural landscape of Tamil Nadu and beyond.
          </div>
        </div>

        {/* Highlights Row */}
        <div className="border-t border-[#0C342C]/20 pt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {highlights.map((highlight, index) => (
              <div 
                key={index} 
                className={`flex flex-col gap-4 ${
                  index !== 0 ? 'lg:border-l lg:border-[#0C342C]/10 lg:pl-10' : ''
                }`}
              >
                <div className="text-5xl lg:text-6xl font-serif text-[#0C342C] tracking-tight">
                  {highlight.value}
                  {highlight.suffix && (
                    <span className="text-xl lg:text-2xl font-light text-[#06231D]/50 ml-2">
                      {highlight.suffix}
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#076653]">
                  {highlight.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
