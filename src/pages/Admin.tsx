import { useState, useMemo } from "react";
import { products, categories, Product, ProductCategory } from "@/data/products";
import { brand } from "@/config/brand";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ── Icons (inline SVG to avoid extra deps) ───────────────────────────────────
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  products: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  config: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  tag: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  new: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  map: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  link: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
};

// ── Sidebar navigation items ──────────────────────────────────────────────────
type Section = "dashboard" | "products" | "config";

const NAV_ITEMS: { id: Section; label: string; iconPath: string }[] = [
  { id: "dashboard", label: "Dashboard", iconPath: ICONS.dashboard },
  { id: "products", label: "Products", iconPath: ICONS.products },
  { id: "config", label: "Brand Config", iconPath: ICONS.config },
];

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  iconPath,
  accent = false,
}: {
  label: string;
  value: number | string;
  iconPath: string;
  accent?: boolean;
}) {
  return (
    <Card className="border border-border">
      <CardContent className="p-5 space-y-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            accent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon path={iconPath} className="w-4 h-4" />
        </div>
        <div>
          <p className="text-3xl font-playfair font-bold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground font-inter tracking-wide uppercase mt-2">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Dashboard overview section ────────────────────────────────────────────────
function DashboardSection() {
  const totalProducts = products.length;
  const featured = products.filter((p) => p.featured).length;
  const isNew = products.filter((p) => p.isNew).length;
  const trending = products.filter((p) => p.isTrending).length;
  const totalCategories = categories.length - 1; // exclude "All"

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const cats = categories.filter((c) => c !== "All") as Exclude<ProductCategory, "All">[];
    return cats.map((cat) => ({
      name: cat,
      count: products.filter((p) => p.category === cat).length,
    }));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Dashboard</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Overview of your catalog and brand data — read-only view.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Products" value={totalProducts} iconPath={ICONS.products} accent />
        <StatCard label="Categories" value={totalCategories} iconPath={ICONS.tag} />
        <StatCard label="Featured" value={featured} iconPath={ICONS.star} />
        <StatCard label="New Arrivals" value={isNew} iconPath={ICONS.new} />
        <StatCard label="Trending" value={trending} iconPath={ICONS.trending} />
      </div>

      {/* Category breakdown */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-playfair text-lg font-semibold">Products by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryBreakdown.map(({ name, count }) => (
              <div key={name} className="text-center p-4 rounded-lg bg-muted/50">
                <p className="font-playfair text-2xl font-semibold text-primary">{count}</p>
                <p className="text-xs text-muted-foreground font-inter tracking-wide mt-1">{name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent products */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-playfair text-lg font-semibold">Recently Added</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {products
              .filter((p) => p.isNew)
              .slice(0, 6)
              .map((p) => (
                <div key={p.id} className="flex items-center gap-4 py-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-md shrink-0 bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-inter font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <span className="text-sm font-inter font-medium text-primary whitespace-nowrap">{p.price}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Products section ──────────────────────────────────────────────────────────
function ProductsSection() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [occasionFilter, setOccasionFilter] = useState<string>("All");

  const occasions = useMemo(() => {
    const set = new Set(products.map((p) => p.occasion).filter(Boolean) as string[]);
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchesOccasion = occasionFilter === "All" || p.occasion === occasionFilter;
      return matchesSearch && matchesCategory && matchesOccasion;
    });
  }, [search, categoryFilter, occasionFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Products</h2>
        <p className="text-sm text-muted-foreground font-inter">
          {products.length} products across {categories.length - 1} categories — read-only.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon
            path={ICONS.search}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-inter text-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44 font-inter text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c} className="font-inter text-sm">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={occasionFilter} onValueChange={setOccasionFilter}>
          <SelectTrigger className="w-full sm:w-44 font-inter text-sm">
            <SelectValue placeholder="Occasion" />
          </SelectTrigger>
          <SelectContent>
            {occasions.map((o) => (
              <SelectItem key={o} value={o} className="font-inter text-sm">
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground font-inter">
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-inter text-xs tracking-wide uppercase w-16">Image</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">ID</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">Name</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">Category</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">Price</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">Occasion</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">Colors</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">Sizes</TableHead>
                <TableHead className="font-inter text-xs tracking-wide uppercase">Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: Product) => (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-md bg-muted"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {p.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-inter text-sm font-medium">{p.name}</p>
                      <p className="font-inter text-xs text-muted-foreground line-clamp-1 max-w-xs">
                        {p.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-inter text-xs whitespace-nowrap">
                      {p.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <p className="font-inter text-sm font-medium text-primary">{p.price}</p>
                    {p.originalPrice && (
                      <p className="font-inter text-xs text-muted-foreground line-through">
                        {p.originalPrice}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="font-inter text-xs text-muted-foreground whitespace-nowrap">
                    {p.occasion ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {(p.colors ?? []).map((c) => (
                        <span key={c} className="font-inter text-xs bg-muted px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                          {c}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[100px]">
                      {(p.sizes ?? []).map((s) => (
                        <span key={s} className="font-inter text-xs bg-muted px-1.5 py-0.5 rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary hover:bg-primary/10 border-0">
                          Featured
                        </Badge>
                      )}
                      {p.isNew && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0">
                          New
                        </Badge>
                      )}
                      {p.isTrending && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-violet-50 text-violet-700 hover:bg-violet-50 border-0">
                          Trending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ── Config row helper ─────────────────────────────────────────────────────────
function ConfigRow({ label, value, iconPath, isLink = false }: {
  label: string;
  value: string;
  iconPath?: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      {iconPath && (
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
          <Icon path={iconPath} className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-inter text-muted-foreground tracking-wide uppercase mb-0.5">{label}</p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-inter text-primary hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-inter break-all">{value}</p>
        )}
      </div>
    </div>
  );
}

// ── Brand Config section ──────────────────────────────────────────────────────
function BrandConfigSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Brand Config</h2>
        <p className="text-sm text-muted-foreground font-inter">
          All values loaded from <code className="text-xs bg-muted px-1.5 py-0.5 rounded">src/config/brand.ts</code> — read-only.
        </p>
      </div>

      {/* Identity */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-playfair text-lg font-semibold">Brand Identity</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ConfigRow label="Brand Name" value={brand.brandName} />
          <ConfigRow label="Tagline" value={brand.tagline} />
          <ConfigRow label="Sub Tagline" value={brand.subTagline} />
          <div className="flex items-start gap-4 py-4">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
              <Icon path={ICONS.star} className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-inter text-muted-foreground tracking-wide uppercase mb-1">Logo</p>
              <img src={brand.logo} alt="Brand logo" className="h-10 object-contain bg-muted rounded-md px-2" />
              <p className="text-xs font-inter text-muted-foreground mt-1">{brand.logo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-playfair text-lg font-semibold">Contact & Ordering</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ConfigRow label="Phone" value={brand.phone} iconPath={ICONS.phone} />
          <ConfigRow label="Email" value={brand.email} iconPath={ICONS.mail} />
          <ConfigRow label="WhatsApp Number" value={brand.whatsappNumber} iconPath={ICONS.phone} />
          <ConfigRow label="Location" value={brand.location} iconPath={ICONS.map} />
        </CardContent>
      </Card>

      {/* Social */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-playfair text-lg font-semibold">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ConfigRow label="Instagram" value={brand.instagram} iconPath={ICONS.link} isLink />
          <ConfigRow label="Facebook" value={brand.facebook} iconPath={ICONS.link} isLink />
          <ConfigRow
            label="WhatsApp Link"
            value={`https://wa.me/${brand.whatsappNumber}`}
            iconPath={ICONS.link}
            isLink
          />
        </CardContent>
      </Card>

      {/* Hero Images */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-playfair text-lg font-semibold">Hero Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Primary Hero", src: brand.heroImage },
            { label: "Secondary Hero", src: brand.heroImage2 },
            { label: "About Image", src: brand.aboutImage },
            { label: "Designer Image", src: brand.designerImage },
          ].map(({ label, src }) => (
            <div key={label} className="flex gap-4 items-start">
              <img src={src} alt={label} className="w-24 h-16 object-cover rounded-md bg-muted shrink-0" />
              <div>
                <p className="text-xs font-inter text-muted-foreground tracking-wide uppercase mb-1">{label}</p>
                <p className="text-xs font-inter text-muted-foreground break-all">{src}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* WhatsApp message templates */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-playfair text-lg font-semibold">WhatsApp Message Templates</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ConfigRow label="Greeting" value={brand.whatsappGreeting} />
          <ConfigRow label="Closing" value={brand.whatsappClosing} />
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex font-inter">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-64 bg-brand-black text-white flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:z-auto
        `}
      >
        {/* Brand header */}
        <div className="px-6 py-8 border-b border-white/10">
          <p className="font-playfair text-xl font-semibold tracking-wider text-white">
            {brand.brandName}
          </p>
          <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/40 mt-1">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map(({ id, label, iconPath }) => (
            <button
              key={id}
              onClick={() => {
                setActiveSection(id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-inter
                transition-colors duration-150 text-left
                ${activeSection === id
                  ? "bg-primary text-primary-foreground"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }
              `}
            >
              <Icon path={iconPath} className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-[10px] font-inter text-white/30 tracking-wide">
            Read-only · No CRUD
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background border-b border-border flex items-center px-6 gap-4">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              className="w-5 h-5">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-inter text-muted-foreground">
            <span className="text-foreground font-medium capitalize">{activeSection}</span>
          </div>

          {/* Read-only badge */}
          <Badge variant="outline" className="font-inter text-xs hidden sm:flex">
            Read-only
          </Badge>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "products" && <ProductsSection />}
          {activeSection === "config" && <BrandConfigSection />}
        </main>
      </div>
    </div>
  );
}
