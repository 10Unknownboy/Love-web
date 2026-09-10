'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AudioPlayerWidget } from '@/components/AudioPlayerWidget';
import { RomanceTicket } from '@/components/RomanceTicket';
import { Sparkles, Heart } from 'lucide-react';

export default function ScrapbookMusicPage() {
  const tickets = [
    {
      title: 'LOVE PASS',
      subtitle: 'ADMIT ONE TO MY HEART',
      serialNumber: '№ 0214-LOVE',
      variant: 'rose' as const,
      rotation: '-rotate-1',
    },
    {
      title: 'ROMANCE TICKET',
      subtitle: 'SPECIAL DAY',
      serialNumber: '№ 0520-DATE',
      variant: 'pink' as const,
      rotation: 'rotate-1',
    },
    {
      title: 'LOVE NOTE',
      subtitle: 'KEEP THIS TICKET',
      serialNumber: '№ 1314-HEART',
      variant: 'cream' as const,
      rotation: '-rotate-0.5',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-8 py-6 relative select-none">
      {/* Header */}
      <header className="space-y-2 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[#6B1A3A]/15 text-xs font-heading font-semibold text-[#8B264E] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
          <span>Surprise 2 • Memories &amp; Melodies</span>
        </div>
        <h1
          data-testid="scrapbook-heading"
          className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight"
        >
          Scrapbook &amp; Melodies
        </h1>
        <p className="text-lg sm:text-2xl font-cursive text-[#8B264E]">
          A snapshot in time and the song in our hearts
        </p>
      </header>

      {/* Scrapbook Main Stage: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl px-4 items-start">
        {/* Left Column: Polaroid Photo Card with Scrapbook Accents */}
        <div className="flex flex-col items-center relative">
          {/* Decorative Floral Graphic (Top-Left) */}
          <div className="absolute -top-4 -left-3 sm:-left-6 z-20 pointer-events-none opacity-80" aria-hidden="true">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-pink-400"
            >
              <circle cx="24" cy="24" r="7" fill="#F472B6" />
              <circle cx="24" cy="12" r="6" fill="#FBCFE8" />
              <circle cx="24" cy="36" r="6" fill="#FBCFE8" />
              <circle cx="12" cy="24" r="6" fill="#FBCFE8" />
              <circle cx="36" cy="24" r="6" fill="#FBCFE8" />
              <circle cx="24" cy="24" r="3" fill="#6B1A3A" />
            </svg>
          </div>

          {/* Polaroid Frame */}
          <div
            data-testid="polaroid-frame"
            className="relative bg-white p-4 pb-7 rounded-2xl shadow-polaroid border border-neutral-200/80 transform -rotate-2 hover:rotate-0 transition-transform duration-300 w-full max-w-[340px] sm:max-w-[360px]"
          >
            {/* Washi Tape Strip on Top */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-pink-200/80 backdrop-blur-[1px] border-t border-b border-pink-300/60 transform -rotate-1 shadow-xs pointer-events-none"
              style={{
                clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
              }}
              aria-hidden="true"
            />

            {/* Photo Container */}
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-neutral-100 border border-neutral-100">
              <Image
                data-testid="polaroid-image"
                src="/images/polaroid.jpg"
                alt="Clouds and Hills Memory"
                fill
                sizes="(max-width: 640px) 300px, 340px"
                className="object-cover"
                priority
              />
            </div>

            {/* Vintage Polaroid Caption */}
            <p
              data-testid="polaroid-caption"
              className="font-cursive text-xl sm:text-2xl text-[#6B1A3A] mt-4 text-center leading-snug"
            >
              Birds of a feather, together forever 💕
            </p>
          </div>

          {/* Decorative Pressed Leaf / Flower Accent */}
          <div className="flex items-center gap-1.5 mt-3 text-xs font-heading text-[#8B264E]/80">
            <Heart className="w-3.5 h-3.5 fill-[#F472B6] text-[#F472B6]" />
            <span>Cherished Moment</span>
          </div>
        </div>

        {/* Right Column: Audio Player Widget & Vintage Romance Tickets */}
        <div className="flex flex-col space-y-6 w-full">
          {/* Functional Audio Player Widget */}
          <AudioPlayerWidget />

          {/* Vintage Romance Tickets Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#6B1A3A]">
                Romance Keepsakes
              </span>
              <span className="text-[11px] font-cursive text-[#8B264E]">
                3 Special Vouchers
              </span>
            </div>

            <div className="space-y-2.5" data-testid="romance-tickets-container">
              {tickets.map((ticket, i) => (
                <RomanceTicket
                  key={i}
                  title={ticket.title}
                  subtitle={ticket.subtitle}
                  serialNumber={ticket.serialNumber}
                  variant={ticket.variant}
                  rotation={ticket.rotation}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Return to Hub Button */}
      <div className="pt-4">
        <Link
          href="/hub"
          className="btn-pill inline-flex items-center gap-2 group shadow-cute"
          data-testid="next-button"
          aria-label="Next step: Return to Gift Hub"
        >
          <span>Next</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
