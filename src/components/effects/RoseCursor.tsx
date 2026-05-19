'use client';

import { useEffect, useRef, useState } from 'react';

export function RoseCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const rafId = useRef(0);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Disable on touch-only devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function tick() {
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    }

    function onOver(e: MouseEvent) {
      const el = e.target as Element;
      setHovering(Boolean(el.closest('a, button, [role="button"], input, textarea, select, label')));
    }

    function onLeave() { setVisible(false); }
    function onEnter() { setVisible(true); }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s' }}
      aria-hidden
    >
      {/* Offset so rose center is at cursor tip */}
      <div
        style={{
          transform: `translate(-50%, -50%) scale(${hovering ? 1.5 : 1})`,
          transition: 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        {/* Top-down rose — 5 petals + center */}
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <g transform="translate(17,17)">
            <ellipse cx="0" cy="-6.5" rx="4"   ry="8.5" fill="#EAC4C4" opacity="0.92" />
            <ellipse cx="0" cy="-6.5" rx="4"   ry="8.5" fill="#E0B5B5" opacity="0.92" transform="rotate(72)" />
            <ellipse cx="0" cy="-6.5" rx="4"   ry="8.5" fill="#EFC8C8" opacity="0.92" transform="rotate(144)" />
            <ellipse cx="0" cy="-6.5" rx="4"   ry="8.5" fill="#DAAEB0" opacity="0.92" transform="rotate(216)" />
            <ellipse cx="0" cy="-6.5" rx="4"   ry="8.5" fill="#EAC4C4" opacity="0.92" transform="rotate(288)" />
            <circle r="4.5" fill="#C9959A" />
            <circle r="2.5" fill="#B07A80" />
          </g>
        </svg>
      </div>
    </div>
  );
}
