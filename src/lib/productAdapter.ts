import { DbProduct } from "@/hooks/useDbProducts";
import { Product } from "@/data/products";

export const dbProductToProduct = (db: DbProduct): Product => ({
  id: db.id,
  name: db.name,
  description: db.description,
  price: db.price,
  originalPrice: db.original_price,
  discount: db.discount,
  rating: db.rating,
  reviewsCount: db.reviews_count,
  image: db.image,
  images: db.images,
  brand: db.brand,
  category: db.category,
  subcategory: db.subcategory,
  specs: db.specs || {},
  highlights: db.highlights || [],
  inStock: db.in_stock,
});