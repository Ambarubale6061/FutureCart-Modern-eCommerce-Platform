import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Zap } from "lucide-react";
import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface DealSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  accent?: "default" | "flash";
}

/* ─── Individual deal card ───────────────────────────────── */
const DealCard = ({ product }: { product: Product }) => (
  <Link
    to={`/product/${product.id}`}
    className="block w-[160px] flex-shrink-0 sm:w-[175px]"
  >
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      {/* Image box */}
      <div className="relative overflow-hidden rounded-2xl bg-muted/30 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="mx-auto h-[120px] w-[120px] object-contain transition-transform duration-400 group-hover:scale-110"
          loading="lazy"
        />
        {product.discount >= 30 && (
          <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-lg bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground">
            <Zap size={7} fill="currentColor" />
            {product.discount}% off
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-xs font-semibold text-card-foreground">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {product.rating} <Star size={7} fill="currentColor" />
          </span>
          <span className="text-[10px] text-muted-foreground">
            ({product.reviewsCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-black text-card-foreground">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
);

/* ─── Scroll arrow button ────────────────────────────────── */
const ScrollButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
    className="absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-all hover:shadow-lg active:scale-95"
    style={{ [direction === "left" ? "left" : "right"]: "-16px" }}
  >
    {direction === "left" ? (
      <ChevronLeft size={17} className="text-card-foreground" />
    ) : (
      <ChevronRight size={17} className="text-card-foreground" />
    )}
  </button>
);

/* ─── Main component ─────────────────────────────────────── */
const DealSection = ({
  title,
  products,
  viewAllLink,
  accent = "default",
}: DealSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
  }, [products]);

  const scroll = (direction: number) => {
    scrollRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-4 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm sm:mx-6"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          {accent === "flash" && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
              <Zap size={14} className="text-destructive" fill="currentColor" />
            </span>
          )}
          <h2 className="text-base font-black tracking-tight text-card-foreground sm:text-lg">
            {title}
          </h2>
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            View All <ChevronRight size={13} />
          </Link>
        )}
      </div>

      {/* Scrollable row */}
      <div className="relative px-5 py-5">
        {canScrollLeft && (
          <ScrollButton direction="left" onClick={() => scroll(-1)} />
        )}

        {/* Fade edges */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-5 top-0 z-10 h-full w-10 bg-gradient-to-r from-card to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-5 top-0 z-10 h-full w-10 bg-gradient-to-l from-card to-transparent" />
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.slice(0, 15).map((product) => (
            <DealCard key={product.id} product={product} />
          ))}
        </div>

        {canScrollRight && (
          <ScrollButton direction="right" onClick={() => scroll(1)} />
        )}
      </div>
    </motion.section>
  );
};

export default DealSection;