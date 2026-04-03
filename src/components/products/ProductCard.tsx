import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  if (compact) {
    return (
      <Link to={`/product/${product.id}`} className="block">
        <motion.div whileTap={{ scale: 0.97 }} className="rounded-2xl bg-card p-3 shadow-sm border border-border/30">
          <div className="relative mx-auto mb-2 h-[130px] w-[130px]">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
          </div>
          <h3 className="truncate text-xs font-medium text-card-foreground">{product.name}</h3>
          <div className="mt-1 flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-flipkart-green px-1.5 py-0.5 text-[10px] font-bold text-white">
              {product.rating} <Star size={8} fill="currentColor" />
            </span>
            <span className="text-[10px] text-muted-foreground">({product.reviewsCount.toLocaleString()})</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold text-card-foreground">₹{product.price.toLocaleString()}</span>
            <span className="text-[10px] text-flipkart-green font-medium">{product.discount}% off</span>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="block"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="flex flex-col rounded-2xl border border-border/30 bg-card p-4 md:flex-row md:gap-6 md:p-5 shadow-sm"
      >
        <div className="relative mx-auto h-[200px] w-[200px] flex-shrink-0 md:h-[180px] md:w-[180px]">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
          <button
            onClick={toggleWishlist}
            className="absolute right-1 top-1 rounded-xl bg-card p-1.5 shadow-sm border border-border/30 active:scale-90 transition-transform"
          >
            <Heart size={16} className={wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"} />
          </button>
          {product.discount >= 30 && (
            <span className="absolute left-1 top-1 rounded-lg bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
              -{product.discount}%
            </span>
          )}
        </div>
        <div className="mt-3 flex-1 md:mt-0">
          <h3 className="text-sm font-medium text-card-foreground md:text-base">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-flipkart-green px-1.5 py-0.5 text-xs font-bold text-white">
              {product.rating} <Star size={10} fill="currentColor" />
            </span>
            <span className="text-xs text-muted-foreground">({product.reviewsCount.toLocaleString()} reviews)</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-card-foreground">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
            <span className="text-sm font-medium text-flipkart-green">{product.discount}% off</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Free delivery</p>
          <ul className="mt-2 hidden space-y-1 md:block">
            {product.highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {h}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
