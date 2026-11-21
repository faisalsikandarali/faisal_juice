import React, { useEffect, useState, useRef } from "react";

export default function ModernCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    // Only activate on devices with a mouse pointer (desktop)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("[role='button']") ||
          target.closest("input") ||
          target.closest(".clickable") ||
          target.closest(".orchard-feature-card") ||
          target.closest(".swiper-slide"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animateTrail = () => {
      currentX = lerp(currentX, targetX, 0.22);
      currentY = lerp(currentY, targetY, 0.22);
      setTrailPos({ x: currentX, y: currentY });
      rafId.current = requestAnimationFrame(animateTrail);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    rafId.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999999] overflow-hidden select-none">
      {/* Outer Floating Magnetic Halo Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border transition-all duration-150 ease-out pointer-events-none ${
          isHovered
            ? "w-12 h-12 border-emerald-400 bg-emerald-400/20 shadow-[0_0_24px_rgba(16,185,129,0.55)] scale-125"
            : isClicked
            ? "w-8 h-8 border-emerald-500 bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-90"
            : "w-9 h-9 border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.25)] scale-100"
        }`}
        style={{
          transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Modern High-End Emerald Pointer Arrow (32px prominent size with glow) */}
      <div
        className="fixed top-0 left-0 pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) ${
            isClicked ? "scale(0.88)" : isHovered ? "scale(1.15)" : "scale(1)"
          }`,
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_12px_rgba(16,185,129,0.65)]"
        >
          <defs>
            <linearGradient id="cursorGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="45%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="cursorNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#10b981" floodOpacity="0.75" />
            </filter>
          </defs>
          {/* Luxury Stylized Cursor Arrow */}
          <path
            d="M3 2L24 14.5L14.2 16.8L11.5 26.5L3 2Z"
            fill="url(#cursorGradient)"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#cursorNeonGlow)"
          />
          {/* Centered Diamond Sparkle */}
          <circle cx="11.2" cy="11.2" r="1.8" fill="#ffffff" opacity="0.95" />
        </svg>
      </div>
    </div>
  );
}
