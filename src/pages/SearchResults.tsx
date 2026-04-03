import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/contexts/ProductsContext";

const ITEMS_PER_PAGE = 24;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sortBy = searchParams.get("sort") || "relevance";

  // ─── Pull from context — includes both JSON mock + DB products ───────────────
  const { searchProducts } = useProducts();

  const results = useMemo(() => {
    const r = searchProducts(query);
    switch (sortBy) {
      case "price-low": r.sort((a, b) => a.price - b.price); break;
      case "price-high": r.sort((a, b) => b.price - a.price); break;
      case "rating": r.sort((a, b) => b.rating - a.rating); break;
      case "discount": r.sort((a, b) => b.discount - a.discount); break;
    }
    return r;
  }, [query, sortBy, searchProducts]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginated = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const setPage = (p: number) => {
    searchParams.set("page", String(p));
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };
  const setSort = (s: string) => {
    searchParams.set("sort", s);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="mb-3 rounded bg-card p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-card-foreground">
              <span className="font-bold">{results.length}</span> results for "
              <span className="font-medium">{query}</span>"
            </p>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground md:inline">Sort By</span>
              {["relevance", "price-low", "price-high", "rating", "discount"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`hidden text-xs font-medium capitalize md:inline ${
                    sortBy === s ? "text-primary underline" : "text-muted-foreground"
                  }`}
                >
                  {s === "price-low" ? "Price ↑" : s === "price-high" ? "Price ↓" : s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {paginated.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No products found for "{query}"</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded border px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const p = page <= 5 ? i + 1 : page + i - 4;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded px-3 py-1.5 text-xs font-medium ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "border text-card-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded border px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;