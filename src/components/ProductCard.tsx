import { useState } from "react";
import { ShoppingBag, Check, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: () => void;
}

export default function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article
      className={cn(
        "group flex flex-col bg-card border border-border rounded-sm overflow-hidden shadow-elegant hover:shadow-gold transition-shadow duration-400",
        className
      )}
    >
      {/* Image */}
      <div className="img-zoom relative aspect-[3/4] bg-secondary overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="font-inter text-[10px] tracking-[0.2em] uppercase bg-background/90 text-foreground px-2.5 py-1 rounded-sm">
            {product.category}
          </span>
          {product.isNew && (
            <span className="font-inter text-[10px] tracking-[0.2em] uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded-sm">
              New
            </span>
          )}
          {product.isTrending && (
            <span className="font-inter text-[10px] tracking-[0.2em] uppercase bg-brand-black text-white px-2.5 py-1 rounded-sm">
              🔥 Hot
            </span>
          )}
        </div>

        {/* Quick View overlay — appears on hover */}
        {onQuickView && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-brand-black/40 to-transparent">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(); }}
              className="flex items-center gap-1.5 font-inter text-xs tracking-[0.15em] uppercase bg-background/95 text-foreground px-4 py-2 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-200 shadow-elegant"
            >
              <Eye size={13} />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-playfair text-base font-semibold leading-snug">
            {product.name}
          </h3>
          <p className="font-inter text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {product.description}
          </p>
          {/* Color dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="font-inter text-[10px] text-muted-foreground">
                {product.colors.slice(0, 3).join(" · ")}
                {product.colors.length > 3 && ` +${product.colors.length - 3}`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="font-playfair text-sm font-medium text-primary">
          {product.price}
        </span>

        <button
          onClick={handleAddToCart}
          className={cn(
            "flex items-center gap-1.5 font-inter text-xs tracking-widest uppercase px-1 py-2 rounded-sm border transition-all duration-200",
            added
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
        >
          {added ? (
            <><Check size={12} /> Added</>
          ) : (
            <><ShoppingBag size={12} /> Add</>
          )}
        </button>
      </div>
    </article>
  );
}
