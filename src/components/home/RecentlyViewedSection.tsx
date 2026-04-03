import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const RecentlyViewedSection = () => {
  const { recentlyViewed } = useRecentlyViewed();
  
  if (recentlyViewed.length === 0) return null;

  // Limiting to 5 items
  const displayedProducts = recentlyViewed.slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-white">
      {/* Header with Navigation */}
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tighter text-black md:text-4xl">
            LAST <br />
            VIEWED
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-all hover:border-black hover:text-black">
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 text-gray-900 transition-all hover:border-black hover:text-black">
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Grid - Cards chi size vadhvanyasathi layout adjust kela aahe */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {displayedProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
            className="group"
          >
            <Link to={`/product/${product.id}`} className="block">
              {/* Product Image Box - Size Vadhvli aahe */}
              <div className="relative mb-6 flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-[#F9F9F9] p-6 transition-all duration-700 ease-in-out group-hover:shadow-xl group-hover:shadow-gray-200/50">
                
                {/* New Arrival Badge */}
                {i === 2 && (
                  <span className="absolute left-6 top-6 rounded-full bg-orange-500 px-4 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
                    New
                  </span>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  // Image proper full size basnyasathi object-contain mix-blend
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-2 px-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    {product.category || "Collection"}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-bold text-gray-900">4.8</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 transition-colors duration-500 group-hover:text-orange-600">
                  {product.name}
                </h3>
                
                <p className="text-xl font-black text-black">
                  ${product.price}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;