/**
 * HeroCarousel — full-width hero slider
 *
 * Uses CSS transform: translateX() (Swiper "slide" effect) so slides
 * physically move horizontally, both during auto-play and live finger drag.
 *
 * Touch behaviour:
 *   onTouchMove → slides follow the finger in real-time
 *   onTouchEnd  → snaps forward/back if drag > 40 px, else snaps back
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Slide {
  bg: string;
  tag: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    bg: "/aurore/aurore-s1-bg-a.jpg",
    tag: "New Arrivals",
    title: "Wear Your Story",
    subtitle: "Bespoke luxury fashion crafted for extraordinary moments",
  },
  {
    bg: "/aurore/aurore-s1-bg-b.jpg",
    tag: "Trending Now",
    title: "Cape Collection",
    subtitle: "Dramatic silhouettes that command every room you enter",
  },
  {
    bg: "/aurore/aurore-s1-bg-c.jpg",
    tag: "Bridal 2026",
    title: "Your Perfect Day",
    subtitle: "Fully bespoke bridal creations tailored to your vision",
  },
];

const TOTAL = slides.length;
const AUTOPLAY_MS = 5000;
const TRANSITION_MS = 500; // matches Aurore speed:500

export default function HeroCarousel() {
  const [current, setCurrent]     = useState(0);
  const [transitioning, setTrans] = useState(false);

  // For live-drag: offset in px relative to the snapped position
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging   = useRef(false);
  const touchStartX  = useRef(0);
  const touchStartY  = useRef(0);
  const autoTimer    = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const stopAuto = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = null;
  }, []);

  const goTo = useCallback((idx: number) => {
    const target = ((idx % TOTAL) + TOTAL) % TOTAL;
    setTrans(true);
    setDragOffset(0);
    setCurrent(target);
    setTimeout(() => setTrans(false), TRANSITION_MS + 50);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // ── auto-play (5 s, matching Aurore autoplayspeed) ─────────────────────
  const startAuto = useCallback(() => {
    stopAuto();
    autoTimer.current = setInterval(() => {
      setCurrent(c => {
        const target = (c + 1) % TOTAL;
        setTrans(true);
        setDragOffset(0);
        setTimeout(() => setTrans(false), TRANSITION_MS + 50);
        return target;
      });
    }, AUTOPLAY_MS);
  }, [stopAuto]);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  // ── keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  // Container width cached to avoid reading layout on every touchmove
  const containerWidthRef = useRef(0);
  useEffect(() => {
    const update = () => {
      containerWidthRef.current = containerRef.current?.offsetWidth ?? window.innerWidth;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── touch: live drag ──────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current  = true;
    stopAuto();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Only horizontal drag (suppress vertical scroll interference)
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      const w = containerWidthRef.current || window.innerWidth;
      // Clamp drag to ±80 % of width so it feels natural
      setDragOffset(Math.max(-w * 0.8, Math.min(w * 0.8, dx)));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Require horizontal dominance + minimum 40 px drag
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
    } else {
      // Snap back (not enough drag)
      setTrans(true);
      setDragOffset(0);
      setTimeout(() => setTrans(false), TRANSITION_MS + 50);
    }
    startAuto();
  };

  // ── translate calculation ─────────────────────────────────────────────────
  // The slide track is TOTAL×100% wide. CSS resolves percentages in translateX
  // relative to the element's OWN width, so 100% here = the full track width.
  // Each slide occupies 1/TOTAL of the track, so we step by (100/TOTAL)% per slide.
  const translateX = `calc(${-current * (100 / TOTAL)}% + ${dragOffset}px)`;

  const slide = slides[current];

  return (
    <section
      className="relative flex h-screen min-h-[600px] overflow-hidden select-none"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {/* ═══════════════ HERO PANEL (full width) ═══════════════════════════ */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slide track — all slides laid out horizontally via translateX */}
        <div
          className="flex h-full"
          style={{
            width: `${TOTAL * 100}%`,
            transform: `translateX(${translateX})`,
            // During drag: instant (no CSS transition); on snap: smooth
            transition: isDragging.current
              ? "none"
              : `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            willChange: "transform",
          }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / TOTAL}%` }}
            >
              <img
                src={s.bg}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        {/* ── Slide text content (always on top, fades when slide changes) ── */}
        <div
          key={current}
          className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 lg:px-20 pb-24 pointer-events-none"
        >
          <p className="font-inter text-[11px] tracking-[0.45em] uppercase text-primary mb-5 animate-fade-in-up">
            {slide.tag}
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight tracking-wide mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.08s" }}>
            {slide.title}
          </h1>
          <p className="font-inter text-sm text-white/70 max-w-xs mb-8 leading-relaxed animate-fade-in-up hidden sm:block"
             style={{ animationDelay: "0.15s" }}>
            {slide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3 animate-fade-in-up pointer-events-auto"
               style={{ animationDelay: "0.22s" }}>
            <Link
              to="/collections"
              className="font-inter text-[11px] tracking-[0.3em] uppercase bg-primary text-primary-foreground px-7 py-3.5 hover:bg-gold-light transition-colors duration-300"
            >
              Shop This Look
            </Link>
            <Link
              to="/lookbook"
              className="font-inter text-[11px] tracking-[0.3em] uppercase border border-white/70 text-white px-7 py-3.5 hover:bg-white/10 transition-colors duration-300"
            >
              Discover More
            </Link>
          </div>
        </div>

        {/* ── Arrows ── */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/50 text-white bg-white/10 hover:bg-white/25 transition-all duration-200 hidden md:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/50 text-white bg-white/10 hover:bg-white/25 transition-all duration-200 hidden md:flex"
        >
          <ChevronRight size={18} />
        </button>

        {/* ── Dot indicators ── */}
        <div className="absolute bottom-6 left-8 md:left-16 z-30 flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "transition-all duration-300",
                i === current
                  ? "w-7 h-[3px] bg-primary"
                  : "w-[6px] h-[6px] rounded-full bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-30">
          <div
            key={`progress-${current}`}
            className="h-full bg-primary"
            style={{ animation: `progress-bar ${AUTOPLAY_MS}ms linear forwards` }}
          />
        </div>
      </div>

    </section>
  );
}
