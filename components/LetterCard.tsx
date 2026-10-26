'use client';

import React from 'react';
import Image from 'next/image';

export interface LetterCardProps {
  recipient?: string;
  subHeader?: string;
  paragraphs?: string[];
  closing?: string;
  signature?: string;
  catImageSrc?: string;
  catAltText?: string;
  catCaption?: string;
  className?: string;
}

export const DEFAULT_LETTER_PARAGRAPHS = [
  'Heyyy !!',
  'This was the message from where it all started. You were just a dream for me, but now I can see my entire universe in you—as if it were something from a past life, as if we were lovers before. The bond and love we share are so immense that I could just lie in your lap and happily live the rest of my life 🤧',
  "I want you to never be sad with me. I am not perfect, and I never claim to be, because against you, I am nothing! I'm not the most charming, the best-looking, or the best human being, but what I have for you is pure and sheer eternal love. I love you in the most innocent way possible! 💖🫶",
];

export const DEFAULT_LETTER_CLOSING = 'Will you forgive me, my jaaann? 🥺';

export function LetterCard({
  recipient = 'To My Beloved 💕',
  subHeader = 'A message from where it all started',
  paragraphs = DEFAULT_LETTER_PARAGRAPHS,
  closing = DEFAULT_LETTER_CLOSING,
  signature,
  catImageSrc = '/images/cat_ecstatic.jpg',
  catAltText = 'Ecstatic kitten hugging glowing red heart',
  catCaption = 'With all my love!',
  className = '',
}: LetterCardProps) {
  return (
    <article
      data-testid="letter-card"
      aria-label="Heartfelt love letter"
      className={`relative w-full max-w-2xl bg-white/95 rounded-3xl border border-[#6B1A3A]/20 shadow-cute-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${className}`}
    >
      {/* Decorative Stationery Header Bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 pt-6 pb-3 border-b border-pink-100/80 bg-rose-50/40 select-none">
        <span
          data-testid="letter-recipient"
          className="font-heading font-semibold text-xs sm:text-sm tracking-widest uppercase text-[#8B264E] flex items-center gap-1.5"
        >
          <span aria-hidden="true">💌</span> {recipient}
        </span>
        <span
          data-testid="letter-subheader"
          className="font-cursive text-sm sm:text-base text-[#8B264E] font-medium"
        >
          {subHeader}
        </span>
      </div>

      {/* Lined Paper Body Container with Vertical Margin Line */}
      <div className="lined-paper px-6 sm:px-10 py-8 relative">
        {/* Notebook Vertical Margin Line */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-10 sm:left-14 w-[1px] bg-rose-300/40 pointer-events-none"
        />

        {/* Letter Text Content */}
        <div className="pl-6 sm:pl-8 space-y-6 text-left">
          {paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              data-testid={`letter-paragraph-${idx}`}
              className={`font-cursive ${
                idx === 0
                  ? 'font-bold text-2xl sm:text-3xl text-[#8B264E]'
                  : 'text-xl sm:text-2xl text-[#6B1A3A]'
              } leading-[32px] tracking-wide select-text`}
            >
              {paragraph}
            </p>
          ))}

          {/* Romantic Closing Signature */}
          <div className="pt-2 text-right">
            <p
              data-testid="letter-closing"
              className="font-cursive font-bold text-2xl sm:text-3xl text-[#52142D] leading-[32px] select-text"
            >
              {closing}
            </p>
            {signature && (
              <p className="font-cursive text-lg sm:text-xl text-[#8B264E] leading-[32px]">
                {signature}
              </p>
            )}
          </div>
        </div>

        {/* Ecstatic Cat Holding Heart Sticker Dock */}
        <div
          data-testid="letter-cat"
          className="flex justify-center sm:justify-end mt-8 pt-4 border-t border-pink-100"
        >
          <div className="flex items-center gap-3 bg-[#FDE8EB]/80 px-4 py-2 rounded-2xl border border-[#6B1A3A]/15 shadow-sm animate-pulse-heart">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shadow-inner bg-white/50 flex-shrink-0">
              <Image
                src={catImageSrc}
                alt={catAltText}
                width={72}
                height={72}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-bold text-sm text-[#6B1A3A]">
                {catCaption}
              </span>
              <span className="text-xs font-cursive text-[#8B264E]">
                Always by your side
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default LetterCard;
