import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

const ShopByCategories = () => {
  const topCats = categories.slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-black md:text-3xl">
            SHOP <br />
            BY CATEGORIES
          </h2>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-500 hover:text-black"
        >
          View more <ArrowRight size={18} strokeWidth={1} />
        </Link>
      </div>

      {/* Grid - Card size thodi kami karnyasaathi gap ani max-width set kelay */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
        {topCats.map((cat, i) => {
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="mx-auto w-full max-w-[240px]" // Card chi width ithe control keli aahe
            >
              <Link to={`/products?category=${cat.id}`} className="group block">
                <div className="flex flex-col items-center">
                  
                  {/* Card Container - Slow & Smooth Transition */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-[#F8F8F8] transition-all duration-700 ease-in-out group-hover:shadow-lg">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      // Image slow zoom honyasaathi duration-700 ani ease-in-out
                      className="h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-500 transition-colors duration-500 group-hover:text-black md:text-sm">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByCategories;