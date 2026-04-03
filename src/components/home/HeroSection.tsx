import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-x-hidden bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col space-y-8">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h1 className="break-words text-[42px] font-bold tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-[54px] leading-[1.1]">
                SHOP <span className="relative inline-block">
                  LATEST
                  {/* Underline SVG */}
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 138 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8.5C35.5 3.5 102.5 1 137 8.5" stroke="#f9a03f" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
                <br />
                TECHNOLOGICAL PRODUCTS
              </h1>
            </motion.div>

            <motion.p
              custom={0.1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-lg text-lg leading-relaxed text-gray-500"
            >
              Unleash tomorrow's technology today: elevating your world with{" "}
              <span className="text-[#f9a03f]">innovative solutions</span> and unparalleled performance!
            </motion.p>

            <motion.div
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center"
            >
              <Link
                to="/products"
                className="group flex items-center gap-4 text-[15px] font-medium text-gray-600 transition-colors hover:text-black"
              >
                Explore all products
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f9a03f] text-white shadow-sm">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </motion.div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2 pt-4">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-100" />
              <div className="h-2 w-2 rounded-full bg-[#f9a03f]" />
              <div className="h-1.5 w-1.5 rounded-full bg-gray-100" />
              <div className="h-1.5 w-1.5 rounded-full bg-gray-100" />
            </div>
          </div>

          {/* RIGHT CONTENT - EXACT REPLICA OF SCREENSHOT */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative"
          >
            <div className="relative flex min-h-[400px] items-center rounded-[32px] bg-[#F7F8FA] p-8 sm:p-12">
              
              {/* Discount Badge */}
              <div className="absolute -right-2 -top-2 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-[#f9a03f] text-sm font-bold text-white">
                %20
              </div>

              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Product Text Side */}
                <div className="flex flex-col justify-center space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Apple</p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900">iPhone 15 Pro 128 GB</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-[#f9a03f]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">516 reviews</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">$999</span>
                    <span className="text-base text-gray-300 line-through">$1099</span>
                  </div>

                  <Link 
                    to="/product/iphone-15"
                    className="group flex items-center gap-2 pt-2 text-sm font-medium text-gray-500 transition-colors hover:text-black"
                  >
                    View more
                    <div className="flex items-center">
                        <div className="h-[1px] w-8 bg-gray-300 transition-all group-hover:w-10 group-hover:bg-black" />
                        <ArrowRight size={14} className="-ml-1" />
                    </div>
                  </Link>
                </div>

                {/* Product Image Side */}
                <div className="relative flex items-center justify-end overflow-hidden rounded-2xl">
                  <img
                    src="https://images.pexels.com/photos/18525574/pexels-photo-18525574/free-photo-of-unboxing-iphone-15-pro-max-titanium-color.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="iPhone 15 Pro"
                    className="h-auto w-full max-w-full rounded-2xl object-cover drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;