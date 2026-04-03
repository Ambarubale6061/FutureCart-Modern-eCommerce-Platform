import { Star, ShoppingCart, Zap, Heart, ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const toggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };

  const featureIcons = [
    { icon: ShieldCheck, label: "2 Year Warranty" },
    { icon: CreditCard, label: "No-cost EMI" },
    { icon: Truck, label: "Free delivery" },
    { icon: RotateCcw, label: "Easy returns" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-card-foreground md:text-2xl">{product.name}</h1>

      <div className="mt-2 flex items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded bg-flipkart-green px-2.5 py-1 text-xs font-bold text-white">
          {product.rating} <Star size={11} fill="currentColor" />
        </span>
        <span className="text-sm text-muted-foreground">
          {product.reviewsCount.toLocaleString()} Ratings & Reviews
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-card-foreground">₹{product.price.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">
          MRP: <span className="line-through">₹{product.originalPrice.toLocaleString()}</span>
        </span>
        <span className="text-sm font-semibold text-flipkart-green">({product.discount}% off)</span>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">inclusive of all taxes</p>

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-8">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-card-foreground">Highlights</h3>
          <ul className="mt-2 space-y-1.5">
            {product.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3">
            {featureIcons.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <f.icon size={18} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-card-foreground">Specifications</h3>
        <table className="mt-2 w-full">
          <tbody>
            {Object.entries(product.specs).map(([key, value]) => (
              <tr key={key} className="border-b border-border last:border-0">
                <td className="py-2.5 pr-4 text-xs text-muted-foreground w-[40%]">{key}</td>
                <td className="py-2.5 text-xs font-medium text-card-foreground">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="flex items-center gap-2 rounded-md bg-flipkart-yellow px-8 py-3 text-sm font-bold text-card-foreground shadow-sm active:opacity-90 transition-opacity"
        >
          <ShoppingCart size={18} /> ADD TO CART
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBuyNow}
          className="flex items-center gap-2 rounded-md bg-flipkart-orange px-8 py-3 text-sm font-bold text-white shadow-sm active:opacity-90 transition-opacity"
        >
          <Zap size={18} /> BUY NOW
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleWishlist}
          className="flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-card-foreground active:bg-muted transition-colors"
        >
          <Heart size={18} className={wishlisted ? "fill-destructive text-destructive" : ""} />
          {wishlisted ? "WISHLISTED" : "WISHLIST"}
        </motion.button>
      </div>

      <div className="mt-5 rounded-md border border-border p-3">
        <p className="text-xs text-muted-foreground">
          {product.inStock ? (
            <span className="font-medium text-flipkart-green">In-Stock ~ Usually delivered in 2-5 days</span>
          ) : (
            <span className="font-medium text-destructive">Currently out of stock</span>
          )}
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{product.description}</p>
    </div>
  );
};

export default ProductInfo;
