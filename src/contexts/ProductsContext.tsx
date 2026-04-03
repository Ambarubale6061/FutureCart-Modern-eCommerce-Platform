/**
 * ProductsContext
 *
 * Single source of truth for all products in the app.
 * Merges two sources:
 *   1. public/data/products.json  — pre-generated mock catalogue (static, fast)
 *   2. Supabase `products` table  — seller-uploaded, admin-approved products
 *
 * Also subscribes to Supabase Realtime so that the moment an admin
 * approves a seller product the storefront updates without a refresh.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { dbProductToProduct } from "@/lib/productAdapter";
import type { Product } from "@/data/products";

// ─── Context shape ────────────────────────────────────────────────────────────

interface ProductsContextValue {
  /** Merged array: JSON mock products + approved DB products */
  allProducts: Product[];
  /** True while the initial JSON fetch OR first DB fetch is in-flight */
  loading: boolean;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  searchProducts: (query: string) => Product[];
  getDealsOfTheDay: () => Product[];
  getTopOffers: () => Product[];
  getTrendingProducts: () => Product[];
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [jsonProducts, setJsonProducts] = useState<Product[]>([]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [jsonLoaded, setJsonLoaded] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);
  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── 1. Fetch static JSON catalogue ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch("/data/products.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch products.json: ${res.status}`);
        return res.json() as Promise<Product[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setJsonProducts(data);
          setJsonLoaded(true);
        }
      })
      .catch((err) => {
        console.error("[ProductsContext] JSON fetch error:", err);
        if (!cancelled) setJsonLoaded(true); // still unblock the app
      });
    return () => { cancelled = true; };
  }, []);

  // ── 2. Fetch approved DB products ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchDb = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("approval_status", "approved")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!cancelled && data) {
          setDbProducts(data.map(dbProductToProduct));
        }
      } catch (err) {
        console.error("[ProductsContext] DB fetch error:", err);
      } finally {
        if (!cancelled) setDbLoaded(true);
      }
    };

    fetchDb();
    return () => { cancelled = true; };
  }, []);

  // ── 3. Supabase Realtime — live approval sync ────────────────────────────────
  useEffect(() => {
    // Clean up any previous subscription
    if (realtimeRef.current) {
      supabase.removeChannel(realtimeRef.current);
    }

    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          const record = payload.new as Record<string, unknown> | undefined;
          const oldRecord = payload.old as Record<string, unknown> | undefined;

          if (payload.eventType === "INSERT") {
            // Only surface newly-approved inserts (edge case: admin bypasses pending)
            if (record && record["approval_status"] === "approved") {
              const product = dbProductToProduct(record as Parameters<typeof dbProductToProduct>[0]);
              setDbProducts((prev) => {
                if (prev.some((p) => p.id === product.id)) return prev;
                return [product, ...prev];
              });
            }
          } else if (payload.eventType === "UPDATE") {
            if (record && record["approval_status"] === "approved") {
              // Product was just approved — add to store if not already present
              const product = dbProductToProduct(record as Parameters<typeof dbProductToProduct>[0]);
              setDbProducts((prev) => {
                const exists = prev.find((p) => p.id === product.id);
                if (exists) {
                  // Update in place (e.g. admin edited after approval)
                  return prev.map((p) => (p.id === product.id ? product : p));
                }
                return [product, ...prev];
              });
            } else if (record && record["approval_status"] !== "approved") {
              // Product was un-approved or deleted — remove from store
              const id = (record["id"] ?? oldRecord?.["id"]) as string | undefined;
              if (id) setDbProducts((prev) => prev.filter((p) => p.id !== id));
            }
          } else if (payload.eventType === "DELETE") {
            const id = oldRecord?.["id"] as string | undefined;
            if (id) setDbProducts((prev) => prev.filter((p) => p.id !== id));
          }
        }
      )
      .subscribe();

    realtimeRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── 4. Merge: JSON first (stable order), then DB products ────────────────────
  const allProducts = useMemo<Product[]>(() => {
    const jsonIds = new Set(jsonProducts.map((p) => p.id));
    // DB products whose IDs don't collide with JSON (they're UUIDs vs "prod-N")
    const uniqueDbProducts = dbProducts.filter((p) => !jsonIds.has(p.id));
    return [...jsonProducts, ...uniqueDbProducts];
  }, [jsonProducts, dbProducts]);

  const loading = !jsonLoaded || !dbLoaded;

  // ── 5. Helper functions (memoised, operate on merged array) ──────────────────

  const getProductById = useCallback(
    (id: string) => allProducts.find((p) => p.id === id),
    [allProducts]
  );

  const getProductsByCategory = useCallback(
    (categoryId: string) => allProducts.filter((p) => p.category === categoryId),
    [allProducts]
  );

  const searchProducts = useCallback(
    (query: string) => {
      const q = query.toLowerCase().trim();
      if (!q) return allProducts;
      return allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    },
    [allProducts]
  );

  const getDealsOfTheDay = useCallback(
    () => allProducts.filter((p) => p.discount >= 50).slice(0, 20),
    [allProducts]
  );

  const getTopOffers = useCallback(
    () => allProducts.filter((p) => p.rating >= 4.5).slice(0, 20),
    [allProducts]
  );

  const getTrendingProducts = useCallback(
    () => allProducts.filter((p) => p.reviewsCount > 10000).slice(0, 20),
    [allProducts]
  );

// ONLY CHANGE PART — bottom value object

const value: ProductsContextValue & { products: Product[] } = {
  allProducts,
  products: allProducts, // 🔥 ADD THIS LINE
  loading,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getDealsOfTheDay,
  getTopOffers,
  getTrendingProducts,
};

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProducts = (): ProductsContextValue => {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside <ProductsProvider>");
  }
  return ctx;
};