import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";
import { useProducts } from "@/contexts/ProductsContext";
import { categories, getBrands } from "@/data/categories";
import { SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 24;
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Best Discount" },
  { value: "newest", label: "Newest" },
];

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ─── Pull merged products from context ─────────────────────────────────────
  const { allProducts } = useProducts();

  const category = categories.find((c) => c.id === categoryId);

  // Build the brand list: category-specific brands + any extra brands from DB products
  const brands = useMemo(() => {
    if (categoryId) {
      const catalogueBrands = getBrands(categoryId);
      const dbBrands = [
        ...new Set(
          allProducts
            .filter((p) => p.category === categoryId && !catalogueBrands.includes(p.brand))
            .map((p) => p.brand)
        ),
      ];
      return [...catalogueBrands, ...dbBrands];
    }
    return [...new Set(allProducts.map((p) => p.brand))];
  }, [categoryId, allProducts]);

  const clearAll = () => {
    setSelectedBrands([]);
    setPriceRange([0, Infinity]);
    setSelectedRating(0);
    setSelectedDiscount(0);
  };

  const filtered = useMemo(() => {
    let result = categoryId
      ? allProducts.filter((p) => p.category === categoryId)
      : [...allProducts];
    if (selectedBrands.length) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (priceRange[1] !== Infinity)
      result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedRating > 0) result = result.filter((p) => p.rating >= selectedRating);
    if (selectedDiscount > 0) result = result.filter((p) => p.discount >= selectedDiscount);
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "discount": result.sort((a, b) => b.discount - a.discount); break;
      // "newest": DB products come first naturally (they're appended after JSON)
      case "newest":
        result.sort((a, b) => {
          // UUID-based IDs (DB products) sort before "prod-N" IDs (JSON products)
          const aIsDb = !a.id.startsWith("prod-");
          const bIsDb = !b.id.startsWith("prod-");
          if (aIsDb && !bIsDb) return -1;
          if (!aIsDb && bIsDb) return 1;
          // Within JSON products, sort by numeric suffix descending
          if (!aIsDb && !bIsDb) {
            return parseInt(b.id.split("-")[1]) - parseInt(a.id.split("-")[1]);
          }
          return 0;
        });
        break;
    }
    return result;
  }, [categoryId, allProducts, selectedBrands, priceRange, selectedRating, selectedDiscount, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const setSort = (s: string) => {
    searchParams.set("sort", s);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };
  const setPage = (p: number) => {
    searchParams.set("page", String(p));
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const range: number[] = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  }, [page, totalPages]);

  return (
    <div className="page-root">
      <Header /><CategoryNav />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6">
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link><ChevronRight size={12} />
          <span className="font-medium text-foreground">{category?.name || "All Products"}</span>
        </nav>
        <div className="flex gap-5">
          <aside className="hidden w-[240px] flex-shrink-0 md:block">
            <div className="sticky top-20">
              <FilterSidebar
                brands={brands}
                selectedBrands={selectedBrands}
                onBrandsChange={setSelectedBrands}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                selectedDiscount={selectedDiscount}
                onDiscountChange={setSelectedDiscount}
                onClearAll={clearAll}
              />
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border/40 bg-card px-4 py-3 shadow-card">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-foreground">{category?.name || "All Products"}</h1>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {filtered.length.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="ml-auto flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground md:hidden"
              >
                <SlidersHorizontal size={13} /> Filters
              </button>
              <div className="hidden items-center gap-1 md:flex md:ml-auto">
                <span className="mr-1 text-[11px] text-muted-foreground">Sort:</span>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      sortBy === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3 md:hidden">
              <select
                value={sortBy}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-card px-3 text-xs text-foreground"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {paginatedProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.3), duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            {paginatedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
                <div className="text-4xl">🔍</div>
                <p className="mt-3 text-base font-semibold text-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
                <button
                  onClick={clearAll}
                  className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                >
                  Clear Filters
                </button>
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-sm text-foreground disabled:opacity-40"
                >‹</button>
                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium ${
                      p === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >{p}</button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-sm text-foreground disabled:opacity-40"
                >›</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 z-50 flex h-full w-[300px] flex-col bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <h3 className="text-sm font-bold text-foreground">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar
                  brands={brands}
                  selectedBrands={selectedBrands}
                  onBrandsChange={setSelectedBrands}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedRating={selectedRating}
                  onRatingChange={setSelectedRating}
                  selectedDiscount={selectedDiscount}
                  onDiscountChange={setSelectedDiscount}
                  onClearAll={clearAll}
                />
              </div>
              <div className="border-t border-border p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
                >
                  Show {filtered.length.toLocaleString()} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default ProductListing;