import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles, TrendingUp, Tag, Search, Star } from "lucide-react";
import { Product } from "@/data/products";
import { categories } from "@/data/categories";
import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductsContext";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  products?: Product[];
}

const quickActions = [
  { icon: TrendingUp, label: "Top Deals", query: "best deals today" },
  { icon: Star, label: "Top Rated", query: "best rated products" },
  { icon: Tag, label: "Under ₹999", query: "products under 999" },
  { icon: Search, label: "Categories", query: "what categories do you have" },
];

const parsePriceRange = (input: string): { min: number; max: number } | null => {
  const under = input.match(/under\s*₹?\s*(\d+)/i) || input.match(/below\s*₹?\s*(\d+)/i) || input.match(/less than\s*₹?\s*(\d+)/i);
  if (under) return { min: 0, max: parseInt(under[1]) };
  const above = input.match(/above\s*₹?\s*(\d+)/i) || input.match(/over\s*₹?\s*(\d+)/i) || input.match(/more than\s*₹?\s*(\d+)/i);
  if (above) return { min: parseInt(above[1]), max: Infinity };
  const between = input.match(/(?:between|from)\s*₹?\s*(\d+)\s*(?:to|and|-)\s*₹?\s*(\d+)/i);
  if (between) return { min: parseInt(between[1]), max: parseInt(between[2]) };
  const justNumber = input.match(/₹\s*(\d+)/);
  if (justNumber) return { min: 0, max: parseInt(justNumber[1]) };
  return null;
};

const findCategory = (text: string): string | null => {
  const lower = text.toLowerCase();
  const map: Record<string, string[]> = {
    "electronics": ["laptop", "electronic", "camera", "headphone", "speaker", "monitor", "tablet", "keyboard"],
    "mobiles": ["phone", "mobile", "smartphone", "iphone", "samsung galaxy", "oneplus", "xiaomi", "realme"],
    "fashion-men": ["men shirt", "men fashion", "jeans", "trouser", "men shoe", "blazer", "men watch", "t-shirt", "tshirt"],
    "fashion-women": ["women", "dress", "saree", "kurta", "handbag", "earring", "women fashion", "ladies"],
    "home-furniture": ["sofa", "bed", "table", "chair", "furniture", "wardrobe", "lamp", "curtain", "cushion", "home decor"],
    "appliances": ["washing machine", "refrigerator", "fridge", "ac", "air conditioner", "microwave", "mixer", "iron", "vacuum"],
    "beauty": ["beauty", "cream", "shampoo", "lipstick", "makeup", "perfume", "skincare", "moisturizer", "sunscreen"],
    "sports": ["sport", "cricket", "football", "gym", "yoga", "running", "fitness", "dumbbell", "shoe"],
    "books": ["book", "novel", "fiction", "programming", "study", "academic"],
    "toys": ["toy", "puzzle", "lego", "doll", "game", "baby", "kids"],
  };
  for (const [cat, keywords] of Object.entries(map)) {
    if (keywords.some((k) => lower.includes(k))) return cat;
  }
  return null;
};

