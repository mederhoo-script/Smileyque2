/**
 * Admin Dashboard — full CRUD for all site content.
 *
 * Tabs:
 *  1. Brand Settings  — name, contact info, social links, images, marquee text
 *  2. Products        — list with add / edit / delete
 *  3. Theme           — primary colour, beige, brand-black via HSL sliders
 *  4. Hero Slides     — add / edit / delete carousel slides
 *  5. Homepage        — trending banners, campaign items, testimonials,
 *                       blog posts, instagram photos, brand logos
 *  6. Settings        — change admin password, reset to defaults
 */

import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil, LogOut, RotateCcw, Save, X, ChevronLeft } from "lucide-react";
import {
  useSite,
  applyTheme,
  DEFAULT_SETTINGS,
  type BrandConfig,
  type ThemeConfig,
  type HeroSlide,
  type TrendingBanner,
  type CampaignItem,
  type Testimonial,
  type BlogPost,
  type BrandLogo,
} from "@/context/SiteContext";
import { isAdminAuthenticated, adminLogout } from "./AdminLogin";
import type { Product, ProductCategory, ProductOccasion } from "@/data/products";

// ─── Auth Guard ───────────────────────────────────────────────────────────────

function useAdminGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAdminAuthenticated()) navigate("/admin/login", { replace: true });
  }, [navigate]);
}

// ─── Small reusable helpers ───────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-inter text-xs tracking-widest uppercase text-muted-foreground mb-1">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary transition-colors ${className}`}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary transition-colors resize-none"
    />
  );
}

