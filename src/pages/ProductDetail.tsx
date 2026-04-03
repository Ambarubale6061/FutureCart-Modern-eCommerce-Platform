import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { getProductById, getProductsByCategory, Product } from "@/data/products";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";

const SimilarProductCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="block min-w-[160px] max-w-[170px] flex-shrink-0">
    <motion.div whileTap={{ scale: 0.96 }}>
      <div className="mx-auto h-[130px] w-[130px] overflow-hidden rounded-md bg-secondary/30 p-2">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
      </div>
      <h3 className="mt-2 truncate text-xs font-medium text-card-foreground">{product.name}</h3>
      <div className="mt-1 flex items-center gap-1">
        <span className="inline-flex items-center gap-0.5 rounded bg-flipkart-green px-1.5 py-0.5 text-[10px] font-bold text-white">
          {product.rating} <Star size={8} fill="currentColor" />
        </span>
        <span className="text-[10px] text-muted-foreground">({product.reviewsCount.toLocaleString()})</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-bold text-card-foreground">₹{product.price.toLocaleString()}</span>
        <span className="text-[10px] font-medium text-flipkart-green">{product.discount}% off</span>
      </div>
    </motion.div>
  </Link>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToRecentlyViewed } = useRecentlyViewed();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product?.id]);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-bold text-card-foreground">Product not found</h2>
          <Link to="/" className="mt-4 text-sm text-primary">Go back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const similarProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="mb-3 text-xs text-muted-foreground">
          Home &gt; {product.category} &gt; {product.subcategory} &gt; {product.brand}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="md:w-[40%]">
              <ImageGallery images={product.images} productName={product.name} />
            </div>
            <div className="md:w-[60%]">
              <ProductInfo product={product} />
            </div>
          </div>
        </motion.div>

        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="mt-4 rounded-lg bg-card p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-bold text-card-foreground">Similar Products</h2>
            <div className="relative">
              <button
                onClick={() => scroll("left")}
                className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-card p-1.5 shadow-md active:bg-muted active:scale-95 transition-all"
              >
                <ChevronLeft size={20} className="text-card-foreground" />
              </button>
              <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
                {similarProducts.map((p) => (
                  <SimilarProductCard key={p.id} product={p} />
                ))}
              </div>
              <button
                onClick={() => scroll("right")}
                className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-card p-1.5 shadow-md active:bg-muted active:scale-95 transition-all"
              >
                <ChevronRight size={20} className="text-card-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
