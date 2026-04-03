import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* --- Animation variants (Slow & Smooth) --- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Custom cubic-bezier for premium smoothness
  },
};

const ExploreProducts = () => {
  const navigate = useNavigate();

  // Optimized & High-Quality Images
  const images = {
    sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop",
    laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    chair: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop",
    camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    lamp: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop",
    sofa: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
   avatars: [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop", // Male - Professional
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", // Female - Friendly
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop"  // Male - Casual
]
  };

  const handleCategoryClick = (e, category) => {
    // Prevent overlapping clicks if necessary
    e.stopPropagation();
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 bg-white font-sans overflow-hidden">
      {/* ─── HEADER SECTION ─── */}
      <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="md:w-1/4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            EXPLORE<br />PRODUCTS
          </h2>
        </div>
        
        <div className="md:w-2/4">
          <p className="text-sm leading-relaxed text-gray-500 max-w-md">
            Embark on a Boundless Exploration of Innovation with Our Diverse Range of Products, 
            Elevating Your Journey to Unveil New Horizons and Endless Possibilities.
          </p>
        </div>

        <div className="md:w-1/4 flex flex-col items-end gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {images.avatars.map((url, i) => (
                <img key={i} src={url} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" alt="user" />
              ))}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-900">Popular Products</p>
              <p className="text-[10px] text-gray-400">+200 item</p>
            </div>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-xs font-bold uppercase text-gray-900">
            View All 
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-400 text-white transition-all duration-500 group-hover:scale-110">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>

      {/* ─── BENTO GRID ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-5"
      >
        {/* Box 1: Sports */}
        <motion.div 
          variants={itemVariants} 
          onClick={(e) => handleCategoryClick(e, 'sports')}
          className="md:col-span-2 lg:col-span-6 h-52 relative overflow-hidden rounded-[2.5rem] bg-[#E8F0FE] p-10 flex items-center cursor-pointer group"
        >
          <div className="z-20 relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Love the sport <br /> you are in</h3>
            <button className="rounded-full bg-white px-6 py-2 text-[11px] font-bold text-gray-600 shadow-sm transition-all duration-700 group-hover:bg-black group-hover:text-white">View All</button>
          </div>
          <img src={images.sports} alt="Sport" className="absolute right-0 bottom-0 h-full w-[55%] object-cover transition-transform duration-1000 ease-out group-hover:scale-110 z-10" />
        </motion.div>

        {/* Box 2: Armchair */}
        <motion.div 
          variants={itemVariants} 
          onClick={(e) => handleCategoryClick(e, 'furniture')}
          className="md:col-span-2 lg:col-span-3 lg:row-span-2 rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm flex flex-col cursor-pointer group overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
              <div className="h-2.5 w-2.5 rounded-full bg-gray-900" />
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-100 transition-all duration-500 group-hover:bg-black group-hover:text-white"><ArrowUpRight size={16} /></div>
          </div>
          <div className="flex-1 flex items-center justify-center relative z-10">
            <img src={images.chair} className="max-h-44 w-auto object-contain transition-transform duration-1000 group-hover:scale-110" alt="Chair" />
          </div>
          <div className="mt-4 flex justify-between items-end relative z-20">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Furniture</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">Minimal Rose<br/>Armchair</p>
            </div>
            <div className="bg-orange-400 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg shadow-orange-100">$85</div>
          </div>
        </motion.div>

        {/* Box 3: Camera */}
        <motion.div 
          variants={itemVariants} 
          onClick={(e) => handleCategoryClick(e, 'electronics')}
          className="md:col-span-2 lg:col-span-3 lg:row-span-2 rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm flex flex-col cursor-pointer group overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-100 transition-all duration-500 group-hover:bg-black group-hover:text-white"><ArrowUpRight size={16} /></div>
          </div>
          <div className="flex-1 flex items-center justify-center relative z-10">
            <img src={images.camera} className="max-h-44 w-auto object-contain transition-transform duration-1000 group-hover:scale-110" alt="Camera" />
          </div>
          <div className="mt-4 flex justify-between items-end relative z-20">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Electronics</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">Fujifilm Instax<br/>Mini 11</p>
            </div>
            <div className="bg-orange-400 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg shadow-orange-100">$85</div>
          </div>
        </motion.div>

        {/* Box 4: Writing Code */}
        <motion.div 
          variants={itemVariants} 
          onClick={(e) => handleCategoryClick(e, 'laptop')}
          className="md:col-span-2 lg:col-span-6 h-52 relative overflow-hidden rounded-[2.5rem] bg-[#FEF3C7] p-10 flex items-center cursor-pointer group"
        >
          <div className="z-20 relative">
            <h3 className="text-xl font-semibold text-gray-800 leading-snug">Writing code?<br/>you are in</h3>
            <p className="text-[12px] font-bold text-gray-600 mt-3 group-hover:text-black transition-colors duration-500">shop now</p>
          </div>
          <div className="absolute right-8 top-8 h-9 w-9 flex items-center justify-center rounded-xl bg-white shadow-sm transition-all duration-500 group-hover:bg-black group-hover:text-white z-20"><ArrowUpRight size={16} /></div>
          <img src={images.laptop} alt="Laptop" className="absolute -right-4 -bottom-8 h-[95%] w-1/2 object-contain transition-transform duration-1000 group-hover:scale-105 z-10" />
        </motion.div>

        {/* Box 5: Lamp */}
        <motion.div 
          variants={itemVariants} 
          onClick={(e) => handleCategoryClick(e, 'decor')}
          className="md:col-span-1 lg:col-span-3 rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm h-60 flex flex-col justify-between cursor-pointer group overflow-hidden"
        >
          <div className="flex justify-between items-start z-20">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-orange-200" />
              <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
            </div>
            <div className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-50 shadow-sm transition-all duration-500 group-hover:bg-black group-hover:text-white"><ArrowUpRight size={14} /></div>
          </div>
          <img src={images.lamp} className="h-28 w-auto object-contain mx-auto transition-transform duration-1000 group-hover:scale-110 z-10" alt="Lamp" />
          <div className="flex justify-end z-20">
            <div className="bg-orange-400 text-white px-3 py-2 rounded-xl text-[11px] font-black">$85</div>
          </div>
        </motion.div>

        {/* Box 6: Tags */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4 bg-[#F1F3FF] rounded-[2.5rem] p-8 flex flex-col justify-between h-60">
          <div className="flex flex-wrap gap-2.5 z-20">
            {['Clothing', 'Pets', 'Laptop', 'Baby', 'School', 'Handmade', 'Iphone'].map(tag => (
              <button 
                key={tag} 
                onClick={(e) => handleCategoryClick(e, tag)}
                className="bg-white px-5 py-2 rounded-full text-[10px] font-bold text-gray-500 shadow-sm hover:bg-gray-900 hover:text-white transition-all duration-500 active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
          <Link to="/products" className="text-[12px] font-bold text-gray-400 hover:text-blue-600 transition-colors duration-500 z-20">View All Categories</Link>
        </motion.div>

        {/* Box 7: Furniture Final */}
        <motion.div 
          variants={itemVariants} 
          onClick={(e) => handleCategoryClick(e, 'furniture')}
          className="md:col-span-2 lg:col-span-5 h-60 relative overflow-hidden rounded-[2.5rem] bg-[#E0E7FF] p-10 flex items-center cursor-pointer group"
        >
          <div className="z-20 relative">
            <h3 className="text-2xl font-semibold text-gray-800 leading-tight">Find the best<br/>furniture!</h3>
            <p className="text-[12px] font-bold text-gray-600 mt-3 group-hover:text-black transition-colors duration-500">shop now</p>
          </div>
          <div className="absolute right-8 top-8 h-9 w-9 flex items-center justify-center rounded-xl bg-white shadow-sm transition-all duration-500 group-hover:bg-black group-hover:text-white z-20"><ArrowUpRight size={16} /></div>
          <img src={images.sofa} alt="Sofa" className="absolute right-0 bottom-0 h-full w-1/2 object-contain transition-transform duration-1000 group-hover:scale-105 z-10" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ExploreProducts;