const renderText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-bold">{part.slice(2, -2)}</strong> : part);
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { products } = useProducts(); 
  const allProducts = products || [];

  const getProductsByCategory = (categoryId: string) => {
    return allProducts.filter((p: Product) => p.category === categoryId);
  };

  const searchProducts = (query: string) => {
    const q = query.toLowerCase();
    return allProducts.filter((p: Product) => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  };

  const greetings: Message[] = [
    { id: "greet-0", role: "bot", content: "👋 Hey! I'm **FutureBot** — your smart shopping assistant!" },
    { id: "greet-1", role: "bot", content: `How can I help you today? Ask me about:\n\n🔍 Any product by name\n💰 Price ranges (e.g. "phones under 15000")\n⭐ Best rated items\n🏷️ Deals & discounts\n📦 Delivery & returns\n\nOr tap a quick action below! 👇` },
  ];

  const getResponse = (input: string): { text: string; products?: Product[] } => {
    const lower = input.toLowerCase().trim();
    if (lower.match(/^(hi|hello|hey|hola|namaste|yo|sup)\b/)) return { text: "Hello! 😊 What are you shopping for today?" };
    if (lower.match(/thank|thanks|thx|ty/)) return { text: "You're welcome! 😊 Happy shopping!" };
    
    if (lower.includes("categor") || lower.includes("what do you sell") || lower.includes("what can i buy") || lower.includes("what do you have")) {
      const catList = categories.map((c) => `• ${c.name}`).join("\n");
      return { text: `We have amazing products across these categories:\n\n${catList}` };
    }

    const priceRange = parsePriceRange(lower);
    if (priceRange) {
      const cat = findCategory(lower);
      let results = cat ? getProductsByCategory(cat) : allProducts;
      results = results.filter((p: Product) => p.price >= priceRange.min && p.price <= priceRange.max).sort((a: Product, b: Product) => b.rating - a.rating).slice(0, 5);
      if (results.length > 0) {
        const rangeText = priceRange.max === Infinity ? `above ₹${priceRange.min.toLocaleString()}` : priceRange.min === 0 ? `under ₹${priceRange.max.toLocaleString()}` : `₹${priceRange.min.toLocaleString()} - ₹${priceRange.max.toLocaleString()}`;
        return { text: `Found **${results.length}** products ${rangeText}:`, products: results };
      }
      return { text: "No products found in that price range." };
    }

    if (lower.includes("review") || lower.includes("rating") || lower.match(/\b(best|top)\s+(rated|quality|selling)\b/) || lower.match(/\bbest\b/)) {
      const cat = findCategory(lower);
      const source = cat ? getProductsByCategory(cat) : allProducts;
      const results = [...source].sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount).slice(0, 5);
      return { text: `⭐ **Top rated** products:`, products: results };
    }

    if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
      const cleaned = lower.replace(/price|cost|how much|is|the|of|a|an|for|what/gi, "").trim();
      if (cleaned) { const results = searchProducts(cleaned).slice(0, 5); if (results.length > 0) return { text: `💰 Prices:`, products: results }; }
      return { text: "Which product's price do you want to check?" };
    }

    if (lower.includes("deal") || lower.includes("discount") || lower.includes("offer") || lower.includes("cheap") || lower.includes("sale")) {
      const cat = findCategory(lower);
      const source = cat ? getProductsByCategory(cat) : allProducts;
      const deals = [...source].sort((a, b) => b.discount - a.discount).slice(0, 5);
      return { text: `🔥 **Best deals** right now:`, products: deals };
    }

    const brandMatch = lower.match(/\b(samsung|apple|nike|adidas|sony|lg|hp|dell|lenovo|xiaomi|oneplus|realme|puma|levi|zara|bosch)\b/i);
    if (brandMatch) {
      const results = allProducts.filter((p: Product) => p.brand.toLowerCase().includes(brandMatch[1])).sort((a: Product, b: Product) => b.rating - a.rating).slice(0, 5);
      if (results.length > 0) return { text: `Found **${results.length}** products from **${results[0].brand}**:`, products: results };
    }

    if (lower.includes("deliver") || lower.includes("ship") || lower.includes("tracking")) return { text: "📦 Standard: 3-5 days • Express: 1-2 days • Free on orders above ₹500" };
    if (lower.includes("return") || lower.includes("refund") || lower.includes("exchange")) return { text: "↩️ 7-day returns • 30-day for electronics • Free pickup" };
    if (lower.includes("payment") || lower.includes("pay") || lower.includes("upi") || lower.includes("card")) return { text: "💳 UPI, Cards, Net Banking, COD, No-cost EMI available" };
    
    if (lower.match(/\b(search|find|show|looking|want|need|buy|get|suggest|recommend)\b/)) {
      const cleaned = lower.replace(/\b(search|find|show|looking\s*for|looking|want|need|buy|get|suggest|recommend|me|i|to|a|an|the|some|please|pls)\b/gi, "").trim();
      if (cleaned) {
        const cat = findCategory(cleaned);
        const results = cat ? getProductsByCategory(cat).sort((a, b) => b.rating - a.rating).slice(0, 5) : searchProducts(cleaned).slice(0, 5);
        if (results.length > 0) return { text: `Here's what I found:`, products: results };
      }
    }

    const results = searchProducts(input).slice(0, 5);
    if (results.length > 0) return { text: `Results for **"${input}"**:`, products: results };
    
    const cat = findCategory(lower);
    if (cat) { const catProducts = getProductsByCategory(cat).sort((a, b) => b.rating - a.rating).slice(0, 5); return { text: `Top products:`, products: catProducts }; }
    
    return { text: "Try: **\"phones under 15000\"**, **\"best laptops\"**, or **\"deals in electronics\"**" };
  };

  useEffect(() => {
    const timer = setTimeout(() => { setIsOpen(true); setHasOpened(true); setMessages([...greetings]); }, 2000);
    return () => clearTimeout(timer);
  }, []); 

  useEffect(() => { 
    // Ensuring smooth auto-scroll to the absolute bottom
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "bot", content: response.text, products: response.products }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setIsOpen(true); if (!hasOpened) { setHasOpened(true); setMessages([...greetings]); } }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-xl hover:shadow-primary/25 transition-all"
          >
            <MessageCircle size={26} className="text-primary-foreground" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-background">1</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex h-[500px] sm:h-[600px] w-[360px] sm:w-[400px] max-h-[85vh] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl border border-border/50 bg-background"
          >
            {/* Premium Header */}
            <div className="relative z-10 flex-none bg-gradient-to-r from-primary via-primary to-accent px-4 py-3.5 shadow-sm">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/10">
                    <Bot size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-[15px] font-bold text-primary-foreground leading-none mb-1">
                      FutureBot <Sparkles size={14} className="text-accent" />
                    </p>
                    {/* Replaced Text with Animated Online Indicator */}
                    <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground/90">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Smart Shopping Assistant
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Area - HIDDEN SCROLLBAR using Tailwind Arbitrary Variants */}
            <div className="flex-1 overflow-y-auto bg-muted/20 p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx < 3 ? idx * 0.1 : 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`relative max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-background text-foreground border border-border/50 rounded-bl-sm"
                  }`}>
                    <p className="whitespace-pre-line">{renderText(msg.content)}</p>
                    
                    {/* Modern Product Cards inside Chat */}
                    {msg.products && (
                      <div className="mt-3 space-y-2">
                        {msg.products.map((p) => (
                          <Link key={p.id} to={`/product/${p.id}`} onClick={() => setIsOpen(false)}
                            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-2 hover:shadow-md hover:border-primary/40 transition-all">
                            <div className="h-12 w-12 shrink-0 rounded-lg bg-muted/30 p-1 flex items-center justify-center overflow-hidden">
                               <img src={p.image} alt={p.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-[13px] font-semibold text-card-foreground">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[13px] font-bold text-primary">₹{p.price.toLocaleString()}</span>
                                <span className="text-[10px] line-through text-muted-foreground">₹{p.originalPrice.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="inline-flex items-center gap-0.5 rounded bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-400">
                                  {p.rating} ★
                                </span>
                                <span className="text-[10px] text-muted-foreground">({p.reviewsCount.toLocaleString()})</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-background border border-border/50 shadow-sm px-4 py-3.5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-primary/60"
                          animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions (Show only at start) */}
              {messages.length <= 2 && !isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-2 pt-2">
                  {quickActions.map((qa) => (
                    <button key={qa.label} onClick={() => sendMessage(qa.query)}
                      className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3.5 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted active:scale-95 transition-all">
                      <qa.icon size={13} className="text-primary" /> {qa.label}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Premium Input Area */}
            <div className="flex-none border-t border-border/50 bg-background p-3.5">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input type="text" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)}
                    className="w-full rounded-full border border-border bg-muted/30 px-4 py-3 text-[14px] text-foreground outline-none transition-all focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10" />
                </div>
                <motion.button type="submit" disabled={!input.trim()} whileTap={{ scale: 0.9 }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={18} className="ml-0.5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;