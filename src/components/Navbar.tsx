import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onSearchOpen?: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isTransparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isTransparent
            ? "bg-transparent"
            : "bg-background/95 backdrop-blur-sm border-b border-border shadow-elegant"
        )}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 font-playfair text-2xl md:text-3xl font-semibold tracking-wider transition-colors duration-300",
              isTransparent ? "text-background" : "text-foreground"
            )}
          >
            <img
              src={brand.logo}
              alt={brand.brandName}
              className="h-8 md:h-10 w-auto transition-all duration-300"
            />
            <span>{brand.brandName}</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "font-inter text-sm tracking-widest uppercase nav-link transition-colors duration-300",
                      isTransparent
                        ? "text-background/90 hover:text-background"
                        : "text-foreground/75 hover:text-foreground",
                      isActive && "font-semibold"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Search + Cart + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search icon */}
            <button
              onClick={onSearchOpen}
              aria-label="Open search"
              className={cn(
                "relative p-2 transition-colors duration-300 rounded-sm hover:bg-white/10",
                isTransparent
                  ? "text-background hover:text-background/70"
                  : "text-foreground hover:text-primary"
              )}
            >
              <Search size={20} />
            </button>

            {/* Cart icon */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className={cn(
                "relative p-2 transition-colors duration-300",
                isTransparent
                  ? "text-background hover:text-background/70"
                  : "text-foreground hover:text-primary"
              )}
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className={cn(
                "md:hidden p-2 transition-colors duration-300",
                isTransparent ? "text-background" : "text-foreground"
              )}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu — smooth slide-in */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-brand-black flex flex-col items-center justify-center gap-10 md:hidden transition-all duration-400",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <Link
          to="/"
          className="flex flex-col items-center gap-4 font-playfair text-3xl text-background tracking-widest"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={brand.logo}
            alt={brand.brandName}
            className="h-16 w-auto"
          />
          <span>{brand.brandName}</span>
        </Link>
        <ul className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="font-inter text-sm tracking-[0.3em] uppercase text-background/80 hover:text-primary transition-colors duration-300"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Search in mobile menu */}
        <button
          onClick={() => { setMenuOpen(false); onSearchOpen?.(); }}
          className="flex items-center gap-2 font-inter text-sm tracking-[0.3em] uppercase text-background/80 hover:text-primary transition-colors duration-300"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </>
  );
}
