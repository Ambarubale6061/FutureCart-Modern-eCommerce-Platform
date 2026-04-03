import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

const CategoryCards = () => {
  return (
    <section className="bg-card py-4">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="flex min-w-[120px] flex-col items-center gap-2 rounded-lg p-3 transition-all hover:shadow-lg hover:bg-muted/50 group"
              >
                <div className="relative overflow-hidden rounded-full">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={cat.image}
                    alt={cat.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <span className="text-center text-xs font-semibold text-card-foreground group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
