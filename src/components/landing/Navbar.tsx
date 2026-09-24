import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { InstitutionLogo } from '../InstitutionLogo';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Academics', href: '#academics' },
    { name: 'Campus', href: '#campus' },
    { name: 'Research', href: '#research' },
    { name: 'Admissions', href: '#admissions' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2FBCE] bg-[#FFFDEE] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[#0C342C] hover:text-[#076653] px-2 py-2 text-sm font-semibold transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E3EF26] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Sign In Button */}
            <div className="flex items-center ml-4">
              <a
                href="#signin"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full shadow-sm text-sm font-bold text-[#FFFDEE] bg-[#076653] hover:bg-[#06231D] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#076653]"
              >
                Sign In
                <ChevronRight className="ml-2 -mr-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#0C342C] hover:text-[#076653] hover:bg-[#E2FBCE] focus:outline-none transition-colors"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-7 w-7" aria-hidden="true" />
              ) : (
                <Menu className="block h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#FFFDEE] ${isMobileMenuOpen ? 'max-h-96 border-b border-[#E2FBCE] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-4 py-3 rounded-md text-base font-semibold text-[#0C342C] hover:text-[#076653] hover:bg-[#E2FBCE] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="mt-6 px-4">
            <a
              href="#signin"
              className="flex w-full items-center justify-center px-4 py-3 rounded-md shadow-sm text-base font-bold text-[#FFFDEE] bg-[#076653] hover:bg-[#06231D] transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
