import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Minus,
  Music,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  ThumbsUp,
  Trash2,
  X,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

// ---- Cart Context ----
interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  cartCount: number;
  cartTotal: string;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  }, []);

  const updateQuantity = useCallback((productId: number, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId),
      );
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: qty } : item,
        ),
      );
    }
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalNum = cartItems.reduce(
    (sum, item) => sum + item.product.priceNum * item.quantity,
    0,
  );
  const cartTotal = `₹${cartTotalNum.toLocaleString("en-IN")}`;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---- Cart Sheet ----
function CartSheet() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-brown-light">
          <SheetTitle className="font-serif text-xl text-brown-dark flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            Your Cart
            {cartCount > 0 && (
              <span className="ml-auto text-sm font-ui font-normal text-muted-foreground">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center"
            data-ocid="cart.empty_state"
          >
            <ShoppingCart className="w-16 h-16 text-brown-light" />
            <p className="font-body text-muted-foreground text-lg">
              Your cart is empty
            </p>
            <p className="text-sm font-ui text-muted-foreground">
              Discover our instruments in the{" "}
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-amber-600 underline hover:text-amber-700"
                data-ocid="cart.link"
              >
                Store
              </button>
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {cartItems.map((item, i) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-white rounded-xl border border-brown-light p-3"
                    data-ocid={`cart.item.${i + 1}`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.altText}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-bold text-brown-dark leading-snug line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-amber-600 font-ui mt-0.5">
                        {item.product.category}
                      </p>
                      <p className="text-sm font-ui font-semibold text-brown-dark mt-1">
                        {item.product.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                        data-ocid={`cart.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1 border border-brown-light rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-amber-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-ui font-semibold text-brown-dark">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-amber-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-brown-light px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-ui font-semibold text-brown-dark">
                  Subtotal
                </span>
                <span className="font-serif text-xl font-bold text-brown-dark">
                  {cartTotal}
                </span>
              </div>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-ui font-semibold"
                onClick={() => setCartOpen(false)}
                data-ocid="cart.close_button"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---- Navbar ----
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/store", label: "Store" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brown-light shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <Music className="w-6 h-6 text-brown-dark" />
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-xl font-bold text-brown-dark">
              SoundSpace
            </span>
            <span className="font-ui text-[10px] text-amber-600 tracking-widest uppercase hidden sm:block">
              Find Your Sound
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-ui">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-brown-medium hover:text-brown-dark transition-colors"
              activeProps={{
                className: "text-brown-dark border-b-2 border-amber-500 pb-0.5",
              }}
              activeOptions={{ exact: link.to === "/" }}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CartIconButton />
          <button
            type="button"
            className="md:hidden p-2 text-brown-dark"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden bg-white border-t border-brown-light px-4 pb-4 flex flex-col gap-1 font-ui">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-2 text-sm font-semibold text-brown-medium hover:text-brown-dark border-b border-brown-light/50 last:border-0"
              onClick={() => setOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

// ---- Cart Icon Button ----
function CartIconButton() {
  const { cartCount, setCartOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className="relative p-2 text-brown-dark hover:text-amber-600 transition-colors"
      aria-label="Open cart"
      data-ocid="cart.open_modal_button"
    >
      <ShoppingCart className="w-5 h-5" />
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-ui font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </button>
  );
}

// ---- Footer ----
function Footer() {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer className="bg-white border-t border-brown-light mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-5 h-5 text-brown-dark" />
              <span className="font-serif text-lg font-bold text-brown-dark">
                SoundSpace
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
              Your Premier Music Instrument Shop. Find your sound at SoundSpace
              — India's trusted guide for guitars, pianos, drums, and more.
            </p>
            <p className="text-xs text-muted-foreground font-ui flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Bennett University, Greater Noida,
              UP - 201310
            </p>
          </div>
          <div>
            <h4 className="font-ui font-semibold text-brown-dark mb-3 text-sm uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/store", label: "Store" },
                { to: "/blog", label: "Blog" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-brown-dark transition-colors font-ui"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-ui font-semibold text-brown-dark mb-3 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-ui flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:hello@soundspace.com"
                  className="hover:text-brown-dark underline"
                >
                  hello@soundspace.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground font-ui flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                Bennett University, Greater Noida, Uttar Pradesh - 201310
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-ui font-semibold text-brown-dark mb-3 text-sm uppercase tracking-wide">
              Follow Us
            </h4>
            <div className="flex flex-col gap-2">
              {[
                {
                  Icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/",
                },
                {
                  Icon: Youtube,
                  label: "YouTube",
                  href: "https://www.youtube.com/",
                },
                {
                  Icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/",
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-brown-dark transition-colors font-ui flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground font-ui">
            Product photos courtesy of{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brown-dark"
            >
              Unsplash
            </a>
            .
          </p>
          <p className="text-sm text-muted-foreground font-ui">
            &copy; 2026 SoundSpace. All rights reserved. Images sourced from
            Unsplash and used with attribution. Your trusted musical instruments
            shop online India for best beginner guitars, pianos, and more.
          </p>
          <p className="text-xs text-muted-foreground font-ui">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brown-medium hover:text-brown-dark underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---- Layout ----
function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

// ---- Add To Cart Button ----
function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(product);
        toast.success(`${product.name} added to cart`, {
          action: {
            label: "View Cart",
            onClick: () => setCartOpen(true),
          },
        });
      }}
      className="w-full inline-flex items-center justify-center gap-2 border border-brown-dark text-brown-dark text-xs font-ui font-semibold px-3 py-2 rounded-lg hover:bg-brown-dark hover:text-white transition-colors"
      data-ocid="product.secondary_button"
    >
      <ShoppingCart className="w-3.5 h-3.5" />
      Add to Cart
    </button>
  );
}

// ---- Product Card ----
function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <article className="bg-white rounded-xl border border-brown-light shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.altText}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-muted-foreground font-ui px-4 pt-2">
        <span>📷 </span>
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-brown-dark"
        >
          Image Source: Unsplash
        </a>
      </p>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-ui font-semibold text-amber-600 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <h3 className="font-serif text-base font-bold text-brown-dark mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground font-body leading-relaxed flex-1 mb-3">
          {product.description}
        </p>
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-brown-dark text-lg">
              {product.price}
            </span>
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-ui font-semibold px-3 py-2 rounded-lg transition-colors"
              data-ocid="product.primary_button"
            >
              Buy on Amazon ↗
            </a>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}

// ---- Home Page ----
function HomePage() {
  return (
    <main>
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.55)), url(https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1400&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="hero.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            SoundSpace | Best Beginner Guitars &amp; Musical Instruments in
            India
          </h1>
          <p className="font-body text-xl text-amber-300 mb-3">
            Masterfully Crafted Instruments for Your Musical Journey
          </p>
          <p className="font-ui text-sm text-gray-300 mb-8 max-w-xl mx-auto">
            Your Premier Music Instrument Shop — Best Beginner Guitars, Piano
            Prices in India &amp; More
          </p>
          <Link to="/store">
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white font-ui font-semibold px-8 py-3 text-base"
              data-ocid="hero.primary_button"
            >
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </section>

      <section
        className="max-w-6xl mx-auto px-4 py-16"
        data-ocid="featured.section"
      >
        <h2 className="font-serif text-3xl font-bold text-brown-dark mb-2 text-center">
          Featured Instruments
        </h2>
        <p className="text-center text-muted-foreground font-body mb-10">
          Handpicked instruments for every beginner in India
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              data-ocid={`featured.item.${i + 1}`}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/store">
            <Button
              variant="outline"
              className="border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white font-ui font-semibold px-8"
              data-ocid="featured.secondary_button"
            >
              View All Instruments
            </Button>
          </Link>
        </div>
      </section>

      <section
        className="bg-amber-50 border-y border-amber-100 py-16 px-4"
        data-ocid="why.section"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-brown-dark mb-10 text-center">
            Why Choose SoundSpace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎸",
                title: "Quality Instruments",
                desc: "Every instrument carefully curated and quality-tested",
              },
              {
                icon: "💰",
                title: "Best Prices in India",
                desc: "Competitive pricing with no hidden costs",
              },
              {
                icon: "🎵",
                title: "Expert Guidance",
                desc: "Our musicians help you find the perfect instrument",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-amber-100 text-center shadow-sm"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-serif text-lg font-bold text-brown-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4" data-ocid="seo.section">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-muted-foreground leading-relaxed text-base">
            At SoundSpace, we help beginners find their perfect first
            instrument. Whether you&apos;re searching for the best acoustic
            guitar for beginners under ₹15,000, comparing piano prices in India,
            or need expert advice on how to choose your first guitar, we&apos;re
            here to guide you. Shop our collection of affordable musical
            instruments India with confidence.
          </p>
        </div>
      </section>
    </main>
  );
}

// ---- Store Page ----
function getImageSourceText(
  imageRedirectUrl: string | undefined,
): string | null {
  if (!imageRedirectUrl) return null;
  if (imageRedirectUrl.includes("amazon")) return "Image Source: Amazon.in";
  if (imageRedirectUrl.includes("flipkart")) return "Image Source: Flipkart";
  if (imageRedirectUrl.includes("bajaao")) return "Image Source: Bajaao.com";
  if (imageRedirectUrl.includes("furtados")) return "Image Source: Furtados";
  if (imageRedirectUrl.includes("wixstatic")) return "Image Source: Wix Media";
  if (imageRedirectUrl.includes("pexels")) return "Image Source: Pexels";
  if (imageRedirectUrl.includes("unsplash")) return "Image Source: Unsplash";
  return "Image Source";
}

function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [priceRange, setPriceRange] = useState<
    "All" | "Under 10000" | "10000-50000" | "Above 50000"
  >("All");
  const { addToCart, setCartOpen } = useCart();

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const types = [
    "All",
    ...(Array.from(
      new Set(products.map((p) => p.instrumentType).filter(Boolean)),
    ) as string[]),
  ];

  const filtered = products.filter((p) => {
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (selectedCategory !== "All" && p.category !== selectedCategory)
      return false;
    if (selectedType !== "All" && p.instrumentType !== selectedType)
      return false;
    if (priceRange === "Under 10000" && p.priceNum >= 10000) return false;
    if (
      priceRange === "10000-50000" &&
      (p.priceNum < 10000 || p.priceNum > 50000)
    )
      return false;
    if (priceRange === "Above 50000" && p.priceNum <= 50000) return false;
    return true;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
    setPriceRange("All");
  };

  return (
    <main data-ocid="store.page">
      {/* Hero */}
      <section className="bg-amber-50 border-b border-amber-100 py-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brown-dark mb-3">
            Our Collection
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated selection of premium musical
            instruments
          </p>
          <p className="font-body text-sm text-brown-medium max-w-2xl mx-auto mt-2 italic">
            Best Musical Instruments Shop — Find Your Perfect Guitar, Piano &
            More at Affordable Prices in India
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="border-b border-amber-100 bg-background sticky top-16 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-amber-200 bg-background text-brown-dark font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
                data-ocid="store.search_input"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 border border-amber-200 bg-background text-brown-dark font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
              data-ocid="store.select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2.5 border border-amber-200 bg-background text-brown-dark font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
              data-ocid="store.select"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
            <select
              value={priceRange}
              onChange={(e) =>
                setPriceRange(e.target.value as typeof priceRange)
              }
              className="px-3 py-2.5 border border-amber-200 bg-background text-brown-dark font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
              data-ocid="store.select"
            >
              <option value="All">All Prices</option>
              <option value="Under 10000">Under ₹10,000</option>
              <option value="10000-50000">₹10,000 – ₹50,000</option>
              <option value="Above 50000">Above ₹50,000</option>
            </select>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="font-body text-sm text-muted-foreground">
              Showing {filtered.length} of {products.length} instruments
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="store.empty_state">
            <p className="font-body text-lg text-muted-foreground mb-6">
              No instruments found matching your criteria.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2.5 border border-brown-dark text-brown-dark font-ui font-semibold text-sm rounded-lg hover:bg-brown-dark hover:text-white transition-colors"
              data-ocid="store.secondary_button"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                data-ocid={`store.item.${i + 1}`}
              >
                <StoreProductCard
                  product={p}
                  onAddToCart={() => {
                    addToCart(p);
                    toast.success(`${p.name} added to cart`, {
                      action: {
                        label: "View Cart",
                        onClick: () => setCartOpen(true),
                      },
                    });
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StoreProductCard({
  product,
  onAddToCart,
}: { product: Product; onAddToCart: () => void }) {
  const sourceText = getImageSourceText(product.imageRedirectUrl);
  return (
    <article className="bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
      <a
        href={product.imageRedirectUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden aspect-[4/3]"
      >
        <img
          src={product.image}
          alt={product.altText}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.imageRedirectUrl && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3 w-3 text-white" />
            <span className="text-white text-xs font-ui">View Source</span>
          </div>
        )}
      </a>
      {sourceText && (
        <div className="px-4 pt-2.5 pb-0">
          <a
            href={product.imageRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-brown-dark underline transition-colors font-ui"
          >
            <ExternalLink className="h-3 w-3" />
            {sourceText}
          </a>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-ui font-semibold text-amber-600 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <Link
          to="/instrument/$id"
          params={{ id: String(product.id) }}
          className="font-serif text-base font-bold text-brown-dark hover:text-amber-600 transition-colors mb-1 leading-snug line-clamp-1"
          data-ocid="store.item.link"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground font-body leading-relaxed flex-1 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-brown-dark text-lg">
              {product.price}
            </span>
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-ui font-semibold px-3 py-2 rounded-lg transition-colors"
              data-ocid="store.primary_button"
            >
              Buy on Amazon ↗
            </a>
          </div>
          <button
            type="button"
            onClick={onAddToCart}
            className="w-full inline-flex items-center justify-center gap-2 border border-brown-dark text-brown-dark text-xs font-ui font-semibold px-3 py-2 rounded-lg hover:bg-brown-dark hover:text-white transition-colors"
            data-ocid="store.secondary_button"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

const instrumentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/instrument/$id",
  component: InstrumentDetailPage,
});

// ---- Instrument Detail Page ----
function InstrumentDetailPage() {
  const { id } = instrumentDetailRoute.useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setCartOpen } = useCart();

  const instrument = products.find((p) => String(p.id) === id) ?? null;
  const sourceText = getImageSourceText(instrument?.imageRedirectUrl);

  if (!instrument) {
    return (
      <main
        className="max-w-6xl mx-auto px-4 py-16 text-center"
        data-ocid="instrument.page"
      >
        <h2 className="font-serif text-3xl font-bold text-brown-dark mb-4">
          Instrument Not Found
        </h2>
        <p className="font-body text-muted-foreground mb-8">
          The instrument you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 border border-brown-dark text-brown-dark font-ui font-semibold px-6 py-3 rounded-lg hover:bg-brown-dark hover:text-white transition-colors"
          data-ocid="instrument.link"
        >
          Browse All Instruments
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(instrument);
    }
    toast.success(`${instrument.name} ×${quantity} added to cart`, {
      action: { label: "View Cart", onClick: () => setCartOpen(true) },
    });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10" data-ocid="instrument.page">
      <Link
        to="/store"
        className="inline-flex items-center gap-2 font-ui text-sm text-amber-600 hover:text-brown-dark transition-colors mb-8"
        data-ocid="instrument.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a
            href={instrument.imageRedirectUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative overflow-hidden rounded-xl bg-amber-50"
          >
            <img
              src={instrument.image}
              alt={instrument.altText}
              className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {instrument.imageRedirectUrl && (
              <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-ui">
                  Click to view original source
                </span>
              </div>
            )}
          </a>

          {instrument.imageRedirectUrl && sourceText && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-2">
                <ExternalLink className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-ui text-sm font-semibold text-brown-dark mb-1">
                    {sourceText}
                  </p>
                  <a
                    href={instrument.imageRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-600 hover:text-brown-dark underline break-all font-body transition-colors"
                  >
                    {instrument.imageRedirectUrl}
                  </a>
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    * Image used for educational/review purposes. All rights
                    belong to original source.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Details column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-5"
        >
          {instrument.category && (
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-ui text-xs font-semibold rounded-full uppercase tracking-wider">
              {instrument.category}
            </span>
          )}

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark leading-tight">
            {instrument.name}
          </h1>

          <div className="font-serif text-2xl font-bold text-brown-dark">
            {instrument.price}
          </div>

          {instrument.description && (
            <div>
              <h2 className="font-serif text-lg font-bold text-brown-dark mb-1">
                Description
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {instrument.description}
              </p>
            </div>
          )}

          {instrument.specifications && (
            <div className="pt-4 border-t border-amber-100">
              <h2 className="font-serif text-lg font-bold text-brown-dark mb-3">
                Specifications
              </h2>
              <div className="space-y-2">
                {instrument.specifications.split("\n").map((spec, idx) =>
                  spec.trim() ? (
                    <div
                      key={`spec-${idx}-${spec.trim().slice(0, 10)}`}
                      className="flex items-start gap-2"
                    >
                      <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-brown-dark">
                        {spec.trim()}
                      </span>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {instrument.instrumentType && (
            <div className="pt-3 border-t border-amber-100">
              <h3 className="font-serif text-base font-bold text-brown-dark mb-1">
                Type
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {instrument.instrumentType}
              </p>
            </div>
          )}

          {/* Quantity */}
          <div className="pt-3" data-ocid="instrument.panel">
            <p className="font-ui text-sm font-semibold text-brown-dark mb-2">
              Quantity
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 border border-amber-200 rounded-lg text-brown-dark hover:bg-amber-100 flex items-center justify-center transition-colors"
                data-ocid="instrument.secondary_button"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-serif font-bold text-brown-dark text-xl w-8 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 border border-amber-200 rounded-lg text-brown-dark hover:bg-amber-100 flex items-center justify-center transition-colors"
                data-ocid="instrument.secondary_button"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-ui font-semibold text-base rounded-lg transition-colors flex items-center justify-center gap-2"
            data-ocid="instrument.primary_button"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>

          <a
            href={instrument.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-ui font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            data-ocid="instrument.link"
          >
            <ExternalLink className="h-4 w-4" />
            Buy on Amazon
          </a>
        </motion.div>
      </div>
    </main>
  );
}

// ---- Blog Page ----
function BlogPage() {
  return (
    <main className="bg-background" data-ocid="blog.page">
      {/* Blog section header */}
      <section className="bg-amber-50 border-b border-amber-100 py-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark mb-3">
            SoundSpace Blog | Insights for Musicians &amp; Music Lovers in India
          </h1>
          <p className="font-body text-muted-foreground text-base max-w-2xl mx-auto">
            Expert articles on best beginner guitars India, musical instruments
            shop online, and industry trends
          </p>
        </motion.div>
      </section>

      {/* Article */}
      <div className="max-w-[760px] mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Post metadata */}
          <div
            className="flex items-center gap-2 text-sm font-ui text-muted-foreground mb-4 flex-wrap"
            data-ocid="blog.panel"
          >
            <span>SoundSpace Editorial</span>
            <span aria-hidden="true">·</span>
            <time dateTime="2026-03-25">25 March 2026</time>
            <span aria-hidden="true">·</span>
            <span>12 min read</span>
          </div>

          {/* Article title */}
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-dark mb-3 leading-tight">
            Industry Insights: The Digital Pulse of Music
          </h2>
          <p className="font-body text-lg text-brown-medium italic mb-8">
            Navigating the Musical Instrument Industry in a Click-First World
          </p>

          {/* Article body */}
          <div
            className="font-body text-[1.05rem] leading-[1.85] text-foreground space-y-6"
            style={{ lineHeight: "1.8" }}
          >
            <h3 className="font-serif text-xl font-bold text-brown-dark mt-8 mb-2">
              Introduction
            </h3>
            <p>
              There is something almost sacred about the relationship between a
              musician and their instrument. Whether it&apos;s the worn-in
              fretboard of a vintage Stratocaster or the pristine, heavy ivory
              of a grand piano, music has always been a tactile, physical
              experience. For decades, the &quot;local music shop&quot; was the
              heart of this world.
            </p>
            <p>
              But let&apos;s be real: the world has shifted. The way we
              discover, research, and eventually buy these tools of expression
              has moved from the physical storefront to the digital screen.
              Today, a kid in a rural village can watch a world-class jazz
              drummer demo a snare drum on YouTube and have that exact model
              delivered to their door by Tuesday. This shift has created a
              massive opportunity, but it&apos;s also made the musical
              instrument industry one of the most competitive digital landscapes
              out there. To survive, brands can&apos;t just &quot;post on social
              media&quot; — they have to build a digital ecosystem that feels as
              authentic as a live performance.
            </p>

            <h3 className="font-serif text-xl font-bold text-brown-dark mt-8 mb-2">
              Understanding the Musical Instruments Industry
            </h3>
            <p>
              To market effectively in this space, you first have to understand
              that this isn&apos;t &quot;retail&quot; in the traditional sense.
              When someone buys a guitar, they aren&apos;t just buying wood and
              wire; they&apos;re buying a piece of their identity.
            </p>
            <p>
              The industry is uniquely bifurcated. On one end, you have the
              entry-level market: parents buying a first violin for a
              third-grader or a college student looking for a cheap MIDI
              controller. These customers are driven by price, durability, and
              &quot;ease of start.&quot; On the other end, you have the
              pro/enthusiast market. These are the &quot;gear-heads.&quot; They
              know the difference between nitrocellulose and polyurethane
              finishes. They care about the weight of the magnets in their
              pickups.
            </p>
            <p>
              For a business, this means your digital presence has to speak two
              languages at once. You need to be welcoming enough for the
              beginner who is intimidated by music theory, but technically
              proficient enough to satisfy the veteran who has been playing for
              thirty years. If your content feels &quot;corporate&quot; or
              uninformed, the community — which prizes authenticity above all
              else — will sniff it out in seconds.
            </p>

            <h3 className="font-serif text-xl font-bold text-brown-dark mt-8 mb-2">
              Why is Digital Marketing Important in This Industry?
            </h3>
            <p>
              If you aren&apos;t online, you&apos;re basically a ghost. That
              might sound harsh, but in an industry where the customer journey
              involves an average of 10 to 15 different &quot;touchpoints&quot;
              before a purchase, digital visibility is the only way to stay in
              the game.
            </p>
            <ul className="space-y-3 pl-4">
              <li>
                <strong>The Death of the &quot;Blind Buy&quot;:</strong> Almost
                nobody walks into a store and buys a ₹20,000 keyboard without
                looking it up first. They&apos;ve already watched ten
                &quot;unboxing&quot; videos and read three forum threads on
                Reddit. Digital marketing allows you to be the one providing
                that information.
              </li>
              <li>
                <strong>Global Reach for Niche Products:</strong> If you make
                boutique, hand-hammered cymbals, your local market might be five
                people. Through digital marketing, your market is every drummer
                on the planet.
              </li>
              <li>
                <strong>The Power of Sound:</strong> Traditional print ads could
                show you a picture of a flute, but digital marketing lets you
                hear it. Through high-fidelity audio and video, you can bridge
                the sensory gap that used to be the biggest barrier to online
                sales.
              </li>
              <li>
                <strong>Community Building:</strong> Musicians love to talk
                about gear. Digital platforms provide a space for a brand to
                stop being a &quot;seller&quot; and start being a
                &quot;facilitator&quot; of a global conversation.
              </li>
            </ul>

            <h3 className="font-serif text-xl font-bold text-brown-dark mt-8 mb-2">
              Smart Digital Marketing Techniques for Musical Instrument
              Businesses
            </h3>
            <p>
              Success in this niche requires moving beyond &quot;Buy Now&quot;
              buttons. You have to provide value before you ever ask for a
              credit card number.
            </p>
            <ul className="space-y-3 pl-4">
              <li>
                <strong>The &quot;Value-First&quot; Content Strategy:</strong>{" "}
                Instead of just listing the specs of a drum kit, create a video
                titled &quot;5 Ways to Make a Cheap Snare Drum Sound Like a
                Professional One.&quot; This positions your brand as an expert
                and a helper. When that drummer eventually decides they do want
                a professional snare, guess whose website they&apos;re going to
                visit first?
              </li>
              <li>
                <strong>
                  Leveraging the &quot;Influencer&quot; Micro-Community:
                </strong>{" "}
                In the music world, a &quot;micro-influencer&quot; (like a local
                guitar teacher with 5,000 loyal YouTube subscribers) is often
                more valuable than a pop star with 5 million. Why? Because
                people trust their ears. Partnering with respected players for
                honest, &quot;no-BS&quot; reviews creates a level of social
                proof that money can&apos;t buy.
              </li>
              <li>
                <strong>
                  Search Engine Optimization (SEO) for
                  &quot;Solution-Seeking&quot; Keywords:
                </strong>{" "}
                Most musicians search for solutions, not just products. Smart
                brands optimize for long-tail keywords like &quot;how to fix
                fret buzz&quot; or &quot;best travel guitars for
                backpacking.&quot; By appearing in these search results, you
                capture the user at the moment of need.
              </li>
              <li>
                <strong>Interactive Gear Builders:</strong> One of the smartest
                moves for modern music sites is the &quot;Custom Shop&quot;
                tool. Letting a user digitally &quot;build&quot; their dream
                guitar by choosing the wood, the hardware, and the color
                literally creates an emotional investment. Even if they
                don&apos;t buy it today, they&apos;ve spent twenty minutes
                engaging with your brand, and they&apos;ve likely saved a
                picture of that &quot;dream build&quot; to their phone.
              </li>
            </ul>

            <h3 className="font-serif text-xl font-bold text-brown-dark mt-8 mb-2">
              Challenges of Digital Marketing for the Musical Instrument
              Industry
            </h3>
            <p>
              It isn&apos;t all standing ovations. There are specific,
              &quot;sticky&quot; problems that music retailers face online.
            </p>
            <ul className="space-y-3 pl-4">
              <li>
                <strong>The &quot;Touch and Feel&quot; Barrier:</strong> How do
                you describe the &quot;neck profile&quot; of a bass through a
                screen? How do you explain the &quot;resistance&quot; of a
                trumpet&apos;s valves? This is the biggest hurdle. Digital
                marketing has to work twice as hard to translate physical
                sensations into visual and auditory cues.
              </li>
              <li>
                <strong>The &quot;Showrooming&quot; Problem:</strong> A classic
                challenge: a customer goes to a local shop to try out a guitar
                for an hour, gets the feel for it, and then goes home and buys
                it from a giant online retailer because it&apos;s ₹1000 cheaper.
                To fight this, digital marketing needs to emphasize added value
                — things like extended warranties, free setups, or exclusive
                &quot;how-to&quot; content that only comes with a purchase from
                your specific store.
              </li>
              <li>
                <strong>Hyper-Critical Audiences:</strong> Musicians can be,
                well... picky. If you post a video of a guitar and the player is
                slightly out of tune, the comments section will let you know
                within minutes. The margin for error in content production is
                much smaller here than in other industries. Your marketing team
                needs to actually know music.
              </li>
            </ul>

            <h3 className="font-serif text-xl font-bold text-brown-dark mt-8 mb-2">
              Conclusion
            </h3>
            <p>
              The musical instrument industry is at a fascinating crossroads. We
              have centuries-old traditions like the hand-carving of a violin
              meeting 21st-century algorithms. But at the core of it all, the
              mission hasn&apos;t changed. People want to make something
              beautiful.
            </p>
            <p>
              Digital marketing, when done right, isn&apos;t about
              &quot;tricking&quot; someone into a sale. It&apos;s about
              education, inspiration, and connection. It&apos;s about making
              sure that when a person decides they are ready to start their
              musical journey, they find the right tool to do it. The brands
              that win in this space will be the ones that stop acting like
              &quot;sellers&quot; and start acting like the &quot;smart
              friend&quot; at the music shop who always knows exactly what gear
              you need.
            </p>
          </div>
        </motion.article>

        {/* Related Posts */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-amber-50 border border-amber-100 rounded-xl p-6 md:p-8"
          data-ocid="blog.section"
        >
          <h2 className="font-serif text-xl font-bold text-brown-dark mb-5">
            You Might Also Like: More on Best Beginner Guitars India &amp;
            Musical Instruments Shop Online
          </h2>
          <ul className="space-y-3">
            {[
              {
                label: "Best Beginner Guitar Buying Guide India 2026",
                to: "/blog",
              },
              {
                label: "Piano Prices in India: Complete Guide 2026",
                to: "/blog",
              },
              {
                label: "How to Choose Your First Guitar in India",
                to: "/blog",
              },
            ].map((post, i) => (
              <li key={post.label}>
                <Link
                  to={post.to}
                  className="flex items-center gap-2 text-sm font-ui text-brown-medium hover:text-brown-dark underline underline-offset-2 transition-colors"
                  data-ocid={`blog.item.${i + 1}`}
                >
                  <span className="text-amber-500">→</span>
                  {post.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Blog-specific footer note */}
        <div className="mt-8 pt-6 border-t border-brown-light text-center space-y-2">
          <p className="text-sm text-muted-foreground font-ui">
            &copy; 2026 SoundSpace. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-ui">
            Your trusted musical instruments shop online India for best beginner
            guitars, piano prices in India, and expert music insights.
          </p>
          <p className="text-xs text-muted-foreground font-ui">
            Looking for the best acoustic guitar for beginners under ₹15,000?{" "}
            <Link
              to="/store"
              className="text-brown-medium hover:text-brown-dark underline"
              data-ocid="blog.link"
            >
              Visit our Store
            </Link>{" "}
            for honest reviews and recommendations.
          </p>
        </div>
      </div>
    </main>
  );
}

// ---- About Page ----
const team = [
  {
    name: "Vedant Garg & Devarsh Binani",
    role: "CONTENT CREATORS & MARKETING STRATEGISTS",
    bio: `Vedant and Devarsh are the voices behind our stories. Their job was to move beyond "sales talk" and create interesting, original content that musicians actually want to read. From deep-dive blog posts to smart digital strategies that help you find exactly what you're looking for online, they ensure that our brand stands out with clarity and authenticity.`,
    bridging:
      "Their expertise in SEO and content marketing helps musicians searching for how to choose first guitar India find our beginner guitar buying guide.",
    initials: "VD",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Ridhima Sharma",
    role: "WEB EDITOR & PROJECT MANAGER",
    bio: `Ridhima is the engine that keeps this project moving. She managed the entire build of our digital storefront, ensuring every page is clean, intuitive, and works perfectly on any device. As Project Manager, she made sure every technical detail was polished and that we hit our deadlines without losing the "human touch" that defines our brand.`,
    bridging:
      "Thanks to Ridhima, our musical instruments shop online is fully mobile-responsive and easy to navigate for beginners across India.",
    initials: "RS",
    color: "bg-sage/60 text-brown-dark",
  },
  {
    name: "Sanjana Chauhan",
    role: "DESIGN SPECIALIST",
    bio: "Sanjana's responsibility was to bring the instruments to life visually. She curated the high-quality photos and videos that capture the resonance and detail of our collection. By choosing the right colors and layouts, she's ensured that exploring our site feels just as exciting as walking into your favorite local music shop.",
    bridging:
      "Every image on our site includes descriptive alt text with keywords like 'best acoustic guitar for beginners under 15000' to help you discover the perfect instrument.",
    initials: "SC",
    color: "bg-amber-50 text-amber-800",
  },
];

function AboutPage() {
  return (
    <main data-ocid="about.page">
      {/* Hero */}
      <section className="bg-cream border-b border-brown-light py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brown-dark mb-3">
            About SoundSpace | Your Trusted Musical Instruments Shop in India
          </h1>
          <p className="font-body text-lg text-brown-medium tracking-widest uppercase">
            FIND YOUR SOUND
          </p>
        </motion.div>
      </section>

      {/* Mission paragraphs */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="bg-white rounded-xl border border-brown-light p-8 md:p-12 space-y-4">
          {/* Original paragraph 1 */}
          <p className="font-body text-muted-foreground leading-relaxed">
            At SoundSpace, we believe that every musician deserves an instrument
            that feels like an extension of themselves. Whether you are picking
            up your very first guitar or hunting for a professional-grade sitar,
            we are here to bridge the gap between &quot;just playing&quot; and
            truly finding your sound. Our mission is simple: to combine the
            timeless craft of instrument making with a modern, digital shopping
            experience that actually makes sense.
          </p>
          {/* Bridging sentence (new SEO) */}
          <p className="font-body text-amber-700 leading-relaxed italic text-sm">
            As a trusted musical instruments shop online in India, we help
            beginners discover the best beginner guitars in India, compare piano
            prices in India, and find the perfect instrument for their journey.
          </p>
          {/* Original paragraph 2 */}
          <p className="font-body text-muted-foreground leading-relaxed">
            This platform was built from the ground up by a team of enthusiasts
            who are just as passionate about gear as you are:
          </p>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="max-w-4xl mx-auto px-4 pb-14">
        <h2 className="font-serif text-2xl font-bold text-brown-dark mb-8">
          Meet the Team
        </h2>
        <div className="flex flex-col gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-xl border border-brown-light p-6"
              data-ocid={`about.item.${i + 1}`}
            >
              <div className="flex gap-4 items-start mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-ui font-bold text-sm shrink-0 ${member.color}`}
                >
                  {member.initials}
                </div>
                <div>
                  <p className="font-serif font-bold text-brown-dark text-lg">
                    {member.name}
                  </p>
                  <p className="text-xs text-amber-600 font-ui tracking-widest uppercase">
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
                {member.bio}
              </p>
              {/* Bridging sentence */}
              <p className="text-xs text-amber-700 font-body italic">
                {member.bridging}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission section */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="bg-white rounded-xl border border-brown-light p-8 md:p-12">
          <h2 className="font-serif text-2xl font-bold text-brown-dark mb-4">
            Our Mission: Helping Beginners Find Their Sound
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed">
            We believe every aspiring musician deserves expert guidance when
            choosing their first instrument. Too many beginners buy the wrong
            instrument, get frustrated, and quit. We&apos;re here to change that
            by providing honest reviews, detailed beginner guitar buying guides,
            and accurate piano prices in India. Whether you&apos;re searching
            for an acoustic guitar for beginners, comparing digital pianos, or
            looking for the best place to buy guitar online India, SoundSpace is
            your trusted companion on your musical journey.
          </p>
        </div>
      </section>

      {/* Why Trust SoundSpace */}
      <section className="bg-cream border-t border-brown-light py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-brown-dark mb-8">
            Why Trust SoundSpace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Music,
                text: "We're musicians ourselves — we've made the beginner mistakes so you don't have to",
              },
              {
                Icon: ThumbsUp,
                text: "Every recommendation is based on hands-on research and real user reviews",
              },
              {
                Icon: ShieldCheck,
                text: "No paid promotions influence our picks — our only goal is to help you find your sound",
              },
            ].map(({ Icon, text }) => (
              <div
                key={text.slice(0, 20)}
                className="bg-white rounded-xl p-6 border border-brown-light text-center"
              >
                <Icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ---- Contact Page ----
function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent! We'll get back to you soon.");
    }, 1000);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12" data-ocid="contact.page">
      <h1 className="font-serif text-4xl font-bold text-brown-dark mb-2">
        Contact SoundSpace
      </h1>
      <p className="font-body text-muted-foreground mb-10">
        Have a question? We&apos;d love to hear from you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-brown-light p-8 space-y-5"
          data-ocid="contact.dialog"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="font-ui text-sm font-semibold text-brown-dark"
            >
              Your Name
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Arjun Kumar"
              required
              className="border-brown-light font-ui"
              data-ocid="contact.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="font-ui text-sm font-semibold text-brown-dark"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="arjun@example.com"
              required
              className="border-brown-light font-ui"
              data-ocid="contact.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="subject"
              className="font-ui text-sm font-semibold text-brown-dark"
            >
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Guitar recommendation"
              required
              className="border-brown-light font-ui"
              data-ocid="contact.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="message"
              className="font-ui text-sm font-semibold text-brown-dark"
            >
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us how we can help you..."
              required
              rows={5}
              className="border-brown-light font-ui resize-none"
              data-ocid="contact.textarea"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-ui font-semibold"
            data-ocid="contact.submit_button"
          >
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
            <h3 className="font-serif text-lg font-bold text-brown-dark mb-4">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:hello@soundspace.com"
                className="flex items-center gap-3 text-sm font-ui text-brown-medium hover:text-brown-dark"
              >
                <Mail className="w-5 h-5 text-amber-500" />
                hello@soundspace.com
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <address className="not-italic text-sm font-ui text-brown-medium leading-relaxed">
                  Bennett University,
                  <br />
                  Greater Noida,
                  <br />
                  Uttar Pradesh - 201310
                </address>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-brown-light p-6">
            <h3 className="font-serif text-lg font-bold text-brown-dark mb-4">
              Follow Us
            </h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  Icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/",
                },
                {
                  Icon: Youtube,
                  label: "YouTube",
                  href: "https://www.youtube.com/",
                },
                {
                  Icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/",
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-ui text-brown-medium hover:text-brown-dark"
                >
                  <Icon className="w-5 h-5 text-amber-500" /> {label}
                </a>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-ui text-center">
            &copy; {new Date().getFullYear()} SoundSpace. All rights reserved.
            Built with ♥ for music lovers.
          </p>
        </aside>
      </div>
    </main>
  );
}

// ---- Router ----
const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayout />
        <CartSheet />
      </QueryClientProvider>
    </CartProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store",
  component: StorePage,
});
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  blogRoute,
  aboutRoute,
  contactRoute,
  instrumentDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
