import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Store, Upload, Trash2, Plus, Clock, LogOut } from "lucide-react";
import { toast } from "sonner";
import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const emptyProduct = {
  name: "", description: "", price: 0, original_price: 0, discount: 0,
  category: "", subcategory: "", brand: "", image: "", images: [] as string[],
  in_stock: true, highlights: [] as string[], specs: {} as Record<string, string>,
};

const SellerDashboard = () => {
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState<{ name: string; status: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const selectedCategory = categories.find((c) => c.id === form.category);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `seller/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
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

  const submitProduct = async () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name: form.name, description: form.description, price: form.price,
      original_price: form.original_price, discount: form.discount,
      category: form.category, subcategory: form.subcategory, brand: form.brand,
      image: form.image, images: form.images, in_stock: form.in_stock,
      highlights: form.highlights, specs: form.specs,
      approval_status: "pending", seller_name: sellerName, seller_email: sellerEmail,
    } as any);
    if (error) { toast.error(error.message); setSaving(false); return; }
    setSubmitted((prev) => [{ name: form.name, status: "pending" }, ...prev]);
    setForm(emptyProduct);
    toast.success("Product submitted for admin approval!");
    setSaving(false);
  };

  const handleLogout = () => {
    setIsRegistered(false);
    setSellerName("");
    setSellerEmail("");
    setSubmitted([]);
    setForm(emptyProduct);
    toast.success("Logged out from Seller Dashboard!");
    navigate("/");
  };

  if (!isRegistered) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex items-center justify-center px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
              <div className="overflow-hidden rounded-2xl shadow-2xl border border-border/50">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Store size={28} className="text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Seller Portal</h2>
                  <p className="mt-1 text-sm text-white/80">Start selling on FutureCart today</p>
                </div>
                <div className="bg-card p-8">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Your Name *</label>
                      <Input value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Your Email *</label>
                      <Input type="email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} placeholder="Enter your email" />
                    </div>
                    <p className="text-xs text-muted-foreground">No account needed. Just enter your details to start adding products.</p>
                    <motion.button whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!sellerName || !sellerEmail) { toast.error("Please fill all fields"); return; }
                        setIsRegistered(true);
                      }}
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 text-sm font-bold text-white shadow-lg transition-all">
                      Continue to Seller Dashboard
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
          <Footer />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white">
                <Store size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Seller Dashboard</h1>
                <p className="text-xs text-muted-foreground">Welcome, {sellerName}! Add products for admin approval.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-destructive border-destructive/30">
              <LogOut size={14} /> Logout
            </Button>
          </div>

          {submitted.length > 0 && (
            <div className="mb-6 rounded-2xl bg-card p-4 border border-border/50">
              <h3 className="mb-3 text-sm font-bold text-card-foreground">Your Submissions</h3>
              {submitted.map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                  <span className="text-sm text-card-foreground">{s.name}</span>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    <Clock size={10} /> Pending Approval
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-card p-6 border border-border/50 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-card-foreground">
              <Plus size={18} /> Add New Product
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Product Name *</label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. iPhone 15 Pro" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={3} placeholder="Product description..." />
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
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Subcategory</label>
                <select value={form.subcategory} onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" disabled={!selectedCategory}>
                  <option value="">Select subcategory</option>
                  {selectedCategory?.subcategories.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))} id="sellerInStock" className="h-4 w-4 rounded border-input" />
                <label htmlFor="sellerInStock" className="text-sm text-card-foreground">In Stock</label>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Product Images</label>
              <div className="flex flex-wrap gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl border border-border">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 active:opacity-100 transition-opacity">
                      <Trash2 size={14} className="text-white" />
                    </button>
                    {form.image === img && <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/80 text-center text-[9px] text-white">Main</span>}
                  </div>
                ))}
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground active:border-emerald-500 active:text-emerald-500 transition-colors">
                  {uploading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-5 w-5 rounded-full border-2 border-emerald-500 border-t-transparent" /> : <><Upload size={16} /><span className="text-[9px]">Upload</span></>}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={submitProduct} disabled={saving} className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
                {saving ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default SellerDashboard;
