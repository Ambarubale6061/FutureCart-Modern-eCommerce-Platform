import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Heart, ShoppingCart, X, Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (productId: string) => {
    const product = items.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
      toast.success("Moved to cart!");
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-root">
        <Header />
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10"
          >
            <Heart size={40} className="text-destructive/40" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save your favourite items and shop them later.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-primary transition-all hover:bg-primary/90"
            >
              Discover Products <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-root">
      <Header />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6">
        {/* Heading */}
        <h1 className="mb-5 font-display text-xl font-bold text-foreground sm:text-2xl">
          My Wishlist
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          <AnimatePresence>
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="group relative"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-card transition-all hover:shadow-card-hover">
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-xl border border-border/60 bg-card/90 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all group-hover:opacity-100 hover:text-destructive"
                    aria-label="Remove from wishlist"
                  >
                    <X size={13} />
                  </button>

                  {/* Product image */}
                  <Link to={`/product/${product.id}`} className="block flex-1">
                    <div className="relative bg-muted/20 p-4">
                      {product.discount >= 30 && (
                        <span className="absolute left-2 top-2 rounded-lg bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-white">
                          -{product.discount}%
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="mx-auto h-[130px] w-[130px] object-contain transition-transform duration-400 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {product.brand}
                      </p>
                      <h3 className="mt-0.5 truncate text-xs font-bold text-foreground">
                        {product.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {product.rating} <Star size={7} fill="currentColor" />
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-foreground">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Move to cart */}
                  <div className="px-3 pb-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleMoveToCart(product.id)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/40 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      <ShoppingCart size={12} /> Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;