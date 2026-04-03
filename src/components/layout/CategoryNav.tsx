import { Link } from "react-router-dom";
import { Monitor, Shirt, ShoppingBag, Baby, Home, Sparkles, Cpu, Dumbbell, BookOpen, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const categoryIcons = [
  { id: "electronics", name: "Electronics", Icon: Monitor },
  { id: "mobiles", name: "Mobiles", Icon: Smartphone },
  { id: "fashion-men", name: "Men", Icon: Shirt },
  { id: "fashion-women", name: "Women", Icon: ShoppingBag },
  { id: "home-furniture", name: "Home", Icon: Home },
  { id: "beauty", name: "Beauty", Icon: Sparkles },
  { id: "appliances", name: "Appliances", Icon: Cpu },
  { id: "sports", name: "Sports", Icon: Dumbbell },
  { id: "books", name: "Books", Icon: BookOpen },
  { id: "toys", name: "Toys & Baby", Icon: Baby },
];

const CategoryNav = () => {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1400px] overflow-x-auto scrollbar-hide px-4 py-3">
        <div className="flex items-center justify-center gap-x-5 gap-y-3 md:gap-x-8">
          {categoryIcons.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="flex flex-shrink-0 flex-col items-center gap-1.5 transition-colors"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background active:border-primary active:bg-primary/5 active:shadow-md transition-all"
                >
                  <cat.Icon size={22} className="text-card-foreground" strokeWidth={1.5} />
                </motion.div>
                <span className="text-[11px] font-medium text-card-foreground whitespace-nowrap">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
