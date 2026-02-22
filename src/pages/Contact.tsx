import Layout from "@/components/Layout";
import { brand, buildWhatsAppOrderUrl } from "@/config/brand";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export default function Contact() {
  const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent("Hello! I would like to inquire about a bespoke order at Smileyque.")}`;

  return (
    <Layout>
      {/* Page header */}
      <section className="bg-beige pt-36 pb-16 text-center px-6">
        <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
          Get in Touch
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl font-semibold mb-4">
          Contact Us
        </h1>
        <div className="gold-divider" />
        <p className="font-inter text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Ready to begin your bespoke journey? Reach out and we'll guide you through every step.
        </p>
      </section>

      {/* Contact grid */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact info */}
          <div>
            <h2 className="font-playfair text-3xl font-semibold mb-8">
              Let's Create Something Extraordinary
            </h2>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs tracking-widest uppercase text-muted-foreground mb-1">
                    Studio Location
                  </p>
                  <p className="font-playfair text-base font-medium">{brand.location}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs tracking-widest uppercase text-muted-foreground mb-1">
                    Phone / WhatsApp
                  </p>
                  <a
                    href={`tel:+${brand.whatsappNumber}`}
                    className="font-playfair text-base font-medium hover:text-primary transition-colors"
                  >
                    {brand.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs tracking-widest uppercase text-muted-foreground mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${brand.email}`}
                    className="font-playfair text-base font-medium hover:text-primary transition-colors"
                  >
                    {brand.email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                  <MessageCircle size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs tracking-widest uppercase text-muted-foreground mb-1">
                    Consultation Hours
                  </p>
                  <p className="font-playfair text-base font-medium">Mon – Sat, 9am – 6pm WAT</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA panel */}
          <div className="bg-brand-black text-background p-10 rounded-sm text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-gold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-8 h-8"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.12 1.524 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.098-1.459A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.884 9.884 0 0 1-5.034-1.377l-.361-.213-3.73.893.908-3.647-.235-.374A9.86 9.86 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1c5.467 0 9.9 4.433 9.9 9.9s-4.433 9.9-9.9 9.9z" />
              </svg>
            </div>

            <div>
              <h3 className="font-playfair text-2xl font-semibold mb-2">
                Order via WhatsApp
              </h3>
              <p className="font-inter text-sm text-background/60 leading-relaxed">
                The fastest way to start your bespoke order. Message us directly and we'll guide you from selection to delivery.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-inter font-semibold text-sm tracking-wide py-4 rounded-sm hover:bg-[#1ebe5a] transition-colors duration-200 shadow-gold pulse-gold"
            >
              Chat on WhatsApp
            </a>

            <p className="font-inter text-xs text-background/40 leading-relaxed">
              Typical response time: within 2 hours during business hours.
            </p>
          </div>
        </div>
      </section>

      {/* Map placeholder / decorative strip */}
      <section className="bg-beige py-16 px-6 text-center">
        <p className="font-inter text-xs tracking-[0.3em] uppercase text-primary mb-3">
          Visit Us
        </p>
        <p className="font-playfair text-2xl font-semibold mb-2">Lagos, Nigeria</p>
        <p className="font-inter text-sm text-muted-foreground">
          Studio visits by appointment only. Contact us on WhatsApp to schedule.
        </p>
      </section>
    </Layout>
  );
}
