import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartItemComponent from "@/components/cart/CartItem";
import PriceSummary from "@/components/cart/PriceSummary";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";

const Cart = () => {
  const { items, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <ShoppingCart size={80} className="text-muted-foreground/30" />
          </motion.div>
          <h2 className="mt-4 text-lg font-medium text-card-foreground">Your cart is empty!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add items to it now.</p>
          <Link to="/" className="mt-4 rounded-xl bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow-lg hover:shadow-xl transition-all">
            Shop Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1400px] px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 rounded-2xl bg-card p-5 shadow-sm border border-border/50">
              <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-lg font-bold text-card-foreground">My Cart ({items.length})</h2>
                <button onClick={clearCart} className="text-xs text-destructive hover:underline">Clear Cart</button>
              </div>
              {items.map((item) => (
                <CartItemComponent key={item.product.id} item={item} />
              ))}
              <div className="mt-4 flex justify-end">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (!isAuthenticated) { toast.error("Please login to place order"); navigate("/login"); return; }
                    navigate("/checkout");
                  }}
                  className="rounded-xl bg-gradient-to-r from-accent to-accent/80 px-12 py-3 text-sm font-bold text-accent-foreground shadow-lg hover:shadow-xl transition-all">
                  PLACE ORDER
                </motion.button>
              </div>
            </div>
            <div className="w-full md:w-[350px]">
              <PriceSummary />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Cart;
