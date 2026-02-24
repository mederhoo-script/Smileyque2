import { ReactNode, useState } from "react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SearchModal from "@/components/SearchModal";
import ProductQuickView from "@/components/ProductQuickView";
import { Product } from "@/data/products";
import { brand } from "@/config/brand";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-brand-black text-background/70 font-inter text-sm">
        <div className="px-6 md:px-12 lg:px-20 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About + Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <p className="font-playfair text-2xl text-background font-semibold tracking-wider">
                {brand.brandName}
              </p>
            </div>
            <p className="text-background/60 text-xs leading-relaxed mb-6">
              {brand.tagline} — {brand.subTagline}
            </p>
            <p className="font-inter text-xs tracking-[0.2em] uppercase text-primary mb-3">Newsletter</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-0"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border border-white/20 text-background placeholder:text-background/40 text-xs px-3 py-2.5 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="font-inter text-[10px] tracking-[0.2em] uppercase bg-primary text-primary-foreground px-4 py-2.5 hover:bg-gold-light transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <p className="font-inter text-xs tracking-[0.2em] uppercase text-primary mb-4">Quick Links</p>
            <ul className="space-y-2">
              {[
                ["Home", "/"],
                ["Collections", "/collections"],
                ["About", "/about"],
                ["Lookbook", "/lookbook"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-background/60 hover:text-primary transition-colors duration-200 text-xs">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <p className="font-inter text-xs tracking-[0.2em] uppercase text-primary mb-4">Customer Care</p>
            <ul className="space-y-2">
              {[
                "How to Order",
                "Size Guide",
                "Delivery Info",
                "Returns Policy",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a href="/contact" className="text-background/60 hover:text-primary transition-colors duration-200 text-xs">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <address className="not-italic text-background/50 text-xs leading-relaxed mt-6 space-y-1">
              <p>{brand.phone}</p>
              <p>{brand.email}</p>
            </address>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <p className="font-inter text-xs tracking-[0.2em] uppercase text-primary mb-4">Follow Us</p>
            <ul className="space-y-2">
              {[
                ["Instagram", brand.instagram],
                ["Facebook", brand.facebook],
                ["WhatsApp", `https://wa.me/${brand.whatsappNumber}`],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background/60 hover:text-primary transition-colors duration-200 text-xs"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment icons row */}
        <div className="border-t border-background/10 px-6 md:px-12 lg:px-20 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">© {new Date().getFullYear()} {brand.brandName}. All rights reserved.</p>
          <img
            src="/aurore/footer-payment-support.png"
            alt="Accepted payment methods"
            className="h-6 object-contain opacity-60"
          />
        </div>
      </footer>

      {/* Global overlays */}
      <CartDrawer />
      <FloatingWhatsApp />

      {/* Search modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onQuickView={(product) => {
          setSearchOpen(false);
          setQuickViewProduct(product);
        }}
      />

      {/* Quick view modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={(p) => setQuickViewProduct(p)}
      />
    </>
  );
}
