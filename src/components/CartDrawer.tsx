import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { brand, buildWhatsAppOrderUrl } from "@/config/brand";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity } = useCart();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    const url = buildWhatsAppOrderUrl(
      items.map((i) => ({ name: i.product.name, quantity: i.quantity }))
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-background flex flex-col shadow-[−8px_0_32px_hsl(0_0%_0%/0.15)] transition-transform duration-350 ease-in-out",
          isCartOpen ? "translate-x-0 animate-slide-in-right" : "translate-x-full"
        )}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-primary" />
            <h2 className="font-playfair text-xl font-semibold">Your Order</h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-muted-foreground/40" />
              <p className="font-playfair text-xl text-muted-foreground">
                Your cart is empty
              </p>
              <p className="font-inter text-sm text-muted-foreground/70">
                Browse our collections and add items to order via WhatsApp.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 items-start border-b border-border pb-4 last:border-0"
                >
                  {/* Product image */}
                  <div className="w-20 h-24 shrink-0 overflow-hidden rounded-sm bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair text-sm font-semibold leading-snug">
                      {product.name}
                    </p>
                    <p className="font-inter text-xs text-muted-foreground mt-0.5">
                      {product.category}
                    </p>
                    <p className="font-inter text-sm font-medium text-primary mt-1">
                      {product.price}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-inter text-sm w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer / WhatsApp CTA */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-3">
            <div className="flex justify-between font-inter text-sm text-muted-foreground">
              <span>
                {items.reduce((s, i) => s + i.quantity, 0)} item
                {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
              </span>
              <span>Order via WhatsApp</span>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-inter font-semibold text-sm tracking-wide py-3.5 rounded-sm hover:bg-[#1ebe5a] transition-colors duration-200 shadow-gold"
            >
              {/* WhatsApp icon (inline SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.12 1.524 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.098-1.459A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.884 9.884 0 0 1-5.034-1.377l-.361-.213-3.73.893.908-3.647-.235-.374A9.86 9.86 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1c5.467 0 9.9 4.433 9.9 9.9s-4.433 9.9-9.9 9.9z" />
              </svg>
              Checkout Now
            </button>

            <p className="text-center font-inter text-xs text-muted-foreground">
              We'll assist with measurements & delivery
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
