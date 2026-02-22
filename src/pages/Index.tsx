import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryBar from "@/components/CategoryBar";
import SkeletonCard from "@/components/SkeletonCard";
import { products, ProductCategory } from "@/data/products";
import { Product } from "@/data/products";
import { brand } from "@/config/brand";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

// ─── Animated section wrapper ───────────────────────────────────────────────
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </section>
  );
}

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate skeleton load on first mount
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Filter products by selected category
  const displayProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <Layout>
      {/* ── HERO ── (original) */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={brand.heroImage}
            alt="Smileyque luxury fashion hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/30 to-brand-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 flex flex-col items-center">
          <p className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-5 animate-fade-in-up opacity-0 animate-delay-100">
            Luxury Bespoke Fashion
          </p>
          <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-semibold text-background leading-none tracking-widest mb-4 animate-fade-in-up opacity-0 animate-delay-200">
            {brand.brandName}
          </h1>
          <p className="font-playfair italic text-xl md:text-3xl text-background/85 mb-2 animate-fade-in-up opacity-0 animate-delay-200">
            {brand.tagline}
          </p>
          <div className="w-12 h-px bg-primary my-6 animate-fade-in-up opacity-0 animate-delay-300" />
          <p className="font-inter text-sm text-background/70 max-w-md leading-relaxed mb-10 animate-fade-in-up opacity-0 animate-delay-300">
            {brand.subTagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up opacity-0 animate-delay-300">
            <Link
              to="/collections"
              className="font-inter text-sm tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-gold-light transition-colors duration-300 shadow-gold"
            >
              Shop Now
            </Link>
            <Link
              to="/lookbook"
              className="font-inter text-sm tracking-[0.2em] uppercase border border-background/60 text-background px-8 py-4 hover:bg-background/10 transition-colors duration-300"
            >
              View Lookbook
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-inter text-[10px] tracking-[0.25em] uppercase text-background/50">Scroll</span>
          <div className="w-px h-8 bg-background/30" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-primary text-primary-foreground overflow-hidden py-3">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-inter text-xs tracking-[0.3em] uppercase mx-8">
              Women's Fashion &nbsp;•&nbsp; Men's Senator Wear &nbsp;•&nbsp; Bridal Couture &nbsp;•&nbsp; Designer Shoes &nbsp;•&nbsp; Luxury Bags
            </span>
          ))}
        </div>
      </div>

      {/* ── SLIDING FEATURED SECTION ── */}
      <HeroCarousel />

      {/* ── CATEGORY BAR ── */}
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />


      {/* ── FEATURED / ALL PRODUCTS GRID ── */}
      <section className="section-padding bg-background">
        <div className="text-center mb-14">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
            {selectedCategory === "All" ? "Curated Selection" : selectedCategory}
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold">
            {selectedCategory === "All" ? "All Collections" : `${selectedCategory} Collection`}
          </h2>
          <div className="gold-divider" />
          <p className="font-inter text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Handpicked pieces that embody the Smileyque aesthetic — bold, refined, and unmistakably you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => setQuickViewProduct(product)}
              />
            ))}
        </div>

        {!isLoading && displayProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl text-muted-foreground">No items in this category yet</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/collections"
            className="font-inter text-sm tracking-[0.2em] uppercase border border-foreground text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 inline-block"
          >
            View All Collections
          </Link>
        </div>
      </section>


      {/* ── BRAND PROMISE ── */}
      <AnimatedSection className="bg-beige section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-4">
            The Smileyque Promise
          </p>
          <blockquote className="font-playfair italic text-3xl md:text-4xl leading-relaxed text-foreground/90">
            "Every stitch is a declaration. Every silhouette, a story worth telling."
          </blockquote>
          <div className="gold-divider mt-8" />
          <p className="font-inter text-sm text-muted-foreground mt-4">
            Crafted to order. Tailored to perfection. Delivered with care.
          </p>
        </div>
      </AnimatedSection>

      {/* ── NEW ARRIVALS SPOTLIGHT ── */}
      <AnimatedSection className="section-padding bg-background">
        <div className="text-center mb-14">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Just Dropped
          </p>
          <h2 className="font-playfair text-4xl font-semibold">New Arrivals</h2>
          <div className="gold-divider" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {products
            .filter((p) => p.isNew)
            .slice(0, 8)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => setQuickViewProduct(product)}
              />
            ))}
        </div>
      </AnimatedSection>

      {/* ── TRENDING NOW ── */}
      <AnimatedSection className="section-padding bg-beige">
        <div className="text-center mb-14">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
            🔥 Trending
          </p>
          <h2 className="font-playfair text-4xl font-semibold">Most Popular</h2>
          <div className="gold-divider" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {products
            .filter((p) => p.isTrending)
            .slice(0, 8)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => setQuickViewProduct(product)}
              />
            ))}
        </div>
      </AnimatedSection>

      {/* ── HOW IT WORKS ── */}
      <AnimatedSection className="section-padding bg-background">
        <div className="text-center mb-14">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Simple &amp; Personal
          </p>
          <h2 className="font-playfair text-4xl font-semibold">How to Order</h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {[
            {
              step: "01",
              title: "Browse & Select",
              desc: "Explore our collections and add your desired pieces to your cart.",
            },
            {
              step: "02",
              title: "Send via WhatsApp",
              desc: "Click 'Send Order via WhatsApp' — your selections are pre-filled automatically.",
            },
            {
              step: "03",
              title: "We Craft & Deliver",
              desc: "We confirm your measurements, craft your piece, and arrange delivery.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <p className="font-playfair text-5xl font-semibold text-primary/30 mb-3">
                {step}
              </p>
              <h3 className="font-playfair text-lg font-semibold mb-2">{title}</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── FULL-WIDTH CTA BANNER ── */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden">
        <img
          src="/images/complete/fashion29.jpg"
          alt="Smileyque fashion editorial"
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-brand-black/65" />
        <div className="relative z-10 text-center px-6">
          <h2 className="font-playfair text-4xl md:text-5xl text-background font-semibold mb-6">
            Your Story. Your Style.
          </h2>
          <Link
            to="/collections"
            className="font-inter text-sm tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-gold-light transition-colors duration-300"
          >
            Shop Collections
          </Link>
        </div>
      </section>

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </Layout>
  );
}
