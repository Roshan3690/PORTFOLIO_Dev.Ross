'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorFollower from '@/components/CursorFollower';
import ScrollProgress from '@/components/ScrollProgress';
import TextReveal from '@/components/TextReveal';
import MagneticWrap from '@/components/MagneticWrap';
import MarqueeStrip from '@/components/MarqueeStrip';
import { Github, Linkedin, Mail, ArrowUpRight, ArrowDown, Code2, Palette, Zap, Globe, ExternalLink } from 'lucide-react';

/* ═══════════════════════════════════════
   FLOATING PARTICLES COMPONENT
   ═══════════════════════════════════════ */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: `rgba(167, 139, 250, ${Math.random() * 0.3 + 0.1})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════ */
function AnimatedCounter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const step = end / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-6xl font-heading font-bold text-accent">
        {count}{suffix}
      </div>
      <div className="text-sm text-white/40 mt-2 font-mono uppercase tracking-widest">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   TILT CARD
   ═══════════════════════════════════════ */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="perspective-1000" data-cursor-hover>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className={`preserve-3d ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SERVICE CARD
   ═══════════════════════════════════════ */
function ServiceCard({ icon: Icon, title, description, index }: {
  icon: any;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard className="group relative p-8 rounded-2xl bg-surface-800/50 border border-white/[0.04] hover:border-accent/20 transition-all duration-500 h-full">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] transition-all duration-500">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white mb-3">{title}</h3>
          <p className="text-white/40 text-sm leading-relaxed">{description}</p>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   PROJECT CARD  
   ═══════════════════════════════════════ */
function ProjectCard({ title, category, tags, color, index }: {
  title: string;
  category: string;
  tags: string[];
  color: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard className="group relative rounded-2xl overflow-hidden cursor-pointer bg-surface-800 border border-white/[0.04] hover:border-accent/20 transition-all duration-500">
        {/* Color gradient header */}
        <div className={`h-48 md:h-56 ${color} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-800 via-transparent to-transparent" />
          {/* Animated grid pattern */}
          <div className="absolute inset-0 grid-bg opacity-30" />
          {/* Floating shapes */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-20 h-20 border border-white/20 rounded-xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ x: '-50%', y: '-50%' }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 w-10 h-10 bg-white/10 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Arrow icon */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-accent/60 text-xs font-mono uppercase tracking-widest mb-2">{category}</p>
          <h3 className="text-xl font-heading font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white/30 bg-white/[0.04] rounded-full border border-white/[0.06]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}


/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Hero parallax effects
  const heroImageY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroImageScale = useTransform(heroScrollProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroTextY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  // Smooth spring for scroll
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const services = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'Building high-performance, scalable web applications with modern frameworks and clean architecture.',
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Crafting intuitive, beautiful interfaces that users love — pixel-perfect execution with purpose.',
    },
    {
      icon: Zap,
      title: 'Motion & Interaction',
      description: 'Bringing interfaces to life with fluid animations, micro-interactions, and immersive scroll experiences.',
    },
    {
      icon: Globe,
      title: '3D & Creative Dev',
      description: 'Pushing web boundaries with Three.js, WebGL, and Spline — creating memorable digital experiences.',
    },
  ];

  const projects = [
    {
      title: 'E-Commerce Platform',
      category: 'Full-Stack Development',
      tags: ['Next.js', 'Node.js', 'Stripe', 'PostgreSQL'],
      color: 'bg-gradient-to-br from-purple-600/30 to-blue-600/20',
    },
    {
      title: 'Interactive Dashboard',
      category: 'Frontend Engineering',
      tags: ['React', 'D3.js', 'TypeScript', 'Tailwind'],
      color: 'bg-gradient-to-br from-emerald-600/30 to-teal-600/20',
    },
    {
      title: '3D Portfolio Experience',
      category: 'Creative Development',
      tags: ['Three.js', 'GSAP', 'Blender', 'WebGL'],
      color: 'bg-gradient-to-br from-orange-600/30 to-rose-600/20',
    },
    {
      title: 'Real-time Chat App',
      category: 'Full-Stack Development',
      tags: ['Next.js', 'Socket.io', 'Redis', 'MongoDB'],
      color: 'bg-gradient-to-br from-cyan-600/30 to-indigo-600/20',
    },
  ];

  const techStack = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Three.js',
    'Framer Motion', 'Tailwind CSS', 'PostgreSQL', 'MongoDB',
    'Docker', 'AWS', 'Figma', 'Git', 'GraphQL', 'Python',
  ];

  return (
    <main className="relative bg-surface-900 min-h-screen selection:bg-accent selection:text-black">
      <CursorFollower />
      <ScrollProgress />
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroImageY, scale: heroImageScale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg.jpg')" }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-surface-900/40 via-surface-900/20 to-surface-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-900/60 via-transparent to-surface-900/60" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.8)_100%)]" />
        </motion.div>

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        {/* HERO CONTENT */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-accent text-xs font-mono uppercase tracking-widest">Available for work</span>
          </motion.div>

          {/* Main Heading */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold tracking-tighter leading-[0.9]"
            >
              <span className="glitch text-white" data-text="ROSHAN">ROSHAN</span>
            </motion.h1>
          </div>

          {/* Subtitle with shimmer */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-gradient-animated text-xl md:text-2xl font-body font-light tracking-wide mb-4"
          >
            Creative Web Developer & Digital Craftsman
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-white/30 text-sm md:text-base max-w-lg mx-auto mb-10 font-body leading-relaxed"
          >
            I build immersive digital experiences with cutting-edge web technologies,
            motion design, and obsessive attention to detail.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticWrap strength={0.25}>
              <a
                href="#work"
                className="group relative px-8 py-3.5 bg-accent text-black font-heading font-bold text-sm rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(167,139,250,0.4)]"
                data-cursor-hover
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-accent-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            </MagneticWrap>

            <MagneticWrap strength={0.25}>
              <a
                href="#contact"
                className="group px-8 py-3.5 border border-white/10 text-white/70 hover:text-white hover:border-accent/40 font-heading font-bold text-sm rounded-full transition-all duration-300"
                data-cursor-hover
              >
                <span className="flex items-center gap-2">
                  Get In Touch
                  <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </span>
              </a>
            </MagneticWrap>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4 text-accent/50" />
          </motion.div>
          <span className="text-white/20 text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>

        {/* Side accent lines */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-8 top-1/3 bottom-1/3 w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent origin-top hidden md:block"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-8 top-1/3 bottom-1/3 w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent origin-bottom hidden md:block"
        />

        {/* Spline 3D placeholder — future integration */}
        <div id="spline-container" className="absolute inset-0 z-5 pointer-events-none" />
      </section>

      {/* ═══════════════════════════════════════
          MARQUEE SECTION (Skills ticker)
          ═══════════════════════════════════════ */}
      <section className="py-12 border-y border-white/[0.04] relative overflow-hidden">
        <MarqueeStrip items={techStack} speed={35} />
        <MarqueeStrip items={techStack} speed={25} reverse className="mt-4 opacity-50" />
      </section>

      {/* ═══════════════════════════════════════
          ABOUT SECTION
          ═══════════════════════════════════════ */}
      <section id="about" className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <FloatingParticles />

        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-16"
          >
            <span className="text-accent font-mono text-sm tracking-widest">01</span>
            <div className="w-12 h-[1px] bg-accent/30" />
            <span className="text-white/40 font-mono text-sm uppercase tracking-widest">About Me</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: Big statement */}
            <div>
              <TextReveal
                text="I craft digital experiences that leave a lasting impression."
                as="h2"
                className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight mb-8"
              />
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-white/40 leading-relaxed text-base"
              >
                With a deep passion for both design and engineering, I bridge the gap between 
                beautiful interfaces and robust functionality. Every pixel, every animation, 
                every interaction is crafted with intention.
              </motion.p>
            </div>

            {/* Right: Details */}
            <div className="space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-white/50 leading-relaxed"
              >
                I&apos;m a creative web developer who thrives at the intersection of design and code. 
                I specialize in building high-performance web applications, immersive 3D experiences, 
                and interfaces that feel alive.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="text-white/50 leading-relaxed"
              >
                When I&apos;m not coding, I&apos;m exploring emerging web technologies, experimenting with 
                creative coding, and pushing the boundaries of what&apos;s possible in the browser.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <MagneticWrap>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-accent text-sm font-mono uppercase tracking-widest hover:gap-3 transition-all duration-300 group"
                    data-cursor-hover
                  >
                    Let&apos;s connect
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </MagneticWrap>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-white/[0.04]">
            <AnimatedCounter value={3} suffix="+" label="Years Exp." />
            <AnimatedCounter value={25} suffix="+" label="Projects" />
            <AnimatedCounter value={15} suffix="+" label="Happy Clients" />
            <AnimatedCounter value={99} suffix="%" label="Passion" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES SECTION
          ═══════════════════════════════════════ */}
      <section id="skills" className="relative py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="text-accent font-mono text-sm tracking-widest">02</span>
            <div className="w-12 h-[1px] bg-accent/30" />
            <span className="text-white/40 font-mono text-sm uppercase tracking-widest">What I Do</span>
          </motion.div>

          <TextReveal
            text="Turning vision into digital reality."
            as="h2"
            className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight mb-16"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.title} {...service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROJECTS SECTION
          ═══════════════════════════════════════ */}
      <section id="work" className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="text-accent font-mono text-sm tracking-widest">03</span>
            <div className="w-12 h-[1px] bg-accent/30" />
            <span className="text-white/40 font-mono text-sm uppercase tracking-widest">Selected Work</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <TextReveal
              text="Projects I'm proud of."
              as="h2"
              className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/30 text-sm mt-4 md:mt-0 max-w-xs"
            >
              A curated selection of projects that showcase my skills and passion.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} {...project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT / CTA SECTION
          ═══════════════════════════════════════ */}
      <section id="contact" className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <FloatingParticles />
        <div className="max-w-4xl mx-auto text-center">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <span className="text-accent font-mono text-sm tracking-widest">04</span>
            <div className="w-12 h-[1px] bg-accent/30" />
            <span className="text-white/40 font-mono text-sm uppercase tracking-widest">Get In Touch</span>
          </motion.div>

          <TextReveal
            text="Let's build something extraordinary together."
            as="h2"
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white/30 text-lg max-w-xl mx-auto mb-12"
          >
            Have a project in mind? Let&apos;s turn your vision into reality. I&apos;m always open to 
            discussing new projects, creative ideas, or opportunities to collaborate.
          </motion.p>

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mb-16"
          >
            <MagneticWrap strength={0.15}>
              <a
                href="mailto:hello@roshan.dev"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-accent text-black font-heading font-bold text-lg rounded-full hover:shadow-[0_0_60px_rgba(167,139,250,0.4)] transition-all duration-300"
                data-cursor-hover
              >
                <Mail className="w-5 h-5" />
                Say Hello
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </MagneticWrap>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-center gap-6"
          >
            {[
              { icon: Github, label: 'GitHub', href: '#' },
              { icon: Linkedin, label: 'LinkedIn', href: '#' },
              { icon: Mail, label: 'Email', href: 'mailto:hello@roshan.dev' },
            ].map((social) => (
              <MagneticWrap key={social.label} strength={0.3}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
                  data-cursor-hover
                >
                  <social.icon className="w-5 h-5" />
                </a>
              </MagneticWrap>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="relative border-t border-white/[0.04] overflow-hidden">
        {/* Marquee Footer */}
        <div className="py-8 opacity-[0.06]">
          <MarqueeStrip
            items={['ROSHAN', '✦', 'CREATIVE DEVELOPER', '✦', 'ROSHAN', '✦', 'DIGITAL CRAFTSMAN', '✦']}
            speed={20}
            separator=""
          />
        </div>

        <div className="px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-mono">
            © {new Date().getFullYear()} ROSHAN. All rights reserved.
          </p>
          <p className="text-white/10 text-xs font-mono">
            Designed & Built with ♥ and too much coffee
          </p>
        </div>
      </footer>
    </main>
  );
}
