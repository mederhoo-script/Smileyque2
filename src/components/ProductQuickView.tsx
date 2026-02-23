import { useEffect, useState } from "react";
import { X, Star, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { buildWhatsAppOrderUrl } from "@/config/brand";

interface ProductQuickViewProps {
    product: Product | null;
    onClose: () => void;
}

// Color name → CSS color
const COLOR_MAP: Record<string, string> = {
    ivory: "#FFFFF0", black: "#1a1a1a", white: "#FFFFFF", gold: "#C9A96E",
    navy: "#1B2A4A", red: "#C0392B", blue: "#2980B9", green: "#27AE60",
    pink: "#E91E8C", purple: "#8E44AD", brown: "#795548", beige: "#F5F0E8",
    cream: "#FFFDD0", silver: "#B2BEB5", grey: "#9E9E9E", gray: "#9E9E9E",
    orange: "#E67E22", yellow: "#F1C40F", turquoise: "#1ABC9C",
    burgundy: "#800020", maroon: "#800000", coral: "#FF6B6B",
    "rose gold": "#B76E79", rose: "#E8B4B8", "midnight blue": "#191970",
    midnight: "#191970", sand: "#C2B280", wine: "#722F37",
    champagne: "#F7E7CE", olive: "#808000", charcoal: "#36454F",
    teal: "#008080", peach: "#FFCBA4", lilac: "#C8A2C8",
    emerald: "#50C878", cobalt: "#0047AB", mustard: "#FFDB58",
};

function getSwatchColor(name: string): string {
    const lower = name.toLowerCase();
    for (const [key, val] of Object.entries(COLOR_MAP)) {
        if (lower.includes(key)) return val;
    }
    return "#D4AF37";
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        setAdded(false);
        setQty(1);
        setSelectedSize(product?.sizes?.[0] ?? null);
        setSelectedColor(product?.colors?.[0] ?? null);
    }, [product]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = product ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2200);
    };

    const waUrl = buildWhatsAppOrderUrl([{ name: product.name, quantity: qty }]);

    return (
        /* ── OVERLAY ── */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
        >
            {/* Dark backdrop */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
            />

            {/* ── MODAL PANEL ── */}
            <div className="relative z-10 bg-white w-full max-w-4xl mx-4 max-h-[92vh] overflow-y-auto flex flex-col md:flex-row animate-fade-in-up shadow-2xl">

                {/* ── Close button ── */}
                <button
                    onClick={onClose}
                    aria-label="Close quick view"
                    className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center border border-border bg-white hover:bg-foreground hover:text-white transition-colors duration-200"
                >
                    <X size={16} />
                </button>

                {/* ── LEFT: Product Image ── */}
                <div className="md:w-[45%] flex-shrink-0 bg-secondary">
                    <div className="relative w-full aspect-[3/4]">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
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
                    </div>
                </div>

                {/* ── RIGHT: Product Details ── */}
                <div className="flex-1 flex flex-col gap-5 p-7 md:p-9 overflow-y-auto">

                    {/* Category / occasion tag */}
                    <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-primary">
                        {product.occasion ?? product.category}
                    </p>

                    {/* Product name */}
                    <h2 className="font-playfair text-2xl md:text-3xl font-semibold leading-snug text-foreground">
                        {product.name}
                    </h2>

                    {/* Star rating (static) */}
                    <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={13} className="fill-primary text-primary" />
                        ))}
                        <span className="font-inter text-[11px] text-muted-foreground ml-1">(12 reviews)</span>
                    </div>

                    {/* Price */}
                    <p className="font-playfair text-2xl font-semibold text-foreground">
                        {product.price}
                    </p>

                    {/* Divider */}
                    <div className="w-10 h-px bg-primary" />

                    {/* Short description */}
                    <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    {/* Color swatches */}
                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5">
                                Color: <span className="text-foreground font-medium">{selectedColor}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        title={color}
                                        className={cn(
                                            "w-6 h-6 rounded-full border-2 transition-all duration-150",
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
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "font-inter text-xs w-11 h-10 border transition-all duration-150",
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

                    {/* Quantity + Add to cart row */}
                    <div className="flex items-stretch gap-3 mt-auto">
                        {/* Qty stepper */}
                        <div className="flex items-center border border-border">
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                aria-label="Decrease quantity"
                                className="w-10 h-12 flex items-center justify-center hover:bg-secondary transition-colors duration-150"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-inter text-sm font-medium select-none">
                                {qty}
                            </span>
                            <button
                                onClick={() => setQty((q) => q + 1)}
                                aria-label="Increase quantity"
                                className="w-10 h-12 flex items-center justify-center hover:bg-secondary transition-colors duration-150"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 font-inter text-xs tracking-[0.2em] uppercase h-12 transition-all duration-200",
                                added
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-foreground text-white hover:bg-primary"
                            )}
                        >
                            {added ? (
                                <><Check size={15} /> Added to Cart</>
                            ) : (
                                <><ShoppingBag size={15} /> Add to Cart</>
                            )}
                        </button>
                    </div>

                    {/* WhatsApp order */}
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center font-inter text-xs tracking-[0.2em] uppercase border border-border text-foreground py-3 hover:bg-foreground hover:text-white hover:border-foreground transition-all duration-200"
                    >
                        Order via WhatsApp
                    </a>

                    <p className="font-inter text-[10px] text-muted-foreground text-center">
                        Crafted to order · Tailored to your measurements
                    </p>
                </div>
            </div>
        </div>
    );
}
