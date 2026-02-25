import { useState, useMemo, useEffect, useCallback } from "react";
import { products, categories, Product, ProductCategory, ProductOccasion } from "@/data/products";
import { addProduct, getProducts, deleteProduct, updateProduct, uploadProductImage } from "@/lib/productsService";
import { brand } from "@/config/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  plus: "M12 4v16m8-8H4",
};

// ── Sidebar navigation items ──────────────────────────────────────────────────
type Section = "dashboard" | "products" | "add-product" | "config";

const NAV_ITEMS: { id: Section; label: string; iconPath: string }[] = [
  { id: "dashboard", label: "Dashboard", iconPath: ICONS.dashboard },
  { id: "products", label: "Products", iconPath: ICONS.products },
  { id: "add-product", label: "Add Product", iconPath: ICONS.plus },
  { id: "config", label: "Brand Config", iconPath: ICONS.config },
];

// ── Firestore products hook ───────────────────────────────────────────────────
function useFirestoreProducts() {
  const [fsProducts, setFsProducts] = useState<Product[]>([]);
  const [fsLoading, setFsLoading] = useState(true);
  const [fsError, setFsError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setFsLoading(true);
    setFsError(null);
    try {
      const data = await getProducts();
      setFsProducts(data);
    } catch (e) {
      setFsError((e as Error).message ?? "Failed to load products from Firestore.");
    } finally {
      setFsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const remove = useCallback(async (id: string): Promise<void> => {
    await deleteProduct(id);
    await fetch();
  }, [fetch]);

  return { fsProducts, fsLoading, fsError, refetch: fetch, remove };
}


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
  const { fsProducts, fsLoading } = useFirestoreProducts();
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
        <StatCard label="Saved to DB" value={fsLoading ? "…" : fsProducts.length} iconPath={ICONS.tag} accent />
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
function ProductsSection({ onEdit }: { onEdit: (p: Product) => void }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [occasionFilter, setOccasionFilter] = useState<string>("All");
  const { fsProducts, fsLoading, fsError, remove } = useFirestoreProducts();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

      {/* ── Firestore Products ─────────────────────────────────────────── */}
      <div>
        <h3 className="font-playfair text-xl font-semibold mt-10 mb-4">
          Firestore Catalog
          {!fsLoading && (
            <span className="ml-2 font-inter text-sm text-muted-foreground font-normal">
              ({fsProducts.length} product{fsProducts.length !== 1 ? "s" : ""})
            </span>
          )}
        </h3>

        {fsLoading && (
          <p className="text-sm text-muted-foreground font-inter">Loading from Firestore…</p>
        )}
        {fsError && (
          <p className="text-sm text-destructive font-inter">Error: {fsError}</p>
        )}
        {!fsLoading && !fsError && fsProducts.length === 0 && (
          <p className="text-sm text-muted-foreground font-inter">
            No products saved to Firestore yet. Use &ldquo;Add Product&rdquo; to create one.
          </p>
        )}
        {!fsLoading && fsProducts.length > 0 && (
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
                    <TableHead className="font-inter text-xs tracking-wide uppercase w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fsProducts.map((p) => (
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
                        <p className="font-inter text-sm font-medium">{p.name}</p>
                        <p className="font-inter text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {p.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-inter text-xs whitespace-nowrap">
                          {p.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-inter text-sm font-medium text-primary whitespace-nowrap">
                        {p.price}
                      </TableCell>
                      <TableCell>
                        {deleteError && deleting === p.id && (
                          <p className="text-xs text-destructive mb-1">{deleteError}</p>
                        )}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onEdit(p)}
                            className="font-inter text-xs text-primary hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
                              setDeleting(p.id);
                              setDeleteError(null);
                              try {
                                await remove(p.id);
                              } catch (err) {
                                setDeleteError((err as Error).message ?? "Delete failed.");
                              } finally {
                                setDeleting(null);
                              }
                            }}
                            disabled={deleting === p.id}
                            className="font-inter text-xs text-destructive hover:underline disabled:opacity-50"
                          >
                            {deleting === p.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Product section ───────────────────────────────────────────────────────
const OCCASION_OPTIONS: ProductOccasion[] = ["Formal", "Wedding", "Casual", "Party", "Traditional", "Any"];
const CATEGORY_OPTIONS = categories.filter((c) => c !== "All") as Exclude<ProductCategory, "All">[];

// Tag-chip input: type a value, press Enter or comma to add it
function TagInput({
  id,
  tags,
  onChange,
  placeholder,
}: {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function add(raw: string) {
    const value = raw.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      add(input);
    } else if (e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 min-h-[38px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-within:ring-1 focus-within:ring-ring">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md text-xs font-inter"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-muted-foreground hover:text-foreground leading-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        id={id}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => add(input)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm font-inter placeholder:text-muted-foreground"
      />
    </div>
  );
}

type ImageMode = "url" | "upload";

// Dual-mode image slot: toggle between pasting a URL or uploading a file
function ImageSlot({
  id,
  label,
  required,
  mode,
  url,
  file,
  uploading,
  onModeChange,
  onUrlChange,
  onFileChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  mode: ImageMode;
  url: string;
  file: File | null;
  uploading: boolean;
  onModeChange: (m: ImageMode) => void;
  onUrlChange: (u: string) => void;
  onFileChange: (f: File | null) => void;
}) {
  // Object-URL for local file preview — revoked on file or unmount
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const displayedPreview = mode === "upload" ? previewUrl : (url || null);
  const hasValue = mode === "url" ? url.trim() !== "" : file !== null;

  return (
    <div className="space-y-2">
      {/* Label + mode toggle */}
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="font-inter text-sm">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <div className="flex rounded-md border border-border overflow-hidden text-xs font-inter">
          <button
            type="button"
            onClick={() => onModeChange("url")}
            className={`px-3 py-1 transition-colors ${
              mode === "url"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => onModeChange("upload")}
            className={`px-3 py-1 border-l border-border transition-colors ${
              mode === "upload"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* URL mode */}
      {mode === "url" && (
        <Input
          id={id}
          type="url"
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="font-inter text-sm"
          required={required && !hasValue}
        />
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <div className="flex items-center gap-3">
          <label
            htmlFor={id}
            className={`inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border border-dashed border-border
              text-xs font-inter text-muted-foreground hover:border-primary hover:text-primary transition-colors
              ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Icon path={ICONS.plus} className="w-3 h-3" />
            {file ? "Change file" : "Choose file"}
            <input
              id={id}
              type="file"
              accept="image/*"
              className="sr-only"
              required={required && !hasValue}
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
          {file && (
            <span className="text-xs font-inter text-muted-foreground truncate max-w-[160px]">
              {file.name}
            </span>
          )}
          {uploading && (
            <span className="text-xs font-inter text-muted-foreground">Uploading…</span>
          )}
        </div>
      )}

      {/* Preview (shared) */}
      {displayedPreview && (
        <img
          src={displayedPreview}
          alt={label}
          className="h-24 w-24 object-cover rounded-md border border-border bg-muted"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
    </div>
  );
}

type ImageView = "front" | "left" | "right" | "back";

interface ImageSlotState {
  mode: ImageMode;
  url: string;
  file: File | null;
}

const EMPTY_IMAGE_SLOT: ImageSlotState = { mode: "upload", url: "", file: null };

function AddProductSection({
  editProduct = null,
  onEditDone,
}: {
  editProduct?: Product | null;
  onEditDone?: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);   // add mode: Firestore doc ID
  const [saveUpdated, setSaveUpdated] = useState(false);         // edit mode: success flag
  const [uploadingView, setUploadingView] = useState<ImageView | null>(null);

  // Text / select fields
  const [form, setForm] = useState({
    name: "",
    description: "",
    fullDescription: "",
    price: "",
    originalPrice: "",
    category: "" as Exclude<ProductCategory, "All"> | "",
    occasion: "" as ProductOccasion | "",
    featured: false,
    isNew: false,
    isTrending: false,
  });

  // Free-form string[] tags
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  // Per-view image state: each slot is independently either URL or file-upload mode
  const [imageSlots, setImageSlots] = useState<Record<ImageView, ImageSlotState>>({
    front: { ...EMPTY_IMAGE_SLOT },
    left: { ...EMPTY_IMAGE_SLOT },
    right: { ...EMPTY_IMAGE_SLOT },
    back: { ...EMPTY_IMAGE_SLOT },
  });

  // Populate form when editing an existing product; reset when returning to add mode
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description,
        fullDescription: editProduct.fullDescription ?? "",
        price: editProduct.price,
        originalPrice: editProduct.originalPrice ?? "",
        category: editProduct.category,
        occasion: editProduct.occasion ?? "",
        featured: editProduct.featured ?? false,
        isNew: editProduct.isNew ?? false,
        isTrending: editProduct.isTrending ?? false,
      });
      setColors(editProduct.colors ?? []);
      setSizes(editProduct.sizes ?? []);
      setImageSlots({
        front: editProduct.image
          ? { mode: "url", url: editProduct.image, file: null }
          : { ...EMPTY_IMAGE_SLOT },
        left: editProduct.images?.left
          ? { mode: "url", url: editProduct.images.left, file: null }
          : { ...EMPTY_IMAGE_SLOT },
        right: editProduct.images?.right
          ? { mode: "url", url: editProduct.images.right, file: null }
          : { ...EMPTY_IMAGE_SLOT },
        back: editProduct.images?.back
          ? { mode: "url", url: editProduct.images.back, file: null }
          : { ...EMPTY_IMAGE_SLOT },
      });
      setSaveError(null);
      setSavedId(null);
      setSaveUpdated(false);
    } else {
      // Switching back to add mode — clear the form
      setForm({
        name: "",
        description: "",
        fullDescription: "",
        price: "",
        originalPrice: "",
        category: "",
        occasion: "",
        featured: false,
        isNew: false,
        isTrending: false,
      });
      setColors([]);
      setSizes([]);
      setImageSlots({
        front: { ...EMPTY_IMAGE_SLOT },
        left: { ...EMPTY_IMAGE_SLOT },
        right: { ...EMPTY_IMAGE_SLOT },
        back: { ...EMPTY_IMAGE_SLOT },
      });
      setSaveError(null);
      setSavedId(null);
      setSaveUpdated(false);
    }
  }, [editProduct]);

  function patchSlot(view: ImageView, patch: Partial<ImageSlotState>) {
    setImageSlots((prev) => ({ ...prev, [view]: { ...prev[view], ...patch } }));
    setSaveError(null);
    setSavedId(null);
  }

  function handleChange(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveError(null);
    setSavedId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const frontSlot = imageSlots.front;
    const frontHasValue =
      (frontSlot.mode === "url" && frontSlot.url.trim() !== "") ||
      (frontSlot.mode === "upload" && frontSlot.file !== null);
    if (!frontHasValue) {
      setSaveError("Please provide a front/main image by entering a URL or uploading a file.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSavedId(null);
    try {
      // Resolve each slot: upload files, pass URLs through directly
      const imageUrls: Partial<Record<ImageView, string>> = {};
      for (const view of (["front", "left", "right", "back"] as ImageView[])) {
        const slot = imageSlots[view];
        if (slot.mode === "url" && slot.url.trim()) {
          imageUrls[view] = slot.url.trim();
        } else if (slot.mode === "upload" && slot.file) {
          setUploadingView(view);
          imageUrls[view] = await uploadProductImage(slot.file, view);
        }
      }
      setUploadingView(null);

      const priceNum = parseInt(form.price.replace(/\D/g, ""), 10) || 0;
      const origPriceNum = form.originalPrice
        ? parseInt(form.originalPrice.replace(/\D/g, ""), 10) || 0
        : undefined;

      const productData: Omit<Product, "id"> = {
        name: form.name,
        description: form.description,
        ...(form.fullDescription ? { fullDescription: form.fullDescription } : {}),
        price: form.price,
        priceValue: priceNum,
        ...(form.originalPrice ? { originalPrice: form.originalPrice } : {}),
        ...(origPriceNum !== undefined ? { originalPriceValue: origPriceNum } : {}),
        category: form.category as Exclude<ProductCategory, "All">,
        ...(form.occasion ? { occasion: form.occasion as ProductOccasion } : {}),
        image: imageUrls.front ?? "",
        images: {
          ...(imageUrls.front ? { front: imageUrls.front } : {}),
          ...(imageUrls.left ? { left: imageUrls.left } : {}),
          ...(imageUrls.right ? { right: imageUrls.right } : {}),
          ...(imageUrls.back ? { back: imageUrls.back } : {}),
        },
        ...(colors.length > 0 ? { colors } : {}),
        ...(sizes.length > 0 ? { sizes } : {}),
        ...(form.featured ? { featured: true } : {}),
        ...(form.isNew ? { isNew: true } : {}),
        ...(form.isTrending ? { isTrending: true } : {}),
      };

      if (editProduct) {
        await updateProduct(editProduct.id, productData);
        setSaveUpdated(true);
        onEditDone?.();
      } else {
        const id = await addProduct(productData);
        setSavedId(id);
      }
      handleReset();
    } catch (err) {
      setSaveError((err as Error).message ?? "Failed to save product.");
      setUploadingView(null);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm({
      name: "",
      description: "",
      fullDescription: "",
      price: "",
      originalPrice: "",
      category: "",
      occasion: "",
      featured: false,
      isNew: false,
      isTrending: false,
    });
    setColors([]);
    setSizes([]);
    setImageSlots({
      front: { ...EMPTY_IMAGE_SLOT },
      left: { ...EMPTY_IMAGE_SLOT },
      right: { ...EMPTY_IMAGE_SLOT },
      back: { ...EMPTY_IMAGE_SLOT },
    });
    setSaveError(null);
    setSavedId(null);
    setSaveUpdated(false);
  }

  const IMAGE_SLOTS: { view: ImageView; label: string; required: boolean }[] = [
    { view: "front", label: "Front / Main Image", required: true },
    { view: "left", label: "Left Side Image", required: false },
    { view: "right", label: "Right Side Image", required: false },
    { view: "back", label: "Back Image", required: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">
          {editProduct ? `Edit Product` : "Add Product"}
        </h2>
        <p className="text-sm text-muted-foreground font-inter">
          {editProduct
            ? `Editing "${editProduct.name}" — update the fields below and save.`
            : "Fill in the fields below to add a new product to the catalog."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-lg font-semibold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="ap-name" className="font-inter text-sm">Product Name <span className="text-destructive">*</span></Label>
              <Input
                id="ap-name"
                placeholder="e.g. Luxury Ankara Blazer"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="font-inter text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-desc" className="font-inter text-sm">Short Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="ap-desc"
                placeholder="A brief one-line description shown on the product card…"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="font-inter text-sm resize-none"
                rows={2}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-full-desc" className="font-inter text-sm">Full Description</Label>
              <Textarea
                id="ap-full-desc"
                placeholder="Detailed product story shown in the quick-view panel…"
                value={form.fullDescription}
                onChange={(e) => handleChange("fullDescription", e.target.value)}
                className="font-inter text-sm resize-none"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-lg font-semibold">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="ap-price" className="font-inter text-sm">Selling Price <span className="text-destructive">*</span></Label>
              <Input
                id="ap-price"
                placeholder="e.g. ₦85,000"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="font-inter text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-orig-price" className="font-inter text-sm">Original Price <span className="text-muted-foreground text-xs">(before discount)</span></Label>
              <Input
                id="ap-orig-price"
                placeholder="e.g. ₦95,000"
                value={form.originalPrice}
                onChange={(e) => handleChange("originalPrice", e.target.value)}
                className="font-inter text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-lg font-semibold">Classification</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="ap-category" className="font-inter text-sm">Category <span className="text-destructive">*</span></Label>
              <Select
                value={form.category}
                onValueChange={(v) => handleChange("category", v)}
                required
              >
                <SelectTrigger id="ap-category" className="font-inter text-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c} className="font-inter text-sm">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-occasion" className="font-inter text-sm">Occasion</Label>
              <Select
                value={form.occasion}
                onValueChange={(v) => handleChange("occasion", v)}
              >
                <SelectTrigger id="ap-occasion" className="font-inter text-sm">
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {OCCASION_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o} className="font-inter text-sm">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Product Images — URL or file upload per slot */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-lg font-semibold">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-xs text-muted-foreground font-inter">
              For each view, paste a URL <strong>or</strong> upload a file from your device.
              Only the Front (Main) image is required. Uploaded files are stored in Firebase Storage.
            </p>
            {IMAGE_SLOTS.map(({ view, label, required }) => (
              <ImageSlot
                key={view}
                id={`ap-image-${view}`}
                label={label}
                required={required}
                mode={imageSlots[view].mode}
                url={imageSlots[view].url}
                file={imageSlots[view].file}
                uploading={saving && uploadingView === view}
                onModeChange={(m) => patchSlot(view, { mode: m, url: "", file: null })}
                onUrlChange={(u) => patchSlot(view, { url: u })}
                onFileChange={(f) => patchSlot(view, { file: f })}
              />
            ))}
          </CardContent>
        </Card>

        {/* Variants — tag-chip inputs */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-lg font-semibold">Variants</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="ap-colors" className="font-inter text-sm">Colors</Label>
              <TagInput
                id="ap-colors"
                tags={colors}
                onChange={setColors}
                placeholder="e.g. Red, Blue, Gold…"
              />
              <p className="text-xs text-muted-foreground font-inter">Type a color and press Enter or comma to add</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-sizes" className="font-inter text-sm">Sizes</Label>
              <TagInput
                id="ap-sizes"
                tags={sizes}
                onChange={setSizes}
                placeholder="e.g. S, M, L, XL…"
              />
              <p className="text-xs text-muted-foreground font-inter">Type a size and press Enter or comma to add</p>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-lg font-semibold">Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            {[
              { id: "ap-featured", field: "featured" as const, label: "Featured", description: "Show in featured collection" },
              { id: "ap-new", field: "isNew" as const, label: "New Arrival", description: "Mark as newly added" },
              { id: "ap-trending", field: "isTrending" as const, label: "Trending", description: "Show in trending section" },
            ].map(({ id, field, label, description }) => (
              <div key={id} className="flex items-start gap-3">
                <Checkbox
                  id={id}
                  checked={form[field]}
                  onCheckedChange={(v) => handleChange(field, Boolean(v))}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor={id} className="font-inter text-sm cursor-pointer">{label}</Label>
                  <p className="text-xs text-muted-foreground font-inter">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Error banner */}
        {saveError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
            <Icon path="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-inter font-medium text-red-800">Failed to save product</p>
              <p className="text-xs font-inter text-red-700 mt-0.5">{saveError}</p>
            </div>
          </div>
        )}

        {/* Success banner */}
        {(savedId || saveUpdated) && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-start gap-3">
            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              {saveUpdated ? (
                <p className="text-sm font-inter font-medium text-emerald-800">Product updated in Firestore</p>
              ) : (
                <>
                  <p className="text-sm font-inter font-medium text-emerald-800">Product saved to Firestore</p>
                  <p className="text-xs font-inter text-emerald-700 mt-0.5">
                    Document ID: <code className="bg-emerald-100 px-1 rounded">{savedId}</code>
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Upload progress indicator */}
        {saving && uploadingView && (
          <p className="text-xs font-inter text-muted-foreground">
            Uploading {uploadingView} image to Firebase Storage…
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" disabled={saving} className="font-inter text-sm">
            <Icon path={ICONS.plus} className="w-4 h-4" />
            {saving
              ? (uploadingView ? `Uploading ${uploadingView}…` : "Saving…")
              : (editProduct ? "Update Product" : "Save Product")}
          </Button>
          <Button type="button" variant="outline" className="font-inter text-sm" onClick={handleReset} disabled={saving}>
            {editProduct ? "Cancel Edit" : "Clear Form"}
          </Button>
        </div>
      </form>
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function handleEdit(p: Product) {
    setEditingProduct(p);
    setActiveSection("add-product");
  }

  function handleEditDone() {
    setEditingProduct(null);
    setActiveSection("products");
  }

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
                if (id !== "add-product") setEditingProduct(null);
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
            Firebase · Firestore CRUD
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

          {/* Firebase badge */}
          <Badge variant="outline" className="font-inter text-xs hidden sm:flex">
            Firebase
          </Badge>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "products" && <ProductsSection onEdit={handleEdit} />}
          {activeSection === "add-product" && (
            <AddProductSection
              editProduct={editingProduct}
              onEditDone={handleEditDone}
            />
          )}
          {activeSection === "config" && <BrandConfigSection />}
        </main>
      </div>
    </div>
  );
}
