import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { allProducts, Product } from "@/data/products";
import { useRef } from "react";

const ViewedCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="block min-w-[160px] max-w-[180px] flex-shrink-0">
    <motion.div whileTap={{ scale: 0.96 }} className="overflow-hidden rounded-2xl bg-card p-3 border border-border/30 shadow-sm">
      <div className="relative mx-auto h-[120px] w-[120px]">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
        {product.discount >= 40 && (
          <span className="absolute left-0 top-0 rounded-md bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">
            -{product.discount}%
          </span>
        )}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">{product.brand}</p>
      <h4 className="truncate text-xs font-semibold text-foreground">{product.name.slice(0, 22)}</h4>
      <div className="mt-1 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={9} className={i < Math.round(product.rating) ? "fill-accent text-accent" : "text-border"} />
        ))}
        <span className="ml-1 text-[9px] text-muted-foreground">{product.reviewsCount.toLocaleString()}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-foreground">₹{product.price.toLocaleString()}</p>
    </motion.div>
  </Link>
);

const LastViewedSection = () => {
  const { recentlyViewed } = useRecentlyViewed();
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = recentlyViewed.length > 0
    ? recentlyViewed.slice(0, 10)
    : allProducts.filter((p) => p.rating >= 4.5).slice(0, 10);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          {recentlyViewed.length > 0 ? "LAST\nVIEWED" : "TOP\nPICKS"}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card active:bg-muted active:scale-95 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card active:bg-muted active:scale-95 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
        {items.map((product) => (
          <ViewedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default LastViewedSection;
