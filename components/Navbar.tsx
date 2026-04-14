'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import MagneticWrap from './MagneticWrap';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
      setMenuOpen(false);
    } else {
      setIsHidden(false);
    }
    setIsTop(latest < 50);
  });

  return (
    <>
      <motion.nav
        animate={{ y: isHidden ? '-100%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[999] px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-500 ${
          isTop
            ? 'bg-transparent'
            : 'bg-[#0a0a0a] border-b border-white/[0.04]'
        }`}
      >
        {/* Logo */}
        <MagneticWrap strength={0.2}>
          <a
            href="#hero"
            className="relative group"
            data-cursor-hover
          >
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              R
              <span className="text-accent">.</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
          </a>
        </MagneticWrap>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <MagneticWrap key={link.label} strength={0.15}>
              <motion.a
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="relative px-4 py-2 text-sm font-body text-white/60 hover:text-white transition-colors duration-300 group"
                data-cursor-hover
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 rounded-full bg-white/[0.04] scale-0 group-hover:scale-100 transition-transform duration-300" />
              </motion.a>
            </MagneticWrap>
          ))}

          <MagneticWrap strength={0.2}>
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="ml-4 px-5 py-2 text-sm font-body font-medium text-black bg-accent rounded-full hover:bg-accent-light transition-colors duration-300 hover:shadow-[0_0_30px_rgba(167,139,250,0.4)]"
              data-cursor-hover
            >
              Let&apos;s Talk
            </motion.a>
          </MagneticWrap>
        </div>

        {/* Mobile Menu Btn */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          data-cursor-hover
          aria-label="Toggle Menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="w-6 h-[1.5px] bg-white block origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
            className="w-6 h-[1.5px] bg-white block"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="w-6 h-[1.5px] bg-white block origin-center"
          />
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998] bg-[#0a0a0a] flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-heading font-bold text-white/80 hover:text-accent transition-colors"
                data-cursor-hover
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
