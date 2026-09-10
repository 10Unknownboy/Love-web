'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { LoveSlider } from '@/components/LoveSlider';
import { LoveGauge } from '@/components/LoveGauge';
import { CatDisplay, getCatThresholdConfig } from '@/components/CatDisplay';

export default function HomePage() {
  const [loveValue, setLoveValue] = useState<number>(0);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Trigger celebration and latch unlock state
  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
    if (typeof window !== 'undefined') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#EC4899', '#6B1A3A', '#BFDBFE', '#FDE8EB'],
        });
      } catch {
        // Graceful fallback for environments lacking canvas support
      }
    }
  }, []);

  // Slider change handler with threshold latching
  const handleSliderChange = useCallback(
    (val: number) => {
      setLoveValue(val);
      if (val >= 200 && !isUnlocked) {
        handleUnlock();
      }
    },
    [isUnlocked, handleUnlock]
  );

  // Retrieve threshold configuration for copy and emotional state
  const catConfig = getCatThresholdConfig(loveValue);

  return (
    <div className="relative w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-5 sm:space-y-6 py-4 sm:py-6 px-4 select-none">
      {/* Decorative Graphic: Paper Airplane (Upper-Left Corner) */}
      <div
        className="absolute -top-3 -left-3 sm:top-2 sm:left-2 md:top-4 md:left-4 z-0 pointer-events-none opacity-60 sm:opacity-90 animate-float"
        aria-hidden="true"
      >
        <div className="relative w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-3xl bg-white/70 p-1.5 shadow-cute border border-[#6B1A3A]/10 backdrop-blur-xs">
          <Image
            src="/images/paper_airplane.jpg"
            alt="Paper Airplane soaring with love trail"
            width={104}
            height={104}
            className="w-full h-full object-cover rounded-2xl"
            priority
          />
        </div>
      </div>

      {/* Decorative Graphic: Kissing Birds (Upper-Right Corner) */}
      <div
        className="absolute -top-3 -right-3 sm:top-2 sm:right-2 md:top-4 md:right-4 z-0 pointer-events-none opacity-60 sm:opacity-90 animate-pulse-heart"
        aria-hidden="true"
      >
        <div className="relative w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-3xl bg-white/70 p-1.5 shadow-cute border border-[#6B1A3A]/10 backdrop-blur-xs">
          <Image
            src="/images/kissing_birds.jpg"
            alt="Two sweet kissing lovebirds"
            width={104}
            height={104}
            className="w-full h-full object-cover rounded-2xl"
            priority
          />
        </div>
      </div>

      {/* Header Tier */}
      <header className="relative z-10 space-y-1.5 max-w-lg mx-auto">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight"
          data-testid="main-heading"
        >
          How much do you love me?
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-cursive text-[#8B264E]">
          {loveValue >= 200
            ? 'You passed the love test! Claim your surprises! 🎉'
            : 'Drag the slider to test your love!'}
        </p>
      </header>

      {/* Central Cat Emotion Reaction Tier */}
      <div className="relative z-10">
        <CatDisplay value={loveValue} unlocked={isUnlocked} size={250} />
      </div>

      {/* Status Badge & Dynamic Reaction Copy Tier */}
      <div className="relative z-10 flex flex-col items-center space-y-1.5">
        <div
          className="inline-flex items-center px-5 py-1 rounded-full bg-white/90 border border-[#6B1A3A]/20 text-[#6B1A3A] font-bold font-heading text-2xl sm:text-3xl shadow-sm tracking-wide"
          data-testid="percentage-badge"
        >
          <span>{loveValue}%</span>
          {loveValue >= 200 && (
            <span className="ml-2 text-xs sm:text-sm uppercase px-2.5 py-0.5 rounded-full bg-[#6B1A3A] text-white font-sans font-semibold animate-pulse">
              love
            </span>
          )}
        </div>
        <p
          className="text-base sm:text-lg font-cursive text-[#6B1A3A] font-medium min-h-[28px]"
          data-testid="threshold-copy"
        >
          {catConfig.reactionText}
        </p>
      </div>

      {/* Semi-Circular Love Gauge Arc */}
      <div className="relative z-10 flex justify-center -my-3">
        <LoveGauge value={loveValue} size={210} showCenterValue={false} />
      </div>

      {/* Interactive Extended Drag Slider Tier */}
      <div className="relative z-10 w-full max-w-md px-2 sm:px-4">
        <LoveSlider
          value={loveValue}
          onChange={handleSliderChange}
          unlocked={isUnlocked}
          onUnlock={handleUnlock}
        />
      </div>

      {/* Action / Next Button Tier with CLS Prevention */}
      <div className="relative z-10 min-h-[56px] flex items-center justify-center pt-1">
        {isUnlocked ? (
          <Link
            href="/hub"
            className="btn-pill animate-unlock-reveal group inline-flex items-center gap-2 shadow-cute"
            data-testid="next-button"
            aria-label="Next step: Proceed to Surprises Hub"
          >
            <span className="font-heading font-semibold text-lg">Next</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 font-heading text-lg"
            >
              &rarr;
            </span>
          </Link>
        ) : (
          <div className="text-xs font-cursive text-[#8B264E]/70 italic tracking-wide">
            Drag past the limit to unlock surprises... 💕
          </div>
        )}
      </div>

      <div className="mt-1 text-xs font-cursive text-[#8B264E]/60 tracking-wide">
          - Made by Manglesh ks...
      </div>
    </div>
  );
}
