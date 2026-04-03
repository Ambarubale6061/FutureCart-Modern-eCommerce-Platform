import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { allProducts, Product } from "@/data/products";
import { categories } from "@/data/categories";

const CategoryCard = ({ title, image, link, color }: { title: string; image: string; link: string; color: string }) => (
  <Link to={link} className="block">
    <motion.div whileTap={{ scale: 0.97 }} className={`${color} relative h-full min-h-[180px] overflow-hidden rounded-2xl p-5`}>
      <div className="relative z-10">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="mt-2 inline-block rounded-lg bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
          View All
        </span>
      </div>
      <img src={image} alt={title} className="absolute bottom-2 right-2 h-24 w-24 object-contain opacity-90" />
      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-card/80 text-foreground">
        <ArrowUpRight size={14} />
      </span>
    </motion.div>
  </Link>
);

const SmallProductCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product.id}`} className="block">
    <motion.div whileTap={{ scale: 0.97 }} className="overflow-hidden rounded-2xl bg-card p-4 border border-border/30 shadow-sm">
      <div className="relative mx-auto h-[140px] w-[140px]">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
        <span className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
          {product.discount}%
        </span>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">{product.brand}</p>
      <h4 className="truncate text-xs font-semibold text-foreground">{product.name.slice(0, 25)}</h4>
    </motion.div>
  </Link>
);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ExploreProducts = () => {
  const sports = allProducts.find((p) => p.category === "sports") || allProducts[10];
  const electronics = allProducts.find((p) => p.category === "electronics") || allProducts[0];
  const furniture1 = allProducts.filter((p) => p.category === "home-furniture").slice(0, 2);
  const trending = allProducts.filter((p) => p.rating >= 4.5).slice(0, 3);
  const catTags = categories.slice(0, 8);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">EXPLORE<br />PRODUCTS</h2>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground leading-relaxed">
            Embark on a Boundless Exploration of Innovation with Our Diverse Range of Products.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-xs font-semibold text-foreground">Popular Products</span>
          <Link to="/products" className="mt-1 flex items-center justify-end gap-1 text-xs font-medium text-primary">
            View All <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5"
      >
        <motion.div variants={itemVariants} className="col-span-2 row-span-2">
          <CategoryCard title="Love the sport you are in" image={sports.image} link="/products?category=sports" color="bg-[hsl(220,20%,92%)]" />
        </motion.div>

        {trending.slice(0, 2).map((p) => (
          <motion.div key={p.id} variants={itemVariants}>
            <SmallProductCard product={p} />
          </motion.div>
        ))}

        <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
          <CategoryCard title="Writing code? you are in" image={electronics.image} link="/products?category=electronics" color="bg-accent/15" />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
          <div className="flex h-full flex-col rounded-2xl bg-card p-4 border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {catTags.map((c) => (
                <Link key={c.id} to={`/products?category=${c.id}`}
                  className="rounded-full border border-border px-3 py-1 text-[10px] font-medium text-foreground active:bg-muted transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
            <Link to="/products" className="mt-auto pt-3 text-xs font-medium text-primary">
              View All Categories
            </Link>
          </div>
        </motion.div>

        {furniture1.length > 0 && (
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
            <CategoryCard title="Find the best furniture!" image={furniture1[0].image} link="/products?category=home-furniture" color="bg-accent/10" />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ExploreProducts;
