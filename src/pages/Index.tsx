import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ExploreProducts from "@/components/home/ExploreProducts";
import ShopByCategories from "@/components/home/ShopByCategories";
import LastViewedSection from "@/components/home/LastViewedSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import DealSection from "@/components/home/DealSection";
import { useDbProducts, DbProduct } from "@/hooks/useDbProducts";
import { allProducts, Product } from "@/data/products";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const } }),
};

// Convert DB product to local Product shape for DealSection compatibility
const toProduct = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  originalPrice: p.original_price,
  discount: p.discount,
  rating: p.rating,
  reviewsCount: p.reviews_count,
  image: p.image,
  images: p.images,
  brand: p.brand,
  category: p.category,
  subcategory: p.subcategory,
  specs: p.specs || {},
  highlights: p.highlights || [],
  inStock: p.in_stock,
});

const Index = () => {
  const { products: dbProducts, loading } = useDbProducts();

  // Use DB products if available, otherwise fall back to static data
  const products: Product[] = dbProducts.length > 0
    ? dbProducts.map(toProduct)
    : allProducts;

  const deals = products.filter((p) => p.discount >= 30).slice(0, 20);
  const topOffers = products.filter((p) => p.rating >= 4).slice(0, 20);
  const trending = products.slice(0, 20);

  const dealSections = [
    { title: "⭐ Top Offers", products: topOffers, link: "/products?sort=rating" },
    { title: "🔥 Deals of the Day", products: deals, link: "/products?sort=discount" },
    { title: "🚀 Trending Now", products: trending, link: "/products" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />
      <main className="pb-8">
        <HeroSection />
        <ExploreProducts />
        <ShopByCategories />
        <LastViewedSection />
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {dealSections.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} custom={i} variants={fadeUp}>
                <DealSection title={s.title} products={s.products} viewAllLink={s.link} />
              </motion.div>
            ))}
          </div>
        )}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
