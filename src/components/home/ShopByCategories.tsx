import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

const ShopByCategories = () => {
  const topCats = categories.slice(0, 6);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          SHOP<br />BY CATEGORIES
        </h2>
        <Link to="/products" className="flex items-center gap-2 text-xs font-medium text-muted-foreground active:text-foreground transition-colors">
          View more <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {topCats.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/products?category=${cat.id}`}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 rounded-2xl bg-card p-4 border border-border/30 active:shadow-lg active:border-primary/20 transition-all"
              >
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-muted/30 p-2">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-contain" />
                </div>
                <span className="text-xs font-semibold text-foreground">{cat.name}</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategories;
