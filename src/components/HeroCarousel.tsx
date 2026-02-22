import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Slide {
    image: string;
    tag: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaLink: string;
    accent: string;
}

const slides: Slide[] = [
    {
        image: "/images/hero001.jpg",
        tag: "New Arrivals",
        title: "Wear Your Story",
        subtitle: "Bespoke luxury fashion crafted for extraordinary moments",
        cta: "Shop Bridal",
        ctaLink: "/collections",
        accent: "from-brand-black/70 via-brand-black/30 to-brand-black/60",
    },
    {
        image: "/images/hero002.jpeg",
        tag: "Trending Now",
        title: "Cape Collection",
        subtitle: "Dramatic silhouettes that command every room you enter",
        cta: "View Gowns",
        ctaLink: "/collections",
        accent: "from-brand-black/60 via-transparent to-brand-black/70",
    },
    {
        image: "/images/hero003.png",
        tag: "Bridal 2026",
        title: "Your Perfect Day",
        subtitle: "Fully bespoke bridal creations tailored to your vision",
        cta: "Book Consultation",
        ctaLink: "/contact",
        accent: "from-brand-black/65 via-brand-black/20 to-brand-black/55",
    },
    {
        image: "/images/hero004.png",
        tag: "Casuals",
        title: "Effortless Chic",
        subtitle: "Everyday elegance for the modern woman on the move",
        cta: "Shop Casuals",
        ctaLink: "/collections",
        accent: "from-brand-black/70 via-brand-black/30 to-brand-black/60",
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

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

    // Auto-advance
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(next, 2000);
        return () => clearInterval(timer);
    }, [next, isPaused]);

    // Keyboard nav
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [next, prev]);

    const slide = slides[current];

    return (
        <section
            className="relative h-screen min-h-[600px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            {slides.map((s, i) => (
                <div
                    key={i}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-700",
                        i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover object-center"
                        loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-b", s.accent)} />
                </div>
            ))}

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                <p
                    key={`tag-${current}`}
                    className="font-inter text-xs tracking-[0.4em] uppercase text-primary mb-4 animate-fade-in-up"
                >
                    {slide.tag}
                </p>
                <h1
                    key={`title-${current}`}
                    className="font-playfair text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-none tracking-widest mb-4 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    {slide.title}
                </h1>
                <div className="w-12 h-px bg-primary my-5" style={{ animationDelay: "0.2s" }} />
                <p
                    key={`sub-${current}`}
                    className="font-inter text-sm md:text-base text-white/75 max-w-md leading-relaxed mb-10 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    {slide.subtitle}
                </p>
                <div
                    className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: "0.3s" }}
                >
                    <Link
                        to={slide.ctaLink}
                        className="font-inter text-sm tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-gold-light transition-colors duration-300 shadow-gold"
                    >
                        {slide.cta}
                    </Link>
                    <Link
                        to="/lookbook"
                        className="font-inter text-sm tracking-[0.2em] uppercase border border-white/60 text-white px-8 py-4 hover:bg-white/10 transition-colors duration-300"
                    >
                        View Lookbook
                    </Link>
                </div>
            </div>

            {/* Arrow buttons */}
            <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/30 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/30 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={cn(
                            "transition-all duration-400 rounded-full",
                            i === current
                                ? "w-8 h-2 bg-primary"
                                : "w-2 h-2 bg-white/40 hover:bg-white/70"
                        )}
                    />
                ))}
            </div>

            {/* Progress bar */}
            {!isPaused && (
                <div className="absolute bottom-0 left-0 z-20 h-0.5 bg-primary/50 w-full">
                    <div
                        key={current}
                        className="h-full bg-primary"
                        style={{ animation: "progress-bar 4.5s linear forwards" }}
                    />
                </div>
            )}
        </section>
    );
}
