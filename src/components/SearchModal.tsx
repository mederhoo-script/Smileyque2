import { useEffect, useState, useMemo } from "react";
import { X, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { products, ProductCategory, ProductOccasion, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onQuickView: (product: Product) => void;
}

type SortOption = "newest" | "popular" | "price-asc" | "price-desc";

const priceRanges = [
    { label: "Under ₦50,000", min: 0, max: 50000 },
    { label: "₦50,000 – ₦150,000", min: 50000, max: 150000 },
    { label: "₦150,000 – ₦300,000", min: 150000, max: 300000 },
    { label: "₦300,000+", min: 300000, max: Infinity },
];

const occasions: ProductOccasion[] = ["Formal", "Wedding", "Casual", "Party", "Traditional", "Any"];

export default function SearchModal({ isOpen, onClose, onQuickView }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All");
    const [selectedOccasion, setSelectedOccasion] = useState<ProductOccasion | "">("");
    const [selectedPriceRange, setSelectedPriceRange] = useState<number>(-1);
    const [sort, setSort] = useState<SortOption>("newest");
    const [showFilters, setShowFilters] = useState(false);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedCategory("All");
            setSelectedOccasion("");
            setSelectedPriceRange(-1);
            setSort("newest");
            // Focus the search input
            setTimeout(() => {
                document.getElementById("search-input")?.focus();
            }, 100);
        }
    }, [isOpen]);

    // ESC to close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Text search
        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Occasion filter
        if (selectedOccasion) {
            result = result.filter((p) => p.occasion === selectedOccasion || p.occasion === "Any");
        }

        // Price range filter
        if (selectedPriceRange >= 0) {
            const range = priceRanges[selectedPriceRange];
            result = result.filter(
                (p) => p.priceValue >= range.min && p.priceValue <= range.max
            );
        }

        // Sort
        switch (sort) {
            case "price-asc":
                result.sort((a, b) => a.priceValue - b.priceValue);
                break;
            case "price-desc":
                result.sort((a, b) => b.priceValue - a.priceValue);
                break;
            case "popular":
                result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
                break;
            case "newest":
            default:
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
        }

        return result;
    }, [query, selectedCategory, selectedOccasion, selectedPriceRange, sort]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            {/* Header */}
            <div className="border-b border-border px-4 md:px-8 py-4 flex items-center gap-4 flex-shrink-0">
                <Search size={20} className="text-muted-foreground flex-shrink-0" />
                <input
                    id="search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for gowns, senator wear, bridal…"
                    className="flex-1 font-inter text-base bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
                <div className="w-px h-6 bg-border" />
                <button
                    onClick={onClose}
                    aria-label="Close search"
                    className="flex items-center gap-1.5 font-inter text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={18} />
                    <span className="hidden sm:inline">Close</span>
                </button>
            </div>

            {/* Filter + Sort bar */}
            <div className="border-b border-border px-4 md:px-8 py-3 flex items-center gap-3 flex-wrap flex-shrink-0 bg-muted/30">
                {/* Toggle filters */}
                <button
                    onClick={() => setShowFilters((v) => !v)}
                    className={cn(
                        "flex items-center gap-1.5 font-inter text-xs tracking-wide border rounded-full px-3 py-1.5 transition-colors",
                        showFilters
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                    )}
                >
                    <SlidersHorizontal size={13} />
                    Filters
                    <ChevronDown size={13} className={cn("transition-transform", showFilters && "rotate-180")} />
                </button>

                {/* Sort */}
                <div className="flex items-center gap-1.5 ml-auto">
                    <span className="font-inter text-xs text-muted-foreground">Sort:</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        className="font-inter text-xs bg-background border border-border rounded-full px-3 py-1.5 outline-none focus:border-primary cursor-pointer"
                    >
                        <option value="newest">Newest</option>
                        <option value="popular">Most Popular</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                    </select>
                </div>

                {/* Results count */}
                <span className="font-inter text-xs text-muted-foreground">
                    {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Collapsible filter panel */}
            {showFilters && (
                <div className="border-b border-border px-4 md:px-8 py-4 flex flex-wrap gap-6 flex-shrink-0 bg-muted/20">
                    {/* Category */}
                    <div>
                        <p className="font-inter text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Category</p>
                        <div className="flex flex-wrap gap-2">
                            {(["All", ...categories.filter((c) => c !== "All")] as ProductCategory[]).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "font-inter text-xs px-3 py-1.5 rounded-full border transition-all",
                                        selectedCategory === cat
                                            ? "border-primary bg-primary/10 text-primary font-semibold"
                                            : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <p className="font-inter text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Price</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedPriceRange(-1)}
                                className={cn(
                                    "font-inter text-xs px-3 py-1.5 rounded-full border transition-all",
                                    selectedPriceRange === -1
                                        ? "border-primary bg-primary/10 text-primary font-semibold"
                                        : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                                )}
                            >
                                Any Price
                            </button>
                            {priceRanges.map((range, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedPriceRange(i)}
                                    className={cn(
                                        "font-inter text-xs px-3 py-1.5 rounded-full border transition-all",
                                        selectedPriceRange === i
                                            ? "border-primary bg-primary/10 text-primary font-semibold"
                                            : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Occasion */}
                    <div>
                        <p className="font-inter text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Occasion</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedOccasion("")}
                                className={cn(
                                    "font-inter text-xs px-3 py-1.5 rounded-full border transition-all",
                                    selectedOccasion === ""
                                        ? "border-primary bg-primary/10 text-primary font-semibold"
                                        : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                                )}
                            >
                                All Occasions
                            </button>
                            {occasions.map((occ) => (
                                <button
                                    key={occ}
                                    onClick={() => setSelectedOccasion(occ)}
                                    className={cn(
                                        "font-inter text-xs px-3 py-1.5 rounded-full border transition-all",
                                        selectedOccasion === occ
                                            ? "border-primary bg-primary/10 text-primary font-semibold"
                                            : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {occ}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Results grid */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Search size={40} className="text-muted-foreground/30 mb-4" />
                        <p className="font-playfair text-xl text-muted-foreground mb-2">No results found</p>
                        <p className="font-inter text-sm text-muted-foreground">
                            Try adjusting your filters or search term
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onQuickView={() => onQuickView(product)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
