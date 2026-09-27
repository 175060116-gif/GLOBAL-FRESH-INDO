import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
  variant?: 'horizontal' | 'badge' | 'icon-only';
  className?: string;
  logoUrl?: string;
  storeName?: string;
  storeTagline?: string;
  storeSlogan?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  inverted = false,
  variant = 'horizontal',
  className = '',
  logoUrl = '/global_fresh_logo.jpg',
  storeName = 'GLOBAL FRESH INDO',
  storeTagline = 'Toko Buah Segar & Distributor Buah Segar',
  storeSlogan = 'Fresh Fruits • Fresh Quality • Fresh Delivery',
}) => {
  const iconDimensions = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
    xl: 'text-2xl md:text-3xl',
  };

  const subSizes = {
    sm: 'text-[9.5px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // If badge variant is requested, render the full official logo emblem
  if (variant === 'badge') {
    return (
      <div className={`relative inline-block select-none group ${className}`}>
        <div className="bg-white rounded-3xl p-3 shadow-md border border-[#E2EBD8] transition-transform duration-300 group-hover:scale-102 flex flex-col items-center max-w-[280px] text-center">
          <img
            src={logoUrl || '/global_fresh_logo.jpg'}
            alt={`Logo Resmi ${storeName}`}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-48 object-contain rounded-2xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}>
      {/* Official Brand Logo Image */}
      <div
        className={`relative ${iconDimensions[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        <div
          className={`w-full h-full rounded-2xl overflow-hidden shadow-xs border flex items-center justify-center p-0.5 ${
            inverted
              ? 'bg-white border-white/40 shadow-sm'
              : 'bg-white border-[#CDE0C4] shadow-xs'
          }`}
        >
          <img
            src={logoUrl || '/global_fresh_logo.jpg'}
            alt={`Logo ${storeName}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Small live fresh indicator pulse */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55AA00] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#087F23] border border-white"></span>
        </span>
      </div>

      {/* Brand Text Typography matching the logo styling */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${titleSizes[size]} ${
                inverted ? 'text-white' : 'text-[#087F23]'
              }`}
            >
              {storeName.split(' ')[0] || 'GLOBAL'}
              <span className={inverted ? 'text-[#FFD54F]' : 'text-[#FF7F00]'}>
                {storeName.split(' ').length > 1 ? ` ${storeName.split(' ').slice(1, -1).join(' ') || storeName.split(' ')[1]}` : ''}
              </span>
            </span>
            {storeName.split(' ').length > 2 && (
              <span
                className={`font-extrabold tracking-wider ${titleSizes[size]} ${
                  inverted ? 'text-green-300' : 'text-[#17331D]'
                }`}
              >
                {storeName.split(' ').slice(-1)[0]}
              </span>
            )}
          </div>

          {showSubtitle && (
            <div className="flex flex-col mt-0.5">
              <span
                className={`font-bold tracking-normal ${subSizes[size]} ${
                  inverted ? 'text-green-100/90' : 'text-[#087F23]'
                }`}
              >
                {storeTagline}
              </span>
              <span
                className={`text-[8.5px] uppercase tracking-wider font-semibold ${
                  inverted ? 'text-white/60' : 'text-[#6B7D70]'
                }`}
              >
                {storeSlogan}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

