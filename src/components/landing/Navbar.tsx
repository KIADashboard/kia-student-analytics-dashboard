import React from 'react';
import { InstitutionLogo } from '../InstitutionLogo';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2FBCE] bg-[#FFFDEE] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center gap-3">
              <InstitutionLogo className="h-14 w-auto" />
              <div className="flex flex-col justify-center">
                <span className="text-[#0C342C] font-bold text-[1.1rem] tracking-wide leading-none uppercase">
                  Kumaraguru
                </span>
                <div className="h-[2px] w-full bg-[#c8953e] my-[3px] opacity-80"></div>
                <span className="text-[#0C342C] font-medium text-[0.65rem] tracking-[0.22em] leading-none uppercase mb-[2px]">
                  Institute of
                </span>
                <span className="text-[#0C342C] font-bold text-[0.85rem] tracking-wide leading-none uppercase">
                  Agriculture
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
