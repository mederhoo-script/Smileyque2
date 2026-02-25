/**
 * SiteContext — Dynamic site settings stored in localStorage.
 *
 * Every piece of previously hard-coded content (brand config, products, hero
 * slides, theme colours, homepage sections) is now managed here so that an
 * admin can update it via the /admin dashboard without touching code.
 *
 * Default values mirror the original static data files so the site looks
 * identical out-of-the-box.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { brand as defaultBrand } from "@/config/brand";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BrandConfig {
  brandName: string;
  tagline: string;
  subTagline: string;
  whatsappNumber: string;
  phone: string;
  location: string;
  email: string;
  heroImage: string;
  heroImage2: string;
  aboutImage: string;
  designerImage: string;
  instagram: string;
  facebook: string;
  whatsappGreeting: string;
  whatsappClosing: string;
  marqueText: string;
}

export interface ThemeConfig {
  /** Primary / gold colour — HSL components */
  primaryH: number;
  primaryS: number;
  primaryL: number;
  /** Beige secondary background — HSL components */
  beigeH: number;
  beigeS: number;
  beigeL: number;
  /** Brand black — HSL components */
  blackH: number;
  blackS: number;
  blackL: number;
}

export interface HeroSlide {
  bg: string;
  tag: string;
  title: string;
  subtitle: string;
}

export interface TrendingBanner {
  img: string;
  label: string;
  link: string;
}

export interface CampaignItem {
  label: string;
  img: string;
  link: string;
}

export interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
}

export interface BlogPost {
  img: string;
  date: string;
  title: string;
  excerpt: string;
}

export interface BrandLogo {
  img: string;
  name: string;
}

export interface SiteSettings {
  brand: BrandConfig;
  theme: ThemeConfig;
  heroSlides: HeroSlide[];
  trendingBanners: TrendingBanner[];
  campaignItems: CampaignItem[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  instaPhotos: string[];
  brandLogos: BrandLogo[];
  products: Product[];
}

// ─── Default values (identical to the original static files) ─────────────────

export const DEFAULT_BRAND: BrandConfig = {
  brandName: defaultBrand.brandName,
  tagline: defaultBrand.tagline,
  subTagline: defaultBrand.subTagline,
  whatsappNumber: defaultBrand.whatsappNumber,
  phone: defaultBrand.phone,
  location: defaultBrand.location,
  email: defaultBrand.email,
  heroImage: defaultBrand.heroImage,
  heroImage2: defaultBrand.heroImage2,
  aboutImage: defaultBrand.aboutImage,
  designerImage: defaultBrand.designerImage,
  instagram: defaultBrand.instagram,
  facebook: defaultBrand.facebook,
  whatsappGreeting: defaultBrand.whatsappGreeting,
  whatsappClosing: defaultBrand.whatsappClosing,
  marqueText:
    "Women's Fashion \u00a0•\u00a0 Men's Senator Wear \u00a0•\u00a0 Bridal Couture \u00a0•\u00a0 Designer Shoes \u00a0•\u00a0 Luxury Bags \u00a0•\u00a0 Accessories",
};

export const DEFAULT_THEME: ThemeConfig = {
  primaryH: 36,
  primaryS: 51,
  primaryL: 61,
  beigeH: 36,
  beigeS: 33,
  beigeL: 94,
  blackH: 0,
  blackS: 0,
  blackL: 4,
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    bg: "/aurore/aurore-s1-bg-a.jpg",
    tag: "New Arrivals",
    title: "Wear Your Story",
    subtitle: "Bespoke luxury fashion crafted for extraordinary moments",
  },
  {
    bg: "/aurore/aurore-s1-bg-b.jpg",
    tag: "Trending Now",
    title: "Cape Collection",
    subtitle: "Dramatic silhouettes that command every room you enter",
  },
  {
    bg: "/aurore/aurore-s1-bg-c.jpg",
    tag: "Bridal 2026",
    title: "Your Perfect Day",
    subtitle: "Fully bespoke bridal creations tailored to your vision",
  },
];

