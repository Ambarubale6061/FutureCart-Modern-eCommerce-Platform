import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, TrendingUp, Tag, Search, Star } from "lucide-react";
import { allProducts, searchProducts, getProductsByCategory, Product } from "@/data/products";
import { categories } from "@/data/categories";
import { Link } from "react-router-dom";

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

const greetings: Message[] = [
  { id: "greet-0", role: "bot", content: "👋 Hey! I'm **FutureBot** — your smart shopping assistant!" },
  { id: "greet-1", role: "bot", content: "I know everything about our **1000+ products**! Ask me about:\n\n🔍 Any product by name\n💰 Price ranges (e.g. \"phones under 15000\")\n⭐ Best rated items\n🏷️ Deals & discounts\n📦 Delivery & returns\n\nOr tap a quick action below! 👇" },
];

// Smart price range parser
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

const getResponse = (input: string): { text: string; products?: Product[] } => {
  const lower = input.toLowerCase().trim();
  if (lower.match(/^(hi|hello|hey|hola|namaste|yo|sup)\b/)) return { text: "Hello! 😊 What are you shopping for today?" };
  if (lower.match(/thank|thanks|thx|ty/)) return { text: "You're welcome! 😊 Happy shopping!" };
  if (lower.includes("categor") || lower.includes("what do you sell") || lower.includes("what can i buy") || lower.includes("what do you have")) {
    const catList = categories.map((c) => `• ${c.name} (${getProductsByCategory(c.id).length} products)`).join("\n");
    return { text: `We have **${allProducts.length}+ products** across **${categories.length} categories**:\n\n${catList}` };
  }
  const priceRange = parsePriceRange(lower);
  if (priceRange) {
    const cat = findCategory(lower);
    let results = cat ? getProductsByCategory(cat) : allProducts;
    results = results.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max).sort((a, b) => b.rating - a.rating).slice(0, 5);
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
    return { text: "Which product's price do you want?" };
  }
  if (lower.includes("deal") || lower.includes("discount") || lower.includes("offer") || lower.includes("cheap") || lower.includes("sale")) {
    const cat = findCategory(lower);
    const source = cat ? getProductsByCategory(cat) : allProducts;
    const deals = [...source].sort((a, b) => b.discount - a.discount).slice(0, 5);
    return { text: `🔥 **Best deals** right now:`, products: deals };
  }
  const brandMatch = lower.match(/\b(samsung|apple|nike|adidas|sony|lg|hp|dell|lenovo|xiaomi|oneplus|realme|puma|levi|zara|bosch)\b/i);
  if (brandMatch) {
    const results = allProducts.filter((p) => p.brand.toLowerCase().includes(brandMatch[1])).sort((a, b) => b.rating - a.rating).slice(0, 5);
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

  useEffect(() => {
    const timer = setTimeout(() => { setIsOpen(true); setHasOpened(true); setMessages([...greetings]); }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

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
            className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-xl"
          >
            <MessageCircle size={26} className="text-primary-foreground" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">1</span>
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
            className="fixed bottom-6 right-6 z-[9999] flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl border border-border"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent px-4 py-3">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                      <Bot size={20} className="text-primary-foreground" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-primary bg-green-400" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-bold text-primary-foreground">
                      FutureBot <Sparkles size={12} className="text-accent" />
                    </p>
                    <p className="text-[10px] text-primary-foreground/70">Always online • {allProducts.length}+ products</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-primary-foreground/80 active:bg-primary-foreground/10 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-background/50 p-3 space-y-2.5">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx < 3 ? idx * 0.1 : 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md"
                      : "bg-card text-card-foreground shadow-sm border rounded-bl-md"
                  }`}>
                    <p className="whitespace-pre-line">{renderText(msg.content)}</p>
                    {msg.products && (
                      <div className="mt-2 space-y-1.5">
                        {msg.products.map((p) => (
                          <Link key={p.id} to={`/product/${p.id}`} onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 rounded-lg border bg-background p-2 active:shadow-md active:border-primary/30 transition-all">
                            <img src={p.image} alt="" className="h-11 w-11 rounded-md object-contain bg-muted/50 p-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-medium text-card-foreground">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-bold text-card-foreground">₹{p.price.toLocaleString()}</span>
                                <span className="text-[10px] line-through text-muted-foreground">₹{p.originalPrice.toLocaleString()}</span>
                                <span className="text-[10px] font-semibold text-green-600">{p.discount}% off</span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="inline-flex items-center gap-0.5 rounded bg-green-600 px-1 py-0.5 text-[9px] font-bold text-white">
                                  {p.rating} ★
                                </span>
                                <span className="text-[9px] text-muted-foreground">({p.reviewsCount.toLocaleString()})</span>
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
                  <div className="rounded-2xl rounded-bl-md bg-card border shadow-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="h-2 w-2 rounded-full bg-muted-foreground/50"
                          animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.length <= 2 && !isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-1.5 pt-1">
                  {quickActions.map((qa) => (
                    <button key={qa.label} onClick={() => sendMessage(qa.query)}
                      className="flex items-center gap-1 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground active:border-primary active:text-primary active:shadow-sm transition-all">
                      <qa.icon size={12} /> {qa.label}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t bg-card p-3">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
                <input type="text" placeholder="Ask about any product..." value={input} onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-full border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" />
                <motion.button type="submit" whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
                  <Send size={16} />
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
