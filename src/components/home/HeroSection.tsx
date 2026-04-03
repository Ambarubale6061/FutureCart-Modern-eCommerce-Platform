import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { allProducts } from "@/data/products";

const HeroSection = () => {
  const featured = allProducts.find((p) => p.category === "mobiles" && p.rating >= 4.5) || allProducts[0];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-8 pb-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col justify-center lg:col-span-3">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            SHOP LATEST<br />
            TECHNOLOGICAL PRODUCTS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed"
          >
            Unleash tomorrow's technology today; elevating your world with{" "}
            <span className="font-semibold text-accent">innovative solutions</span> and unparalleled performance!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 flex items-center gap-3"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground active:text-primary transition-colors"
            >
              Explore all products
              <motion.span whileTap={{ scale: 0.9 }} className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
          <div className="mt-8 flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative lg:col-span-2"
        >
          <Link to={`/product/${featured.id}`} className="block">
            <motion.div whileTap={{ scale: 0.98 }} className="relative overflow-hidden rounded-3xl bg-muted/40 p-6">
              <span className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                %{featured.discount}
              </span>
              <div className="mx-auto h-[220px] w-[220px] sm:h-[280px] sm:w-[280px]">
                <img src={featured.image} alt={featured.name} className="h-full w-full object-contain" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">{featured.brand}</p>
                <h3 className="text-sm font-bold text-foreground">{featured.name.slice(0, 30)}</h3>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < Math.round(featured.rating) ? "fill-accent text-accent" : "text-border"} />
                  ))}
                  <span className="ml-1 text-[10px] text-muted-foreground">{featured.reviewsCount} reviews</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-black text-foreground">₹{featured.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{featured.originalPrice.toLocaleString()}</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  View more <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