function Btn({
  onClick,
  children,
  variant = "primary",
  type = "button",
  className = "",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit";
  className?: string;
}) {
  const cls: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-gold-light",
    secondary: "border border-border text-foreground hover:border-primary hover:text-primary",
    danger: "bg-destructive text-white hover:opacity-80",
    ghost: "text-muted-foreground hover:text-foreground",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-inter text-xs font-semibold tracking-wide px-4 py-2 transition-colors duration-200 ${cls[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair text-2xl font-semibold mb-6 pb-2 border-b border-border">
      {children}
    </h2>
  );
}

// ─── Tab: Brand Settings ──────────────────────────────────────────────────────

function BrandTab() {
  const { settings, updateBrand } = useSite();
  const [form, setForm] = useState<BrandConfig>({ ...settings.brand });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof BrandConfig) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateBrand(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: Array<{ key: keyof BrandConfig; label: string; textarea?: boolean }> = [
    { key: "brandName", label: "Brand Name" },
    { key: "tagline", label: "Tagline" },
    { key: "subTagline", label: "Sub-tagline" },
    { key: "whatsappNumber", label: "WhatsApp Number (international, no + or spaces)" },
    { key: "phone", label: "Phone (display format)" },
    { key: "email", label: "Email" },
    { key: "location", label: "Studio Location", textarea: true },
    { key: "instagram", label: "Instagram URL" },
    { key: "facebook", label: "Facebook URL" },
    { key: "heroImage", label: "Hero Image URL" },
    { key: "heroImage2", label: "Hero Image 2 URL" },
    { key: "aboutImage", label: "About Page Image URL" },
    { key: "designerImage", label: "Designer Image URL" },
    { key: "whatsappGreeting", label: "WhatsApp Greeting Message" },
    { key: "whatsappClosing", label: "WhatsApp Closing Message" },
    { key: "marqueText", label: "Marquee Strip Text" },
  ];

  return (
    <div className="max-w-2xl space-y-5">
      <SectionTitle>Brand Settings</SectionTitle>
      {fields.map(({ key, label, textarea }) => (
        <div key={key}>
          <Label>{label}</Label>
          {textarea ? (
            <Textarea value={form[key]} onChange={set(key)} />
          ) : (
            <Input value={form[key]} onChange={set(key)} />
          )}
        </div>
      ))}
      <Btn variant="primary" onClick={handleSave}>
        {saved ? "✓ Saved!" : "Save Brand Settings"}
      </Btn>
    </div>
  );
}

// ─── Tab: Theme ───────────────────────────────────────────────────────────────

function ThemeTab() {
  const { settings, updateTheme } = useSite();
  const [form, setForm] = useState<ThemeConfig>({ ...settings.theme });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof ThemeConfig) => (v: string) => {
    const num = parseInt(v, 10);
    if (!isNaN(num)) setForm((f) => ({ ...f, [k]: num }));
  };

  // Live preview
  useEffect(() => {
    applyTheme(form);
  }, [form]);

  const handleSave = () => {
    updateTheme(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const groups = [
    {
      title: "Primary / Accent Colour (Gold)",
      fields: [
        { key: "primaryH" as const, label: "Hue (0–360)", max: 360 },
        { key: "primaryS" as const, label: "Saturation (0–100 %)", max: 100 },
        { key: "primaryL" as const, label: "Lightness (0–100 %)", max: 100 },
      ],
    },
    {
      title: "Beige / Secondary Background",
      fields: [
        { key: "beigeH" as const, label: "Hue (0–360)", max: 360 },
        { key: "beigeS" as const, label: "Saturation (0–100 %)", max: 100 },
        { key: "beigeL" as const, label: "Lightness (0–100 %)", max: 100 },
      ],
    },
    {
      title: "Brand Black",
      fields: [
        { key: "blackH" as const, label: "Hue (0–360)", max: 360 },
        { key: "blackS" as const, label: "Saturation (0–100 %)", max: 100 },
        { key: "blackL" as const, label: "Lightness (0–100 %)", max: 100 },
      ],
    },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <SectionTitle>Theme Colours</SectionTitle>
      <p className="font-inter text-xs text-muted-foreground">
        Colours use HSL. Changes preview in real-time; click Save to persist.
      </p>
      {/* Colour swatches preview */}
      <div className="flex gap-4">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-sm border border-border mb-1"
            style={{ background: `hsl(${form.primaryH} ${form.primaryS}% ${form.primaryL}%)` }}
          />
          <p className="font-inter text-[10px] text-muted-foreground">Primary</p>
        </div>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-sm border border-border mb-1"
            style={{ background: `hsl(${form.beigeH} ${form.beigeS}% ${form.beigeL}%)` }}
          />
          <p className="font-inter text-[10px] text-muted-foreground">Beige</p>
        </div>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-sm border border-border mb-1"
            style={{ background: `hsl(${form.blackH} ${form.blackS}% ${form.blackL}%)` }}
          />
          <p className="font-inter text-[10px] text-muted-foreground">Brand Black</p>
        </div>
      </div>
      {groups.map((g) => (
        <div key={g.title} className="space-y-3">
          <h3 className="font-playfair text-lg font-semibold">{g.title}</h3>
          {g.fields.map(({ key, label, max }) => (
            <div key={key}>
              <Label>
                {label} — <strong>{form[key]}</strong>
              </Label>
              <input
                type="range"
                min={0}
                max={max}
                value={form[key]}
                onChange={(e) => set(key)(e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          ))}
        </div>
      ))}
      <Btn variant="primary" onClick={handleSave}>
        {saved ? "✓ Saved!" : "Save Theme"}
      </Btn>
    </div>
  );
}

// ─── Tab: Products ────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS: Array<Exclude<ProductCategory, "All">> = [
  "Women", "Men", "Bridal", "Shoes", "Bags", "Accessories",
];
const OCCASION_OPTIONS: ProductOccasion[] = [
  "Formal", "Wedding", "Casual", "Party", "Traditional", "Any",
];

function emptyProduct(): Omit<Product, "id"> {
  return {
    name: "",
    description: "",
    fullDescription: "",
    price: "",
    priceValue: 0,
    originalPrice: "",
    originalPriceValue: undefined,
    category: "Women",
    image: "",
    images: [],
    colors: [],
    sizes: [],
    occasion: undefined,
    featured: false,
    isNew: false,
    isTrending: false,
  };
}

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Product, "id"> & { id?: string };
  onSave: (p: Omit<Product, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form) => (v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input value={form.name} onChange={set("name")} placeholder="Product name" />
        </div>
        <div>
          <Label>Category *</Label>
          <select
            value={form.category}
            onChange={(e) => set("category")(e.target.value as ProductCategory)}
            className="w-full border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label>Short Description *</Label>
        <Textarea value={form.description} onChange={set("description")} rows={2} />
      </div>
      <div>
        <Label>Full Description (shown in Quick View)</Label>
        <Textarea value={form.fullDescription ?? ""} onChange={set("fullDescription")} rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price (display) e.g. ₦85,000 *</Label>
          <Input value={form.price} onChange={set("price")} placeholder="₦85,000" />
        </div>
        <div>
          <Label>Price Value (number) *</Label>
          <Input
            type="number"
            value={form.priceValue}
            onChange={(v) => set("priceValue")(parseFloat(v) || 0)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Original Price (if on sale)</Label>
          <Input value={form.originalPrice ?? ""} onChange={set("originalPrice")} placeholder="₦95,000" />
        </div>
        <div>
          <Label>Original Price Value</Label>
          <Input
            type="number"
            value={form.originalPriceValue ?? ""}
            onChange={(v) => set("originalPriceValue")(parseFloat(v) || undefined)}
          />
        </div>
      </div>
      <div>
        <Label>Main Image URL *</Label>
        <Input value={form.image} onChange={set("image")} placeholder="https://… or /images/…" />
      </div>
      <div>
        <Label>Gallery Images (one URL per line)</Label>
        <Textarea
          value={(form.images ?? []).join("\n")}
          onChange={(v) => set("images")(v.split("\n").filter(Boolean))}
          placeholder="/images/product-front.jpg&#10;/images/product-back.jpg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Colors (comma-separated)</Label>
          <Input
            value={(form.colors ?? []).join(", ")}
            onChange={(v) => set("colors")(v.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="Ivory, Black, Gold"
          />
        </div>
        <div>
          <Label>Sizes (comma-separated)</Label>
          <Input
            value={(form.sizes ?? []).join(", ")}
            onChange={(v) => set("sizes")(v.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="XS, S, M, L, XL"
          />
        </div>
      </div>
      <div>
        <Label>Occasion</Label>
        <select
          value={form.occasion ?? ""}
          onChange={(e) => set("occasion")(e.target.value || undefined)}
          className="w-full border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary"
        >
          <option value="">— select —</option>
          {OCCASION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="flex gap-6">
        {(["featured", "isNew", "isTrending"] as const).map((flag) => (
          <label key={flag} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form[flag]}
              onChange={(e) => set(flag)(e.target.checked)}
              className="accent-primary"
            />
            <span className="font-inter text-xs capitalize">{flag}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-3">
        <Btn type="submit" variant="primary">
          <Save size={14} className="inline mr-1" />
          Save Product
        </Btn>
        <Btn variant="secondary" onClick={onCancel}>
          Cancel
        </Btn>
      </div>
    </form>
  );
}

function ProductsTab() {
  const { settings, addProduct, updateProduct, deleteProduct } = useSite();
  const [editing, setEditing] = useState<(Product & { id: string }) | null>(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = settings.products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Omit<Product, "id"> & { id?: string }) => {
    const id = `prod-${Date.now()}`;
    addProduct({ ...data, id } as Product);
    setAdding(false);
  };

  const handleUpdate = (data: Omit<Product, "id"> & { id?: string }) => {
    if (editing) {
      updateProduct(editing.id, data);
      setEditing(null);
    }
  };

  if (adding) {
    return (
      <div>
        <button onClick={() => setAdding(false)} className="flex items-center gap-1 font-inter text-xs text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft size={14} /> Back to list
        </button>
        <SectionTitle>Add New Product</SectionTitle>
        <ProductForm initial={emptyProduct()} onSave={handleAdd} onCancel={() => setAdding(false)} />
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 font-inter text-xs text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft size={14} /> Back to list
        </button>
        <SectionTitle>Edit Product — {editing.name}</SectionTitle>
        <ProductForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle>Products ({settings.products.length})</SectionTitle>
        <Btn variant="primary" onClick={() => setAdding(true)}>
          <Plus size={14} className="inline mr-1" />Add Product
        </Btn>
      </div>
      <Input value={search} onChange={setSearch} placeholder="Search by name or category…" className="mb-4 max-w-sm" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-inter text-xs tracking-widest uppercase text-muted-foreground py-3 pr-4">Image</th>
              <th className="text-left font-inter text-xs tracking-widest uppercase text-muted-foreground py-3 pr-4">Name</th>
              <th className="text-left font-inter text-xs tracking-widest uppercase text-muted-foreground py-3 pr-4">Category</th>
              <th className="text-left font-inter text-xs tracking-widest uppercase text-muted-foreground py-3 pr-4">Price</th>
              <th className="text-left font-inter text-xs tracking-widest uppercase text-muted-foreground py-3 pr-4">Flags</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 pr-4">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-sm" />
                </td>
                <td className="py-3 pr-4 font-playfair font-semibold">{p.name}</td>
                <td className="py-3 pr-4 font-inter text-xs text-muted-foreground">{p.category}</td>
                <td className="py-3 pr-4 font-inter text-xs text-primary font-medium">{p.price}</td>
                <td className="py-3 pr-4 font-inter text-xs text-muted-foreground">
                  {[p.featured && "Featured", p.isNew && "New", p.isTrending && "Trending"]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td className="py-3 flex items-center gap-2 justify-end">
                  <button onClick={() => setEditing(p as Product & { id: string })} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id); }} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center font-inter text-sm text-muted-foreground py-10">No products found.</p>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Hero Slides ─────────────────────────────────────────────────────────

function HeroSlidesTab() {
  const { settings, updateHeroSlides } = useSite();
  const [slides, setSlides] = useState<HeroSlide[]>(settings.heroSlides);
  const [saved, setSaved] = useState(false);

  const update = (i: number, k: keyof HeroSlide, v: string) => {
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));
  };

  const addSlide = () => {
    setSlides((prev) => [...prev, { bg: "", tag: "", title: "", subtitle: "" }]);
  };

  const removeSlide = (i: number) => {
    setSlides((prev) => prev.filter((_, idx) => idx !== i));
  };

  const save = () => {
    updateHeroSlides(slides);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <SectionTitle>Hero Carousel Slides</SectionTitle>
      {slides.map((slide, i) => (
        <div key={i} className="border border-border p-5 space-y-3 relative">
          <button onClick={() => removeSlide(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
            <X size={16} />
          </button>
          <p className="font-playfair font-semibold text-sm">Slide {i + 1}</p>
          <div><Label>Background Image URL</Label><Input value={slide.bg} onChange={(v) => update(i, "bg", v)} /></div>
          <div><Label>Tag (small label above title)</Label><Input value={slide.tag} onChange={(v) => update(i, "tag", v)} /></div>
          <div><Label>Title</Label><Input value={slide.title} onChange={(v) => update(i, "title", v)} /></div>
          <div><Label>Subtitle</Label><Input value={slide.subtitle} onChange={(v) => update(i, "subtitle", v)} /></div>
        </div>
      ))}
      <div className="flex gap-3">
        <Btn variant="secondary" onClick={addSlide}><Plus size={14} className="inline mr-1" />Add Slide</Btn>
        <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save Slides"}</Btn>
      </div>
    </div>
  );
}

// ─── Tab: Homepage Sections ───────────────────────────────────────────────────

function StringListField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea
        value={values.join("\n")}
        onChange={(v) => onChange(v.split("\n").filter(Boolean))}
        placeholder={placeholder}
        rows={Math.max(3, values.length + 1)}
      />
    </div>
  );
}

function TrendingBannersSection() {
  const { settings, updateTrendingBanners } = useSite();
  const [banners, setBanners] = useState<TrendingBanner[]>(settings.trendingBanners);
  const [saved, setSaved] = useState(false);

  const update = (i: number, k: keyof TrendingBanner, v: string) =>
    setBanners((prev) => prev.map((b, idx) => (idx === i ? { ...b, [k]: v } : b)));

  const save = () => { updateTrendingBanners(banners); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-lg font-semibold">Trending Banners</h3>
      {banners.map((b, i) => (
        <div key={i} className="border border-border p-4 grid grid-cols-3 gap-3 relative">
          <button onClick={() => setBanners((p) => p.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X size={14} /></button>
          <div><Label>Image URL</Label><Input value={b.img} onChange={(v) => update(i, "img", v)} /></div>
          <div><Label>Label</Label><Input value={b.label} onChange={(v) => update(i, "label", v)} /></div>
          <div><Label>Link</Label><Input value={b.link} onChange={(v) => update(i, "link", v)} /></div>
        </div>
      ))}
      <div className="flex gap-3">
        <Btn variant="secondary" onClick={() => setBanners((p) => [...p, { img: "", label: "", link: "/collections" }])}><Plus size={14} className="inline mr-1" />Add Banner</Btn>
        <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save"}</Btn>
      </div>
    </div>
  );
}

function CampaignItemsSection() {
  const { settings, updateCampaignItems } = useSite();
  const [items, setItems] = useState<CampaignItem[]>(settings.campaignItems);
  const [saved, setSaved] = useState(false);

  const update = (i: number, k: keyof CampaignItem, v: string) =>
    setItems((prev) => prev.map((b, idx) => (idx === i ? { ...b, [k]: v } : b)));

  const save = () => { updateCampaignItems(items); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-lg font-semibold">Campaign / Shop By Category</h3>
      {items.map((item, i) => (
        <div key={i} className="border border-border p-4 grid grid-cols-3 gap-3 relative">
          <button onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X size={14} /></button>
          <div><Label>Label</Label><Input value={item.label} onChange={(v) => update(i, "label", v)} /></div>
          <div><Label>Image URL</Label><Input value={item.img} onChange={(v) => update(i, "img", v)} /></div>
          <div><Label>Link</Label><Input value={item.link} onChange={(v) => update(i, "link", v)} /></div>
        </div>
      ))}
      <div className="flex gap-3">
        <Btn variant="secondary" onClick={() => setItems((p) => [...p, { label: "", img: "", link: "/collections" }])}><Plus size={14} className="inline mr-1" />Add Item</Btn>
        <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save"}</Btn>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const { settings, updateTestimonials } = useSite();
  const [testimonials, setT] = useState<Testimonial[]>(settings.testimonials);
  const [saved, setSaved] = useState(false);

  const update = (i: number, k: keyof Testimonial, v: string | number) =>
    setT((prev) => prev.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)));

  const save = () => { updateTestimonials(testimonials); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-lg font-semibold">Testimonials</h3>
      {testimonials.map((t, i) => (
        <div key={i} className="border border-border p-4 space-y-3 relative">
          <button onClick={() => setT((p) => p.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X size={14} /></button>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Name</Label><Input value={t.name} onChange={(v) => update(i, "name", v)} /></div>
            <div><Label>Role / Location</Label><Input value={t.role} onChange={(v) => update(i, "role", v)} /></div>
          </div>
          <div><Label>Avatar Image URL</Label><Input value={t.avatar} onChange={(v) => update(i, "avatar", v)} /></div>
          <div>
            <Label>Rating (1–5)</Label>
            <input type="number" min={1} max={5} value={t.rating} onChange={(e) => update(i, "rating", parseInt(e.target.value) || 5)}
              className="w-20 border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary" />
          </div>
          <div><Label>Quote</Label><Textarea value={t.quote} onChange={(v) => update(i, "quote", v)} /></div>
        </div>
      ))}
      <div className="flex gap-3">
        <Btn variant="secondary" onClick={() => setT((p) => [...p, { name: "", role: "", avatar: "", rating: 5, quote: "" }])}><Plus size={14} className="inline mr-1" />Add Testimonial</Btn>
        <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save"}</Btn>
      </div>
    </div>
  );
}

function BlogPostsSection() {
  const { settings, updateBlogPosts } = useSite();
  const [posts, setPosts] = useState<BlogPost[]>(settings.blogPosts);
  const [saved, setSaved] = useState(false);

  const update = (i: number, k: keyof BlogPost, v: string) =>
    setPosts((prev) => prev.map((b, idx) => (idx === i ? { ...b, [k]: v } : b)));

  const save = () => { updateBlogPosts(posts); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-lg font-semibold">Blog Posts</h3>
      {posts.map((post, i) => (
        <div key={i} className="border border-border p-4 space-y-3 relative">
          <button onClick={() => setPosts((p) => p.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X size={14} /></button>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Image URL</Label><Input value={post.img} onChange={(v) => update(i, "img", v)} /></div>
            <div><Label>Date</Label><Input value={post.date} onChange={(v) => update(i, "date", v)} placeholder="June 12, 2025" /></div>
          </div>
          <div><Label>Title</Label><Input value={post.title} onChange={(v) => update(i, "title", v)} /></div>
          <div><Label>Excerpt</Label><Textarea value={post.excerpt} onChange={(v) => update(i, "excerpt", v)} rows={2} /></div>
        </div>
      ))}
      <div className="flex gap-3">
        <Btn variant="secondary" onClick={() => setPosts((p) => [...p, { img: "", date: "", title: "", excerpt: "" }])}><Plus size={14} className="inline mr-1" />Add Post</Btn>
        <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save"}</Btn>
      </div>
    </div>
  );
}

function BrandLogosSection() {
  const { settings, updateBrandLogos } = useSite();
  const [logos, setLogos] = useState<BrandLogo[]>(settings.brandLogos);
  const [saved, setSaved] = useState(false);

  const update = (i: number, k: keyof BrandLogo, v: string) =>
    setLogos((prev) => prev.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)));

  const save = () => { updateBrandLogos(logos); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-lg font-semibold">Partner / Brand Logos</h3>
      {logos.map((logo, i) => (
        <div key={i} className="border border-border p-4 grid grid-cols-2 gap-3 relative">
          <button onClick={() => setLogos((p) => p.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X size={14} /></button>
          <div><Label>Image URL</Label><Input value={logo.img} onChange={(v) => update(i, "img", v)} /></div>
          <div><Label>Name</Label><Input value={logo.name} onChange={(v) => update(i, "name", v)} /></div>
        </div>
      ))}
      <div className="flex gap-3">
        <Btn variant="secondary" onClick={() => setLogos((p) => [...p, { img: "", name: "" }])}><Plus size={14} className="inline mr-1" />Add Logo</Btn>
        <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save"}</Btn>
      </div>
    </div>
  );
}

function InstaPhotosSection() {
  const { settings, updateInstaPhotos } = useSite();
  const [photos, setPhotos] = useState<string[]>(settings.instaPhotos);
  const [saved, setSaved] = useState(false);

  const save = () => { updateInstaPhotos(photos); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-lg font-semibold">Instagram / Social Feed Photos</h3>
      <StringListField label="One URL per line" values={photos} onChange={setPhotos} placeholder="/aurore/aurore-pn-a.jpg" />
      <Btn variant="primary" onClick={save}>{saved ? "✓ Saved!" : "Save"}</Btn>
    </div>
  );
}

function HomepageTab() {
  return (
    <div className="space-y-12">
      <SectionTitle>Homepage Sections</SectionTitle>
      <TrendingBannersSection />
      <CampaignItemsSection />
      <TestimonialsSection />
      <BlogPostsSection />
      <InstaPhotosSection />
      <BrandLogosSection />
    </div>
  );
}

// ─── Tab: Settings ────────────────────────────────────────────────────────────

const ADMIN_PWD_KEY = "smileyque_admin_pwd";
const DEFAULT_PASSWORD = "admin123";

function SettingsTab() {
  const { resetToDefaults } = useSite();
  const navigate = useNavigate();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  const changePwd = () => {
    const stored = localStorage.getItem(ADMIN_PWD_KEY) ?? DEFAULT_PASSWORD;
    if (oldPwd !== stored) { setPwdMsg("Incorrect current password."); return; }
    if (newPwd.length < 6) { setPwdMsg("New password must be at least 6 characters."); return; }
    if (newPwd !== confirm) { setPwdMsg("Passwords do not match."); return; }
    localStorage.setItem(ADMIN_PWD_KEY, newPwd);
    setPwdMsg("Password changed successfully.");
    setOldPwd(""); setNewPwd(""); setConfirm("");
  };

  const handleReset = () => {
    if (confirm("Reset ALL site settings to factory defaults? This cannot be undone.")) {
      resetToDefaults();
      alert("Settings reset to defaults.");
    }
  };

  return (
    <div className="max-w-md space-y-10">
      <SectionTitle>Admin Settings</SectionTitle>

      <div className="space-y-4">
        <h3 className="font-playfair text-lg font-semibold">Change Admin Password</h3>
        <div><Label>Current Password</Label><Input type="password" value={oldPwd} onChange={setOldPwd} /></div>
        <div><Label>New Password</Label><Input type="password" value={newPwd} onChange={setNewPwd} /></div>
        <div><Label>Confirm New Password</Label><Input type="password" value={confirm} onChange={setConfirm} /></div>
        {pwdMsg && <p className={`font-inter text-xs ${pwdMsg.includes("success") ? "text-green-600" : "text-destructive"}`}>{pwdMsg}</p>}
        <Btn variant="primary" onClick={changePwd}>Change Password</Btn>
      </div>

      <div className="space-y-4 border-t border-border pt-8">
        <h3 className="font-playfair text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="font-inter text-xs text-muted-foreground">
          Reset all site settings back to the original factory defaults. This will overwrite all brand configuration, products, theme, and homepage content.
        </p>
        <Btn variant="danger" onClick={handleReset}>
          <RotateCcw size={14} className="inline mr-1" />Reset to Defaults
        </Btn>
      </div>

      <div className="border-t border-border pt-8">
        <Btn variant="secondary" onClick={() => { adminLogout(); navigate("/admin/login"); }}>
          <LogOut size={14} className="inline mr-1" />Log Out
        </Btn>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

const TABS = [
  { id: "brand", label: "Brand" },
  { id: "products", label: "Products" },
  { id: "theme", label: "Theme" },
  { id: "hero", label: "Hero Slides" },
  { id: "homepage", label: "Homepage" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Admin() {
  useAdminGuard();
  const navigate = useNavigate();
  const { settings } = useSite();
  const [activeTab, setActiveTab] = useState<TabId>("brand");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="font-inter text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Site
            </button>
            <span className="text-border">|</span>
            <span className="font-playfair text-xl font-semibold">{settings.brand.brandName} Admin</span>
          </div>
          <button
            onClick={() => { adminLogout(); navigate("/admin/login"); }}
            className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
        {/* Tab bar */}
        <div className="flex overflow-x-auto px-6 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-inter text-xs tracking-widest uppercase whitespace-nowrap px-5 py-3 border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 md:px-12 py-10">
        {activeTab === "brand" && <BrandTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "theme" && <ThemeTab />}
        {activeTab === "hero" && <HeroSlidesTab />}
        {activeTab === "homepage" && <HomepageTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
