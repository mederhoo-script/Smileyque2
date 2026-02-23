/**
 * ProductQuickView — Aurore-style full-page product overlay
 *
 * Layout matches the Aurore quick view which loads a full product page:
 *   • Left: main image + thumbnail strip (front / back / side / detail)
 *   • Right: tag, name, stars, price, description, colour swatches, size buttons,
 *            qty stepper, Add-to-Cart, WhatsApp, accordion tabs
 *   • Bottom: "You May Also Like" horizontal product strip
 */

import { useEffect, useState, useRef, useCallback } from "react";
import {
  X, Star, Minus, Plus, ShoppingBag, Check,
  ChevronLeft, ChevronRight, Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Product, products as allProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { buildWhatsAppOrderUrl } from "@/config/brand";
import { getSwatchColor } from "@/lib/colorMap";

interface Props {
  product: Product | null;
  onClose: () => void;
  onNavigate?: (p: Product) => void; // called when user clicks a related product
}

const PRODUCT_RATING = 5; // displayed as static rating; replace with real data when reviews are implemented
const TABS = ["Description", "Details & Care", "Shipping"] as const;
type Tab = typeof TABS[number];

const TAB_CONTENT: Record<Tab, string> = {
  "Description":
    "Each Smileyque piece is handcrafted to order. We take your exact measurements during consultation to ensure a perfect, bespoke fit. Our master tailors use only premium fabrics sourced from global textile houses.",
  "Details & Care":
    "• Dry clean only  •  Do not tumble dry  •  Store in a breathable garment bag  •  Iron on low heat with a pressing cloth  •  Fabric: Premium blend as described per style",
  "Shipping":
    "All orders are made-to-measure and require 2–4 weeks production time. Delivery is available nationwide across Nigeria. International shipping available on request. Contact us via WhatsApp to confirm availability.",
};

export default function ProductQuickView({ product, onClose, onNavigate }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab | null>("Description");

  // Touch/swipe on main image
  const touchStartX = useRef(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Reset state when product changes
  useEffect(() => {
    setAdded(false);
    setActiveImg(0);
    setQty(1);
    setSelectedSize(product?.sizes?.[0] ?? null);
    setSelectedColor(product?.colors?.[0] ?? null);
    setActiveTab("Description");  }, [product]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  // ESC to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Build gallery — must be above the early return so that goImg (a hook) is
  // always called the same number of times regardless of whether product is null.
  // (Rules of Hooks: hooks must not be conditional on render-to-render state.)
  const gallery: string[] = product?.images?.length
    ? product.images
    : product
      ? [product.image]
      : [];

  const goImg = useCallback((dir: 1 | -1) => {
    if (gallery.length === 0) return;
    setActiveImg(i => ((i + dir + gallery.length) % gallery.length));
  }, [gallery.length]);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const waUrl = buildWhatsAppOrderUrl([{ name: product.name, quantity: qty }]);

  // Related products: same category, excluding current
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    /* ── FULL-PAGE OVERLAY ── */
    <div
      className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* ── Close button ── */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center bg-white border border-border shadow-sm hover:bg-foreground hover:text-white transition-colors duration-200"
      >
        <X size={16} />
      </button>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-border px-6 py-3 flex items-center gap-2 font-inter text-xs text-muted-foreground">
        <button onClick={onClose} className="hover:text-primary transition-colors duration-150">Home</button>
        <span>/</span>
        <Link to="/collections" onClick={onClose} className="hover:text-primary transition-colors duration-150">{product.category}</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 lg:gap-14">

        {/* ════ LEFT: IMAGE GALLERY ════ */}
        <div className="md:w-[52%] flex-shrink-0">
          <div className="flex flex-col-reverse md:flex-row gap-3">

            {/* Thumbnail strip */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto max-h-none md:max-h-[520px] scrollbar-none flex-shrink-0">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "flex-shrink-0 w-16 h-20 md:w-18 md:h-24 border-2 overflow-hidden transition-all duration-150",
                    i === activeImg ? "border-foreground" : "border-transparent hover:border-border"
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div
              ref={galleryRef}
              className="relative flex-1 aspect-[3/4] bg-secondary overflow-hidden select-none"
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 40) goImg(dx < 0 ? 1 : -1);
              }}
            >
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="eager"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                {product.originalPrice && (
                  <span className="font-inter text-[9px] tracking-[0.15em] uppercase bg-red-600 text-white px-2 py-0.5">SALE</span>
                )}
                {product.isNew && (
                  <span className="font-inter text-[9px] tracking-[0.15em] uppercase bg-foreground text-background px-2 py-0.5">NEW</span>
                )}
                {product.isTrending && (
                  <span className="font-inter text-[9px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-2 py-0.5">TREND</span>
                )}
              </div>

              {/* Prev/Next arrows on main image */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => goImg(-1)}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white border border-border transition-colors duration-150"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => goImg(1)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white border border-border transition-colors duration-150"
                  >
                    <ChevronRight size={16} />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={cn(
                          "transition-all duration-200",
                          i === activeImg
                            ? "w-5 h-[3px] bg-primary"
                            : "w-[5px] h-[5px] rounded-full bg-white/60 hover:bg-white"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ════ RIGHT: PRODUCT DETAILS ════ */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Tag */}
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-primary">
            {product.occasion ?? product.category}
          </p>

          {/* Name */}
          <h1 className="font-playfair text-2xl md:text-3xl font-semibold leading-snug text-foreground">
            {product.name}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: PRODUCT_RATING }).map((_, s) => (
              <Star key={s} size={13} className="fill-primary text-primary" />
            ))}
            <span className="font-inter text-[11px] text-muted-foreground ml-2">{PRODUCT_RATING}.0</span>
          </div>

          {/* Price */}
          {/* Price — sale + struck-through original when discounted */}
          {product.originalPrice ? (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-playfair text-2xl font-bold text-red-600">{product.price}</span>
              <span className="font-playfair text-lg text-muted-foreground line-through">{product.originalPrice}</span>
              {product.originalPriceValue && product.originalPriceValue > 0 && (
                <span className="font-inter text-xs font-semibold tracking-wide bg-red-600 text-white px-2 py-0.5 self-center">
                  -{Math.round((1 - product.priceValue / product.originalPriceValue) * 100)}% OFF
                </span>
              )}
            </div>
          ) : (
            <p className="font-playfair text-2xl font-bold text-foreground">{product.price}</p>
          )}

          <div className="w-10 h-px bg-primary" />

          {/* Short description */}
          <p className="font-inter text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Colour swatches */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5">
                Colour: <span className="text-foreground font-medium">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    title={color}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all duration-150",
                      selectedColor === color
                        ? "border-foreground scale-110 shadow-sm"
                        : "border-transparent hover:border-foreground/40"
                    )}
                    style={{ backgroundColor: getSwatchColor(color) }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5">
                Size: <span className="text-foreground font-medium">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "font-inter text-xs w-12 h-10 border transition-all duration-150",
                      selectedSize === size
                        ? "border-foreground bg-foreground text-white"
                        : "border-border text-foreground hover:border-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-stretch gap-3">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-12 flex items-center justify-center hover:bg-secondary transition-colors duration-150"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-inter text-sm font-medium select-none">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                aria-label="Increase quantity"
                className="w-10 h-12 flex items-center justify-center hover:bg-secondary transition-colors duration-150"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 font-inter text-xs tracking-[0.2em] uppercase h-12 transition-all duration-200",
                added
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground text-white hover:bg-primary"
              )}
            >
              {added ? <><Check size={15} /> Added</> : <><ShoppingBag size={15} /> Add to Cart</>}
            </button>

            <button
              aria-label="Add to wishlist"
              className="w-12 h-12 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors duration-150"
            >
              <Heart size={16} />
            </button>
          </div>

          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center font-inter text-xs tracking-[0.2em] uppercase border border-border text-foreground py-3 hover:bg-foreground hover:text-white hover:border-foreground transition-all duration-200"
          >
            Order via WhatsApp
          </a>

          <p className="font-inter text-[10px] text-muted-foreground text-center">
            Crafted to order · Tailored to your measurements · 2–4 weeks delivery
          </p>

          {/* ── Accordion tabs: Description / Details / Shipping ── */}
          <div className="border-t border-border mt-2">
            {TABS.map(tab => (
              <div key={tab} className="border-b border-border">
                <button
                  onClick={() => setActiveTab(t => t === tab ? null : tab)}
                  className="w-full flex items-center justify-between py-4 font-inter text-xs tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors duration-150"
                >
                  {tab}
                  <span className="text-lg leading-none">{activeTab === tab ? "−" : "+"}</span>
                </button>
                {activeTab === tab && (
                  <div className="pb-4 font-inter text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.fullDescription && tab === "Description"
                      ? product.fullDescription
                      : TAB_CONTENT[tab]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ RELATED PRODUCTS: "You May Also Like" ════ */}
      {related.length > 0 && (
        <section className="border-t border-border bg-gray-50 px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-primary mb-2">Discover More</p>
              <h2 className="font-playfair text-2xl md:text-3xl font-semibold">You May Also Like</h2>
            </div>
            {/* Horizontal scrolling product strip */}
            <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
              {related.map(p => (
                <button
                  key={p.id}
                  onClick={() => onNavigate ? onNavigate(p) : undefined}
                  className="flex-shrink-0 w-44 md:w-52 text-left group"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-secondary mb-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-playfair text-sm font-medium leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-150">
                    {p.name}
                  </p>
                  <p className="font-inter text-xs font-semibold text-foreground mt-1">{p.price}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
