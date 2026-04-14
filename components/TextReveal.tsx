'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  splitBy?: 'word' | 'char';
  staggerChildren?: number;
}

export default function TextReveal({
  text,
  className = '',
  delay = 0,
  once = true,
  as: Tag = 'h2',
  splitBy = 'word',
  staggerChildren = 0.04,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: '-100px 0px' });

  const items = splitBy === 'word' ? text.split(' ') : text.split('');
  const separator = splitBy === 'word' ? '\u00A0' : '';

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerChildren,
      },
    },
  };

  const child = {
    hidden: {
      y: 80,
      opacity: 0,
      rotateX: -40,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Tag ref={ref as any} className={`overflow-hidden ${className}`}>
      <motion.span
        className="inline-flex flex-wrap"
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ perspective: '600px' }}
      >
        {items.map((item, i) => (
          <motion.span
            key={i}
            variants={child}
            className="inline-block origin-bottom"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {item}
            {separator}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
