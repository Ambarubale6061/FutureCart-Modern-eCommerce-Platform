import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "fashion-men", name: "MEN" },
  { id: "fashion-women", name: "WOMEN" },
  { id: "toys", name: "KIDS" },
  { id: "home-furniture", name: "HOME & LIVING" },
  { id: "electronics", name: "ELECTRONICS" },
  { id: "beauty", name: "BEAUTY" },
  { id: "sports", name: "SPORT & FITNESS" },
  { id: "books", name: "BOOKS" },
  { id: "music", name: "MUSIC & GAMES" },
  { id: "gift-cards", name: "GIFT CARDS" },
];

const CategoryNav = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* FIX 1: "relative" ऐवजी "sticky" वापरले आहे आणि z-index 40 ठेवला आहे.
         तसेच shadow-sm दिले आहे जेणेकरून पांढऱ्या बॅकग्राउंडवर तो वेगळा दिसेल.
      */}
      <nav className="w-full bg-white border-b border-gray-100 py-3 px-6 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          
          {/* 1. Hamburger Menu - Left */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-700 hover:text-black transition-all p-2 hover:bg-gray-50 rounded-lg"
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* 2. Categories - Center 
              FIX 2: justify-center मुळे आता कॅटेगरी व्यवस्थित मधोमध दिसतील.
          */}
          <div className="flex items-center justify-center flex-1 overflow-x-auto scrollbar-hide gap-8 px-4">
            {CATEGORIES.map((cat, i) => {
              const isActive = activeCategory === cat.id;
              return (
                <div key={cat.id} className="shrink-0">
                  <Link
                    to={`/products?category=${cat.id}`}
                    className={`whitespace-nowrap text-[11px] font-extrabold tracking-[0.1em] transition-all relative py-2
                      ${isActive ? "text-black" : "text-gray-400 hover:text-black"}`}
                  >
                    {cat.name}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-[3px] bg-blue-600 rounded-full"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Spacer for symmetry - Right */}
          <div className="w-10 md:block hidden" />
        </div>
      </nav>

      {/* SIDE DRAWER - z-index 50 (सर्वात वर) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50]"
            />
            
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-white z-[60] shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-black tracking-tighter text-blue-600">FUTURECART</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-xs font-bold text-gray-700 transition-colors group"
                  >
                    {cat.name}
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryNav;