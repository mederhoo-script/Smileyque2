import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCategory, categories } from "@/data/products";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<ProductCategory, { emoji: string; label: string }> = {
    All: { emoji: "✨", label: "All" },
    Women: { emoji: "👗", label: "Women" },
    Men: { emoji: "👔", label: "Men" },
    Bridal: { emoji: "💍", label: "Bridal" },
    Shoes: { emoji: "👠", label: "Shoes" },
    Bags: { emoji: "👜", label: "Bags" },
    Accessories: { emoji: "💎", label: "Accessories" },
};

interface CategoryBarProps {
    selected: ProductCategory;
    onSelect: (cat: ProductCategory) => void;
}

export default function CategoryBar({ selected, onSelect }: CategoryBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    };

    return (
        <div className="sticky top-16 md:top-20 z-30 bg-background border-b border-border shadow-sm">
            <div className="relative flex items-center max-w-7xl mx-auto px-4">
                {/* Left arrow */}
                <button
                    onClick={() => scroll("left")}
                    className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Scroll categories left"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Scrollable category list */}
                <div
                    ref={scrollRef}
                    className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 px-1 flex-1"
                >
                    {categories.map((cat) => {
                        const meta = CATEGORY_META[cat];
                        const isSelected = selected === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => onSelect(cat)}
                                className={cn(
                                    "shrink-0 flex flex-col items-center gap-1 px-5 py-2 rounded-sm font-inter text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-200",
                                    isSelected
                                        ? "bg-primary/10 text-primary border border-primary/30 font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                                )}
                            >
                                <span className="text-lg leading-none">{meta.emoji}</span>
                                <span>{meta.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right arrow */}
                <button
                    onClick={() => scroll("right")}
                    className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Scroll categories right"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
