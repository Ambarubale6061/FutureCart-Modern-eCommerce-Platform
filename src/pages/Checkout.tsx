import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Step = "address" | "payment" | "confirmation";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, addresses, addAddress } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("address");
  const [selectedAddress, setSelectedAddress] = useState(addresses?.[0]?.id || "");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderNumber] = useState("ORD-" + Date.now().toString(36).toUpperCase());
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "", type: "home", is_default: false });
  const [showNewAddr, setShowNewAddr] = useState(false);

  if (!isAuthenticated) { navigate("/login"); return null; }
  if (items.length === 0 && step !== "confirmation") { navigate("/cart"); return null; }

  const discount = Math.round(totalPrice * 0.1);
  const delivery = totalPrice > 500 ? 0 : 40;
  const finalTotal = totalPrice - discount + delivery;

  const selectedAddr = addresses.find((a) => a.id === selectedAddress);

  const handleAddAddress = async () => {
    if (!newAddr.name || !newAddr.phone || !newAddr.street || !newAddr.city || !newAddr.state || !newAddr.pincode) {
      toast.error("Fill all address fields"); return;
    }
    await addAddress(newAddr as any);
    setShowNewAddr(false);
    toast.success("Address added!");
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) { toast.error("Select a payment method"); return; }
    setIsProcessing(true);

    try {
      if (paymentMethod === "stripe") {
        // Create Stripe checkout session
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: {
            items: items.map((i) => ({ name: i.product.name, price: i.product.price, quantity: i.quantity, image: i.product.image })),
            address: selectedAddr,
            orderNumber,
          },
        });
        if (error || data?.error) throw new Error(data?.error || error?.message);

        // Create order in DB as pending
        const { data: orderData } = await supabase.from("orders").insert({
          user_id: user!.id,
          order_number: orderNumber,
          status: "processing",
          total_amount: finalTotal,
          discount_amount: discount,
          delivery_charge: delivery,
          payment_method: "stripe",
          stripe_session_id: data.sessionId,
          address: selectedAddr as any,
        }).select().single();

        if (orderData) {
          await supabase.from("order_items").insert(
            items.map((i) => ({
              order_id: orderData.id,
              product_id: i.product.id,
              product_name: i.product.name,
              product_image: i.product.image,
              price: i.product.price,
              quantity: i.quantity,
            }))
          );
        }

        clearCart();
        window.open(data.url, "_blank");
        setStep("confirmation");
      } else {
        // COD or other methods
        const { data: orderData } = await supabase.from("orders").insert({
          user_id: user!.id,
          order_number: orderNumber,
          status: "confirmed",
          total_amount: finalTotal,
          discount_amount: discount,
          delivery_charge: delivery,
          payment_method: paymentMethod,
          address: selectedAddr as any,
        }).select().single();

        if (orderData) {
          await supabase.from("order_items").insert(
            items.map((i) => ({
              order_id: orderData.id,
              product_id: i.product.id,
              product_name: i.product.name,
              product_image: i.product.image,
              price: i.product.price,
              quantity: i.quantity,
            }))
          );
          // Add initial tracking
          await supabase.from("order_tracking").insert({
            order_id: orderData.id,
            status: "confirmed",
            description: "Order has been confirmed",
            location: "FutureCart Warehouse",
          });
        }

        clearCart();
        setStep("confirmation");
        toast.success("Order placed successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const stepVariants = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[900px] px-4 py-6">
        <div className="mb-6 flex items-center justify-center gap-2">
          {[
            { id: "address" as Step, label: "Address", icon: MapPin },
            { id: "payment" as Step, label: "Payment", icon: CreditCard },
            { id: "confirmation" as Step, label: "Done", icon: CheckCircle },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${step === s.id ? "bg-primary text-primary-foreground shadow-lg" : s.id === "confirmation" && step === "confirmation" ? "bg-flipkart-green text-white" : "bg-muted text-muted-foreground"}`}>
                <s.icon size={14} /> {s.label}
              </div>
              {i < 2 && <ChevronRight size={14} className="text-muted-foreground" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "address" && (
            <motion.div key="address" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                <h2 className="mb-4 text-lg font-bold text-card-foreground">Delivery Address</h2>
                {addresses.map((addr) => (
                  <label key={addr.id} className={`mb-3 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${selectedAddress === addr.id ? "border-primary bg-primary/5 shadow-sm" : "border-border"}`}>
                    <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-[hsl(var(--primary))]" />
                    <div>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{addr.type}</span>
                      <p className="mt-1 text-sm font-bold text-card-foreground">{addr.name} <span className="ml-2 font-normal">{addr.phone}</span></p>
                      <p className="text-sm text-card-foreground">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </label>
                ))}
                {showNewAddr ? (
                  <div className="mt-4 space-y-3 rounded-xl border p-4">
                    <h3 className="text-sm font-bold text-card-foreground">Add New Address</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        { key: "name", ph: "Full Name" }, { key: "phone", ph: "Phone" },
                        { key: "street", ph: "Street Address", full: true },
                        { key: "city", ph: "City" }, { key: "state", ph: "State" }, { key: "pincode", ph: "Pincode" },
                      ].map((f) => (
                        <input key={f.key} placeholder={f.ph} value={(newAddr as any)[f.key]}
                          onChange={(e) => setNewAddr({ ...newAddr, [f.key]: e.target.value })}
                          className={`rounded-xl border bg-background px-3 py-2 text-sm text-foreground ${f.full ? "col-span-full" : ""}`} />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddAddress} className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">Save</button>
                      <button onClick={() => setShowNewAddr(false)} className="rounded-xl border px-6 py-2 text-sm text-card-foreground">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowNewAddr(true)} className="mt-2 text-sm font-medium text-primary hover:underline">+ Add a new address</button>
                )}
                <div className="mt-6 flex justify-end">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { if (!selectedAddress) { toast.error("Select an address"); return; } setStep("payment"); }}
                    className="rounded-xl bg-accent px-8 py-3 text-sm font-bold text-accent-foreground shadow-lg">
                    DELIVER HERE
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div key="payment" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1 rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                  <h2 className="mb-4 text-lg font-bold text-card-foreground">Payment Method</h2>
                  {[
                    { id: "stripe", label: "💳 Pay with Stripe", desc: "Credit/Debit Card via Stripe (Secure)" },
                    { id: "cod", label: "💰 Cash on Delivery", desc: "Pay when you receive the order" },
                    { id: "upi", label: "📱 UPI", desc: "GPay, PhonePe, Paytm (Demo)" },
                  ].map((pm) => (
                    <label key={pm.id} className={`mb-3 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${paymentMethod === pm.id ? "border-primary bg-primary/5 shadow-sm" : "border-border"}`}>
                      <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="mt-1 accent-[hsl(var(--primary))]" />
                      <div>
                        <p className="text-sm font-bold text-card-foreground">{pm.label}</p>
                        <p className="text-xs text-muted-foreground">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                  <div className="mt-6 flex gap-2">
                    <button onClick={() => setStep("address")} className="rounded-xl border px-6 py-3 text-sm font-medium text-card-foreground">Back</button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder} disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-bold text-accent-foreground shadow-lg disabled:opacity-50">
                      {isProcessing && <Loader2 size={16} className="animate-spin" />}
                      PLACE ORDER • ₹{finalTotal.toLocaleString()}
                    </motion.button>
                  </div>
                </div>
                <div className="w-full md:w-[300px]">
                  <div className="rounded-2xl bg-card p-4 shadow-sm border border-border/50">
                    <h3 className="mb-3 border-b border-border pb-2 text-sm font-bold uppercase text-muted-foreground">Price Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Price ({items.length} items)</span><span>₹{totalPrice.toLocaleString()}</span></div>
                      <div className="flex justify-between text-flipkart-green"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Delivery</span><span className={delivery === 0 ? "text-flipkart-green" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
                      <div className="flex justify-between border-t border-dashed pt-2 font-bold"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div key="confirmation" variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <div className="flex flex-col items-center rounded-2xl bg-card px-6 py-16 text-center shadow-sm border border-border/50">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <CheckCircle size={80} className="text-flipkart-green" />
                </motion.div>
                <h2 className="mt-4 text-2xl font-bold text-card-foreground">Order Confirmed!</h2>
                <p className="mt-2 text-sm text-muted-foreground">Order <b className="text-primary">{orderNumber}</b> placed successfully</p>
                <div className="mt-6 flex gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate("/")} className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground">Continue Shopping</motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate("/profile")} className="rounded-xl border px-8 py-2.5 text-sm font-medium text-card-foreground">View Orders</motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
