'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export interface RomanceTicketProps {
  title: string;
  subtitle: string;
  serialNumber?: string;
  variant?: 'rose' | 'pink' | 'cream';
  rotation?: string;
  className?: string;
}

const variantStyles = {
  rose: 'bg-[#FFF0F4] border-[#6B1A3A]/25',
  pink: 'bg-[#FDF2F6] border-[#6B1A3A]/25',
  cream: 'bg-[#FFF9EE] border-[#6B1A3A]/25',
};

export function RomanceTicket({
  title,
  subtitle,
  serialNumber = '№ 0214',
  variant = 'pink',
  rotation = 'rotate-0',
  className = '',
}: RomanceTicketProps) {
  return (
    <div
      data-testid={`romance-ticket-${title.toLowerCase().replace(/\s+/g, '-')}`}
      aria-label={`${title} ${subtitle}`}
      className={`relative flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-dashed shadow-sm transition-all duration-300 hover:shadow-cute hover:scale-[1.02] hover:rotate-0 cursor-default overflow-hidden ${variantStyles[variant]} ${rotation} ${className}`}
    >
      {/* Left Perforation Notch */}
      <span
        aria-hidden="true"
        className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FDE8EB] border border-[#6B1A3A]/25 pointer-events-none"
      />
      {/* Right Perforation Notch */}
      <span
        aria-hidden="true"
        className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FDE8EB] border border-[#6B1A3A]/25 pointer-events-none"
      />

      {/* Main Ticket Content */}
      <div className="flex items-center gap-3 pl-1 sm:pl-2">
        <div className="w-8 h-8 rounded-full bg-white/80 border border-[#6B1A3A]/15 flex items-center justify-center flex-shrink-0 text-[#6B1A3A]">
          <Heart className="w-4 h-4 fill-[#6B1A3A]/20" />
        </div>
        <div className="text-left">
          <h3 className="font-heading text-xs sm:text-sm font-bold tracking-wider text-[#6B1A3A] uppercase inline-flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span>{title}</span>{' '}
            <span className="font-semibold tracking-wide text-[#8B264E]">{subtitle}</span>
          </h3>
          <p className="text-[10px] font-mono tracking-widest text-[#6B1A3A]/60 uppercase mt-0.5">
            NON-TRANSFERABLE • VALID FOREVER 💕
          </p>
        </div>
      </div>

      {/* Perforated Divider & Stub */}
      <div className="flex items-center gap-2 pl-3 border-l border-dashed border-[#6B1A3A]/30 pr-1 sm:pr-2 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <span className="block font-mono text-[10px] tracking-widest font-bold text-[#6B1A3A]/80">
            {serialNumber}
          </span>
          <span className="block text-[9px] font-heading text-[#8B264E] uppercase">
            Pass
          </span>
        </div>
        <Sparkles className="w-4 h-4 text-[#8B264E]/60 hidden sm:block" />
      </div>
    </div>
  );
}

export default RomanceTicket;
