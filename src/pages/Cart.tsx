import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartItemComponent from "@/components/cart/CartItem";
import PriceSummary from "@/components/cart/PriceSummary";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";

const Cart = () => {
  const { items, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page-root">
        <Header />
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-muted"
          >
            <ShoppingCart size={40} className="text-muted-foreground/50" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-primary transition-all hover:bg-primary/90"
            >
              <ShoppingBag size={16} /> Start Shopping
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-root">
        <Header />
        <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6">
          {/* Page heading */}
          <h1 className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">
            Shopping Cart
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          </h1>

          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Cart items */}
            <div className="flex-1">
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-card">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
                  <span className="text-sm font-semibold text-foreground">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs font-medium text-destructive hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Items */}
                <div className="divide-y divide-border/40">
                  {items.map((item) => (
                    <CartItemComponent key={item.product.id} item={item} />
                  ))}
                </div>

                {/* Checkout button */}
                <div className="border-t border-border/40 px-5 py-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error("Please login to place your order");
                        navigate("/login");
                        return;
                      }
                      navigate("/checkout");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-accent/90 hover:shadow-lg sm:w-auto sm:min-w-[220px] sm:ml-auto"
                  >
                    Place Order <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="w-full lg:w-[340px] lg:flex-shrink-0">
              <div className="sticky top-20">
                <PriceSummary />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Cart;