export const DEFAULT_TRENDING_BANNERS: TrendingBanner[] = [
  { img: "/aurore/aurore-s2-img-a.jpg", label: "Women's Wear", link: "/collections" },
  { img: "/aurore/aurore-s2-img-b.jpg", label: "Men's Fashion", link: "/collections" },
  { img: "/aurore/aurore-s2-img-c.jpg", label: "Bridal Couture", link: "/collections" },
  { img: "/aurore/aurore-s2-img-d.jpg", label: "Accessories", link: "/collections" },
  { img: "/aurore/aurore-s2-img-e.jpg", label: "Shoes & Bags", link: "/collections" },
];

export const DEFAULT_CAMPAIGN_ITEMS: CampaignItem[] = [
  { label: "Women", img: "/aurore/aurore-s3-img-a.jpg", link: "/collections" },
  { label: "Men", img: "/aurore/aurore-s3-img-b.jpg", link: "/collections" },
  { label: "Bags", img: "/aurore/aurore-s3-img-c.jpg", link: "/collections" },
  { label: "Shoes", img: "/aurore/aurore-s3-img-d.jpg", link: "/collections" },
  { label: "Bridal", img: "/aurore/aurore-s3-img-e.jpg", link: "/collections" },
  { label: "Accessories", img: "/aurore/aurore-s3-img-f.jpg", link: "/collections" },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    avatar: "/aurore/aurore-tt-a.jpg",
    name: "Adaeze Okonkwo",
    role: "Lagos, Nigeria",
    rating: 5,
    quote:
      "Smileyque transformed my wedding vision into reality. Every stitch was perfection — I felt like royalty walking down the aisle.",
  },
  {
    avatar: "/aurore/aurore-tt-b.jpg",
    name: "Fatima Al-Hassan",
    role: "Abuja, Nigeria",
    rating: 5,
    quote:
      "The attention to detail is extraordinary. My Anarkali gown drew compliments all evening. Truly bespoke luxury.",
  },
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    img: "/aurore/aurore-s9-img-a.jpg",
    date: "June 12, 2025",
    title: "5 Bridal Trends Redefining Nigerian Fashion in 2025",
    excerpt:
      "From intricate hand-beading to bold Ankara-fused silhouettes, discover the looks every bride is talking about.",
  },
  {
    img: "/aurore/aurore-s9-img-b.jpg",
    date: "May 28, 2025",
    title: "How to Style Senator Wear for Every Occasion",
    excerpt:
      "Senator wear has evolved far beyond formal ceremonies. Here's how to make it work for every event.",
  },
  {
    img: "/aurore/aurore-s9-img-c.jpg",
    date: "May 10, 2025",
    title: "The Art of Bespoke: What Goes Into a Smileyque Creation",
    excerpt:
      "Behind every piece lies a process of careful consultation, measurement, and craftsmanship. We lift the curtain.",
  },
];

export const DEFAULT_INSTA_PHOTOS: string[] = [
  "/aurore/aurore-pn-a.jpg",
  "/aurore/aurore-pn-b.jpg",
  "/aurore/aurore-pn-c.jpg",
  "/aurore/aurore-pn-d.jpg",
  "/aurore/aurore-pn-e.jpg",
  "/aurore/aurore-pn-f.jpg",
];

export const DEFAULT_BRAND_LOGOS: BrandLogo[] = [
  { img: "/aurore/aurore-mm-a.jpg", name: "Brand A" },
  { img: "/aurore/aurore-mm-b.jpg", name: "Brand B" },
  { img: "/aurore/aurore-mm-c.jpg", name: "Brand C" },
  { img: "/aurore/aurore-mm-d.jpg", name: "Brand D" },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: DEFAULT_BRAND,
  theme: DEFAULT_THEME,
  heroSlides: DEFAULT_HERO_SLIDES,
  trendingBanners: DEFAULT_TRENDING_BANNERS,
  campaignItems: DEFAULT_CAMPAIGN_ITEMS,
  testimonials: DEFAULT_TESTIMONIALS,
  blogPosts: DEFAULT_BLOG_POSTS,
  instaPhotos: DEFAULT_INSTA_PHOTOS,
  brandLogos: DEFAULT_BRAND_LOGOS,
  products: defaultProducts,
};

// ─── Helper: build WhatsApp order URL ────────────────────────────────────────

export function buildWhatsAppOrderUrl(
  brand: BrandConfig,
  items: Array<{ name: string; quantity: number }>
): string {
  const itemLines = items
    .map((item) => `• ${item.name} – Qty: ${item.quantity}`)
    .join("\n");
  const message = `${brand.whatsappGreeting}\n\n${itemLines}\n\n${brand.whatsappClosing}`;
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ─── Theme application ────────────────────────────────────────────────────────

export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  const primary = `${theme.primaryH} ${theme.primaryS}% ${theme.primaryL}%`;
  const beige = `${theme.beigeH} ${theme.beigeS}% ${theme.beigeL}%`;
  const black = `${theme.blackH} ${theme.blackS}% ${theme.blackL}%`;

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--accent", primary);
  root.style.setProperty("--brand-gold", primary);
  root.style.setProperty("--ring", primary);
  root.style.setProperty("--brand-beige", beige);
  root.style.setProperty("--secondary", beige);
  root.style.setProperty("--brand-black", black);
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface SiteContextValue {
  settings: SiteSettings;
  updateBrand: (patch: Partial<BrandConfig>) => void;
  updateTheme: (patch: Partial<ThemeConfig>) => void;
  updateHeroSlides: (slides: HeroSlide[]) => void;
  updateTrendingBanners: (banners: TrendingBanner[]) => void;
  updateCampaignItems: (items: CampaignItem[]) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateBlogPosts: (posts: BlogPost[]) => void;
  updateInstaPhotos: (photos: string[]) => void;
  updateBrandLogos: (logos: BrandLogo[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "smileyque_site_settings";

const SiteContext = createContext<SiteContextValue | null>(null);

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteSettings>;
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        brand: { ...DEFAULT_SETTINGS.brand, ...(parsed.brand ?? {}) },
        theme: { ...DEFAULT_SETTINGS.theme, ...(parsed.theme ?? {}) },
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => loadSettings());

  // Apply CSS custom properties whenever theme changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage not available
    }
  }, [settings]);

  const updateBrand = useCallback((patch: Partial<BrandConfig>) => {
    setSettings((s) => ({ ...s, brand: { ...s.brand, ...patch } }));
  }, []);

  const updateTheme = useCallback((patch: Partial<ThemeConfig>) => {
    setSettings((s) => ({ ...s, theme: { ...s.theme, ...patch } }));
  }, []);

  const updateHeroSlides = useCallback((heroSlides: HeroSlide[]) => {
    setSettings((s) => ({ ...s, heroSlides }));
  }, []);

  const updateTrendingBanners = useCallback((trendingBanners: TrendingBanner[]) => {
    setSettings((s) => ({ ...s, trendingBanners }));
  }, []);

  const updateCampaignItems = useCallback((campaignItems: CampaignItem[]) => {
    setSettings((s) => ({ ...s, campaignItems }));
  }, []);

  const updateTestimonials = useCallback((testimonials: Testimonial[]) => {
    setSettings((s) => ({ ...s, testimonials }));
  }, []);

  const updateBlogPosts = useCallback((blogPosts: BlogPost[]) => {
    setSettings((s) => ({ ...s, blogPosts }));
  }, []);

  const updateInstaPhotos = useCallback((instaPhotos: string[]) => {
    setSettings((s) => ({ ...s, instaPhotos }));
  }, []);

  const updateBrandLogos = useCallback((brandLogos: BrandLogo[]) => {
    setSettings((s) => ({ ...s, brandLogos }));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setSettings((s) => ({ ...s, products: [...s.products, product] }));
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setSettings((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setSettings((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SiteContext.Provider
      value={{
        settings,
        updateBrand,
        updateTheme,
        updateHeroSlides,
        updateTrendingBanners,
        updateCampaignItems,
        updateTestimonials,
        updateBlogPosts,
        updateInstaPhotos,
        updateBrandLogos,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
