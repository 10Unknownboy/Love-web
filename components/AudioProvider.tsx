'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { RomanticSynth } from '@/lib/RomanticSynth';

export interface AudioContextType {
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  currentTime: number;
  duration: number;
  seek: (seconds: number) => void;
  trackTitle: string;
  artist: string;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(177); // Default 2m 57s matching Purrple Cat track
  const [isUsingSynth, setIsUsingSynth] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<RomanticSynth | null>(null);

  const trackTitle = 'BIRDS OF A FEATHER';
  const artist = 'Billie Eilish / Purrple Cat';

  // Initialize synth instance
  useEffect(() => {
    synthRef.current = new RomanticSynth();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  const handleAudioError = useCallback(() => {
    console.info('Audio asset unavailable or blocked; activating RomanticSynth fallback.');
    setIsUsingSynth(true);
    if (isPlaying) {
      synthRef.current?.start((t) => setCurrentTime(t));
    }
  }, [isPlaying]);

  const play = useCallback(async () => {
    if (isUsingSynth) {
      synthRef.current?.start((t) => setCurrentTime(t));
      setIsPlaying(true);
      return;
    }

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        const errorName = err instanceof DOMException ? err.name : '';
        if (errorName === 'NotAllowedError' || errorName === 'AbortError') {
          console.info('Audio autoplay was blocked; waiting for user interaction.');
          setIsPlaying(false);
          return;
        }

        console.warn('Audio play failed; switching to RomanticSynth fallback:', err);
        setIsUsingSynth(true);
        synthRef.current?.start((t) => setCurrentTime(t));
        setIsPlaying(true);
      }
    }
  }, [isUsingSynth]);

  const pause = useCallback(() => {
    if (isUsingSynth) {
      synthRef.current?.stop();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, [isUsingSynth]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

  useEffect(() => {
    void play();
  }, [play]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, duration));
      setCurrentTime(clamped);
      if (isUsingSynth) {
        synthRef.current?.seek(clamped);
      } else if (audioRef.current) {
        audioRef.current.currentTime = clamped;
      }
    },
    [duration, isUsingSynth]
  );

  const handleTimeUpdate = () => {
    if (audioRef.current && !isUsingSynth) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        play,
        pause,
        toggle,
        currentTime,
        duration,
        seek,
        trackTitle,
        artist,
      }}
    >
      {/* Hidden persistent HTML5 audio tag */}
      <audio
        ref={audioRef}
        src="/audio/romantic_melody.mp3"
        preload="auto"
        loop
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
      />

      {/* Persistent Floating Mini-Player Pill */}
      <aside
        aria-label="Global music player"
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6B1A3A]/20 bg-white/80 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:shadow-md"
      >
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2 text-xs font-semibold text-[#6B1A3A] focus:outline-none"
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          <span className={`text-sm ${isPlaying ? 'animate-heart-pulse' : ''}`}>
            {isPlaying ? '💕' : '🤍'}
          </span>
          <span className="hidden sm:inline font-heading max-w-[140px] truncate">
            {trackTitle}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FDE8EB]">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </button>
      </aside>

      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
