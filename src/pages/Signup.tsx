import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, Sparkles, Store } from "lucide-react";

type TabType = "user" | "seller";

const Signup = () => {
  const [activeTab, setActiveTab] = useState<TabType>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setIsLoading(true);
    const result = await signup(name, email, password);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created! Please check your email to verify.");
      navigate("/login");
    }
  };

  const tabs = [
    { id: "user" as TabType, label: "User", icon: UserIcon, gradient: "from-primary via-primary to-accent", desc: "Join the FutureCart family" },
    { id: "seller" as TabType, label: "Seller", icon: Store, gradient: "from-emerald-600 via-emerald-500 to-teal-500", desc: "Sell on FutureCart" },
  ];

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex items-center justify-center px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="mb-4 flex rounded-2xl bg-card border border-border/50 p-1.5 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setName(""); setEmail(""); setPassword(""); }}
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
              <div className={`bg-gradient-to-br ${activeTabData.gradient} p-8 text-center`}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <activeTabData.icon size={28} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  {activeTab === "user" ? "Create Account" : "Seller Portal"}
                </h2>
                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-white/80">
                  <Sparkles size={14} /> {activeTabData.desc}
                </p>
              </div>

              <div className="bg-card p-8">
                {activeTab === "seller" ? (
                  <div className="space-y-5">
                    <p className="text-sm text-muted-foreground text-center">
                      No signup required! Go directly to the Seller Dashboard to start adding products.
                    </p>
                    <motion.button whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/seller")}
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 text-sm font-bold text-white shadow-lg transition-all">
                      Go to Seller Dashboard
                    </motion.button>
                    <p className="text-center text-xs text-muted-foreground">
                      Products added by sellers require admin approval before going live.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                      <UserIcon size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
                      className="w-full rounded-xl bg-gradient-to-r from-accent to-accent/80 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-all disabled:opacity-50">
                      {isLoading ? "Creating account..." : "Create Account"}
                    </motion.button>
                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="font-semibold text-primary">Log in</Link>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Signup;
