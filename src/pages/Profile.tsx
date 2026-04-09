import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { useAuth } from "@/contexts/AuthContext";
import { User, MapPin, Package, LogOut, ChevronRight, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, profile, isAuthenticated, isAdmin, updateProfile, removeAddress, addresses } = useAuth();
  const navigate  = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");
  const [editMode,  setEditMode]  = useState(false);
  const [name,  setName]  = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone     || "");

  if (!isAuthenticated || !user) { navigate("/login"); return null; }

  const handleSave = async () => {
    await updateProfile({ full_name: name, phone });
    setEditMode(false);
    toast.success("Profile updated!");
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row">

            {/* ── Sidebar ── */}
            <div className="w-full md:w-[280px]">
              <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
                    {(profile?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hello,</p>
                    <p className="font-bold text-card-foreground">{profile?.full_name || user.email}</p>
                    {isAdmin && (
                      <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                        <Shield size={10} /> Admin
                      </span>
                    )}
                  </div>
                </div>

                <nav className="mt-3 space-y-1">
                  {/* My Profile tab */}
                  <button onClick={() => setActiveTab("profile")}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${activeTab === "profile" ? "bg-primary/10 font-bold text-primary" : "text-card-foreground hover:bg-muted"}`}>
                    <span className="flex items-center gap-2"><User size={16} /> My Profile</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* My Orders — navigates to dedicated page */}
                  <Link to="/orders"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-card-foreground hover:bg-muted transition-colors">
                    <span className="flex items-center gap-2"><Package size={16} /> My Orders</span>
                    <ChevronRight size={14} />
                  </Link>

                  {/* Manage Addresses tab */}
                  <button onClick={() => setActiveTab("addresses")}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${activeTab === "addresses" ? "bg-primary/10 font-bold text-primary" : "text-card-foreground hover:bg-muted"}`}>
                    <span className="flex items-center gap-2"><MapPin size={16} /> Manage Addresses</span>
                    <ChevronRight size={14} />
                  </button>

                  {isAdmin && (
                    <Link to="/admin" className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-accent hover:bg-muted transition-colors">
                      <span className="flex items-center gap-2"><Shield size={16} /> Admin Panel</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}

                  <button onClick={() => navigate("/logout")}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-muted transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* ── Content area ── */}
            <div className="flex-1">

              {/* Personal Information */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-card-foreground">Personal Information</h2>
                    <button
                      onClick={() => editMode ? handleSave() : setEditMode(true)}
                      className="rounded-lg bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
                      {editMode ? "Save" : "Edit"}
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Full Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} disabled={!editMode}
                        className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-60" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                      <input value={user.email || ""} disabled
                        className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-60" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Phone</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editMode}
                        className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-60" />
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                    <Link to="/orders"
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      <Package size={15} /> View My Orders
                    </Link>
                    <button onClick={() => setActiveTab("addresses")}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      <MapPin size={15} /> Manage Addresses
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Addresses */}
              {activeTab === "addresses" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <h2 className="text-lg font-bold text-card-foreground">Manage Addresses</h2>
                  {addresses.map((addr) => (
                    <div key={addr.id} className="rounded-2xl bg-card p-4 shadow-sm border border-border/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{addr.type}</span>
                          <p className="mt-1 text-sm font-bold text-card-foreground">
                            {addr.name} <span className="ml-2 font-normal text-muted-foreground">{addr.phone}</span>
                          </p>
                          <p className="mt-1 text-sm text-card-foreground">
                            {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                        </div>
                        <button onClick={() => removeAddress(addr.id)} className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">No addresses saved yet.</p>
                  )}
                </motion.div>
              )}
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Profile;