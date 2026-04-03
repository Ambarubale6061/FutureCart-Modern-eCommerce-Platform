import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import BannerCarousel from "@/components/home/BannerCarousel";
import ExploreProducts from "@/components/home/ExploreProducts";
import ShopByCategories from "@/components/home/ShopByCategories";
import LastViewedSection from "@/components/home/LastViewedSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import DealSection from "@/components/home/DealSection";
import { allProducts, Product } from "@/data/products";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
};

const Index = () => {
  const products = allProducts;
  const deals = products.filter((p) => p.discount >= 30).slice(0, 20);
  const topOffers = products.filter((p) => p.rating >= 4).slice(0, 20);
  const trending = products.slice(0, 20);

  const dealSections = [
  ];

  return (
    <div className="page-root">
      <Header /><CategoryNav />
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 sm:pt-4"><BannerCarousel /></div>
        <div className="mt-2 sm:mt-6"><HeroSection /></div>
        <ShopByCategories /><ExploreProducts />
        <div className="mx-auto max-w-7xl px-3 sm:px-6"><LastViewedSection /></div>
        <div className="mx-auto max-w-7xl px-3 pb-4 sm:px-6">
          <div className="space-y-4 sm:space-y-5">
            {dealSections.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} custom={i} variants={fadeUp}>
                <DealSection title={s.title} products={s.products} viewAllLink={s.link} accent={s.accent} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-3 sm:px-6"><NewsletterSection /></div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;