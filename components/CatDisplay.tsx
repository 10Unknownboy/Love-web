'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

export type CatEmotionState = 'shy' | 'crying' | 'confused' | 'happy' | 'ecstatic';

export interface CatThresholdConfig {
  state: CatEmotionState;
  min: number;
  max: number;
  imageSrc: string;
  altText: string;
  reactionText: string;
  subText: string;
  badgeLabel: string;
  animationClass: string;
}

export const CAT_THRESHOLDS: Record<CatEmotionState, CatThresholdConfig> = {
  shy: {
    state: 'shy',
    min: 0,
    max: 13.99,
    imageSrc: '/images/cat_shy.jpg',
    altText: 'Shy kitten looking unsure',
    reactionText: 'Only that much?',
    subText: 'Drag the slider to test your love!',
    badgeLabel: '0%',
    animationClass: 'animate-float',
  },
  crying: {
    state: 'crying',
    min: 14,
    max: 54.99,
    imageSrc: '/images/cat_crying.jpg',
    altText: 'Skeptical crying kitten',
    reactionText: 'Half? Seriously?',
    subText: 'Is that all the love you have for me?!',
    badgeLabel: '14%',
    animationClass: 'animate-wiggle',
  },
  confused: {
    state: 'confused',
    min: 55,
    max: 80.99,
    imageSrc: '/images/cat_confused.jpg',
    altText: 'Curious kitten perking up',
    reactionText: "Aww, that's more like it!",
    subText: 'Now we are getting somewhere!',
    badgeLabel: '55%',
    animationClass: 'hover:scale-105 transition-transform duration-200',
  },
  happy: {
    state: 'happy',
    min: 81,
    max: 199.99,
    imageSrc: '/images/cat_happy.jpg',
    altText: 'Happy celebrating kitten with sparkling eyes',
    reactionText: 'love',
    subText: 'So much pure love! Keep pulling to the limit!',
    badgeLabel: '81%',
    animationClass: 'animate-cute-bounce',
  },
  ecstatic: {
    state: 'ecstatic',
    min: 200,
    max: Infinity,
    imageSrc: '/images/cat_ecstatic.jpg',
    altText: 'Ecstatic kitten hugging glowing red heart with LOVE',
    reactionText: 'Correct answer!',
    subText: '200% LOVE unlocked!',
    badgeLabel: '200% love',
    animationClass: 'animate-pulse-heart',
  },
};

export function getCatThresholdConfig(value: number): CatThresholdConfig {
  if (value >= 200) return CAT_THRESHOLDS.ecstatic;
  if (value >= 81) return CAT_THRESHOLDS.happy;
  if (value >= 55) return CAT_THRESHOLDS.confused;
  if (value >= 14) return CAT_THRESHOLDS.crying;
  return CAT_THRESHOLDS.shy;
}

export interface CatDisplayProps {
  value: number;
  unlocked?: boolean;
  className?: string;
  size?: number;
}

export function CatDisplay({
  value,
  unlocked = false,
  className = '',
  size = 280,
}: CatDisplayProps) {
  const currentConfig = useMemo(() => getCatThresholdConfig(value), [value]);
  const isOverdrive = value > 100;
  const isMaxUnlocked = value >= 200 || unlocked;
  const isUltimateSparkle = value >= 500;

  return (
    <div
      data-testid="cat-display"
      className={`relative rounded-3xl bg-white/70 backdrop-blur-md p-4 shadow-cute border border-[#6B1A3A]/15 flex items-center justify-center select-none overflow-hidden transition-all duration-300 ${
        isMaxUnlocked ? 'ring-4 ring-[#F472B6]/40 shadow-cute-lg' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Cat Reaction: ${currentConfig.altText}`}
    >
      {/* Decorative background glow for overdrive/ecstatic */}
      {isOverdrive && (
        <div
          className={`absolute inset-0 bg-gradient-to-tr from-pink-200/40 via-transparent to-rose-200/40 pointer-events-none transition-opacity duration-300 ${
            isMaxUnlocked ? 'opacity-100 animate-pulse' : 'opacity-60'
          }`}
        />
      )}

      {/* Floating heart particles at 200% */}
      {isMaxUnlocked && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-20"
          aria-hidden="true"
        >
          <span className="absolute top-2 left-4 text-xl animate-float">💖</span>
          <span
            className="absolute top-3 right-5 text-lg animate-float"
            style={{ animationDelay: '0.6s' }}
          >
            ✨
          </span>
          <span
            className="absolute bottom-4 left-6 text-base animate-float"
            style={{ animationDelay: '1.2s' }}
          >
            💕
          </span>
          <span
            className="absolute bottom-5 right-4 text-xl animate-float"
            style={{ animationDelay: '0.3s' }}
          >
            ❤️
          </span>
        </div>
      )}

      {isUltimateSparkle && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-30 animate-pulse"
          aria-hidden="true"
        >
          <span className="absolute top-8 left-10 text-3xl animate-ping">✨</span>
          <span
            className="absolute top-12 right-8 text-2xl animate-spin"
            style={{ animationDuration: '0.8s' }}
          >
            ✨
          </span>
          <span
            className="absolute bottom-10 left-10 text-2xl animate-ping"
            style={{ animationDelay: '0.2s' }}
          >
            💫
          </span>
          <span
            className="absolute bottom-8 right-10 text-3xl animate-spin"
            style={{ animationDuration: '0.7s', animationDelay: '0.15s' }}
          >
            ✨
          </span>
        </div>
      )}

      {/* Stacked preloaded cat images for 0ms instant swapping */}
      {(Object.keys(CAT_THRESHOLDS) as CatEmotionState[]).map((stateKey) => {
        const item = CAT_THRESHOLDS[stateKey];
        const isActive = item.state === currentConfig.state;

        return (
          <div
            key={item.state}
            data-testid={`cat-state-${item.state}`}
            className={`absolute inset-4 transition-opacity duration-75 ease-out ${
              isActive
                ? 'opacity-100 z-10 pointer-events-auto'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={item.imageSrc}
              alt={item.altText}
              fill
              sizes="(max-width: 640px) 256px, 288px"
              className={`rounded-2xl object-cover transition-transform duration-200 ${
                isActive ? item.animationClass : ''
              }`}
              priority
            />
          </div>
        );
      })}
    </div>
  );
}

export interface CatReactionTextProps {
  value: number;
  unlocked?: boolean;
  className?: string;
}

export function CatReactionText({
  value,
  unlocked = false,
  className = '',
}: CatReactionTextProps) {
  const currentConfig = useMemo(() => getCatThresholdConfig(value), [value]);
  const isMax = value >= 500 || unlocked;

  return (
    <div
      data-testid="cat-reaction-container"
      className={`flex flex-col items-center text-center space-y-1 select-none ${className}`}
      aria-live="polite"
      role="status"
    >
      {/* Primary Reaction Headline */}
      <p
        data-testid="cat-reaction-text"
        key={currentConfig.reactionText}
        className={`text-2xl sm:text-3xl font-heading font-bold tracking-wide transition-all duration-200 ${
          isMax
            ? 'text-[#6B1A3A] scale-105 drop-shadow-sm animate-cute-bounce'
            : 'text-[#6B1A3A]'
        }`}
      >
        {currentConfig.reactionText}
      </p>

      {/* Cheering / Narrative Subtitle */}
      <p
        data-testid="cat-subtext"
        className="text-base sm:text-lg font-cursive text-[#8B264E] max-w-xs transition-opacity duration-200"
      >
        {currentConfig.subText}
      </p>
    </div>
  );
}

export default CatDisplay;
