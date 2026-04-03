import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

const CategoryCards = () => {
  return (
    <section className="border-b border-border/40 bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto py-3 sm:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="flex-shrink-0"
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="group flex flex-col items-center gap-1.5"
              >
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/40 bg-background transition-all group-hover:border-primary/40 group-hover:shadow-card"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </motion.div>
                <span className="text-[10px] font-semibold text-foreground transition-colors group-hover:text-primary">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;