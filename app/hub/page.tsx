import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { GiftBoxCard } from '@/components/GiftBoxCard';

export const metadata: Metadata = {
  title: 'Gift Hub 💕 | Surprises Waiting For You',
  description: 'Choose from 3 special romantic surprises unlocked by passing the love test.',
};

export default function HubPage() {
  const gifts = [
    {
      id: 1,
      title: 'Surprise 1',
      subtitle: 'Your Bouquet',
      href: '/surprise/1',
      description: 'A sweet bouquet of fresh roses gathered just for you',
      imageSrc: '/images/gift_box.jpg',
    },
    {
      id: 2,
      title: 'Surprise 2',
      subtitle: 'Scrapbook & Music Player',
      href: '/surprise/2',
      description: 'Our special song and dreamy polaroid moments together',
      imageSrc: '/images/gift_box.jpg',
    },
    {
      id: 3,
      title: 'Surprise 3',
      subtitle: 'A Letter From My Heart',
      href: '/surprise/3',
      description: 'Handwritten romantic words crafted straight from my heart',
      imageSrc: '/images/gift_box.jpg',
    },
  ];

  return (
    <div className="relative w-full max-w-5xl flex flex-col items-center justify-between text-center space-y-8 sm:space-y-10 py-6 sm:py-8 px-4 select-none">
      {/* Decorative Graphic: Paper Airplane (Upper-Left Corner) */}
      <div
        className="absolute -top-3 -left-3 sm:top-2 sm:left-2 md:top-4 md:left-4 z-0 pointer-events-none opacity-50 sm:opacity-80 animate-float"
        aria-hidden="true"
      >
        <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-white/70 p-1.5 shadow-cute border border-[#6B1A3A]/10 backdrop-blur-xs">
          <Image
            src="/images/paper_airplane.jpg"
            alt="Paper Airplane soaring with love trail"
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Decorative Graphic: Kissing Birds (Upper-Right Corner) */}
      <div
        className="absolute -top-3 -right-3 sm:top-2 sm:right-2 md:top-4 md:right-4 z-0 pointer-events-none opacity-50 sm:opacity-80 animate-pulse-heart"
        aria-hidden="true"
      >
        <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-white/70 p-1.5 shadow-cute border border-[#6B1A3A]/10 backdrop-blur-xs">
          <Image
            src="/images/kissing_birds.jpg"
            alt="Two sweet kissing lovebirds"
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Header Tier */}
      <header className="relative z-10 space-y-2 sm:space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 border border-[#6B1A3A]/15 text-xs sm:text-sm font-heading font-semibold text-[#6B1A3A] shadow-xs">
          <span>💖</span>
          <span>Love Test Cleared</span>
        </div>
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-bold font-heading text-[#6B1A3A] tracking-tight"
          data-testid="hub-heading"
        >
          You passed the love test
        </h1>
        <p className="text-lg sm:text-2xl md:text-3xl font-cursive text-[#8B264E]">
          Your surprises are waiting for you
        </p>
      </header>

      {/* 3 Interactive Gift Boxes Grid Tier (Desktop: 3x1, Mobile: 1x3) */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl px-2 sm:px-4"
        data-testid="gift-box-grid"
      >
        {gifts.map((gift, idx) => (
          <GiftBoxCard
            key={gift.id}
            id={gift.id}
            title={gift.title}
            subtitle={gift.subtitle}
            description={gift.description}
            href={gift.href}
            imageSrc={gift.imageSrc}
            index={idx}
            testId={`gift-box-card-${gift.id}`}
          />
        ))}
      </div>

      {/* Navigation Return Button Tier */}
      <div className="relative z-10 pt-2 sm:pt-4">
        <Link
          href="/"
          className="btn-pill inline-flex items-center gap-2 shadow-cute"
          data-testid="back-to-slider"
          aria-label="Back to Love Slider"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to Love Slider</span>
        </Link>
      </div>
    </div>
  );
}
