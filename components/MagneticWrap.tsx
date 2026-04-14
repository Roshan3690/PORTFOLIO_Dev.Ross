'use client';

import { useRef, MouseEvent, ReactNode } from 'react';

interface MagneticWrapProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticWrap({ children, strength = 0.3, className = '' }: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * strength;
    const distY = (e.clientY - centerY) * strength;
    
    // Bypass React state for 60fps performance
    ref.current.style.transform = `translate(${distX}px, ${distY}px)`;
    ref.current.style.transition = 'none';
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `translate(0px, 0px)`;
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-wrap ${className}`}
      style={{
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {children}
    </div>
  );
}
