/**
 * HeroCarousel — Aurore-style split-screen hero slider
 *
 * Uses CSS transform: translateX() (Swiper "slide" effect) so slides
 * physically move horizontally, both during auto-play and live finger drag.
 *
 * Layout:
 *   Mobile  : full-width left panel, right panel hidden
 *   Desktop : left 65% (image + text + CTAs) | right 35% (4 mini-product cards)
 *
 * Touch behaviour:
 *   onTouchMove → slides follow the finger in real-time
 *   onTouchEnd  → snaps forward/back if drag > 40 px, else snaps back
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MiniProduct {
  image: string;
  name: string;
  price: string;
}

interface Slide {
  bg: string;
  tag: string;
  title: string;
  subtitle: string;
  miniProducts: MiniProduct[];
}

const slides: Slide[] = [
  {
    bg: "/aurore/aurore-s1-bg-a.jpg",
    tag: "New Arrivals",
    title: "Wear Your Story",
    subtitle: "Bespoke luxury fashion crafted for extraordinary moments",
    miniProducts: [
      { image: "/images/girl/AnarkaliGown.png", name: "Anarkali Evening Gown", price: "₦220,000" },
      { image: "/images/men/fashion10.jpg", name: "Senator Agbada Set", price: "₦95,000" },
      { image: "/images/bags/fashion.jpg", name: "Luxury Tote Bag", price: "₦38,000" },
      { image: "/images/shoes/fashion10.jpg", name: "Strappy Heeled Sandal", price: "₦28,000" },
    ],
  },
  {
    bg: "/aurore/aurore-s1-bg-b.jpg",
    tag: "Trending Now",
    title: "Cape Collection",
    subtitle: "Dramatic silhouettes that command every room you enter",
    miniProducts: [
      { image: "/images/girl/CapeGown.png", name: "Cape Drape Gown", price: "₦145,000" },
      { image: "/images/men/fashion27.jpg", name: "Linen Kaftan Set", price: "₦75,000" },
      { image: "/images/bags/faahion30.jpg", name: "Evening Clutch", price: "₦22,000" },
      { image: "/images/shoes/fashion27.jpg", name: "Block Heel Mule", price: "₦32,000" },
    ],
  },
  {
    bg: "/aurore/aurore-s1-bg-c.jpg",
    tag: "Bridal 2026",
    title: "Your Perfect Day",
    subtitle: "Fully bespoke bridal creations tailored to your vision",
    miniProducts: [
      { image: "/images/girl/4d65e36a-cbb1-44cd-80f1-16a19c5dafc5.jpeg", name: "Bridal Ball Gown", price: "₦350,000" },
      { image: "/images/men/fashion6.jpg", name: "Groom's Agbada", price: "₦120,000" },
      { image: "/images/bags/0fd0dea2-1481-4524-9d52-cbaf9d8b1c06.jpeg", name: "Bridal Handbag", price: "₦55,000" },
      { image: "/images/shoes/fashion6.jpg", name: "Bridal Court Shoe", price: "₦42,000" },
    ],
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
  // Each slide occupies 100% of the left-panel width.
  // translateX = -current * 100% + dragOffset(px)
  const translateX = `calc(${-current * 100}% + ${dragOffset}px)`;

  const slide = slides[current];

  return (
    <section
      className="relative flex h-screen min-h-[600px] overflow-hidden select-none"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {/* ═══════════════ LEFT PANEL (full width mobile / 65% desktop) ═════════════ */}
      <div
        ref={containerRef}
        className="relative w-full md:w-[65%] h-full overflow-hidden"
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

      {/* ═══════════════ RIGHT PANEL (35%, desktop only) ════════════════════ */}
      <div className="hidden md:flex md:w-[35%] h-full bg-white flex-col border-l border-gray-100">
        {/* Product mini-cards */}
        <div className="flex-1 flex flex-col divide-y divide-gray-100 overflow-hidden">
          {slide.miniProducts.map((p, i) => (
            <Link
              key={`${current}-${i}`}
              to="/collections"
              className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors duration-200 group flex-1"
            >
              <div className="w-14 h-[72px] flex-shrink-0 overflow-hidden bg-gray-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                  draggable={false}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-playfair text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">
                  {p.name}
                </p>
                <p className="font-inter text-xs text-primary mt-1 font-semibold">
                  {p.price}
                </p>
              </div>
              <ChevronRight size={13} className="text-gray-300 flex-shrink-0 group-hover:text-primary transition-colors duration-200" />
            </Link>
          ))}
        </div>

        {/* "View All" footer link */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <Link
            to="/collections"
            className="block text-center font-inter text-[10px] tracking-[0.3em] uppercase border border-gray-900 text-gray-900 py-3 hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
