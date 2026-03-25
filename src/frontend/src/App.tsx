import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  blogPosts,
  categories,
  priceRanges,
  products,
  types,
} from "@/data/mockData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { Music, Search, ShoppingCart } from "lucide-react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Headphones,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  image: string;
  description: string;
  fullDescription: string;
  specs: Record<string, string>;
  inStock: boolean;
}

const CART_KEY = "soundspace_cart";

function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
    }
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, cartCount, addToCart, updateQuantity, removeItem, clearCart };
}

// ---- Product Card ----
function ProductCard({
  product,
  onAddToCart,
}: { product: Product; onAddToCart: (p: Product) => void }) {
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const goToProduct = () =>
    navigate({ to: "/product/$id", params: { id: String(product.id) } });

  return (
    <div className="bg-white rounded-lg border border-brown-light shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <button
        type="button"
        className="relative overflow-hidden cursor-pointer aspect-[4/3] w-full"
        onClick={goToProduct}
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </button>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs font-ui border-brown-light text-brown-medium"
          >
            {product.category}
          </Badge>
          <Badge className="text-xs font-ui bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
            AI
          </Badge>
          <Badge className="text-xs font-ui bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            Netaji
          </Badge>
          <Badge className="text-xs font-ui bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
            tagine
          </Badge>
        </div>
        <button
          type="button"
          className="font-serif text-base font-semibold text-brown-dark mb-1 cursor-pointer hover:text-brown-medium transition-colors leading-snug text-left"
          onClick={goToProduct}
        >
          {product.name}
        </button>
        <p className="text-xs text-muted-foreground mb-2 font-body line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="mt-auto">
          <p
            className="text-xs text-muted-foreground font-ui truncate mb-2"
            title={product.image}
          >
            <span className="font-semibold">URL:</span> {product.image}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-ui font-semibold text-brown-dark text-base">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="bg-brown-dark hover:bg-brown-medium text-white font-ui text-xs"
              data-ocid="product.add_to_cart.button"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Header ----
function Header({ cartCount }: { cartCount: number }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brown-light shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <Music className="w-6 h-6 text-brown-dark" />
          <span className="font-serif text-xl font-bold text-brown-dark">
            SoundSpace
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-ui">
          {[
            { to: "/", label: "Home" },
            { to: "/store", label: "Store" },
            { to: "/blog", label: "Blog" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              className="text-sm font-semibold transition-colors hover:text-brown-dark text-brown-medium"
              activeProps={{
                className:
                  "text-brown-dark border-b-2 border-brown-dark pb-0.5",
              }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link to="/cart" className="relative p-2" data-ocid="cart.link">
          <ShoppingCart className="w-6 h-6 text-brown-dark" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brown-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-ui font-semibold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

// ---- Footer ----
function Footer() {
  const year = new Date().getFullYear();
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
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Your Premier Music Instrument Shop.
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
                { to: "/about", label: "About" },
                { to: "/blog", label: "Blog" },
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
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-brown-dark transition-colors font-ui"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-muted-foreground hover:text-brown-dark transition-colors font-ui"
                >
                  My Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-ui font-semibold text-brown-dark mb-3 text-sm uppercase tracking-wide">
              Connect
            </h4>
            <p className="text-sm text-muted-foreground font-body">
              Follow us on social media for the latest updates.
            </p>
          </div>
        </div>
        <div className="border-t border-brown-light mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground font-ui">
            &copy; {year}. Built with ❤️ using{" "}
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

// ---- Root Layout ----
function RootLayout() {
  const { cartCount } = useRootContext();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header cartCount={cartCount} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

type RootContext = ReturnType<typeof useCart>;

function useRootContext(): RootContext {
  return rootRoute.useRouteContext() as RootContext;
}

// ---- Home Page ----
const categoryBoxes = [
  { id: "string", label: "String", emoji: "🎸" },
  { id: "keyboard", label: "Keyboard", emoji: "🎹" },
  { id: "percussion", label: "Percussion", emoji: "🥁" },
  { id: "wind", label: "Wind", emoji: "🎷" },
  { id: "recording", label: "Recording", emoji: "🎙️" },
];

const whyUs = [
  {
    icon: CheckCircle,
    title: "Quality Instruments",
    desc: "Every instrument in our collection is carefully curated and quality-tested.",
  },
  {
    icon: Headphones,
    title: "Expert Advice",
    desc: "Our team of experienced musicians is here to help you find the perfect instrument.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "We offer a hassle-free 30-day return policy so you can shop with complete confidence.",
  },
];

function HomePage() {
  const { addToCart } = useRootContext();
  const navigate = useNavigate();
  const featured = products.slice(0, 6);

  return (
    <main>
      <section className="bg-cream py-24 px-4 text-center border-b border-brown-light">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-serif text-7xl md:text-8xl font-bold text-brown-dark mb-4 leading-none">
            SoundSpace
          </h1>
          <p className="font-body text-xl text-brown-medium mb-2">
            Masterfully Crafted Instruments for Your Musical Journey
          </p>
          <p className="font-ui text-sm text-muted-foreground mb-8">
            Your Premier Music Instrument Shop - Best Beginner Guitars, Piano
            Prices in India & More
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="outline"
              className="border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white font-ui font-semibold tracking-wider px-8"
              onClick={() => navigate({ to: "/store" })}
              data-ocid="hero.explore.button"
            >
              EXPLORE COLLECTION
            </Button>
            <Button
              variant="outline"
              className="border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white font-ui font-semibold tracking-wider px-8"
              onClick={() => navigate({ to: "/about" })}
              data-ocid="hero.story.button"
            >
              OUR STORY
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-serif text-4xl font-bold text-brown-dark mb-8 text-center">
          Featured Instruments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <ProductCard
                product={product as unknown as Product}
                onAddToCart={addToCart}
              />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white font-ui font-semibold px-8"
            onClick={() => navigate({ to: "/store" })}
            data-ocid="featured.view_all.button"
          >
            View All Instruments
          </Button>
        </div>
      </section>

      <section className="bg-white border-y border-brown-light py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-brown-dark mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categoryBoxes.map((cat) => (
              <Link
                key={cat.id}
                to="/store"
                search={{ category: cat.id }}
                className="bg-cream rounded-lg p-6 text-center border border-brown-light hover:border-brown-medium hover:shadow-sm transition-all group"
                data-ocid={`category.${cat.id}.link`}
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-ui font-semibold text-brown-dark text-sm">
                  {cat.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-serif text-4xl font-bold text-brown-dark mb-8 text-center">
          Latest from the Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to="/blog/$id"
                params={{ id: String(post.id) }}
                className="block bg-white rounded-lg border border-brown-light overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs font-ui font-semibold text-brown-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-base font-semibold text-brown-dark mt-1 mb-2 leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white font-ui font-semibold px-8"
            onClick={() => navigate({ to: "/blog" })}
            data-ocid="blog.view_all.button"
          >
            View All Posts
          </Button>
        </div>
      </section>

      <section className="bg-sage/30 py-16 px-4 border-y border-brown-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-brown-dark mb-8 text-center">
            Why Choose SoundSpace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-lg p-6 border border-brown-light text-center"
              >
                <item.icon className="w-10 h-10 text-brown-dark mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-brown-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ---- Store Page ----
type StoreSearch = {
  category?: string;
  type?: string;
  price?: string;
  q?: string;
};

function StorePage() {
  const { addToCart } = useRootContext();
  const search = useSearch({ from: "/store" }) as StoreSearch;
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(search.q || "");

  const selectedCategory = search.category || "all";
  const selectedType = search.type || "all";
  const selectedPrice = search.price || "all";

  const updateSearch = (updates: Partial<StoreSearch>) => {
    navigate({ to: "/store", search: { ...search, ...updates } });
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(localSearch.toLowerCase());
    const matchCat =
      selectedCategory === "all" ||
      p.category.toLowerCase() === selectedCategory;
    const matchType =
      selectedType === "all" ||
      p.type.toLowerCase().replace(" ", "-") === selectedType;
    const priceRange = priceRanges.find((pr) => pr.id === selectedPrice);
    const matchPrice =
      !priceRange || (p.price >= priceRange.min && p.price <= priceRange.max);
    return matchSearch && matchCat && matchType && matchPrice;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-brown-dark mb-2">
        Our Store
      </h1>
      <p className="font-body text-muted-foreground mb-8">
        Discover our complete collection of musical instruments
      </p>
      <div
        className="bg-white rounded-lg border border-brown-light p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="store.filters.section"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search instruments..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 font-ui text-sm border-brown-light"
            data-ocid="store.search.input"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(v) => updateSearch({ category: v })}
        >
          <SelectTrigger
            className="font-ui text-sm border-brown-light"
            data-ocid="store.category.select"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id} className="font-ui text-sm">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedType}
          onValueChange={(v) => updateSearch({ type: v })}
        >
          <SelectTrigger
            className="font-ui text-sm border-brown-light"
            data-ocid="store.type.select"
          >
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t.id} value={t.id} className="font-ui text-sm">
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedPrice}
          onValueChange={(v) => updateSearch({ price: v })}
        >
          <SelectTrigger
            className="font-ui text-sm border-brown-light"
            data-ocid="store.price.select"
          >
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((pr) => (
              <SelectItem key={pr.id} value={pr.id} className="font-ui text-sm">
                {pr.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16" data-ocid="store.empty_state">
          <p className="font-body text-muted-foreground text-lg">
            No instruments found matching your filters.
          </p>
        </div>
      ) : (
        <>
          <p className="font-ui text-sm text-muted-foreground mb-4">
            {filtered.length} instrument{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product as unknown as Product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

// ---- Product Detail Page ----
function ProductDetailPage() {
  const { addToCart } = useRootContext();
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id)) as
    | Product
    | undefined;

  if (!product) {
    return (
      <main
        className="max-w-6xl mx-auto px-4 py-16 text-center"
        data-ocid="product.error_state"
      >
        <p className="font-body text-muted-foreground">Product not found.</p>
        <Button className="mt-4" onClick={() => navigate({ to: "/store" })}>
          Back to Store
        </Button>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/store" })}
        className="mb-6 text-brown-medium hover:text-brown-dark font-ui"
        data-ocid="product.back.button"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg border border-brown-light object-cover aspect-[4/3]"
          />
          <p className="text-xs text-muted-foreground font-ui mt-2 break-all">
            <span className="font-semibold">Image URL:</span> {product.image}
          </p>
        </div>
        <div>
          <Badge
            variant="outline"
            className="mb-2 font-ui border-brown-light text-brown-medium"
          >
            {product.category}
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-brown-dark mb-3">
            {product.name}
          </h1>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge className="text-xs font-ui bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
              AI
            </Badge>
            <Badge className="text-xs font-ui bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
              Netaji
            </Badge>
            <Badge className="text-xs font-ui bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
              tagine
            </Badge>
          </div>
          <p className="font-serif text-3xl font-bold text-brown-dark mb-4">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
            {product.description}
          </p>
          <p className="font-body text-sm text-foreground mb-6 leading-relaxed">
            {product.fullDescription}
          </p>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-brown-dark hover:bg-brown-medium text-white font-ui font-semibold w-full mb-4"
            data-ocid="product.add_to_cart.button"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          {product.specs && (
            <div className="border border-brown-light rounded-lg overflow-hidden">
              <div className="bg-cream px-4 py-2 border-b border-brown-light">
                <h3 className="font-ui font-semibold text-brown-dark text-sm">
                  Specifications
                </h3>
              </div>
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <tr
                      key={key}
                      className={i % 2 === 0 ? "bg-white" : "bg-cream"}
                    >
                      <td className="px-4 py-2 text-xs font-ui font-semibold text-brown-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </td>
                      <td className="px-4 py-2 text-xs font-body text-foreground">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ---- About Page ----
const values = [
  {
    title: "Quality",
    desc: "We partner only with trusted brands known for exceptional craftsmanship and durability.",
  },
  {
    title: "Expertise",
    desc: "Our team of passionate musicians brings decades of combined experience.",
  },
  {
    title: "Community",
    desc: "We're more than a store — we're a hub for the musical community.",
  },
];

const team = [
  {
    name: "Vedant Garg",
    role: "Founder & CEO",
    bio: "Guitarist and entrepreneur with 15 years in the music industry.",
  },
  {
    name: "Priya Nair",
    role: "Head of Procurement",
    bio: "Expert in sourcing world-class instruments from top manufacturers.",
  },
  {
    name: "Arjun Mehta",
    role: "Music Educator",
    bio: "Classically trained pianist and dedicated music education advocate.",
  },
  {
    name: "Ridhima Sharma",
    role: "Customer Experience Lead",
    bio: "Passionate violinist committed to helping every musician succeed.",
  },
];

function AboutPage() {
  return (
    <main>
      <section className="bg-sage/40 py-20 px-4 text-center border-b border-brown-light">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-5xl font-bold text-brown-dark mb-4">
            About SoundSpace
          </h1>
          <p className="font-body text-lg text-brown-medium max-w-2xl mx-auto">
            We are a passionate team of musicians dedicated to bringing the best
            instruments to players across India.
          </p>
        </motion.div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg border border-brown-light p-8 md:p-12">
          <h2 className="font-serif text-3xl font-bold text-brown-dark mb-4">
            Our Mission
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            At SoundSpace, our mission is simple: to make quality musical
            instruments accessible to every aspiring musician in India. We
            believe that the right instrument has the power to transform a
            beginner into a lifelong musician.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            Founded in 2020, we have grown from a small online store to one of
            India's most trusted musical instrument retailers. We carefully
            curate our selection, working directly with top manufacturers to
            bring you authentic, quality-assured instruments at competitive
            prices.
          </p>
        </div>
      </section>
      <section className="bg-cream py-16 px-4 border-y border-brown-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-brown-dark mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 border border-brown-light"
              >
                <h3 className="font-serif text-xl font-bold text-brown-dark mb-2">
                  {v.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl font-bold text-brown-dark mb-8 text-center">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-lg border border-brown-light p-6 text-center"
            >
              <div className="w-16 h-16 bg-sage rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-brown-dark">
                  {member.name[0]}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-brown-dark">
                {member.name}
              </h3>
              <p className="font-ui text-xs text-brown-medium mb-2">
                {member.role}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ---- Blog Page ----
function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-brown-dark mb-2">
        The SoundSpace Blog
      </h1>
      <p className="font-body text-muted-foreground mb-10">
        Insights, guides, and stories for music lovers
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Link
              to="/blog/$id"
              params={{ id: String(post.id) }}
              className="block bg-white rounded-lg border border-brown-light overflow-hidden hover:shadow-md transition-shadow"
              data-ocid={`blog.item.${i + 1}`}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <span className="text-xs font-ui font-semibold text-brown-medium uppercase tracking-wide">
                  {post.category}
                </span>
                <h2 className="font-serif text-lg font-bold text-brown-dark mt-1 mb-2 leading-snug line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm font-body text-muted-foreground line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs font-ui text-muted-foreground">
                  <span>{post.author}</span>
                  <span>
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

// ---- Blog Post Page ----
function BlogPostPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <main
        className="max-w-3xl mx-auto px-4 py-16 text-center"
        data-ocid="blogpost.error_state"
      >
        <p className="font-body text-muted-foreground">Post not found.</p>
        <Button className="mt-4" onClick={() => navigate({ to: "/blog" })}>
          Back to Blog
        </Button>
      </main>
    );
  }

  const paragraphs = post.content.split("\n\n");

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/blog" })}
        className="mb-6 text-brown-medium hover:text-brown-dark font-ui"
        data-ocid="blogpost.back.button"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
      </Button>
      <div className="mb-4">
        <span className="text-xs font-ui font-semibold text-brown-medium uppercase tracking-wide">
          {post.category}
        </span>
      </div>
      <h1 className="font-serif text-4xl font-bold text-brown-dark mb-4 leading-tight">
        {post.title}
      </h1>
      <div className="flex items-center gap-4 text-sm font-ui text-muted-foreground mb-8">
        <span>{post.author}</span>
        <span>·</span>
        <span>
          {new Date(post.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <img
        src={post.image}
        alt={post.title}
        className="w-full rounded-lg border border-brown-light mb-8 object-cover max-h-80"
      />
      <div className="prose-sm max-w-none">
        {paragraphs.map((para) => (
          <p
            key={para.slice(0, 40)}
            className="font-body text-foreground leading-relaxed mb-4"
          >
            {para}
          </p>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-brown-light">
        <Link
          to="/blog"
          className="font-ui text-sm text-brown-medium hover:text-brown-dark underline"
        >
          ← Back to all posts
        </Link>
      </div>
    </main>
  );
}

// ---- Contact Page ----
function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-brown-dark mb-2">
        Contact Us
      </h1>
      <p className="font-body text-muted-foreground mb-10">
        We'd love to hear from you. Send us a message and we'll respond as soon
        as possible.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          className="bg-white rounded-lg border border-brown-light p-8"
          data-ocid="contact.form.panel"
        >
          <h2 className="font-serif text-2xl font-bold text-brown-dark mb-6">
            Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="font-ui text-sm font-semibold text-brown-dark"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your name"
                  required
                  className="mt-1 border-brown-light"
                  data-ocid="contact.name.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="font-ui text-sm font-semibold text-brown-dark"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  required
                  className="mt-1 border-brown-light"
                  data-ocid="contact.email.input"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="phone"
                className="font-ui text-sm font-semibold text-brown-dark"
              >
                Phone
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+91 XXXXX XXXXX"
                className="mt-1 border-brown-light"
                data-ocid="contact.phone.input"
              />
            </div>
            <div>
              <Label
                htmlFor="subject"
                className="font-ui text-sm font-semibold text-brown-dark"
              >
                Subject
              </Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="How can we help?"
                required
                className="mt-1 border-brown-light"
                data-ocid="contact.subject.input"
              />
            </div>
            <div>
              <Label
                htmlFor="message"
                className="font-ui text-sm font-semibold text-brown-dark"
              >
                Message
              </Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Write your message here..."
                rows={5}
                required
                className="mt-1 border-brown-light resize-none"
                data-ocid="contact.message.textarea"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-brown-dark hover:bg-brown-medium text-white font-ui font-semibold"
              data-ocid="contact.submit.button"
            >
              Send Message
            </Button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-brown-light p-6">
            <h2 className="font-serif text-xl font-bold text-brown-dark mb-4">
              Get in Touch
            </h2>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "hello@soundspace.in" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "123 Music Street, Bandra West, Mumbai - 400050",
                },
                { icon: Clock, label: "Hours", value: "Mon-Sat: 10AM - 8PM" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <item.icon className="w-5 h-5 text-brown-medium mt-0.5 shrink-0" />
                  <div>
                    <p className="font-ui font-semibold text-xs text-brown-medium uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="font-body text-sm text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---- Cart Page ----
function CartPage() {
  const {
    items: cartItemsState,
    updateQuantity,
    removeItem,
    clearCart,
  } = useRootContext();
  const navigate = useNavigate();

  const subtotal = cartItemsState.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 50000 ? 0 : 499;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    toast.success("Order placed successfully! Thank you for your purchase.");
    clearCart();
  };

  if (cartItemsState.length === 0) {
    return (
      <main
        className="max-w-6xl mx-auto px-4 py-16 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold text-brown-dark mb-2">
          Your Cart is Empty
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          Discover amazing instruments in our store.
        </p>
        <Button
          className="bg-brown-dark hover:bg-brown-medium text-white font-ui font-semibold"
          onClick={() => navigate({ to: "/store" })}
        >
          Browse Store
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-brown-dark mb-8">
        Your Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4" data-ocid="cart.list">
          {cartItemsState.map((item, i) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-brown-light p-4 flex gap-4"
              data-ocid={`cart.item.${i + 1}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md border border-brown-light shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base font-semibold text-brown-dark leading-snug mb-1">
                  {item.name}
                </h3>
                <p className="font-ui text-xs text-brown-medium mb-3">
                  {item.category}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-brown-light rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      data-ocid={`cart.quantity_decrease.button.${i + 1}`}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-3 text-sm font-ui font-semibold text-brown-dark">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      data-ocid={`cart.quantity_increase.button.${i + 1}`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="font-ui font-semibold text-brown-dark">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive shrink-0 self-start"
                onClick={() => removeItem(item.id)}
                data-ocid={`cart.delete_button.${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div
          className="bg-white rounded-lg border border-brown-light p-6 h-fit"
          data-ocid="cart.summary.panel"
        >
          <h2 className="font-serif text-xl font-bold text-brown-dark mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm font-ui">
            <div className="flex justify-between text-muted-foreground">
              <span>
                Subtotal ({cartItemsState.reduce((s, i) => s + i.quantity, 0)}{" "}
                items)
              </span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? "Free"
                  : `₹${shipping.toLocaleString("en-IN")}`}
              </span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-green-600">
                Free shipping on orders above ₹50,000!
              </p>
            )}
          </div>
          <Separator className="my-4 bg-brown-light" />
          <div className="flex justify-between font-ui font-bold text-brown-dark text-base mb-6">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <Button
            className="w-full bg-brown-dark hover:bg-brown-medium text-white font-ui font-semibold"
            onClick={handleCheckout}
            data-ocid="cart.checkout.button"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </main>
  );
}

// ---- Router Setup ----
const rootRoute = createRootRoute({
  component: RootLayout,
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
  validateSearch: (s: Record<string, unknown>): StoreSearch => ({
    category: s.category as string | undefined,
    type: s.type as string | undefined,
    price: s.price as string | undefined,
    q: s.q as string | undefined,
  }),
});
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});
const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogPostPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  productRoute,
  aboutRoute,
  blogRoute,
  blogPostRoute,
  contactRoute,
  cartRoute,
]);

// ---- App ----
export default function App() {
  const cart = useCart();

  const router = createRouter({
    routeTree,
    context: cart,
    defaultPreload: "intent",
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={cart} />
    </QueryClientProvider>
  );
}
