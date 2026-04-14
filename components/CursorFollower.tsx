'use client';

import { useEffect, useRef } from 'react';

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if ('ontouchstart' in window) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]');

      if (isHoverable) {
        dotRef.current?.classList.add('hovering');
        ringRef.current?.classList.add('hovering');
      } else {
        dotRef.current?.classList.remove('hovering');
        ringRef.current?.classList.remove('hovering');
      }
    };

    const animate = () => {
      // Dot follows closely (faster)
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.2;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.2;

      // Ring follows loosely (slower, creates trailing effect)
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.08;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
