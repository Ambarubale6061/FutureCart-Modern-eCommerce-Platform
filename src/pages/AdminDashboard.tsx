import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Shield, Package, Users, ShoppingCart, TrendingUp, Eye, Plus, Pencil, Trash2, Upload, X, ImageIcon, CheckCircle, XCircle, Clock, Loader2, LogOut, MapPin } from "lucide-react";
import { toast } from "sonner";
import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  user_id: string;
  payment_method: string | null;
}

interface AdminProfile {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface DBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount: number;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  images: string[];
  in_stock: boolean;
  created_at: string;
  approval_status?: string;
  seller_name?: string | null;
  seller_email?: string | null;
}

const emptyProduct = {
  name: "", description: "", price: 0, original_price: 0, discount: 0,
  category: "", subcategory: "", brand: "", image: "", images: [] as string[],
  in_stock: true, highlights: [] as string[], specs: {} as Record<string, string>,
};

const OrderRow = ({ order, updateOrderStatus, addTrackingUpdate }: { order: AdminOrder; updateOrderStatus: (id: string, status: string) => Promise<void>; addTrackingUpdate: (id: string, status: string, desc: string, loc: string) => Promise<void> }) => {
  const [showTracking, setShowTracking] = useState(false);
  const [trackDesc, setTrackDesc] = useState("");
  const [trackLoc, setTrackLoc] = useState("");
  const [trackStatus, setTrackStatus] = useState(order.status);

  const statusColor = order.status === "delivered" ? "bg-flipkart-green/10 text-flipkart-green" : order.status === "processing" ? "bg-flipkart-orange/10 text-flipkart-orange" : "bg-primary/10 text-primary";

  return (
    <div className="rounded-2xl bg-card border border-border/40 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-card-foreground">#{order.order_number}</p>
          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()} · {order.payment_method || "N/A"}</p>
        </div>
        <p className="text-sm font-bold text-card-foreground">₹{Number(order.total_amount).toLocaleString()}</p>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusColor}`}>{order.status}</span>
        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
          className="rounded-xl border bg-background px-2 py-1.5 text-xs text-foreground">
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Button variant="outline" size="sm" onClick={() => setShowTracking(!showTracking)} className="gap-1 text-xs">
          <MapPin size={12} /> {showTracking ? "Hide" : "Add"} Tracking
        </Button>
      </div>
      {showTracking && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 border-t border-border pt-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-medium text-muted-foreground">Status</label>
              <select value={trackStatus} onChange={(e) => setTrackStatus(e.target.value)}
                className="w-full rounded-lg border bg-background px-2 py-1.5 text-xs">
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-muted-foreground">Description</label>
              <Input value={trackDesc} onChange={(e) => setTrackDesc(e.target.value)} placeholder="e.g. Package dispatched" className="text-xs h-8" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-muted-foreground">Location</label>
              <Input value={trackLoc} onChange={(e) => setTrackLoc(e.target.value)} placeholder="e.g. Mumbai Hub" className="text-xs h-8" />
            </div>
          </div>
          <Button size="sm" className="mt-2" onClick={async () => {
            await addTrackingUpdate(order.id, trackStatus, trackDesc, trackLoc);
            setTrackDesc(""); setTrackLoc(""); setShowTracking(false);
          }}>
            Add Tracking Update
          </Button>
        </motion.div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { isAdmin, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "users" | "products" | "approvals">("overview");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, pendingOrders: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
      toast.error("Access denied. Admin only.");
    }
  }, [isAdmin, isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [{ data: ordersData, error: oErr }, { data: usersData, error: uErr }, { data: productsData, error: pErr }] = await Promise.all([
          supabase.from("orders").select("*").order("created_at", { ascending: false }),
          supabase.from("profiles").select("*").order("created_at", { ascending: false }),
          supabase.from("products").select("*").order("created_at", { ascending: false }),
        ]);
        if (oErr) toast.error("Failed to load orders");
        if (uErr) toast.error("Failed to load users");
        if (pErr) toast.error("Failed to load products");

        const allOrders = (ordersData || []) as AdminOrder[];
        const allUsers = (usersData || []) as AdminProfile[];
        setOrders(allOrders);
        setUsers(allUsers);
        setProducts((productsData || []) as DBProduct[]);
        setStats({
          totalOrders: allOrders.length,
          totalRevenue: allOrders.reduce((s, o) => s + Number(o.total_amount), 0),
          totalUsers: allUsers.length,
          pendingOrders: allOrders.filter((o) => o.status === "processing").length,
        });
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      if (error) throw error;
      await supabase.from("order_tracking").insert({ order_id: orderId, status: newStatus, description: `Order ${newStatus}` });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast.success(`Order updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order");
    }
  };

  const addTrackingUpdate = async (orderId: string, status: string, description: string, location: string) => {
    try {
      const { error } = await supabase.from("order_tracking").insert({ order_id: orderId, status, description, location });
      if (error) throw error;
      toast.success("Tracking update added!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add tracking");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast.error("Upload failed: " + error.message); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    if (urls.length) {
      setForm((f) => ({ ...f, images: [...f.images, ...urls], image: f.image || urls[0] }));
      toast.success(`${urls.length} image(s) uploaded`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setForm((f) => {
      const newImages = f.images.filter((_, i) => i !== idx);
      return { ...f, images: newImages, image: newImages[0] || "" };
    });
  };

  const openAddForm = () => { setEditingId(null); setForm(emptyProduct); setShowForm(true); };

  const openEditForm = (p: DBProduct) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, original_price: p.original_price, discount: p.discount, category: p.category, subcategory: p.subcategory, brand: p.brand, image: p.image, images: p.images || [], in_stock: p.in_stock, highlights: [], specs: {} });
    setShowForm(true);
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price: form.price, original_price: form.original_price, discount: form.discount, category: form.category, subcategory: form.subcategory, brand: form.brand, image: form.image, images: form.images, in_stock: form.in_stock, highlights: form.highlights, specs: form.specs };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
        toast.success("Product updated");
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select().single();
        if (error) throw error;
        setProducts((prev) => [data as DBProduct, ...prev]);
        toast.success("Product added");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  const approveProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").update({ approval_status: "approved" } as any).eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, approval_status: "approved" } : x)));
      toast.success("Product approved!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve");
    }
  };

  const rejectProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((x) => x.id !== id));
      toast.success("Product rejected and removed");
    } catch (err: any) {
      toast.error(err?.message || "Failed to reject");
    }
  };

  const selectedCategory = categories.find((c) => c.id === form.category);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (!isAdmin) return null;

  const pendingCount = products.filter((p) => p.approval_status === "pending").length;

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-primary/10 text-primary" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-flipkart-green/10 text-flipkart-green" },
    { label: "Users", value: stats.totalUsers, icon: Users, color: "bg-accent/10 text-accent" },
    { label: "Pending", value: stats.pendingOrders, icon: Package, color: "bg-flipkart-orange/10 text-flipkart-orange" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage orders, users, products, and platform activities</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-destructive border-destructive/30">
            <LogOut size={14} /> Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-card p-5 shadow-sm border border-border/40">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-card-foreground">{dataLoading ? "..." : card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {[
            { id: "overview" as const, label: "Overview", icon: Eye },
            { id: "orders" as const, label: "Orders", icon: Package },
            { id: "users" as const, label: "Users", icon: Users },
            { id: "products" as const, label: "Products", icon: ShoppingCart },
            { id: "approvals" as const, label: `Approvals (${pendingCount})`, icon: Clock },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-muted-foreground hover:bg-muted border border-border/40"}`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/40">
                  <h3 className="mb-3 text-sm font-bold text-card-foreground">Recent Orders</h3>
                  {orders.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>}
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
                      <div>
                        <p className="text-xs font-medium text-card-foreground">#{o.order_number}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-card-foreground">₹{Number(o.total_amount).toLocaleString()}</p>
                        <span className={`text-[10px] font-bold uppercase ${o.status === "delivered" ? "text-flipkart-green" : o.status === "processing" ? "text-flipkart-orange" : "text-primary"}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/40">
                  <h3 className="mb-3 text-sm font-bold text-card-foreground">Recent Users</h3>
                  {users.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No users yet</p>}
                  {users.slice(0, 5).map((u) => (
                    <div key={u.user_id} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                        {(u.full_name || "U")[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-card-foreground">{u.full_name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {orders.length === 0 && <p className="py-12 text-center text-muted-foreground">No orders yet</p>}
                {orders.map((o) => (
                  <OrderRow key={o.id} order={o} updateOrderStatus={updateOrderStatus} addTrackingUpdate={addTrackingUpdate} />
                ))}
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card shadow-sm border border-border/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground">User</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                {(u.full_name || "U")[0]?.toUpperCase()}
                              </div>
                              <span className="font-medium text-card-foreground">{u.full_name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{u.phone || "N/A"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <p className="py-12 text-center text-muted-foreground">No users yet</p>}
                </div>
              </motion.div>
            )}

            {activeTab === "products" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {showForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-xl border border-border">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-card-foreground">{editingId ? "Edit Product" : "Add New Product"}</h3>
                        <button onClick={() => setShowForm(false)} className="rounded-xl p-1.5 hover:bg-muted transition-colors"><X size={18} /></button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Product Name *</label>
                          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. iPhone 15 Pro" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={3} placeholder="Product description..." />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Price (₹) *</label>
                          <Input type="number" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Original Price (₹)</label>
                          <Input type="number" value={form.original_price || ""} onChange={(e) => setForm((f) => ({ ...f, original_price: Number(e.target.value) }))} />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Discount (%)</label>
                          <Input type="number" value={form.discount || ""} onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))} />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Brand</label>
                          <Input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} placeholder="e.g. Apple" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
                          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, subcategory: "" }))}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select category</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Subcategory</label>
                          <select value={form.subcategory} onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))}
                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" disabled={!selectedCategory}>
                            <option value="">Select subcategory</option>
                            {selectedCategory?.subcategories.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))} id="inStock" className="h-4 w-4 rounded border-input" />
                          <label htmlFor="inStock" className="text-sm text-card-foreground">In Stock</label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="mb-2 block text-xs font-medium text-muted-foreground">Product Images</label>
                        <div className="flex flex-wrap gap-3">
                          {form.images.map((img, i) => (
                            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-border">
                              <img src={img} alt="" className="h-full w-full object-cover" />
                              <button onClick={() => removeImage(i)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                <Trash2 size={14} className="text-white" />
                              </button>
                              {form.image === img && <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-center text-[9px] text-primary-foreground">Main</span>}
                            </div>
                          ))}
                          <button onClick={() => fileRef.current?.click()} disabled={uploading}
                            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={16} /><span className="text-[9px]">Upload</span></>}
                          </button>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </div>
                      <div className="mt-6 flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        <Button onClick={saveProduct} disabled={saving}>
                          {saving ? <><Loader2 size={14} className="animate-spin mr-1" /> Saving...</> : editingId ? "Update Product" : "Add Product"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{products.filter((p) => p.approval_status !== "pending").length} approved product(s)</p>
                  <Button onClick={openAddForm} size="sm" className="gap-2 rounded-xl"><Plus size={14} /> Add Product</Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.filter((p) => p.approval_status !== "pending").map((p) => (
                    <div key={p.id} className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="relative aspect-square bg-muted/30">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground"><ImageIcon size={40} /></div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => openEditForm(p)} className="rounded-xl bg-card p-2 shadow hover:bg-muted"><Pencil size={14} /></button>
                          <button onClick={() => deleteProduct(p.id)} className="rounded-xl bg-destructive p-2 text-destructive-foreground shadow hover:bg-destructive/90"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-card-foreground line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-card-foreground">₹{Number(p.price).toLocaleString()}</span>
                          {p.original_price > p.price && <span className="text-xs text-muted-foreground line-through">₹{Number(p.original_price).toLocaleString()}</span>}
                        </div>
                        <span className={`mt-1 inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold ${p.in_stock ? "bg-flipkart-green/10 text-flipkart-green" : "bg-destructive/10 text-destructive"}`}>
                          {p.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {products.filter((p) => p.approval_status !== "pending").length === 0 && (
                  <div className="mt-8 flex flex-col items-center gap-3 text-muted-foreground">
                    <Package size={48} strokeWidth={1} />
                    <p className="text-sm">No products yet. Click "Add Product" to get started.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "approvals" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="mb-4 text-sm font-bold text-card-foreground">Seller Product Submissions</h3>
                {(() => {
                  const pendingProducts = products.filter((p) => p.approval_status === "pending");
                  if (pendingProducts.length === 0) return (
                    <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                      <CheckCircle size={48} strokeWidth={1} />
                      <p className="text-sm">No pending approvals</p>
                    </div>
                  );
                  return (
                    <div className="space-y-3">
                      {pendingProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-card border border-border/40 p-4 shadow-sm">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted/30">
                            {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><ImageIcon size={24} className="text-muted-foreground" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-card-foreground line-clamp-1">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand} · {p.category} · ₹{Number(p.price).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">Seller: {p.seller_name || "Unknown"} ({p.seller_email || "N/A"})</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => approveProduct(p.id)} className="flex items-center gap-1 rounded-xl bg-flipkart-green px-3 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity">
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => rejectProduct(p.id)} className="flex items-center gap-1 rounded-xl bg-destructive px-3 py-2 text-xs font-bold text-destructive-foreground hover:opacity-90 transition-opacity">
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
