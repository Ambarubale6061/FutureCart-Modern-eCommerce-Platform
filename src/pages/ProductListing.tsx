import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";
import { allProducts } from "@/data/products";
import { categories, getBrands } from "@/data/categories";
import { SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 24;

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

  const category = categories.find((c) => c.id === categoryId);
  const brands = categoryId ? getBrands(categoryId) : [...new Set(allProducts.slice(0, 200).map((p) => p.brand))];

  const filtered = useMemo(() => {
    let result = categoryId ? allProducts.filter((p) => p.category === categoryId) : [...allProducts];
    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (priceRange[1] !== Infinity) result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedRating > 0) result = result.filter((p) => p.rating >= selectedRating);
    if (selectedDiscount > 0) result = result.filter((p) => p.discount >= selectedDiscount);

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "discount": result.sort((a, b) => b.discount - a.discount); break;
      case "newest": result.sort((a, b) => parseInt(b.id.split("-")[1]) - parseInt(a.id.split("-")[1])); break;
    }
    return result;
  }, [categoryId, selectedBrands, priceRange, selectedRating, selectedDiscount, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const setSort = (s: string) => { searchParams.set("sort", s); searchParams.set("page", "1"); setSearchParams(searchParams); };
  const setPage = (p: number) => { searchParams.set("page", String(p)); setSearchParams(searchParams); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          Home &gt; {category ? category.name : "All Products"}
        </div>

        <div className="flex gap-4">
          <div className="hidden w-[250px] flex-shrink-0 md:block">
            <div className="sticky top-20">
              <FilterSidebar brands={brands} selectedBrands={selectedBrands} onBrandsChange={setSelectedBrands}
                priceRange={priceRange} onPriceRangeChange={setPriceRange} selectedRating={selectedRating}
                onRatingChange={setSelectedRating} selectedDiscount={selectedDiscount} onDiscountChange={setSelectedDiscount} />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-card p-3 shadow-sm border border-border/30">
              <div className="flex items-center gap-1 text-sm font-bold text-card-foreground">
                {category?.name || "All Products"}
                <span className="ml-1 text-xs font-normal text-muted-foreground">({filtered.length} products)</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-xs text-primary md:hidden" onClick={() => setShowMobileFilters(true)}>
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <span className="hidden text-xs text-muted-foreground md:inline">Sort By</span>
                {["relevance", "price-low", "price-high", "rating", "discount", "newest"].map((s) => (
                  <button key={s} onClick={() => setSort(s)}
                    className={`hidden text-xs font-medium capitalize md:inline rounded-lg px-2 py-1 transition-colors ${sortBy === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-card-foreground"}`}>
                    {s === "price-low" ? "Price ↑" : s === "price-high" ? "Price ↓" : s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {paginatedProducts.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="rounded-xl border px-4 py-2 text-xs font-medium text-primary disabled:opacity-50 hover:bg-muted transition-colors">Previous</button>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  const p = page <= 5 ? i + 1 : page + i - 4;
                  if (p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border text-card-foreground hover:bg-muted"}`}>{p}</button>
                  );
                })}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="rounded-xl border px-4 py-2 text-xs font-medium text-primary disabled:opacity-50 hover:bg-muted transition-colors">Next</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto h-full w-[300px] overflow-y-auto bg-card">
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="text-sm font-bold text-card-foreground">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}><X size={20} /></button>
            </div>
            <div className="p-3">
              <FilterSidebar brands={brands} selectedBrands={selectedBrands} onBrandsChange={setSelectedBrands}
                priceRange={priceRange} onPriceRangeChange={setPriceRange} selectedRating={selectedRating}
                onRatingChange={setSelectedRating} selectedDiscount={selectedDiscount} onDiscountChange={setSelectedDiscount} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductListing;
