import { useState, useEffect, useCallback, useRef } from "react";
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
    miniProducts: MiniProduct[];
}

const slides: Slide[] = [
    {
        bg: "/aurore/aurore-s1-bg-a.jpg",
        tag: "New Arrivals",
        title: "Wear Your\nStory",
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
        title: "Cape\nCollection",
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
        title: "Your Perfect\nDay",
        miniProducts: [
            { image: "/images/girl/4d65e36a-cbb1-44cd-80f1-16a19c5dafc5.jpeg", name: "Bridal Ball Gown", price: "₦350,000" },
            { image: "/images/men/fashion6.jpg", name: "Groom's Agbada", price: "₦120,000" },
            { image: "/images/bags/0fd0dea2-1481-4524-9d52-cbaf9d8b1c06.jpeg", name: "Bridal Handbag", price: "₦55,000" },
            { image: "/images/shoes/fashion6.jpg", name: "Bridal Court Shoe", price: "₦42,000" },
        ],
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Touch/swipe tracking
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const goTo = useCallback(
        (index: number) => {
            if (isAnimating) return;
            setIsAnimating(true);
            setCurrent((index + slides.length) % slides.length);
            setTimeout(() => setIsAnimating(false), 700);
        },
        [isAnimating]
    );

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next, isPaused]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [next, prev]);

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        setIsPaused(true);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        // Only trigger if horizontal swipe is dominant
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) next();
            else prev();
        }
        touchStartX.current = null;
        touchStartY.current = null;
        setIsPaused(false);
    };

    const slide = slides[current];

    return (
        <section
            className="relative flex h-screen min-h-[600px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ── LEFT PANEL (65%) ── */}
            <div className="relative w-full md:w-[65%] h-full overflow-hidden">
                {/* Background slides */}
                {slides.map((s, i) => (
                    <div
                        key={i}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-700",
                            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    >
                        <img
                            src={s.bg}
                            alt={s.title}
                            className="w-full h-full object-cover object-center"
                            loading={i === 0 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-brand-black/55" />
                    </div>
                ))}

                {/* Left content */}
                <div className="relative z-20 h-full flex flex-col justify-center px-10 md:px-16 lg:px-20 pb-20">
                    <p
                        key={`tag-${current}`}
                        className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-6 animate-fade-in-up"
                    >
                        {slide.tag}
                    </p>
                    <h1
                        key={`title-${current}`}
                        className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white leading-tight tracking-wide mb-10 animate-fade-in-up whitespace-pre-line"
                        style={{ animationDelay: "0.1s" }}
                    >
                        {slide.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <Link
                            to="/collections"
                            className="font-inter text-xs tracking-[0.25em] uppercase bg-primary text-primary-foreground px-7 py-4 hover:bg-gold-light transition-colors duration-300"
                        >
                            Shop This Look
                        </Link>
                        <Link
                            to="/lookbook"
                            className="font-inter text-xs tracking-[0.25em] uppercase border border-white/60 text-white px-7 py-4 hover:bg-white/10 transition-colors duration-300"
                        >
                            Discover More
                        </Link>
                    </div>
                </div>

                {/* Slide arrows — bottom left */}
                <div className="absolute bottom-8 left-10 md:left-16 z-20 flex items-center gap-3">
                    <button
                        onClick={prev}
                        aria-label="Previous slide"
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/40 text-white transition-all duration-200"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next slide"
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/40 text-white transition-all duration-200"
                    >
                        <ChevronRight size={18} />
                    </button>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-2 ml-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={cn(
                                    "transition-all duration-300",
                                    i === current
                                        ? "w-6 h-1.5 bg-primary"
                                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (35%) ── */}
            <div className="hidden md:flex md:w-[35%] h-full bg-white flex-col justify-center border-l border-border">
                <div className="flex flex-col divide-y divide-border">
                    {slide.miniProducts.map((p, i) => (
                        <Link
                            key={i}
                            to="/collections"
                            className="flex items-center gap-3 px-5 py-4 hover:bg-beige transition-colors duration-200 group"
                        >
                            <div className="w-16 h-20 flex-shrink-0 overflow-hidden bg-secondary">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-playfair text-sm font-medium text-foreground leading-snug line-clamp-2">
                                    {p.name}
                                </p>
                                <p className="font-inter text-xs text-primary mt-1 font-medium">
                                    {p.price}
                                </p>
                            </div>
                            <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                        </Link>
                    ))}
                </div>
                <div className="px-5 pt-6 pb-4 border-t border-border">
                    <Link
                        to="/collections"
                        className="block text-center font-inter text-xs tracking-[0.25em] uppercase border border-foreground text-foreground px-4 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                        View All Collections
                    </Link>
                </div>
            </div>
        </section>
    );
}
