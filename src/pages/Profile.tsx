import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { useAuth } from "@/contexts/AuthContext";
import { User, MapPin, Package, LogOut, ChevronRight, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, profile, isAuthenticated, isAdmin, logout, updateProfile, removeAddress, addresses, orders } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleSave = async () => {
    await updateProfile({ full_name: name, phone });
    setEditMode(false);
    toast.success("Profile updated!");
  };

  const statusColor: Record<string, string> = {
    delivered: "text-flipkart-green",
    shipped: "text-primary",
    processing: "text-flipkart-orange",
    cancelled: "text-destructive",
    confirmed: "text-primary",
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row">
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
                  {[
                    { id: "profile" as const, icon: User, label: "My Profile" },
                    { id: "orders" as const, icon: Package, label: "My Orders" },
                    { id: "addresses" as const, icon: MapPin, label: "Manage Addresses" },
                  ].map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${activeTab === item.id ? "bg-primary/10 font-bold text-primary" : "text-card-foreground hover:bg-muted"}`}>
                      <span className="flex items-center gap-2"><item.icon size={16} />{item.label}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                  {isAdmin && (
                    <Link to="/admin" className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-accent hover:bg-muted">
                      <span className="flex items-center gap-2"><Shield size={16} /> Admin Panel</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                  <button onClick={async () => { await logout(); navigate("/"); toast.success("Logged out!"); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-muted">
                    <LogOut size={16} /> Logout
                  </button>
                </nav>
              </div>
            </div>

            <div className="flex-1">
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-card-foreground">Personal Information</h2>
                    <button onClick={() => editMode ? handleSave() : setEditMode(true)}
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
                      <input value={user.email || ""} disabled className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-60" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Phone</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editMode}
                        className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-60" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <h2 className="text-lg font-bold text-card-foreground">My Orders</h2>
                  {orders.length === 0 && <p className="py-12 text-center text-muted-foreground">No orders yet. Start shopping!</p>}
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-card p-4 shadow-sm border border-border/50">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-xs text-muted-foreground">#{order.order_number} • {new Date(order.created_at).toLocaleDateString()}</span>
                        <span className={`text-xs font-bold uppercase ${statusColor[order.status] || "text-muted-foreground"}`}>{order.status}</span>
                      </div>
                      {order.items?.map((item, i) => (
                        <div key={i} className="mt-3 flex items-center gap-3">
                          {item.product_image && <img src={item.product_image} alt="" className="h-14 w-14 rounded-xl object-cover" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-card-foreground">₹{item.price.toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                        <span className="text-sm text-muted-foreground">Total: <b className="text-card-foreground">₹{Number(order.total_amount).toLocaleString()}</b></span>
                        <Link to={`/order-tracking/${order.order_number}`} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                          <Truck size={12} /> Track Order
                        </Link>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <h2 className="text-lg font-bold text-card-foreground">Manage Addresses</h2>
                  {addresses.map((addr) => (
                    <div key={addr.id} className="rounded-2xl bg-card p-4 shadow-sm border border-border/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{addr.type}</span>
                          <p className="mt-1 text-sm font-bold text-card-foreground">{addr.name} <span className="ml-2 font-normal text-muted-foreground">{addr.phone}</span></p>
                          <p className="mt-1 text-sm text-card-foreground">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        <button onClick={() => removeAddress(addr.id)} className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No addresses saved yet.</p>}
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
