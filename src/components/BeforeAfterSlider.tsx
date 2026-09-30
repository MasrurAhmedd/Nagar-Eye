import React, { useState, useRef, useCallback, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  heightClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE (Reported Hazard)',
  afterLabel = 'AFTER (Verified Public Works)',
  heightClass = 'h-72 sm:h-96',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = Math.round((clampedX / rect.width) * 100);
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleEnd]);

  function handleMouseUp() {
    setIsDragging(false);
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} overflow-hidden rounded-xl border border-slate-200 select-none cursor-ew-resize bg-slate-900 shadow-inner`}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* Background: AFTER Image (Revealed on Right) */}
      <img
        src={afterImage}
        alt="After repair evidence"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-3 right-3 bg-emerald-950/85 backdrop-blur-xs text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-emerald-500/40 z-10 pointer-events-none shadow-sm">
        {afterLabel}
      </div>

      {/* Foreground: BEFORE Image (Clipped on Left) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before hazard evidence"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
            maxWidth: 'none',
          }}
        />
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-xs text-rose-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-rose-500/40 z-10 shadow-sm">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute inset-y-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)]" />
        <div className="absolute w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl border-2 border-slate-900 flex items-center justify-center font-bold text-xs pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-105 transition-transform">
          <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3" />
          </svg>
        </div>
      </div>

      {/* Hint at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/70 backdrop-blur-xs text-white/90 text-[10px] font-medium px-3 py-1 rounded-full pointer-events-none">
        Drag slider left / right to inspect fix
      </div>
    </div>
  );
};
