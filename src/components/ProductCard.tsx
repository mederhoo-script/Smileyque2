import { Heart, ArrowLeftRight, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { getSwatchColor } from "@/lib/colorMap";

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: () => void;
}

export default function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col bg-white overflow-hidden relative",
        className
      )}
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
        {/* Primary image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.originalPrice && (
            <span className="font-inter text-[9px] tracking-[0.15em] uppercase bg-red-600 text-white px-2 py-0.5">
              SALE
            </span>
          )}
          {product.isNew && (
            <span className="font-inter text-[9px] tracking-[0.15em] uppercase bg-foreground text-background px-2 py-0.5">
              NEW
            </span>
          )}
          {product.isTrending && (
            <span className="font-inter text-[9px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-2 py-0.5">
              TREND
            </span>
          )}
        </div>

        {/* ── ZONE B: top-right icon buttons (hover) ── */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            aria-label="Add to wishlist"
            title="Add to wishlist"
            className="w-9 h-9 flex items-center justify-center bg-white shadow-sm hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <Heart size={14} />
          </button>
          <button
            aria-label="Compare"
            title="Compare"
            className="w-9 h-9 flex items-center justify-center bg-white shadow-sm hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <ArrowLeftRight size={14} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(); }}
              aria-label="Quick view"
              title="Quick view"
              className="w-9 h-9 flex items-center justify-center bg-white shadow-sm hover:bg-primary hover:text-white transition-colors duration-200"
            >
              <Eye size={14} />
            </button>
          )}
        </div>

        {/* ── ZONE A: bottom "Quick View" button (hover) ── */}
        {onQuickView && (
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(); }}
              className="w-full font-inter text-[10px] tracking-[0.25em] uppercase bg-white/95 text-foreground py-3 hover:bg-foreground hover:text-white transition-colors duration-200"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* ── ZONE D: product info below image ── */}
      <div className="flex flex-col gap-1.5 pt-3 pb-2 px-1">
        <h3 className="font-playfair text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>

        {/* Price — sale price + struck-through original when discounted */}
        {product.originalPrice ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-inter text-sm font-semibold text-red-600">
              {product.price}
            </span>
            <span className="font-inter text-xs text-muted-foreground line-through">
              {product.originalPrice}
            </span>
          </div>
        ) : (
          <p className="font-inter text-sm font-semibold text-foreground">
            {product.price}
          </p>
        )}

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-0.5" role="list" aria-label="Available colours">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color}
                role="listitem"
                aria-label={color}
                title={color}
                className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0 cursor-default"
                style={{ backgroundColor: getSwatchColor(color) }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="font-inter text-[9px] text-muted-foreground" aria-label={`${product.colors.length - 5} more colours`}>
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
