/**
 * SMILEYQUE BRAND CONFIGURATION
 * ==============================
 * To duplicate this website for another fashion brand, edit ONLY this file:
 * - brandName: The brand/label name shown in the navbar and footer
 * - whatsappNumber: Full international number WITHOUT + or spaces (e.g. 2348034295030)
 * - tagline: Main hero tagline displayed on the homepage
 * - subTagline: Supporting text under the tagline
 * - location: Where the atelier/studio is located
 * - phone: Display-formatted phone number shown on the Contact page
 * - heroImages: URLs for the homepage hero banner (swap with real photos)
 * - socialLinks: Optional Instagram / Facebook links
 */

export const brand = {
  // --- BRAND IDENTITY ---
  brandName: "Smileyque",
  logo: "/images/smileyque_logo.png",
  tagline: "Wear Your Story",
  subTagline: "Bespoke luxury fashion crafted for the extraordinary woman and man",

  // --- CONTACT & ORDERING ---
  // WhatsApp number — international format, no + or spaces
  whatsappNumber: "2348145968490",
  phone: "+234 814 596 8490",
  location: "Bodlink-MTN Partner, Henry T Bus Stop, Odo ona elewe, 25 Adifala St, lbadanLayi Ayanniyi Street, opposite niyi ishola & co, off MKO Abiola Way, New Gra, Ibadan 200273, Oyo, Nigeria.",
  email: "hello@smileyque.com",

  // --- HERO IMAGES ---
  // Swap these with your actual model/editorial photographs
  heroImage:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
  heroImage2:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80",

  // --- ABOUT PAGE ---
  aboutImage:
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
  designerImage:
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=900&q=80",

  // --- SOCIAL LINKS (optional) ---
  instagram: "https://instagram.com/smileyque",
  facebook: "https://facebook.com/smileyque",

  // --- WHATSAPP MESSAGE TEMPLATE ---
  whatsappGreeting:
    "Hello, I would like to order the following items from Smileyque:",
  whatsappClosing:
    "Please assist me with measurement and delivery details. Thank you.",
} as const;

/**
 * Helper: build a WhatsApp order URL from cart items
 */
export function buildWhatsAppOrderUrl(
  items: Array<{ name: string; quantity: number }>
): string {
  const itemLines = items
    .map((item) => `• ${item.name} – Qty: ${item.quantity}`)
    .join("\n");

  const message = `${brand.whatsappGreeting}\n\n${itemLines}\n\n${brand.whatsappClosing}`;
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
