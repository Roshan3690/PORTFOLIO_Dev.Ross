'use client';

import { motion } from 'framer-motion';

interface MarqueeStripProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
}

export default function MarqueeStrip({
  items,
  speed = 30,
  reverse = false,
  className = '',
  separator = '✦',
}: MarqueeStripProps) {
  // Double the items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex items-center"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="mx-6 md:mx-10 text-2xl md:text-4xl font-heading font-bold text-white/10 hover:text-white/30 transition-colors duration-500 select-none">
              {item}
            </span>
            <span className="text-accent/30 text-xs">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
