'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface GiftBoxCardProps {
  id?: number | string;
  title: string;
  subtitle: string;
  description?: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  index?: number;
  delay?: number;
  badgeText?: string;
  className?: string;
  testId?: string;
}

export function GiftBoxCard({
  id,
  title,
  subtitle,
  description,
  href,
  imageSrc = '/images/gift_box.jpg',
  imageAlt,
  index = 0,
  delay,
  badgeText = 'Open Gift',
  className = '',
  testId,
}: GiftBoxCardProps) {
  // Stagger bounce animation delay so the 3 gift boxes don't bounce identically
  const animDelay = delay ?? index * 0.25;
  const cardTestId = testId ?? (id ? `gift-box-card-${id}` : 'gift-box-card');

  return (
    <Link
      href={href}
      className={`group relative flex flex-col items-center text-center justify-between p-6 sm:p-7 rounded-3xl bg-white/80 hover:bg-white/95 backdrop-blur-xs border-2 border-[#BFDBFE]/70 hover:border-[#F472B6]/80 shadow-cute hover:shadow-gift-hover hover:scale-105 transition-all duration-300 ease-out transform hover:-translate-y-2 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F472B6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDE8EB] ${className}`}
      data-testid={cardTestId}
      aria-label={`Open ${title}: ${subtitle}. ${description ?? ''}`}
    >
      {/* Top Ribbon Badge */}
      <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/90 border border-pink-200/80 text-xs font-heading font-semibold text-[#6B1A3A] tracking-wider uppercase shadow-2xs">
        <span aria-hidden="true" className="text-pink-500">
          🎁
        </span>
        <span>{title}</span>
      </div>

      {/* Gift Box Image with Cute Bounce & Halo Glow */}
      <div
        className="relative w-36 h-36 sm:w-40 sm:h-40 mb-4 flex items-center justify-center animate-cute-bounce group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 ease-out"
        style={{ animationDelay: `${animDelay}s` }}
      >
        {/* Soft Sky Blue & Rose Halo Glow */}
        <div
          className="absolute inset-2 bg-gradient-to-tr from-[#BFDBFE]/50 to-[#FBCFE8]/40 rounded-full blur-xl -z-10 group-hover:from-[#BFDBFE]/80 group-hover:to-[#F472B6]/50 transition-colors duration-300"
          aria-hidden="true"
        />
        <Image
          src={imageSrc}
          alt={imageAlt || `${subtitle} - ${title} gift box`}
          width={150}
          height={150}
          className="rounded-2xl object-cover drop-shadow-md select-none"
          priority={index === 0 || index === 1}
        />
      </div>

      {/* Card Typography Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#6B1A3A] group-hover:text-[#52142D] tracking-tight transition-colors">
          {subtitle}
        </h2>
        {description && (
          <p className="text-sm sm:text-base font-cursive text-[#8B264E] leading-snug line-clamp-2 px-1">
            {description}
          </p>
        )}
      </div>

      {/* Interactive Action Pill / CTA */}
      <div className="mt-5 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white border border-[#6B1A3A]/25 text-xs sm:text-sm font-heading font-semibold text-[#6B1A3A] shadow-2xs group-hover:bg-[#6B1A3A] group-hover:text-white group-hover:border-[#6B1A3A] group-hover:shadow-sm transition-all duration-200">
        <span>{badgeText}</span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </div>
    </Link>
  );
}

export default GiftBoxCard;
