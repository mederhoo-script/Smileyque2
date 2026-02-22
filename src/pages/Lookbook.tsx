import Layout from "@/components/Layout";

// Lookbook gallery images — swap with real editorial photography
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80",
    alt: "Editorial fashion look 1",
    span: "row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    alt: "Editorial fashion look 2",
    span: "",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    alt: "Editorial fashion look 3",
    span: "",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
    alt: "Editorial fashion look 4",
    span: "row-span-2",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=700&q=80",
    alt: "Editorial fashion look 5",
    span: "",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=600&q=80",
    alt: "Editorial fashion look 6",
    span: "row-span-2",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    alt: "Editorial fashion look 7",
    span: "",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=600&q=80",
    alt: "Editorial fashion look 8",
    span: "",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    alt: "Editorial fashion look 9",
    span: "",
  },
];

export default function Lookbook() {
  return (
    <Layout>
      {/* Page header */}
      <section className="bg-brand-black pt-36 pb-16 text-center px-6">
        <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
          Visual Stories
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl font-semibold text-background mb-4">
          Lookbook
        </h1>
        <div className="gold-divider" />
        <p className="font-inter text-sm text-background/60 max-w-sm mx-auto leading-relaxed">
          An editorial journey through the world of Smileyque.
        </p>
      </section>

      {/* Masonry Grid */}
      <section className="section-padding bg-background">
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto"
          style={{ gridAutoRows: "200px" }}
        >
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden bg-secondary rounded-sm cursor-pointer ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/40 transition-colors duration-400 flex items-end p-4">
                <span className="font-playfair italic text-background text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transform transition-transform">
                  Smileyque Collection
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-beige section-padding text-center">
        <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-4">
          Inspired?
        </p>
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4">
          Commission Your Piece
        </h2>
        <div className="gold-divider" />
        <p className="font-inter text-sm text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
          Every image here represents a bespoke creation. Yours is waiting to be made.
        </p>
        <a
          href="/collections"
          className="font-inter text-sm tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-gold-light transition-colors duration-300 inline-block"
        >
          Shop Collections
        </a>
      </section>
    </Layout>
  );
}
