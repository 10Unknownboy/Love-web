'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export interface SliderProps {
  value: number; // 0 to 500
  onChange: (value: number) => void;
  unlocked: boolean; // true when value >= 500
  onUnlock: () => void;
  className?: string;
  disabled?: boolean;
}

export function LoveSlider({
  value,
  onChange,
  unlocked,
  onUnlock,
  className = '',
  disabled = false,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  // Constants for extended drag physics
  // W_OVERDRIVE: Extra horizontal drag pixels needed past track end to scale from 100% to 500%
  const W_OVERDRIVE = 160;
  // MAX_THUMB_OVERHANG: Maximum visual pixel breakout for thumb past track boundary
  const MAX_THUMB_OVERHANG = 64;

  const calculateValueFromPointer = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const trackLeft = rect.left;
      const trackWidth = rect.width;

      if (trackWidth <= 0) return value;

      const x = clientX - trackLeft;

      if (x <= 0) {
        return 0;
      }

      if (x <= trackWidth) {
        // Normal track: 0% to 100%
        const ratio = x / trackWidth;
        return Math.round(ratio * 100);
      }

      // Overdrive breakout zone: 101% to 500%
      const overdriveX = x - trackWidth;
      // On narrow screens, use the pixels still available before the viewport
      // edge so the full range remains reachable with a touch drag.
      const availableViewportWidth =
        typeof window !== 'undefined' ? Math.max(1, window.innerWidth - rect.right) : W_OVERDRIVE;
      const overdriveWidth = Math.min(W_OVERDRIVE, availableViewportWidth);
      const overdriveRatio = Math.min(1, overdriveX / overdriveWidth);
      const computedValue = Math.round(100 + overdriveRatio * 400);

      return Math.min(500, computedValue);
    },
    [value]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();

      const pointerId = e.pointerId;
      activePointerId.current = pointerId;
      isDragging.current = true;

      // Safe pointer capture with try-catch for headless / test runner environments
      if (typeof e.currentTarget.setPointerCapture === 'function') {
        try {
          e.currentTarget.setPointerCapture(pointerId);
        } catch {
          // Graceful fallback for environments lacking native pointer capture
        }
      }

      const newValue = calculateValueFromPointer(e.clientX);
      onChange(newValue);

      if (newValue >= 500 && !unlocked) {
        onUnlock();
      }
    },
    [disabled, calculateValueFromPointer, onChange, unlocked, onUnlock]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || e.pointerId !== activePointerId.current) return;

      const newValue = calculateValueFromPointer(e.clientX);
      onChange(newValue);

      if (newValue >= 500 && !unlocked) {
        onUnlock();
      }
    },
    [calculateValueFromPointer, onChange, unlocked, onUnlock]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerId === activePointerId.current) {
        isDragging.current = false;
        activePointerId.current = null;

        if (typeof e.currentTarget.releasePointerCapture === 'function') {
          try {
            if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          } catch {
            // Graceful fallback
          }
        }
      }
    },
    []
  );

  // Global window pointer release listener as safety net
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        activePointerId.current = null;
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  // Keyboard accessibility handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      let delta = 0;
      let targetValue: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          delta = e.shiftKey ? 1 : 5;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          delta = e.shiftKey ? -1 : -5;
          break;
        case 'PageUp':
          delta = 50;
          break;
        case 'PageDown':
          delta = -50;
          break;
        case 'Home':
          targetValue = 0;
          break;
        case 'End':
          targetValue = 500;
          break;
        default:
          return;
      }

      e.preventDefault();
      const nextValue =
        targetValue !== null
          ? targetValue
          : Math.max(0, Math.min(500, value + delta));

      onChange(nextValue);

      if (nextValue >= 500 && !unlocked) {
        onUnlock();
      }
    },
    [disabled, value, onChange, unlocked, onUnlock]
  );

  // Sync unlock trigger whenever value reaches 500
  useEffect(() => {
    if (value >= 500 && !unlocked) {
      onUnlock();
    }
  }, [value, unlocked, onUnlock]);

  // Compute visual track fill percentage (0% to 100%)
  const fillPercent = Math.min(100, Math.max(0, value));

  // Compute visual thumb position and overhang
  const isOverdrive = value > 100;
  const overdriveRatio = isOverdrive ? Math.min(1, (value - 100) / 400) : 0;
  const overhangPx = overdriveRatio * MAX_THUMB_OVERHANG;

  const thumbLeftStyle = isOverdrive
    ? `calc(100% + ${overhangPx}px)`
    : `${fillPercent}%`;

  return (
    <div
      className={`relative w-full max-w-sm sm:max-w-md mx-auto select-none pt-6 pb-4 px-8 ${className}`}
      data-testid="love-slider"
    >
      {/* Hidden input for automated test suites and screen readers */}
      <input
        type="range"
        min="0"
        max="500"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const val = Number(e.target.value);
          onChange(val);
          if (val >= 500 && !unlocked) onUnlock();
        }}
        className="sr-only"
        data-testid="love-slider-input"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Main interactive slider container */}
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={500}
        aria-valuenow={value}
        aria-label="How much do you love me?"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ touchAction: 'none' }}
        className="relative h-6 flex items-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1A3A] rounded-full"
      >
        {/* Physical Track Background */}
        <div
          data-testid="slider-track"
          className="relative w-full h-3.5 bg-[#FCE7F3] rounded-full border border-[#6B1A3A]/20 shadow-inner overflow-hidden"
        >
          {/* Active Gradient Fill Bar (0 - 100%) */}
          <div
            className="h-full rounded-full transition-all duration-75 ease-out"
            style={{
              width: `${fillPercent}%`,
              background:
                'linear-gradient(90deg, #FBCFE8 0%, #F472B6 40%, #DB2777 75%, #6B1A3A 100%)',
            }}
          />
        </div>

        {/* Milestone Threshold Indicators along track */}
        <div className="absolute inset-x-0 h-3.5 pointer-events-none flex items-center justify-between px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" title="0%" />
          <span
            className="w-1.5 h-1.5 rounded-full bg-white/70"
            style={{ left: '14%', position: 'absolute' }}
            title="14%"
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-white/70"
            style={{ left: '55%', position: 'absolute' }}
            title="55%"
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-white/70"
            style={{ left: '81%', position: 'absolute' }}
            title="81%"
          />
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" title="100%" />
        </div>

        {/* Extended Overdrive Connector Rail (Visible when value > 100%) */}
        {isOverdrive && (
          <div
            className="absolute top-1/2 -translate-y-1/2 left-full h-1 border-t-2 border-dashed border-[#EC4899] pointer-events-none transition-all duration-75"
            style={{
              width: `${overhangPx}px`,
            }}
          />
        )}

        {/* Custom Slider Thumb Handle */}
        <div
          data-testid="slider-thumb"
          style={{
            left: thumbLeftStyle,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none',
          }}
          className={`absolute top-1/2 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-cute transition-transform duration-75 ${
            isDragging.current || isHovered ? 'scale-110' : 'scale-100'
          } ${
            value >= 500
              ? 'bg-gradient-to-tr from-[#6B1A3A] to-[#EC4899] text-white ring-4 ring-[#F472B6]/50 animate-pulse'
              : isOverdrive
              ? 'bg-[#8B264E] text-white ring-2 ring-[#F472B6]/40'
              : 'bg-[#6B1A3A] text-white'
          }`}
        >
          {value >= 500 ? (
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <Heart
              className={`w-4 h-4 fill-current ${
                value > 80 ? 'animate-pulse' : ''
              }`}
            />
          )}

          {/* Value Floating Bubble Tooltip */}
          <div
            data-testid="love-percentage"
            className={`absolute -top-8 px-2 py-0.5 rounded-full text-xs font-bold font-heading shadow-sm whitespace-nowrap transition-all ${
              value >= 500
                ? 'bg-[#6B1A3A] text-white ring-2 ring-[#F472B6] scale-110'
                : 'bg-white text-[#6B1A3A] border border-[#6B1A3A]/20'
            }`}
          >
            {value}%
          </div>
        </div>
      </div>

      {/* Track Footnote with Sub-Labels */}
      <div className="flex justify-between items-center mt-2 px-1 text-xs font-heading text-[#6B1A3A]/60">
        <span>0%</span>
        <span>50%</span>
        <span className="relative">
          100%
          {isOverdrive && (
            <span className="absolute left-full ml-2 text-[#EC4899] font-bold animate-pulse whitespace-nowrap">
              &rarr; {value}% !
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default LoveSlider;
