'use client';

interface MarqueeStripProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
}

export default function MarqueeStrip({
  items,
  reverse = false,
  className = '',
  separator = '✦',
}: MarqueeStripProps) {
  // Triple the items to ensure it seamlessly fills wide screens
  const doubled = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap flex w-full relative ${className}`}>
      <div 
        className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationPlayState: 'running' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="mx-6 md:mx-10 text-2xl md:text-4xl font-heading font-bold text-white/10 hover:text-white/30 transition-colors duration-500 select-none">
              {item}
            </span>
            <span className="text-accent/30 text-xs">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
