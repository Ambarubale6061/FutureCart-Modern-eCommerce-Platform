import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface DealSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const DealCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="block min-w-[160px] max-w-[170px] flex-shrink-0">
    <motion.div whileTap={{ scale: 0.96 }}>
      <div className="relative mx-auto h-[130px] w-[130px] overflow-hidden rounded-2xl bg-muted/30 p-3">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
        {product.discount >= 30 && (
          <span className="absolute top-1 left-1 rounded-lg bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
            -{product.discount}%
          </span>
        )}
      </div>
      <h3 className="mt-2 truncate text-xs font-medium text-card-foreground">{product.name}</h3>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5 rounded-md bg-flipkart-green px-1.5 py-0.5 text-[10px] font-bold text-white">
          {product.rating} <Star size={8} fill="currentColor" />
        </span>
        <span className="text-[10px] text-muted-foreground">({product.reviewsCount.toLocaleString()})</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-sm font-bold text-card-foreground">₹{product.price.toLocaleString()}</span>
        <span className="text-[10px] text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
      </div>
    </motion.div>
  </Link>
);

const DealSection = ({ title, products, viewAllLink }: DealSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-2xl mx-4 py-5 shadow-sm border border-border/30"
    >
      <div className="px-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
          {viewAllLink && (
            <Link to={viewAllLink}
              className="flex items-center gap-1 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground active:bg-primary/90 transition-colors">
              View All <ChevronRight size={14} />
            </Link>
          )}
        </div>
        <div className="relative">
          {canScrollLeft && (
            <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg border border-border active:scale-95 transition-transform">
              <ChevronRight size={18} className="rotate-180 text-card-foreground" />
            </button>
          )}
          <div ref={scrollRef} onScroll={updateScroll} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide">
            {products.slice(0, 12).map((product) => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
          {canScrollRight && (
            <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg border border-border active:scale-95 transition-transform">
              <ChevronRight size={18} className="text-card-foreground" />
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default DealSection;
