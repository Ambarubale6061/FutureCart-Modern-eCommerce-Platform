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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-[1400px] px-4 py-8"
    >
      <div className="rounded-3xl bg-card border border-border/30 p-8 md:p-12">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
              SUBSCRIBE<br />TO THE NEWS
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Be aware of all discounts and bargains!<br />Don't miss your benefit!
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="h-11 rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground active:bg-accent/90 transition-colors"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default NewsletterSection;
