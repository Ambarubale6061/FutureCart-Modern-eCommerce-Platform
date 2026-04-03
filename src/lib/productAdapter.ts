import type { Product } from "@/data/products";

/**
 * Maps a raw Supabase products row to the canonical Product shape
 * used throughout the storefront.
 *
 * Handles both the typed DbProduct interface (from useDbProducts)
 * and raw Record<string, unknown> objects coming from Realtime events.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dbProductToProduct = (db: Record<string, any>): Product => ({
  id: String(db.id ?? ""),
  name: String(db.name ?? ""),
  description: String(db.description ?? ""),
  price: Number(db.price ?? 0),
  originalPrice: Number(db.original_price ?? db.originalPrice ?? 0),
  discount: Number(db.discount ?? 0),
  rating: Number(db.rating ?? 0),
  reviewsCount: Number(db.reviews_count ?? db.reviewsCount ?? 0),
  image: String(db.image ?? ""),
  images: Array.isArray(db.images) ? (db.images as string[]) : db.image ? [String(db.image)] : [],
  brand: String(db.brand ?? ""),
  category: String(db.category ?? ""),
  subcategory: String(db.subcategory ?? ""),
  specs: (db.specs && typeof db.specs === "object" && !Array.isArray(db.specs))
    ? (db.specs as Record<string, string>)
    : {},
  highlights: Array.isArray(db.highlights) ? (db.highlights as string[]) : [],
  inStock: Boolean(db.in_stock ?? db.inStock ?? true),
});