import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Bouquet 🌹 | Surprise 1',
  description: 'A romantic bouquet of red roses surrounded by sweet words of love.',
};

export default function BouquetPage() {
  const quotes = [
    { text: 'You make my heart bloom.', emoji: '🌸', delay: '0s', mdPos: 'md:top-4 md:left-4 lg:left-8' },
    { text: 'I choose you every day', emoji: '💖', delay: '0.5s', mdPos: 'md:top-[42%] md:-translate-y-1/2 md:left-0 lg:left-4' },
    { text: 'Life feels sweeter with you', emoji: '🍯', delay: '1.0s', mdPos: 'md:bottom-6 md:left-4 lg:left-8' },
    { text: 'My love for you keeps growing', emoji: '🌹', delay: '1.5s', mdPos: 'md:top-4 md:right-4 lg:right-8' },
    { text: 'You make every moment sweeter.', emoji: '✨', delay: '2.0s', mdPos: 'md:top-[42%] md:-translate-y-1/2 md:right-0 lg:right-4' },
    { text: 'My heart will always choose you', emoji: '💕', delay: '2.5s', mdPos: 'md:bottom-6 md:right-4 lg:right-8' },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 py-6 select-none">
      {/* Header Tier */}
      <header className="space-y-2 max-w-lg mx-auto">
        <h1
          data-testid="bouquet-heading"
          className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight"
        >
          Your Bouquet
        </h1>
        <p className="text-lg sm:text-2xl font-cursive text-[#8B264E]">
          Fresh blooms gathered just for you
        </p>
      </header>

      {/* Central Interactive Zone: Scalloped Frame & Orbiting Bubbles */}
      <div className="relative w-full max-w-4xl px-4 py-4 sm:py-8 flex flex-col items-center justify-center min-h-[460px]">
        {/* Scalloped / Wavy Border Frame Container around Bouquet */}
        <div
          data-testid="bouquet-frame"
          className="scalloped-frame bg-white/70 backdrop-blur-xs p-6 sm:p-8 relative max-w-md w-full flex items-center justify-center shadow-cute transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <Image
              data-testid="bouquet-image"
              src="/images/bouquet.jpg"
              alt="Lush Bouquet of Red Roses"
              width={320}
              height={320}
              className="rounded-2xl object-cover shadow-sm w-full h-full"
              priority
            />
          </div>
        </div>

        {/* 6 Floating Romantic Sweet Text Bubbles */}
        <div
          data-testid="quote-bubbles-container"
          className="w-full max-w-lg md:max-w-none grid grid-cols-1 sm:grid-cols-2 md:block gap-3 mt-6 md:mt-0"
        >
          {quotes.map((quote, idx) => (
            <div
              key={idx}
              data-testid={`quote-bubble-${idx}`}
              className={`relative md:absolute ${quote.mdPos} bg-white/95 backdrop-blur-sm border border-[#6B1A3A]/20 rounded-full px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-cursive text-[#6B1A3A] font-semibold shadow-cute animate-float transition-all duration-300 hover:scale-105 hover:bg-white hover:border-[#6B1A3A]/40 flex items-center justify-center gap-1.5 z-10`}
              style={{ animationDelay: quote.delay }}
            >
              <span className="text-xs sm:text-sm" aria-hidden="true">{quote.emoji}</span>
              <span>&ldquo;{quote.text}&rdquo;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Return Button to Gift Hub */}
      <div className="pt-2">
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
