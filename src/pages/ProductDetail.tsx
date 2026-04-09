import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ChevronRightIcon, Loader2, Send, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { useProducts } from "@/contexts/ProductsContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Product } from "@/data/products";

/* ─── Types ─── */
interface Review {
  id:            string;
  product_id:    string;
  user_id:       string;
  order_id:      string;
  rating:        number;
  title:         string | null;
  body:          string | null;
  reviewer_name: string | null;
  created_at:    string;
}

/* ─── Star display (static) ─── */
const StarRow = ({ rating, size = 13 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size}
        className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/25 fill-muted-foreground/10"} />
    ))}
  </div>
);

/* ─── Similar product card ─── */
const SimilarCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="block w-[150px] flex-shrink-0 sm:w-[165px]">
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.2 }} className="group">
      <div className="overflow-hidden rounded-2xl bg-muted/30 p-4">
        <img src={product.image} alt={product.name}
          className="mx-auto h-[110px] w-[110px] object-contain transition-transform duration-400 group-hover:scale-110" />
      </div>
      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-xs font-semibold text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {product.rating} <Star size={7} fill="currentColor" />
          </span>
          <span className="text-[10px] text-muted-foreground">({product.reviewsCount.toLocaleString()})</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-black text-foreground">₹{product.price.toLocaleString()}</span>
          <span className="text-[10px] font-medium text-green-600">{product.discount}% off</span>
        </div>
      </div>
    </motion.div>
  </Link>
);

