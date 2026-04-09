import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Sparkles, Store, User } from "lucide-react";

type TabType = "user" | "seller";

const Login = () => {
  const [activeTab, setActiveTab] = useState<TabType>("user");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.error) { toast.error(result.error); }
    else { toast.success("Login successful!"); navigate("/"); }
  };

  const tabs = [
    {
      id: "user"   as TabType, label: "User",
      icon: User,  gradient: "from-primary via-primary to-accent",
      desc: "Access your FutureCart account",
    },
    {
      id: "seller" as TabType, label: "Seller",
      icon: Store, gradient: "from-emerald-600 via-emerald-500 to-teal-500",
      desc: "Sell on FutureCart",
    },
  ];

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Tab switcher */}
            <div className="mb-4 flex rounded-2xl bg-card border border-border/50 p-1.5 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setEmail(""); setPassword(""); }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                      : "text-muted-foreground"
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl shadow-2xl border border-border/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-br ${activeTabData.gradient} p-8 text-center`}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
                    >
                      <activeTabData.icon size={28} className="text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white">
                      {activeTab === "user" ? "Welcome Back" : "Seller Portal"}
                    </h2>
                    <p className="mt-1 flex items-center justify-center gap-1 text-sm text-white/80">
                      <Sparkles size={14} /> {activeTabData.desc}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="bg-card p-8">
                    {activeTab === "seller" ? (
                      <div className="space-y-5">
                        <p className="text-sm text-muted-foreground text-center">
                          No login required! Go directly to the Seller Dashboard to start adding products.
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate("/seller")}
                          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 text-sm font-bold text-white shadow-lg transition-all"
                        >
                          Go to Seller Dashboard
                        </motion.button>
                        <p className="text-center text-xs text-muted-foreground">
                          Products added by sellers require admin approval before going live.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                          <input
                            type="email" placeholder="Enter Email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                          <input
                            type="password" placeholder="Enter Password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          By continuing, you agree to FutureCart's Terms of Use and Privacy Policy.
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
                          className="w-full rounded-xl bg-gradient-to-r from-accent to-accent/80 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-all disabled:opacity-50"
                        >
                          {isLoading ? "Logging in…" : "Login"}
                        </motion.button>
                        <p className="text-center text-sm text-muted-foreground">
                          New to FutureCart?{" "}
                          <Link to="/signup" className="font-semibold text-primary">Create an account</Link>
                        </p>
                      </form>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Login;