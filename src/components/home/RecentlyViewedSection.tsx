import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";

const RecentlyViewedSection = () => {
  const { recentlyViewed } = useRecentlyViewed();
  if (recentlyViewed.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl mx-4 py-5 shadow-sm border border-border/30"
    >
      <div className="px-5">
        <h2 className="mb-3 text-lg font-bold text-card-foreground">Recently Viewed</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {recentlyViewed.slice(0, 12).map((product) => (
            <div key={product.id} className="min-w-[170px] max-w-[180px]">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default RecentlyViewedSection;
