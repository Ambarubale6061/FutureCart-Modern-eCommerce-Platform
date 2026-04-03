import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-7xl px-6 py-12"
    >
      {/* Main Box - Now Pure White */}
      <div className="rounded-[2.5rem] bg-white border border-gray-100 px-10 py-16 md:px-20 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          
          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
              SUBSCRIBE<br />TO THE NEWS
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Be aware of all discounts and bargains!<br />
              Don't miss your benefit!
            </p>
          </div>

          {/* Subscription Form */}
          <form 
            onSubmit={handleSubscribe} 
            className="relative flex w-full max-w-lg items-center"
          >
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-16 w-full rounded-full border border-gray-100 bg-white px-8 text-sm text-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] outline-none placeholder:text-gray-400 focus:border-gray-200 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-full bg-[#FF9900] px-8 text-[13px] font-medium text-white transition-transform hover:brightness-105 active:scale-95"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default NewsletterSection;