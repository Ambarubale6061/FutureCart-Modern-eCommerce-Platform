import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const BANNERS = [
  {
    id: 1,
    title: "Fashion Bonanza",
    subtitle: "STYLISH LOOKS UP TO",
    highlight: "40% OFF",
    cta: "Shop the Sale",
    link: "/products?category=fashion-women",
    // editorial high-fashion image
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
    gradient: "from-black/70 via-black/40 to-transparent",
    accent: "#f43f5e", // Rose 500
  },
  {
    id: 2,
    title: "The Tech Revolution",
    subtitle: "NEXT-GEN ELECTRONICS",
    highlight: "80% OFF",
    cta: "Upgrade Now",
    link: "/products?category=electronics",
    // clean workspace/electronics image
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop",
    gradient: "from-blue-950/80 via-blue-900/40 to-transparent",
    accent: "#0ea5e9", // Sky 500
  },
  {
    id: 3,
    title: "Luxe Living Spaces",
    subtitle: "MODERN INTERIORS FROM",
    highlight: "₹299",
    cta: "Explore Home",
    link: "/products?category=home-furniture",
    // premium interior image
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    gradient: "from-stone-900/80 via-stone-800/40 to-transparent",
    accent: "#d4af37", // Gold accent
  },
  {
    id: 4,
    title: "Urban Athleticism",
    subtitle: "PERFORMANCE GEAR UP TO",
    highlight: "60% OFF",
    cta: "Shop Sportswear",
    link: "/products?category=sports",
    // High-energy sports/running image
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop",
    gradient: "from-zinc-950/90 via-zinc-900/40 to-transparent",
    accent: "#ef4444", // Red 500
  },
  {
    id: 5,
    title: "Timeless Precision",
    subtitle: "LUXURY WATCHES STARTING AT",
    highlight: "₹1,999",
    cta: "Discover More",
    link: "/products?category=accessories",
    // Macro shot of a luxury watch
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop",
    gradient: "from-slate-950/90 via-slate-900/40 to-transparent",
    accent: "#f59e0b", // Amber 500
  },
  {
    id: 6,
    title: "Glow & Radiance",
    subtitle: "PREMIUM SKINCARE ESSENTIALS",
    highlight: "BUY 1 GET 1",
    cta: "Shop Beauty",
    link: "/products?category=beauty",
    // Aesthetic skincare/beauty products
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop",
    gradient: "from-teal-950/80 via-teal-900/30 to-transparent",
    accent: "#2dd4bf", // Teal 400
  },
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % BANNERS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const banner = BANNERS[current];

  return (
    <div className="relative overflow-hidden rounded-2xl mx-3 mt-3 sm:mx-0 sm:mt-4">
      <div className="relative h-[160px] sm:h-[260px] md:h-[340px]">
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover"
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
              {/* Right-side soft fade */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-10 md:px-14">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-semibold uppercase tracking-widest text-white/70 sm:text-sm"
                  >
                    {banner.subtitle}
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.17 }}
                    className="mt-0.5 font-display text-2xl font-bold leading-tight text-white drop-shadow sm:text-4xl md:text-5xl"
                  >
                    {banner.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="mt-1 text-xl font-black sm:text-3xl md:text-4xl"
                    style={{ color: banner.accent }}
                  >
                    {banner.highlight}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.32 }}
                    className="mt-3 sm:mt-5"
                  >
                    <Link
                      to={banner.link}
                      className="inline-block rounded-xl bg-white px-5 py-2 text-xs font-bold tracking-wide text-gray-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:px-7 sm:py-2.5 sm:text-sm"
                    >
                      {banner.cta} →
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 sm:h-10 sm:w-10"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 sm:h-10 sm:w-10"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "h-1.5 w-6 bg-white"
                : "h-1.5 w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;