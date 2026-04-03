import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Heart, ShoppingCart, X, Star } from "lucide-react";
import { toast } from "sonner";

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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <Heart size={80} className="text-muted-foreground/30" />
          <h2 className="mt-4 text-lg font-medium text-card-foreground">Your wishlist is empty!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Save items that you like in your wishlist.</p>
          <Link to="/" className="mt-4 rounded bg-primary px-8 py-2 text-sm font-medium text-primary-foreground">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-4">
        <h2 className="mb-4 text-lg font-bold text-card-foreground">My Wishlist ({items.length})</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((product) => (
            <div key={product.id} className="relative rounded border bg-card p-3 shadow-sm">
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute right-2 top-2 rounded-full bg-muted p-1 text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="mx-auto h-[140px] w-[140px] object-contain" />
                <h3 className="mt-2 truncate text-xs font-medium text-card-foreground">{product.name}</h3>
                <div className="mt-1 flex items-center gap-1">
                  <span className="inline-flex items-center gap-0.5 rounded-sm bg-flipkart-green px-1 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {product.rating} <Star size={8} fill="currentColor" />
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-card-foreground">₹{product.price.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                </div>
              </Link>
              <button
                onClick={() => handleMoveToCart(product.id)}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded border py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ShoppingCart size={12} /> Move to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
