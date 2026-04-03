import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "FASHION BONANZA",
    subtitle: "UP TO",
    highlight: "40% OFF",
    cta: "SHOP THE SALE",
    link: "/products?category=fashion-women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=400&fit=crop",
    gradient: "from-purple-900/80 to-pink-800/60",
  },
  {
    id: 2,
    title: "MEGA ELECTRONICS SALE",
    subtitle: "UP TO",
    highlight: "80% OFF",
    cta: "SHOP NOW",
    link: "/products?category=electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1400&h=400&fit=crop",
    gradient: "from-blue-900/80 to-cyan-800/60",
  },
  {
    id: 3,
    title: "HOME MAKEOVER FEST",
    subtitle: "STARTING FROM",
    highlight: "₹299",
    cta: "EXPLORE",
    link: "/products?category=home-furniture",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1400&h=400&fit=crop",
    gradient: "from-emerald-900/80 to-teal-800/60",
  },
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => { setDirection(1); setCurrent((c) => (c + 1) % banners.length); }, []);
  const prev = useCallback(() => { setDirection(-1); setCurrent((c) => (c - 1 + banners.length) % banners.length); }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const banner = banners[current];

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 mt-4">
      <div className="relative h-[180px] md:h-[340px]">
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="text-2xl font-bold tracking-wider text-white md:text-5xl drop-shadow-lg">
                    {banner.title}
                  </motion.h2>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="mt-2 text-base text-white/90 md:text-2xl">
                    {banner.subtitle}{" "}
                    <span className="font-bold text-yellow-300">{banner.highlight}</span>
                  </motion.p>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}>
                    <Link to={banner.link}
                      className="mt-5 inline-block rounded-2xl bg-white px-8 py-3 text-sm font-bold tracking-wide text-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      {banner.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors backdrop-blur-sm">
        <ChevronLeft size={20} className="text-foreground" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors backdrop-blur-sm">
        <ChevronRight size={20} className="text-foreground" />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-2 rounded-full transition-all ${i === current ? "bg-white w-8" : "bg-white/50 w-2"}`} />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
