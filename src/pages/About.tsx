import Layout from "@/components/Layout";
import { brand } from "@/config/brand";

export default function About() {
  return (
    <Layout>
      {/* Page header */}
      <section className="bg-beige pt-36 pb-16 text-center px-6">
        <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
          Our Story
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl font-semibold mb-4">
          About Smileyque
        </h1>
        <div className="gold-divider" />
      </section>

      {/* Split section 1: Brand Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
        <div className="img-zoom order-2 lg:order-1">
          <img
            src={brand.aboutImage}
            alt="Smileyque atelier"
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>
        <div className="order-1 lg:order-2 flex items-center bg-background px-8 md:px-16 lg:px-20 py-20">
          <div className="max-w-md">
            <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-4">
              The Brand
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-6 leading-tight">
              Where Fashion Becomes a Personal Language
            </h2>
            <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4">
              Smileyque was born from a simple belief: clothing is not merely fabric — it is identity, confidence, and artistry woven together. Every piece we create is a conversation between the designer's vision and the wearer's soul.
            </p>
            <p className="font-inter text-sm text-muted-foreground leading-relaxed">
              Founded in Lagos, Nigeria, Smileyque has quietly become a destination for women and men who refuse to settle for ordinary. Our studio merges West African heritage with contemporary European silhouettes, producing collections that are global in sensibility yet deeply rooted in culture.
            </p>
          </div>
        </div>
      </section>

      {/* Quote interlude */}
      <section className="bg-brand-black section-padding text-center">
        <blockquote className="font-playfair italic text-3xl md:text-4xl text-background/90 max-w-3xl mx-auto leading-relaxed">
          "Fashion is the armor to survive the reality of everyday life."
        </blockquote>
        <div className="gold-divider mt-8" />
        <p className="font-inter text-xs text-background/40 tracking-widest uppercase mt-4">
          The Smileyque Philosophy
        </p>
      </section>

      {/* Split section 2: Designer */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
        <div className="flex items-center bg-beige px-8 md:px-16 lg:px-20 py-20">
          <div className="max-w-md">
            <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-4">
              The Designer
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-6 leading-tight">
              Craftsmanship Is in Every Detail
            </h2>
            <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4">
              The creative mind behind Smileyque brings over a decade of couture training, blending traditional hand-sewing techniques with modern pattern-making to produce pieces that feel as extraordinary as they look.
            </p>
            <p className="font-inter text-sm text-muted-foreground leading-relaxed">
              Every client is seen as a canvas — no two orders are ever the same. From the first measurement to the final fitting, the process is intimate, precise, and always personal.
            </p>
          </div>
        </div>
        <div className="img-zoom">
          <img
            src={brand.designerImage}
            alt="Smileyque designer"
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>
      </section>

      {/* Values strip */}
      <section className="section-padding bg-background">
        <div className="text-center mb-14">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
            What We Stand For
          </p>
          <h2 className="font-playfair text-3xl font-semibold">Our Values</h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
          {[
            { icon: "✦", title: "Authenticity", desc: "Every piece is an original — never mass-produced." },
            { icon: "✦", title: "Precision", desc: "Meticulous tailoring crafted to your exact measurements." },
            { icon: "✦", title: "Heritage", desc: "Rooted in African tradition with a global outlook." },
            { icon: "✦", title: "Service", desc: "White-glove experience from first inquiry to delivery." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <span className="text-primary text-xl">{icon}</span>
              <h3 className="font-playfair text-lg font-semibold">{title}</h3>
              <p className="font-inter text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
