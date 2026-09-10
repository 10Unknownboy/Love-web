'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAudio } from '@/components/AudioProvider';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

export default function ScrapbookMusicPage() {
  const { isPlaying, toggle, currentTime, duration, seek, trackTitle, artist } = useAudio();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const tickets = [
    { title: 'LOVE PASS', code: 'ADMIT ONE TO MY HEART', bg: 'bg-rose-50' },
    { title: 'ROMANCE TICKET', code: 'SPECIAL DAY FOREVER', bg: 'bg-pink-50' },
    { title: 'LOVE NOTE', code: 'KEEP THIS TICKET IN YOUR HEART', bg: 'bg-amber-50' },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-8 py-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight">
          Scrapbook &amp; Melodies
        </h1>
        <p className="text-lg sm:text-2xl font-cursive text-[#8B264E]">
          A snapshot in time and the song in our hearts
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 items-center">
        {/* Left: Polaroid Frame */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 pb-8 rounded-2xl shadow-polaroid border border-neutral-200 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 overflow-hidden rounded-xl bg-neutral-100">
              <Image
                src="/images/polaroid.jpg"
                alt="Clouds and Hills Memory"
                width={300}
                height={300}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <p className="font-cursive text-xl text-[#6B1A3A] mt-4 text-center">
              Our dreamy moments together 💕
            </p>
          </div>
        </div>

        {/* Right: Music Player Widget & Vintage Tickets */}
        <div className="flex flex-col space-y-6">
          {/* Custom Audio Player Card */}
          <div className="bg-white/80 rounded-3xl p-6 border border-[#6B1A3A]/15 shadow-cute text-left space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                  Now Playing
                </span>
                <h3 className="text-xl font-bold font-heading text-[#6B1A3A]">
                  {trackTitle}
                </h3>
                <p className="text-sm font-cursive text-[#8B264E]">{artist}</p>
              </div>
              <Volume2 className="w-5 h-5 text-[#6B1A3A]/60" />
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-[#6B1A3A]"
                aria-label="Seek track"
              />
              <div className="flex justify-between text-xs font-mono text-[#6B1A3A]/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={toggle}
                className="w-12 h-12 rounded-full bg-[#6B1A3A] text-white flex items-center justify-center shadow-cute hover:scale-105 active:scale-95 transition-transform"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => seek(0)}
                className="p-2 text-[#6B1A3A]/70 hover:text-[#6B1A3A] transition-colors"
                title="Replay"
                aria-label="Replay track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Vintage Romance Tickets */}
          <div className="space-y-2">
            {tickets.map((ticket, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2 rounded-xl border border-dashed border-[#6B1A3A]/30 ${ticket.bg} text-left shadow-sm`}
              >
                <span className="font-heading text-xs font-bold tracking-wider text-[#6B1A3A]">
                  {ticket.title}
                </span>
                <span className="font-mono text-xs text-[#8B264E]">
                  {ticket.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Link href="/hub" className="btn-pill">
          Next &rarr;
        </Link>
      </div>
    </div>
  );
}
