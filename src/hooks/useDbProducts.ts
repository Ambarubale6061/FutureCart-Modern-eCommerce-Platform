/**
 * useDbProducts.ts
 *
 * The useDbProducts *hook* has been removed — ProductsContext now owns all
 * merged product state and Realtime subscriptions.
 *
 * The standalone async fetchers below are still used by AdminDashboard
 * for paginated / filtered server-side queries that are too large to pull
 * through the context (e.g. ALL products including pending ones).
 */

import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  reviews_count: number;
  image: string;
  images: string[];
  brand: string;
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  highlights: string[];
  in_stock: boolean;
  approval_status?: string;
  seller_name?: string | null;
  seller_email?: string | null;
}

// ─── Standalone fetchers (used by AdminDashboard and similar) ─────────────────

export const fetchProductById = async (id: string): Promise<DbProduct | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();
  if (error || !data) return null;
  return data as DbProduct;
};

export const fetchFilteredProducts = async (filters: {
  category?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}) => {
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("approval_status", "approved");

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.brands?.length) query = query.in("brand", filters.brands);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.minRating) query = query.gte("rating", filters.minRating);
  if (filters.minDiscount) query = query.gte("discount", filters.minDiscount);

  switch (filters.sortBy) {
    case "price-low": query = query.order("price", { ascending: true }); break;
    case "price-high": query = query.order("price", { ascending: false }); break;
    case "rating": query = query.order("rating", { ascending: false }); break;
    case "discount": query = query.order("discount", { ascending: false }); break;
    default: query = query.order("created_at", { ascending: false });
  }

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 24;
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;
  if (error || !data) return { products: [], total: 0 };
  return { products: data as DbProduct[], total: count || 0 };
};

export const searchProductsDb = async (
  queryText: string,
  sortBy?: string,
  page = 1,
  pageSize = 24
) => {
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("approval_status", "approved")
    .textSearch("name", queryText, { config: "english" });

  switch (sortBy) {
    case "price-low": query = query.order("price", { ascending: true }); break;
    case "price-high": query = query.order("price", { ascending: false }); break;
    case "rating": query = query.order("rating", { ascending: false }); break;
    case "discount": query = query.order("discount", { ascending: false }); break;
    default: query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;
  if (error || !data) return { products: [], total: 0 };
  return { products: data as DbProduct[], total: count || 0 };
};