/* ─── Main page ─── */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const shouldOpenReview = searchParams.get("review") === "1";

  const { getProductById, getProductsByCategory, loading } = useProducts();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { user, profile, isAuthenticated, orders } = useAuth();

  const product = getProductById(id || "");

  /* ─── Reviews state ─── */
  const [reviews,       setReviews]       = useState<Review[]>([]);
  const [loadingReviews,setLoadingReviews]= useState(false);
  const [reviewRating,  setReviewRating]  = useState(5);
  const [reviewTitle,   setReviewTitle]   = useState("");
  const [reviewBody,    setReviewBody]    = useState("");
  const [hoveredStar,   setHoveredStar]   = useState(0);
  const [submitting,    setSubmitting]    = useState(false);

  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const scrollRef        = useRef<HTMLDivElement>(null);

  /* Track recently viewed */
  useEffect(() => { if (product) addToRecentlyViewed(product); }, [product?.id]);

  /* Fetch reviews */
  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      setLoadingReviews(true);
      const { data } = await supabase
        .from("product_reviews").select("*")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });
      setReviews((data || []) as Review[]);
      setLoadingReviews(false);
    };
    fetchReviews();
  }, [product?.id]);

  /* Auto-scroll to reviews if ?review=1 */
  useEffect(() => {
    if (shouldOpenReview && !loadingReviews && reviewSectionRef.current) {
      setTimeout(() => reviewSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 600);
    }
  }, [shouldOpenReview, loadingReviews]);

  /* Computed values */
  const purchasedOrders = useMemo(() => {
    if (!isAuthenticated || !product) return [];
    return orders.filter(
      (o) => o.status === "delivered" &&
             o.items?.some((item) => item.product_id === product.id)
    );
  }, [orders, product?.id, isAuthenticated]);

  const hasPurchased   = purchasedOrders.length > 0;
  const purchasedOrderId = purchasedOrders[0]?.id;
  const alreadyReviewed  = reviews.some((r) => r.user_id === user?.id);
  const canReview        = isAuthenticated && hasPurchased && !alreadyReviewed;

  const localAvgRating = useMemo(() => {
    if (!reviews.length) return product?.rating ?? 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews, product?.rating]);

  const ratingDistribution = useMemo(() => {
    const d: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { d[r.rating] = (d[r.rating] || 0) + 1; });
    return d;
  }, [reviews]);

  /* Submit review */
  const submitReview = async () => {
    if (!user || !purchasedOrderId) return;
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_id:    product!.id,
      user_id:       user.id,
      order_id:      purchasedOrderId,
      rating:        reviewRating,
      title:         reviewTitle || null,
      body:          reviewBody  || null,
      reviewer_name: profile?.full_name || user.email?.split("@")[0] || "Anonymous",
    });
    if (error) {
      toast.error("Failed to submit review: " + error.message);
    } else {
      toast.success("Review submitted! Thank you.");
      setReviewTitle(""); setReviewBody(""); setReviewRating(5);
      const { data } = await supabase.from("product_reviews").select("*")
        .eq("product_id", product!.id).order("created_at", { ascending: false });
      setReviews((data || []) as Review[]);
    }
    setSubmitting(false);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  /* ─── Loading / not found ─── */
  if (loading && !product) return (
    <div className="page-root">
      <Header />
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading product…</p>
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="page-root">
      <Header />
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-6xl">📦</div>
        <h2 className="mt-4 text-lg font-bold text-foreground">Product not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">This product may have been removed or the link is incorrect.</p>
        <Link to="/" className="mt-5 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Back to Home</Link>
      </div>
      <Footer />
    </div>
  );

  const similarProducts = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 12);
  const totalReviews    = reviews.length || product.reviewsCount;

  return (
    <div className="page-root">
      <Header />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRightIcon size={11} />
          <Link to={`/products?category=${product.category}`} className="capitalize hover:text-foreground">{product.category.replace("-", " ")}</Link>
          <ChevronRightIcon size={11} />
          <Link to={`/products?category=${product.category}`} className="hover:text-foreground">{product.brand}</Link>
          <ChevronRightIcon size={11} />
          <span className="max-w-[180px] truncate text-foreground">{product.name}</span>
        </nav>

        {/* Product card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-card">
          <div className="flex flex-col gap-6 p-4 md:flex-row md:gap-8 md:p-6 lg:p-8">
            <div className="md:w-[42%] lg:w-[40%]"><ImageGallery images={product.images} productName={product.name} /></div>
            <div className="flex-1"><ProductInfo product={product} /></div>
          </div>
        </motion.div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="mt-4 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
              <h2 className="text-base font-bold text-foreground">Similar Products</h2>
              <Link to={`/products?category=${product.category}`} className="flex items-center gap-1 text-xs font-semibold text-primary">View all <ChevronRight size={13} /></Link>
            </div>
            <div className="relative px-5 py-5">
              <button onClick={() => scroll("left")} className="absolute -left-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md"><ChevronLeft size={16} /></button>
              <div ref={scrollRef} className="scrollbar-hide flex gap-4 overflow-x-auto pb-1 pl-2 pr-2">
                {similarProducts.map((p) => <SimilarCard key={p.id} product={p} />)}
              </div>
              <button onClick={() => scroll("right")} className="absolute -right-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md"><ChevronRight size={16} /></button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            RATINGS & REVIEWS SECTION
        ═══════════════════════════════════════════ */}
        <motion.div
          ref={reviewSectionRef}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mt-4 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-card"
        >
          <div className="border-b border-border/40 px-5 py-4">
            <h2 className="text-base font-bold text-foreground">Ratings &amp; Reviews</h2>
          </div>

          <div className="p-5">
            {/* Rating summary */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              {/* Average score */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 px-6 py-5 text-center sm:w-40">
                <p className="text-5xl font-black text-foreground leading-none">{localAvgRating.toFixed(1)}</p>
                <StarRow rating={localAvgRating} size={16} />
                <p className="mt-1.5 text-xs text-muted-foreground">{totalReviews.toLocaleString()} review{totalReviews !== 1 ? "s" : ""}</p>
              </div>

              {/* Distribution bars */}
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star] ?? 0;
                  const pct   = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-3 text-xs text-muted-foreground text-right">{star}</span>
                      <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.3 }}
                          className="h-full rounded-full bg-amber-400"
                        />
                      </div>
                      <span className="w-5 text-xs text-muted-foreground text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Write a Review form ── */}
            {canReview && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <h3 className="mb-1 text-sm font-bold text-foreground">Write a Review</h3>
                <p className="mb-4 text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" /> Verified Purchase — you bought this product
                </p>

                {/* Star selector */}
                <div className="mb-4">
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Your Rating *</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star}
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star size={28}
                          className={star <= (hoveredStar || reviewRating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30 fill-muted-foreground/10"} />
                      </button>
                    ))}
                    <span className="ml-2 self-center text-sm font-medium text-muted-foreground">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hoveredStar || reviewRating]}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Review Title (optional)</label>
                  <input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarise your experience…"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                {/* Body */}
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Review (optional)</label>
                  <textarea value={reviewBody} onChange={(e) => setReviewBody(e.target.value)}
                    rows={3} placeholder="What did you like or dislike? How is the quality?"
                    className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }} onClick={submitReview} disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60 transition-all"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {submitting ? "Submitting…" : "Submit Review"}
                </motion.button>
              </motion.div>
            )}

            {/* Not eligible — show reason */}
            {isAuthenticated && !hasPurchased && (
              <div className="mb-6 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                Only customers who have purchased and received this product can write a review.
              </div>
            )}
            {isAuthenticated && hasPurchased && alreadyReviewed && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 px-4 py-3 text-xs text-green-700 dark:text-green-400">
                <CheckCircle size={12} className="inline mr-1" /> You have already reviewed this product.
              </div>
            )}
            {!isAuthenticated && (
              <div className="mb-6 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                <Link to="/login" className="font-semibold text-primary">Login</Link> and purchase this product to write a review.
              </div>
            )}

            {/* ── Reviews list ── */}
            {loadingReviews ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-10 text-center">
                <Star size={40} strokeWidth={1} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border/50 pb-5 last:border-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <StarRow rating={review.rating} size={13} />
                          {review.title && <span className="text-sm font-semibold text-foreground">{review.title}</span>}
                        </div>
                        {review.body && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{review.body}</p>}
                      </div>
                      {review.user_id === user?.id && (
                        <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Your Review</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                        {(review.reviewer_name || "A")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{review.reviewer_name || "Anonymous"}</span>
                      <span>·</span>
                      <span>{new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-green-600 font-medium">
                        <CheckCircle size={10} /> Verified Purchase
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;