'use client';

import React, { useState } from 'react';
import { useAudio } from '@/components/AudioProvider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Heart,
  Music,
} from 'lucide-react';

export function AudioPlayerWidget({ className = '' }: { className?: string }) {
  const {
    isPlaying,
    toggle,
    currentTime,
    duration,
    seek,
    trackTitle,
    artist,
  } = useAudio();

  const [isRepeat, setIsRepeat] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Time formatter m:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkipBack = () => {
    // Rewind by 10s or reset to 0
    seek(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    // Skip forward by 10s
    seek(Math.min(duration || 177, currentTime + 10));
  };

  return (
    <div
      data-testid="audio-player-widget"
      className={`bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#6B1A3A]/15 shadow-cute text-left space-y-4 relative overflow-hidden ${className}`}
    >
      {/* Top Header: Spinning Vinyl + Metadata */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
        <div className="flex items-center gap-3">
          {/* Spinning Vinyl Record */}
          <div
            className={`relative w-11 h-11 rounded-full bg-[#20181b] border-2 border-[#6B1A3A]/30 flex items-center justify-center shadow-sm ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
            aria-hidden="true"
          >
            {/* Vinyl grooves */}
            <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#F472B6] flex items-center justify-center">
                <Heart className="w-2 h-2 text-white fill-white" />
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
              <Music className="w-3 h-3" />
              Now Playing
            </span>
            <h3
              data-testid="audio-track-title"
              className="text-lg sm:text-xl font-bold font-heading text-[#6B1A3A] tracking-tight leading-tight mt-0.5"
            >
              {trackTitle || 'BIRDS OF A FEATHER'}
            </h3>
            <p
              data-testid="audio-artist-name"
              className="text-xs sm:text-sm font-cursive text-[#8B264E]"
            >
              {artist || 'Billie Eilish'}
            </p>
          </div>
        </div>

        {/* Mute Indicator */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 text-[#6B1A3A]/70 hover:text-[#6B1A3A] hover:bg-pink-50 rounded-full transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Progress Bar & Scrubbing */}
      <div className="space-y-1.5 pt-1">
        <input
          type="range"
          min={0}
          max={duration || 177}
          step={1}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-[#6B1A3A] focus:outline-none focus:ring-2 focus:ring-[#6B1A3A]/30"
          aria-label="Seek audio track"
          data-testid="audio-seek-slider"
        />
        <div className="flex justify-between text-xs font-mono font-medium text-[#6B1A3A]/70">
          <span data-testid="audio-current-time">{formatTime(currentTime)}</span>
          <span data-testid="audio-duration-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between pt-1">
        {/* Shuffle Visual Toggle */}
        <button
          type="button"
          onClick={() => setIsShuffle(!isShuffle)}
          className={`p-2 rounded-full transition-all ${
            isShuffle
              ? 'text-[#6B1A3A] bg-[#FDE8EB] ring-1 ring-[#6B1A3A]/30'
              : 'text-[#6B1A3A]/40 hover:text-[#6B1A3A] hover:bg-pink-50'
          }`}
          title="Shuffle toggle"
          aria-label="Toggle shuffle"
          aria-pressed={isShuffle}
          data-testid="audio-shuffle-btn"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        {/* Primary Controls Group */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Skip Back */}
          <button
            type="button"
            onClick={handleSkipBack}
            className="p-2 rounded-full text-[#6B1A3A]/80 hover:text-[#6B1A3A] hover:bg-pink-50 transition-colors"
            title="Skip backward 10s"
            aria-label="Skip backward 10 seconds"
            data-testid="audio-skip-back-btn"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={toggle}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6B1A3A] text-white flex items-center justify-center shadow-cute hover:bg-[#8B264E] hover:scale-105 active:scale-95 transition-all duration-200 ${
              isPlaying ? 'ring-4 ring-pink-200' : ''
            }`}
            title={isPlaying ? 'Pause music' : 'Play music'}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            data-testid="audio-play-pause-btn"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          {/* Skip Forward */}
          <button
            type="button"
            onClick={handleSkipForward}
            className="p-2 rounded-full text-[#6B1A3A]/80 hover:text-[#6B1A3A] hover:bg-pink-50 transition-colors"
            title="Skip forward 10s"
            aria-label="Skip forward 10 seconds"
            data-testid="audio-skip-forward-btn"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Repeat Visual Toggle */}
        <button
          type="button"
          onClick={() => setIsRepeat(!isRepeat)}
          className={`p-2 rounded-full transition-all ${
            isRepeat
              ? 'text-[#6B1A3A] bg-[#FDE8EB] ring-1 ring-[#6B1A3A]/30'
              : 'text-[#6B1A3A]/40 hover:text-[#6B1A3A] hover:bg-pink-50'
          }`}
          title="Repeat toggle"
          aria-label="Toggle repeat"
          aria-pressed={isRepeat}
          data-testid="audio-repeat-btn"
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AudioPlayerWidget;
