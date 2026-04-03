// -----------------------------------------------------------------
// products.ts — TYPE DEFINITIONS ONLY
//
// All mock product data lives in: public/data/products.json
// All runtime data (JSON + DB) is managed by: ProductsContext
//
// Import data via the hook:
//   import { useProducts } from "@/contexts/ProductsContext";
// -----------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  brand: string;
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  highlights: string[];
  inStock: boolean;
}