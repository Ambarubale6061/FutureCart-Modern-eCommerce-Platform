import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Truck, Search, ArrowLeft, Star, Clock,
  CheckCircle, XCircle, ShoppingBag, RefreshCw,
  ChevronDown, ChevronUp, MapPin, CreditCard,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Status config ─── */
const STATUS: Record<string, { label: string; textColor: string; bgColor: string; dot: string }> = {
  processing:      { label: "Processing",      textColor: "text-amber-700 dark:text-amber-400",  bgColor: "bg-amber-100 dark:bg-amber-900/30",  dot: "bg-amber-500"  },
  confirmed:       { label: "Confirmed",       textColor: "text-blue-700 dark:text-blue-400",    bgColor: "bg-blue-100 dark:bg-blue-900/30",    dot: "bg-blue-500"   },
  shipped:         { label: "Shipped",         textColor: "text-indigo-700 dark:text-indigo-400",bgColor: "bg-indigo-100 dark:bg-indigo-900/30",dot: "bg-indigo-500" },
  out_for_delivery:{ label: "Out for Delivery",textColor: "text-purple-700 dark:text-purple-400",bgColor: "bg-purple-100 dark:bg-purple-900/30",dot: "bg-purple-500" },
  delivered:       { label: "Delivered",       textColor: "text-green-700 dark:text-green-400",  bgColor: "bg-green-100 dark:bg-green-900/30",  dot: "bg-green-500"  },
  cancelled:       { label: "Cancelled",       textColor: "text-red-700 dark:text-red-400",      bgColor: "bg-red-100 dark:bg-red-900/30",      dot: "bg-red-500"    },
};

const ACTIVE_STATUSES = ["processing", "confirmed", "shipped", "out_for_delivery"];

const FILTER_TABS = [
  { id: "all",       label: "All Orders"  },
  { id: "active",    label: "Active"      },
  { id: "delivered", label: "Delivered"   },
  { id: "cancelled", label: "Cancelled"   },
];

/* ─── Order Card ─── */
const OrderCard = ({ order, navigate }: { order: Order; navigate: ReturnType<typeof useNavigate> }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg     = STATUS[order.status] || STATUS.processing;
  const address = order.address as any;
  const isActive    = ACTIVE_STATUSES.includes(order.status);
  const isDelivered = order.status === "delivered";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm"
    >
      {/* ── Card header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 bg-muted/20 px-4 py-3">
        <div>
          <p className="text-xs font-bold text-foreground">Order #{order.order_number}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${cfg.bgColor} ${cfg.textColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="text-sm font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</span>
        </div>
      </div>

      {/* ── Items ── */}
      <div className="divide-y divide-border/30">
        {(expanded ? order.items : order.items?.slice(0, 2))?.map((item, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            {/* Thumbnail */}
            {item.product_image ? (
              <img src={item.product_image} alt={item.product_name}
                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover bg-muted/30" />
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-muted/30">
                <Package size={20} className="text-muted-foreground/40" />
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="line-clamp-1 text-sm font-medium text-foreground">{item.product_name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm font-bold text-foreground">₹{Number(item.price).toLocaleString()}</p>
            </div>

            {/* Rate button for delivered orders */}
            {isDelivered && (
              <button
                onClick={() => navigate(`/product/${item.product_id}?review=1`)}
                className="flex-shrink-0 flex items-center gap-1 rounded-lg border border-amber-400/70 px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
              >
                <Star size={11} className="fill-amber-400 text-amber-400" /> Rate
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {(order.items?.length ?? 0) > 2 && (
        <button onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1 border-t border-border/30 py-2 text-xs text-primary font-medium hover:bg-muted/30 transition-colors">
          {expanded
            ? <><ChevronUp size={13} /> Show less</>
            : <><ChevronDown size={13} /> +{(order.items?.length ?? 0) - 2} more item{(order.items?.length ?? 0) - 2 !== 1 ? "s" : ""}</>}
        </button>
      )}

      {/* ── Footer ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 bg-muted/10 px-4 py-3">
        <div className="space-y-0.5 text-[11px] text-muted-foreground">
          {order.payment_method && (
            <p className="flex items-center gap-1">
              <CreditCard size={11} /> {order.payment_method}
            </p>
          )}
          {address?.city && (
            <p className="flex items-center gap-1">
              <MapPin size={11} /> {address.city}, {address.state}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {isActive && (
            <Link to={`/order-tracking/${order.order_number}`}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
              <Truck size={12} /> Track Order
            </Link>
          )}
          {isDelivered && (
            <Link to={`/order-tracking/${order.order_number}`}
              className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors">
              View Details
            </Link>
          )}
          {order.status === "cancelled" && (
            <span className="flex items-center gap-1 rounded-xl border border-red-200 dark:border-red-900 px-4 py-2 text-xs font-medium text-red-500">
              <XCircle size={12} /> Cancelled
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main page ─── */
const OrderHistory = () => {
  const { orders, isAuthenticated, loading, fetchOrders } = useAuth();
  const navigate      = useNavigate();
  const [filter,      setFilter]      = useState("all");
  const [query,       setQuery]       = useState("");
  const [refreshing,  setRefreshing]  = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading) navigate("/login");
  }, [isAuthenticated, loading, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast.success("Orders refreshed");
  };

  /* Counts for tab badges */
  const counts = useMemo(() => ({
    active:    orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }), [orders]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (filter === "active")    list = list.filter((o) => ACTIVE_STATUSES.includes(o.status));
    if (filter === "delivered") list = list.filter((o) => o.status === "delivered");
    if (filter === "cancelled") list = list.filter((o) => o.status === "cancelled");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.items?.some((item) => item.product_name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [orders, filter, query]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[920px] px-4 py-6">

          {/* ── Page header ── */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">My Orders</h1>
                <p className="text-xs text-muted-foreground">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                </p>
              </div>
            </div>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* ── Search ── */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text" placeholder="Search by order number or product name…"
              value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* ── Filter tabs ── */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map((tab) => {
              const count = tab.id === "all" ? orders.length : counts[tab.id as keyof typeof counts] ?? 0;
              return (
                <button key={tab.id} onClick={() => setFilter(tab.id)}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    filter === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}>
                  {tab.label}
                  <span className={`rounded-full px-1.5 py-px text-[10px] font-bold ${
                    filter === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Orders list ── */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <ShoppingBag size={64} strokeWidth={1} className="mb-4 text-muted-foreground/20" />
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {query ? "No orders match your search" : filter !== "all" ? `No ${filter} orders` : "No orders yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {query
                    ? "Try searching with a different keyword"
                    : filter !== "all"
                    ? "Orders with this status will appear here"
                    : "Start shopping and your orders will appear here"}
                </p>
                {!query && filter === "all" && (
                  <Link to="/" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                    Start Shopping
                  </Link>
                )}
                {(query || filter !== "all") && (
                  <button onClick={() => { setQuery(""); setFilter("all"); }}
                    className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Clear Filters
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-4">
                {filtered.map((order, i) => (
                  <motion.div key={order.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <OrderCard order={order} navigate={navigate} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Summary footer ── */}
          {filtered.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-between gap-3 rounded-2xl border border-border/40 bg-card px-5 py-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-500" />
                {counts.delivered} order{counts.delivered !== 1 ? "s" : ""} delivered
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-amber-500" />
                {counts.active} active order{counts.active !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                Total spent: ₹{orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_amount), 0).toLocaleString()}
              </span>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default OrderHistory;