import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface InstitutionLogoProps {
  className?: string;
  imageClassName?: string;
}

export const InstitutionLogo: React.FC<InstitutionLogoProps> = ({ className = '', imageClassName = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span className={`institution-logo-fallback ${className}`} aria-label="Kumaraguru Institute of Agriculture logo"><GraduationCap className="w-5 h-5" /></span>;
  }

  return <img src="/kiwal.png" alt="Kumaraguru Institute of Agriculture" className={`institution-logo ${className} ${imageClassName}`} onError={() => setHasError(true)} />;
};
