import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { LetterCard } from '@/components/LetterCard';

export const metadata: Metadata = {
  title: 'A Letter From My Heart 💕 | Surprise 3',
  description: 'A heartfelt romantic letter written with love and devotion.',
};

export default function LetterPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 py-6 select-none">
      {/* Header Tier */}
      <header className="space-y-2 max-w-lg mx-auto">
        <h1
          data-testid="letter-heading"
          className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight"
        >
          A Letter From My Heart
        </h1>
        <p className="text-lg sm:text-2xl font-cursive text-[#8B264E]">
          Every word written with love
        </p>
      </header>

      {/* Main Lined Paper Letter Card */}
      <div className="w-full max-w-2xl px-4 flex justify-center">
        <LetterCard />
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
