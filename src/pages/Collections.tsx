import { useState } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import { categories, ProductCategory } from "@/data/products";
import { Product } from "@/data/products";
import { useSite } from "@/context/SiteContext";
import { cn } from "@/lib/utils";

export default function Collections() {
  const { settings } = useSite();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filtered =
    activeCategory === "All"
      ? settings.products
      : settings.products.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Page header */}
      <section className="bg-beige pt-36 pb-16 text-center section-padding">
        <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
          Our Catalog
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl font-semibold mb-4">
          Collections
        </h1>
        <div className="gold-divider" />
        <p className="font-inter text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Browse our bespoke offerings. Add your favorites to cart and place your order directly via WhatsApp.
        </p>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-6 md:px-12 lg:px-20 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "font-inter text-xs tracking-[0.2em] uppercase whitespace-nowrap px-5 py-2.5 rounded-sm border transition-all duration-200",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl text-muted-foreground">
              No items in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={() => setQuickViewProduct(product)} />
            ))}
          </div>
        )}
      </section>

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onNavigate={(p) => setQuickViewProduct(p)} />
    </Layout>
  );
}
