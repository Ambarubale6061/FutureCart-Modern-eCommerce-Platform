import { Link } from "react-router-dom";
import { Heart, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps { product: Product; compact?: boolean; }

const RatingBadge = ({ rating, reviewsCount, small }: { rating: number; reviewsCount: number; small?: boolean }) => (
  <div className="flex items-center gap-1.5">
    <span className={`inline-flex items-center gap-0.5 rounded-md bg-green-600 font-bold text-white ${small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"}`}>
      {rating}<Star size={small ? 8 : 10} fill="currentColor" />
    </span>
    <span className={`text-muted-foreground ${small ? "text-[10px]" : "text-xs"}`}>({reviewsCount.toLocaleString()})</span>
  </div>
);

const CompactCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="block h-full">
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="group flex h-full flex-col rounded-2xl border border-border/40 bg-card p-3.5 shadow-sm hover:shadow-md">
      <div className="relative mx-auto mb-3 h-[130px] w-[130px] flex-shrink-0">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform group-hover:scale-105" loading="lazy" />
        {product.discount >= 30 && <span className="absolute left-0 top-0 rounded-lg bg-destructive px-1.5 py-0.5 text-[9px] font-bold">-{product.discount}%</span>}
      </div>
      <div className="flex flex-1 flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <h3 className="mt-0.5 truncate text-xs font-bold text-card-foreground">{product.name}</h3>
        <div className="mt-1.5"><RatingBadge rating={product.rating} reviewsCount={product.reviewsCount} small /></div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-sm font-black text-card-foreground">₹{product.price.toLocaleString()}</span>
          <span className="text-[10px] font-medium text-green-600">{product.discount}% off</span>
        </div>
      </div>
    </motion.div>
  </Link>
);

const FullCard = ({ product, wishlisted, onToggleWishlist }: { product: Product; wishlisted: boolean; onToggleWishlist: (e: React.MouseEvent) => void }) => (
  <Link to={`/product/${product.id}`} className="block">
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} className="group flex flex-col rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md md:flex-row md:gap-6 md:p-5">
      <div className="relative flex-shrink-0 bg-muted/20 md:rounded-xl">
        {product.discount >= 30 && <span className="absolute left-3 top-3 z-10 flex items-center gap-0.5 rounded-lg bg-destructive px-2 py-0.5 text-[10px] font-bold"><Zap size={8} fill="currentColor" />-{product.discount}%</span>}
        <button onClick={onToggleWishlist} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-border/40 bg-card shadow-sm hover:border-border">
          <Heart size={15} className={wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-destructive"} />
        </button>
        <div className="mx-auto h-[200px] w-[200px] p-5 md:h-[180px] md:w-[180px] md:p-0">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform group-hover:scale-105" loading="lazy" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{product.brand}</p>
        <h3 className="mt-1 text-sm font-bold leading-snug text-card-foreground md:text-base">{product.name}</h3>
        <div className="mt-2"><RatingBadge rating={product.rating} reviewsCount={product.reviewsCount} /></div>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-xl font-black text-card-foreground">₹{product.price.toLocaleString()}</span>
          <span className="mb-0.5 text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
          <span className="mb-0.5 text-sm font-semibold text-green-600">{product.discount}% off</span>
        </div>
        <p className="mt-1 text-xs font-medium text-green-600">✓ Free delivery</p>
        {product.highlights.length > 0 && (
          <ul className="mt-3 hidden space-y-1 md:block">
            {product.highlights.slice(0, 3).map((h, i) => <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground"><span className="mt-0.5 h-1 w-1 rounded-full bg-muted-foreground/50" />{h}</li>)}
          </ul>
        )}
      </div>
    </motion.div>
  </Link>
);

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const toggleWishlist = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); wishlisted ? removeFromWishlist(product.id) : addToWishlist(product); };
  if (compact) return <CompactCard product={product} />;
  return <FullCard product={product} wishlisted={wishlisted} onToggleWishlist={toggleWishlist} />;
};

export default ProductCard;