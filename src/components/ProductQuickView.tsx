import { useEffect } from "react";
import { X, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductQuickViewProps {
    product: Product | null;
    onClose: () => void;
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    // Reset state when product changes
    useEffect(() => {
        setAdded(false);
        setSelectedSize(product?.sizes?.[0] ?? null);
        setSelectedColor(product?.colors?.[0] ?? null);
    }, [product]);

    // Close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (product) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 bg-background rounded-sm shadow-elegant w-full max-w-3xl max-h-[90vh] overflow-auto animate-fade-in-up">
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close quick view"
                    className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-background/90 border border-border hover:border-primary hover:text-primary transition-colors duration-200"
                >
                    <X size={16} />
                </button>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="img-zoom relative aspect-[3/4] md:aspect-auto md:min-h-[480px] bg-secondary overflow-hidden rounded-tl-sm rounded-bl-sm">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
                                    Trending
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-7 flex flex-col gap-5">
                        {/* Occasion */}
                        {product.occasion && (
                            <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary">
                                {product.occasion}
                            </p>
                        )}

                        <div>
                            <h2 className="font-playfair text-2xl font-semibold leading-snug mb-2">
                                {product.name}
                            </h2>
                            <p className="font-playfair text-xl font-medium text-primary">
                                {product.price}
                            </p>
                        </div>

                        <div className="w-10 h-px bg-primary" />

                        <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <p className="font-inter text-xs tracking-[0.2em] uppercase text-foreground/60 mb-2">
                                    Color: <span className="text-foreground font-medium">{selectedColor}</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "font-inter text-xs px-3 py-1.5 rounded-sm border transition-all duration-200",
                                                selectedColor === color
                                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                                    : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                                            )}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <p className="font-inter text-xs tracking-[0.2em] uppercase text-foreground/60 mb-2">
                                    Size: <span className="text-foreground font-medium">{selectedSize}</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "font-inter text-xs w-12 py-1.5 rounded-sm border text-center transition-all duration-200",
                                                selectedSize === size
                                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                                    : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 font-inter text-sm tracking-[0.2em] uppercase py-4 rounded-sm border transition-all duration-300 mt-auto",
                                added
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-foreground text-background border-foreground hover:bg-primary hover:border-primary"
                            )}
                        >
                            {added ? (
                                <><Check size={16} /> Added to Cart</>
                            ) : (
                                <><ShoppingBag size={16} /> Add to Cart</>
                            )}
                        </button>

                        <p className="font-inter text-xs text-muted-foreground text-center">
                            Crafted to order · Tailored to your measurements
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
