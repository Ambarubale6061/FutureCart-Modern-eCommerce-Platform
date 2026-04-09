import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Heart, User, Menu, X,
  ChevronDown, LogOut, Shield, Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Header = () => {
  const [searchQuery,    setSearchQuery]    = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown,   setShowDropdown]   = useState(false);
  const navigate = useNavigate();
  const { totalItems }                       = useCart();
  const { totalItems: wishlistCount }        = useWishlist();
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const displayName =
    profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Account";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-border/50 bg-card/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex h-14 items-center gap-3 sm:h-16 sm:gap-4">

            {/* Mobile menu toggle */}
            <button
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 select-none">
              <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
                <span className="text-primary">Future</span>
                <span className="text-accent">Cart</span>
              </span>
            </Link>

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden flex-1 justify-center md:flex">
              <div className="relative w-full max-w-[520px]">
                <input
                  type="text"
                  placeholder="Search for products, brands and more…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background pl-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95">
                  <Search size={14} />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-0.5 sm:gap-1">

              {/* Account dropdown (desktop) */}
              <div className="relative hidden md:block">
                <button onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={14} />
                  </div>
                  <span className="max-w-[72px] truncate text-xs font-medium">
                    {isAuthenticated ? displayName : "Login"}
                  </span>
                  <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-52 overflow-hidden rounded-2xl border border-border bg-card py-1.5 shadow-card-lg"
                    >
                      {!isAuthenticated ? (
                        <>
                          <div className="border-b border-border px-4 py-3">
                            <p className="text-xs text-muted-foreground">New customer?</p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">Sign up free</span>
                              <Link to="/signup" onClick={() => setShowDropdown(false)}
                                className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                Sign Up
                              </Link>
                            </div>
                          </div>
                          <Link to="/login" onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted">
                            <User size={14} className="text-muted-foreground" /> Login
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="border-b border-border px-4 py-3">
                            <p className="text-xs text-muted-foreground">Signed in as</p>
                            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                              {profile?.full_name || user?.email}
                            </p>
                          </div>
                          {/* ← My Orders now goes to /orders */}
                          {[
                            { to: "/profile", icon: User,    label: "My Profile" },
                            { to: "/orders",  icon: Package, label: "My Orders"  },   // ← /orders
                            { to: "/wishlist",icon: Heart,   label: "Wishlist"   },
                          ].map(({ to, icon: Icon, label }) => (
                            <Link key={label} to={to} onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted">
                              <Icon size={14} className="text-muted-foreground" /> {label}
                            </Link>
                          ))}
                          {isAdmin && (
                            <Link to="/admin" onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary hover:bg-muted">
                              <Shield size={14} /> Admin Panel
                            </Link>
                          )}
                          <div className="mx-3 my-1 border-t border-border" />
                          <button onClick={() => { setShowDropdown(false); navigate("/logout"); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-muted">
                            <LogOut size={14} /> Logout
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {showDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted sm:w-auto sm:gap-1.5 sm:px-2.5">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute right-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white sm:right-1.5">
                    {wishlistCount}
                  </span>
                )}
                <span className="hidden text-xs font-medium sm:inline">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted sm:w-auto sm:gap-1.5 sm:px-2.5">
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute right-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white sm:right-1.5">
                    {totalItems}
                  </span>
                )}
                <span className="hidden text-xs font-medium sm:inline">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="pb-2.5 md:hidden">
            <div className="relative">
              <input
                type="text" placeholder="Search for products…"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-background pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden border-b border-border bg-card/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">Home</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">My Profile</Link>
                  {/* ← /orders */}
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">My Orders</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted">Admin Panel</Link>
                  )}
                  <button onClick={() => { setMobileMenuOpen(false); navigate("/logout"); }}
                    className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-muted">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;