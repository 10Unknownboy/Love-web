'use client';

import React, { useMemo } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export interface LoveGaugeProps {
  value: number; // 0 to 500
  size?: number; // Width in px, default 240
  className?: string;
  showTicks?: boolean; // Default true
  showNeedle?: boolean; // Default true
  showCenterValue?: boolean; // Default true
}

export function LoveGauge({
  value,
  size = 240,
  className = '',
  showTicks = true,
  showNeedle = true,
  showCenterValue = true,
}: LoveGaugeProps) {
  // Semi-circle arc geometry constants
  // Origin: cx = 120, cy = 120
  // Arc radius: R = 90
  // Semicircle length: pi * R = 90 * pi ≈ 282.743
  const CX = 120;
  const CY = 120;
  const R = 90;
  const ARC_LENGTH = Math.PI * R; // 282.7433

  // Progress percentage clamped to 0 - 100% for the physical arc fill
  const clampedNormalProgress = Math.min(1, Math.max(0, value / 100));
  const strokeOffset = ARC_LENGTH * (1 - clampedNormalProgress);

  // Overdrive state calculation (> 100% to 500%)
  const isOverdrive = value > 100;
  const isMaxLove = value >= 500;
  const overdriveRatio = isOverdrive ? Math.min(1, (value - 100) / 400) : 0;

  // Needle angle calculation
  // 0% -> -90 deg (pointing left)
  // 50% -> 0 deg (pointing straight up)
  // 100% -> +90 deg (pointing right)
  // >100% -> tilts past +90 deg up to +108 deg (overload)
  const needleAngle = useMemo(() => {
    if (value <= 100) {
      return -90 + (value / 100) * 180;
    }
    // Overdrive: tilt an additional 18 degrees past 90
    return 90 + overdriveRatio * 18;
  }, [value, overdriveRatio]);

  // Specific milestone tick positions per specification (0%, 14%, 55%, 81%, 100%)
  const milestones = useMemo(
    () => [
      { percent: 0, label: '0%' },
      { percent: 14, label: '14%' },
      { percent: 55, label: '55%' },
      { percent: 81, label: '81%' },
      { percent: 100, label: '100%' },
    ],
    []
  );

  const tickRadius = 74;

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      style={{ width: `${size}px` }}
      data-testid="love-gauge"
    >
      <svg
        viewBox="0 0 240 145"
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Main Gradient Pink-to-Crimson Fill */}
          <linearGradient id="loveGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBCFE8" /> {/* Light rose */}
            <stop offset="30%" stopColor="#F472B6" /> {/* Vibrant ribbon pink */}
            <stop offset="65%" stopColor="#DB2777" /> {/* Deep rose */}
            <stop offset="100%" stopColor="#6B1A3A" /> {/* Deep crimson */}
          </linearGradient>

          {/* Overdrive Glow Filter */}
          <filter id="gaugeOverdriveGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Outer Background Arc Track */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="#FCE7F3"
          strokeWidth="14"
          strokeLinecap="round"
          className="opacity-70"
        />

        {/* Milestone Tick Dots on Arc */}
        {showTicks &&
          milestones.map(({ percent }) => {
            const angleRad = Math.PI * (1 - percent / 100);
            const tx = CX + tickRadius * Math.cos(angleRad);
            const ty = CY - tickRadius * Math.sin(angleRad);
            const isActive = value >= percent;

            return (
              <g key={percent} className="transition-all duration-150">
                <circle
                  cx={tx}
                  cy={ty}
                  r={percent === 0 || percent === 100 ? 3 : 2.5}
                  fill={isActive ? '#6B1A3A' : '#F472B6'}
                  opacity={isActive ? 0.9 : 0.4}
                />
              </g>
            );
          })}

        {/* Active Animated Progress Arc */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="url(#loveGaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={strokeOffset}
          className="transition-all duration-100 ease-out"
        />

        {/* Overdrive Pulsing Glow Layer (Active when value > 100%) */}
        {isOverdrive && (
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="#EC4899"
            strokeWidth="16"
            strokeLinecap="round"
            filter="url(#gaugeOverdriveGlow)"
            style={{
              opacity: Math.min(0.85, overdriveRatio * 0.9),
            }}
            className={isMaxLove ? 'animate-pulse' : ''}
          />
        )}

        {/* Semicircle Base Accent Line */}
        <line
          x1={CX - R - 7}
          y1={CY}
          x2={CX + R + 7}
          y2={CY}
          stroke="#6B1A3A"
          strokeWidth="1"
          opacity="0.15"
        />

        {/* Rotating Gauge Needle */}
        {showNeedle && (
          <g
            transform={`translate(${CX}, ${CY}) rotate(${needleAngle})`}
            className="transition-transform duration-100 ease-out"
          >
            {/* Needle Body */}
            <path
              d="M -3 0 L 0 -76 L 3 0 Z"
              fill={isMaxLove ? '#EC4899' : '#6B1A3A'}
              className={isMaxLove ? 'animate-wiggle' : ''}
            />
            {/* Needle Center Pivot Cap */}
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="#6B1A3A"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx="0" cy="0" r="2.5" fill="#FDE8EB" />
          </g>
        )}
      </svg>

      {/* Central Digital Readout & Status Label */}
      {showCenterValue && (
        <div className="absolute top-[58%] flex flex-col items-center text-center pointer-events-none">
          <div className="flex items-center space-x-1">
            <span
              className={`text-2xl sm:text-3xl font-bold font-heading tracking-tight transition-all duration-100 ${
                isMaxLove
                  ? 'text-[#EC4899] scale-110 drop-shadow-sm animate-pulse'
                  : 'text-[#6B1A3A]'
              }`}
            >
              {value}%
            </span>
            {isMaxLove ? (
              <Sparkles className="w-5 h-5 text-[#EC4899] animate-bounce" />
            ) : value > 80 ? (
              <Heart className="w-4 h-4 text-[#8B264E] fill-current animate-pulse" />
            ) : null}
          </div>

          <span className="text-[10px] sm:text-xs font-bold font-heading uppercase tracking-widest text-[#6B1A3A]/60 -mt-0.5">
            {isMaxLove ? 'OVERFLOWING LOVE' : 'LOVE METER'}
          </span>
        </div>
      )}
    </div>
  );
}

export default LoveGauge;
