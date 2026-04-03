import { Link } from "react-router-dom";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const LastViewedSection = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-black md:text-3xl">
        RECENTLY VIEWED
      </h2>
      
      {/* Horizontal Scroll Wrapper */}
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
        {recentlyViewed.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="w-[200px] flex-shrink-0 md:w-[240px]" // Card size ithe vadhvli aahe
          >
            <Link to={`/product/${product.id}`} className="group block">
              
              {/* Product Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[#F9F9F9] p-6 transition-all duration-1000 ease-in-out group-hover:shadow-xl group-hover:shadow-gray-200/50">
                <img
                  src={product.image}
                  alt={product.name}
                  // Slow & Smooth Zoom Effect
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Product Details */}
              <div className="mt-5 space-y-1 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {product.category || "Premium"}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-gray-900">
                    {product.rating || "4.5"} <Star size={10} fill="#facc15" className="text-yellow-400" />
                  </span>
                </div>

                <h3 className="truncate text-base font-semibold text-gray-800 transition-colors duration-500 group-hover:text-black">
                  {product.name}
                </h3>

                <p className="text-lg font-black text-black">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LastViewedSection;