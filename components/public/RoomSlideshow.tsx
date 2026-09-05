'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';

export default function RoomSlideshow({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (images.length < 2 || paused || hovered || focused || reducedMotion || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [images.length, paused, hovered, focused, reducedMotion, visible]);

  return (
    <div ref={container} className="absolute inset-0 overflow-hidden bg-forest-900"
      role="region" aria-roledescription="carousel" aria-label={`${name} photos`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <AnimatePresence initial={false}>
        <motion.img key={images[index]} src={images[index]} alt={`${name} — photo ${index + 1}`}
          initial={{ y: reducedMotion ? 0 : '-100%' }} animate={{ y: 0 }}
          exit={{ y: reducedMotion ? 0 : '100%' }}
          transition={{ duration: reducedMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-white/25 bg-black/55 p-1 text-white backdrop-blur-md">
          <span className="px-2 text-xs tabular-nums">{index + 1} / {images.length}</span>
          <button type="button" aria-label={`Previous ${name} photo`} className="rounded-full p-2 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            onClick={() => setIndex((index + images.length - 1) % images.length)}><ChevronUp className="h-4 w-4" /></button>
          <button type="button" aria-label={`Next ${name} photo`} className="rounded-full p-2 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            onClick={() => setIndex((index + 1) % images.length)}><ChevronDown className="h-4 w-4" /></button>
          {!reducedMotion && <button type="button" aria-label={`${paused ? 'Play' : 'Pause'} ${name} slideshow`} className="rounded-full p-2 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            onClick={() => setPaused(!paused)}>{paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}</button>}
        </div>
      )}
    </div>
  );
}
