import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Account";

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex h-16 items-center gap-4">
          <button className="text-card-foreground md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Future</span>
              <span className="text-accent">Cart</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-[540px]">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-2xl border border-border bg-background pl-5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground active:scale-95 transition-transform">
                <Search size={16} />
              </button>
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-1">
            {/* Login / Profile */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-card-foreground active:bg-muted transition-colors"
              >
                <User size={18} />
                <span className="max-w-[80px] truncate">{isAuthenticated ? displayName : "Login"}</span>
                <ChevronDown size={14} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full w-52 rounded-2xl bg-card py-2 shadow-xl border border-border z-50"
                  >
                    {!isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-card-foreground">New customer?</span>
                            <Link to="/signup" onClick={() => setShowDropdown(false)} className="text-sm font-medium text-primary">Sign Up</Link>
                          </div>
                        </div>
                        <Link to="/login" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm text-card-foreground active:bg-muted mx-1 rounded-lg">Login</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/profile" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm text-card-foreground active:bg-muted mx-1 rounded-lg">My Profile</Link>
                        <Link to="/profile" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm text-card-foreground active:bg-muted mx-1 rounded-lg">My Orders</Link>
                        <Link to="/wishlist" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm text-card-foreground active:bg-muted mx-1 rounded-lg">Wishlist</Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary active:bg-muted mx-1 rounded-lg">
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}
                        <div className="mx-2 my-1 border-t border-border" />
                        <button onClick={async () => { await logout(); toast.success("Logged out!"); setShowDropdown(false); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive active:bg-muted mx-1 rounded-lg">
                          <LogOut size={14} /> Logout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Click-away overlay */}
              {showDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-card-foreground active:bg-muted transition-colors">
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">{wishlistCount}</span>
              )}
              <span className="hidden md:inline">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-card-foreground active:bg-muted transition-colors">
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute right-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{totalItems}</span>
              )}
              <span className="hidden md:inline">Cart</span>
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSearch} className="pb-2 md:hidden">
          <div className="relative">
            <input type="text" placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-2xl border border-border bg-background pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"><Search size={18} /></button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-card px-4 md:hidden"
          >
            <nav className="flex flex-col gap-2 py-3">
              <Link to="/" className="rounded-xl px-3 py-2.5 text-sm text-card-foreground active:bg-muted" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="rounded-xl px-3 py-2.5 text-sm text-card-foreground active:bg-muted" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                  {isAdmin && <Link to="/admin" className="rounded-xl px-3 py-2.5 text-sm text-primary active:bg-muted" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>}
                  <button onClick={async () => { await logout(); toast.success("Logged out!"); setMobileMenuOpen(false); }} className="rounded-xl px-3 py-2.5 text-left text-sm text-destructive active:bg-muted">Logout</button>
                </>
              ) : (
                <Link to="/login" className="rounded-xl px-3 py-2.5 text-sm text-card-foreground active:bg-muted" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
