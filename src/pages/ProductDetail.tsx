import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ChevronRightIcon, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { useProducts } from "@/contexts/ProductsContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import type { Product } from "@/data/products";

const SimilarCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="block w-[150px] flex-shrink-0 sm:w-[165px]">
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.2 }} className="group">
      <div className="overflow-hidden rounded-2xl bg-muted/30 p-4">
        <img src={product.image} alt={product.name} className="mx-auto h-[110px] w-[110px] object-contain transition-transform duration-400 group-hover:scale-110" />
      </div>
      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-xs font-semibold text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {product.rating} <Star size={7} fill="currentColor" />
          </span>
          <span className="text-[10px] text-muted-foreground">({product.reviewsCount.toLocaleString()})</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-black text-foreground">₹{product.price.toLocaleString()}</span>
          <span className="text-[10px] font-medium text-green-600">{product.discount}% off</span>
        </div>
      </div>
    </motion.div>
  </Link>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, getProductsByCategory, loading } = useProducts();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const product = getProductById(id || "");

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product?.id]);

  const scrollRef = { current: null as HTMLDivElement | null };
  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  // Show a neutral loading screen while the catalogue is being fetched.
  // This prevents a false "Product not found" flash for DB products
  // whose IDs appear in the URL before the context has loaded.
  if (loading && !product) {
    return (
      <div className="page-root">
        <Header />
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading product…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-root">
        <Header />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-6xl">📦</div>
          <h2 className="mt-4 text-lg font-bold text-foreground">Product not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">This product may have been removed or the link is incorrect.</p>
          <Link to="/" className="mt-5 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const similarProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 12);

  return (
    <div className="page-root">
      <Header />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRightIcon size={11} />
          <Link to={`/products?category=${product.category}`} className="capitalize hover:text-foreground">{product.category.replace("-", " ")}</Link>
          <ChevronRightIcon size={11} />
          <Link to={`/products?category=${product.category}`} className="hover:text-foreground">{product.brand}</Link>
          <ChevronRightIcon size={11} />
          <span className="max-w-[180px] truncate text-foreground">{product.name}</span>
        </nav>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-card">
          <div className="flex flex-col gap-6 p-4 md:flex-row md:gap-8 md:p-6 lg:p-8">
            <div className="md:w-[42%] lg:w-[40%]"><ImageGallery images={product.images} productName={product.name} /></div>
            <div className="flex-1"><ProductInfo product={product} /></div>
          </div>
        </motion.div>
        {similarProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-4 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
              <h2 className="text-base font-bold text-foreground">Similar Products</h2>
              <Link to={`/products?category=${product.category}`} className="flex items-center gap-1 text-xs font-semibold text-primary">View all <ChevronRight size={13} /></Link>
            </div>
            <div className="relative px-5 py-5">
              <button onClick={() => scroll("left")} className="absolute -left-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md"><ChevronLeft size={16} /></button>
              <div ref={(el) => (scrollRef.current = el)} className="scrollbar-hide flex gap-4 overflow-x-auto pb-1 pl-2 pr-2">
                {similarProducts.map((p) => <SimilarCard key={p.id} product={p} />)}
              </div>
              <button onClick={() => scroll("right")} className="absolute -right-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md"><ChevronRight size={16} /></button>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;