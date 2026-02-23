import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import HeroCarousel from "@/components/HeroCarousel";
import { products } from "@/data/products";
import { Product } from "@/data/products";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Aurore-style editorial banner slider (TRENDING section) ──────────────────
// Matches Aurore's lakit-banner-list carousel: images with title overlay,
// 2 visible on desktop / 1 on mobile, horizontal swipe supported.
const TRENDING_BANNERS = [
  { img: "/aurore/aurore-s2-img-a.jpg", label: "Women's Wear",    link: "/collections" },
  { img: "/aurore/aurore-s2-img-b.jpg", label: "Men's Fashion",   link: "/collections" },
  { img: "/aurore/aurore-s2-img-c.jpg", label: "Bridal Couture",  link: "/collections" },
  { img: "/aurore/aurore-s2-img-d.jpg", label: "Accessories",     link: "/collections" },
  { img: "/aurore/aurore-s2-img-e.jpg", label: "Shoes & Bags",    link: "/collections" },
];

function TrendingBannerSlider() {
  const VISIBLE_DESKTOP = 2;
  const SWIPE_THRESHOLD = 40;
  const TOTAL = TRENDING_BANNERS.length;
  const maxOffset = TOTAL - VISIBLE_DESKTOP;

  const [offset, setOffset] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const clamp = (v: number) => Math.max(0, Math.min(maxOffset, v));

  const go = useCallback((dir: 1 | -1) => {
    setOffset(o => clamp(o + dir));
    setDragDelta(0);
  }, [clamp]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    setDragDelta(dx);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    isDragging.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
    else setDragDelta(0);
  };

  const slideWidthPct = isMobile ? 100 : 50;
  const translateX = `calc(${-offset * slideWidthPct}% + ${dragDelta}px)`;

  return (
    <div className="relative overflow-hidden" ref={containerRef}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      style={{ touchAction: "pan-y" }}>
      {/* Track */}
      <div
        className="flex"
        style={{
          transform: `translateX(${translateX})`,
          transition: isDragging.current ? "none" : "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {TRENDING_BANNERS.map((b, i) => (
          <Link
            key={i}
            to={b.link}
            className="flex-shrink-0 w-full md:w-1/2 relative overflow-hidden group"
            draggable={false}
          >
            <div className="aspect-[4/3] md:aspect-[3/2] overflow-hidden">
              <img
                src={b.img}
                alt={b.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading={i < 2 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
            {/* Label overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
              <p className="font-playfair text-xl font-semibold text-white tracking-wide">{b.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Prev / Next arrows (desktop) */}
      {offset > 0 && (
        <button onClick={() => go(-1)} aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 border border-border hover:bg-primary hover:text-white transition-all duration-200 hidden md:flex">
          <ChevronLeft size={18} />
        </button>
      )}
      {offset < maxOffset && (
        <button onClick={() => go(1)} aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 border border-border hover:bg-primary hover:text-white transition-all duration-200 hidden md:flex">
          <ChevronRight size={18} />
        </button>
      )}

      {/* Scrollbar (thin line like Aurore) */}
      <div className="h-[2px] bg-border mt-3 mx-1 relative">
        <div
          className="absolute top-0 left-0 h-full bg-foreground transition-all duration-300"
          style={{ width: `${((offset + VISIBLE_DESKTOP) / TOTAL) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── Countdown timer ───────────────────────────────────────────────────────────
function useCountdown(h: number, m: number, s: number) {
  const [time, setTime] = useState({ h, m, s });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Index() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const countdown = useCountdown(10, 25, 30);

  const trending = products.filter((p) => p.isTrending);
  const newArrivals = products.filter((p) => p.isNew);
  const bestSellers = products.filter((p) => p.featured);

  const campaignItems = [
    { label: "Women", img: "/aurore/aurore-s3-img-a.jpg", link: "/collections" },
    { label: "Men", img: "/aurore/aurore-s3-img-b.jpg", link: "/collections" },
    { label: "Bags", img: "/aurore/aurore-s3-img-c.jpg", link: "/collections" },
    { label: "Shoes", img: "/aurore/aurore-s3-img-d.jpg", link: "/collections" },
    { label: "Bridal", img: "/aurore/aurore-s3-img-e.jpg", link: "/collections" },
    { label: "Accessories", img: "/aurore/aurore-s3-img-f.jpg", link: "/collections" },
  ];

  const testimonials = [
    {
      avatar: "/aurore/aurore-tt-a.jpg",
      name: "Adaeze Okonkwo",
      role: "Lagos, Nigeria",
      rating: 5,
      quote: "Smileyque transformed my wedding vision into reality. Every stitch was perfection — I felt like royalty walking down the aisle.",
    },
    {
      avatar: "/aurore/aurore-tt-b.jpg",
      name: "Fatima Al-Hassan",
      role: "Abuja, Nigeria",
      rating: 5,
      quote: "The attention to detail is extraordinary. My Anarkali gown drew compliments all evening. Truly bespoke luxury.",
    },
  ];

  const brands = [
    { img: "/aurore/aurore-mm-a.jpg", name: "Brand A" },
    { img: "/aurore/aurore-mm-b.jpg", name: "Brand B" },
    { img: "/aurore/aurore-mm-c.jpg", name: "Brand C" },
    { img: "/aurore/aurore-mm-d.jpg", name: "Brand D" },
  ];

  const blogPosts = [
    {
      img: "/aurore/aurore-s9-img-a.jpg",
      date: "June 12, 2025",
      title: "5 Bridal Trends Redefining Nigerian Fashion in 2025",
      excerpt: "From intricate hand-beading to bold Ankara-fused silhouettes, discover the looks every bride is talking about.",
    },
    {
      img: "/aurore/aurore-s9-img-b.jpg",
      date: "May 28, 2025",
      title: "How to Style Senator Wear for Every Occasion",
      excerpt: "Senator wear has evolved far beyond formal ceremonies. Here's how to make it work for every event.",
    },
    {
      img: "/aurore/aurore-s9-img-c.jpg",
      date: "May 10, 2025",
      title: "The Art of Bespoke: What Goes Into a Smileyque Creation",
      excerpt: "Behind every piece lies a process of careful consultation, measurement, and craftsmanship. We lift the curtain.",
    },
  ];

  const instaPhotos = [
    "/aurore/aurore-pn-a.jpg",
    "/aurore/aurore-pn-b.jpg",
    "/aurore/aurore-pn-c.jpg",
    "/aurore/aurore-pn-d.jpg",
    "/aurore/aurore-pn-e.jpg",
    "/aurore/aurore-pn-f.jpg",
  ];

  return (
    <Layout>

      {/* ── 1. HERO CAROUSEL ── */}
      <HeroCarousel />

      {/* ── 2. MARQUEE STRIP ── */}
      <div className="bg-primary text-primary-foreground overflow-hidden py-3">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-inter text-xs tracking-[0.3em] uppercase mx-8">
              Women's Fashion &nbsp;•&nbsp; Men's Senator Wear &nbsp;•&nbsp; Bridal Couture &nbsp;•&nbsp; Designer Shoes &nbsp;•&nbsp; Luxury Bags &nbsp;•&nbsp; Accessories
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. TRENDING SECTION — Aurore editorial banner slider ── */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Trending</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold">Shop The Latest Trends</h2>
            </div>
            <Link to="/collections" className="font-inter text-xs tracking-[0.2em] uppercase border border-foreground text-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-all duration-300 hidden sm:block">
              View All
            </Link>
          </div>
          {/* Aurore-style sliding editorial banners */}
          <TrendingBannerSlider />
          {/* Products grid: 2 cols mobile → 3 tablet → 4 desktop */}
          <div className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {trending.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={() => setQuickViewProduct(p)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. NEW ARRIVAL SECTION ── */}
      <section className="section-padding bg-beige overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">New Arrival</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold">Fresh Off The Runway</h2>
            </div>
            <Link to="/collections" className="font-inter text-xs tracking-[0.2em] uppercase border border-foreground text-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-all duration-300 hidden sm:block">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={() => setQuickViewProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CAMPAIGN STYLES ── */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Campaign Styles</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold">Shop By Category</h2>
          </div>
          <div className="campaign-grid">
            {campaignItems.map((item) => (
              <Link key={item.label} to={item.link} className="campaign-item block">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-black/40 flex items-end p-5">
                  <p className="font-playfair text-xl font-semibold text-white tracking-wide">{item.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. BEST SELLER / FLASH SALE ── */}
      <section className="py-20 bg-brand-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
            <div>
              <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Best Seller</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-white">Discover The Best Deal</h2>
            </div>
            {/* Countdown */}
            <div className="flex items-center gap-2">
              {[
                { val: countdown.h, label: "Hrs" },
                { val: countdown.m, label: "Min" },
                { val: countdown.s, label: "Sec" },
              ].map(({ val, label }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="font-playfair text-2xl text-white font-semibold">{pad(val)}</span>
                    </div>
                    <p className="font-inter text-[10px] tracking-widest uppercase text-white/50 mt-1">{label}</p>
                  </div>
                  {i < 2 && <span className="font-playfair text-2xl text-primary mb-5">:</span>}
                </div>
              ))}
            </div>
          </div>
          {/* Products grid: 2 cols mobile → 3 tablet → 4 desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={() => setQuickViewProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. THE ESSENCE LINE ── */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Editorial</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold">The Essence Line</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["/aurore/aurore-s4-img-a.jpg", "/aurore/aurore-s4-img-b.jpg"].map((img, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden group img-zoom">
                <img src={img} alt={`Essence ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/35 transition-colors duration-500 flex items-end p-8">
                  <div>
                    <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-2">Collection</p>
                    <p className="font-playfair text-2xl text-white font-semibold">
                      {i === 0 ? "The Feminine Edit" : "The Power Silhouette"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. GOLDEN HOUR ── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 h-96 md:h-[500px]">
          {[
            "/aurore/aurore-s7-img-a.jpg",
            "/aurore/aurore-s7-img-b.jpg",
            "/aurore/aurore-s7-img-c.jpg",
            "/aurore/aurore-s7-img-d.jpg",
          ].map((img, i) => (
            <div key={i} className="relative overflow-hidden group img-zoom">
              <img src={img} alt={`Golden Hour ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-brand-black/30" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-3">Lookbook</p>
            <h2 className="font-playfair text-5xl md:text-7xl font-semibold text-white drop-shadow-lg">Golden Hour</h2>
            <div className="w-12 h-px bg-primary mx-auto my-5" />
            <Link
              to="/lookbook"
              className="pointer-events-auto font-inter text-xs tracking-[0.25em] uppercase border border-white/70 text-white px-7 py-3 hover:bg-white/10 transition-colors duration-300"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ── */}
      <section className="section-padding bg-beige">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Reviews</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold">What Our Clients Say</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 border border-border">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="font-playfair italic text-lg text-foreground/80 leading-relaxed mb-6">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 object-cover" loading="lazy" />
                  <div>
                    <p className="font-playfair font-semibold text-foreground">{t.name}</p>
                    <p className="font-inter text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. SHOP BY TOP BRANDS ── */}
      <section className="py-16 bg-background border-y border-border">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-10">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Partners</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold">Shop By Top Brands</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {brands.map((b, i) => (
              <div key={i} className="flex items-center justify-center p-4 border border-border hover:border-primary transition-colors duration-300">
                <img src={b.img} alt={b.name} className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. LATEST BLOG ── */}
      <section className="section-padding bg-beige">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Journal</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold">Latest From The Blog</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <article key={i} className="group bg-white border border-border overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden img-zoom">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <p className="font-inter text-xs text-muted-foreground mb-2 tracking-wide">{post.date}</p>
                  <h3 className="font-playfair text-lg font-semibold leading-snug mb-3 group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link
                    to="/about"
                    className="font-inter text-xs tracking-[0.2em] uppercase text-foreground border-b border-foreground pb-px hover:text-primary hover:border-primary transition-colors duration-200"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. INSTAGRAM GRID ── */}
      <section className="section-padding bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-2">Follow Us</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold">@smileyque</h2>
            <div className="gold-divider" />
            <p className="font-inter text-sm text-muted-foreground">Follow us on Instagram for daily style inspiration</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {instaPhotos.map((img, i) => (
              <a
                key={i}
                href={`https://instagram.com/smileyque`}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden group img-zoom block"
              >
                <img src={img} alt={`@smileyque post ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={(p) => setQuickViewProduct(p)}
      />
    </Layout>
  );
}
