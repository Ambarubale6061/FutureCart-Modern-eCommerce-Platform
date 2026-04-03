import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, MapPin, Clock, ArrowLeft } from "lucide-react";

interface TrackingEvent {
  id: string;
  status: string;
  description: string | null;
  location: string | null;
  created_at: string;
}

interface OrderInfo {
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  address: any;
}

const statusSteps = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: Package },
];

const OrderTracking = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (orderData) {
        setOrder(orderData as any);
        const { data: trackingData } = await supabase
          .from("order_tracking")
          .select("*")
          .eq("order_id", orderData.id)
          .order("created_at", { ascending: true });
        setTracking((trackingData || []) as TrackingEvent[]);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderNumber]);

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order?.status);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[800px] px-4 py-6">
          <Link to="/profile" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft size={14} /> Back to Orders
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : !order ? (
            <div className="py-20 text-center">
              <Package size={60} className="mx-auto text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">Order not found</p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-bold text-card-foreground">Order #{order.order_number}</h1>
                    <p className="text-sm text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">{order.status}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, i) => {
                      const isActive = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      return (
                        <div key={step.key} className="flex flex-1 flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isCurrent ? 1.15 : 1 }}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted text-muted-foreground"}`}
                          >
                            <step.icon size={18} />
                          </motion.div>
                          <p className={`mt-2 text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{step.label}</p>
                          {i < statusSteps.length - 1 && (
                            <div className={`absolute h-0.5 w-full ${isActive ? "bg-primary" : "bg-muted"}`} style={{ display: "none" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex">
                    {statusSteps.slice(0, -1).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full mx-1 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {tracking.length > 0 && (
                <div className="mt-4 rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                  <h2 className="mb-4 text-sm font-bold text-card-foreground">Tracking History</h2>
                  <div className="space-y-4">
                    {tracking.map((event, i) => (
                      <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${i === tracking.length - 1 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                          {i < tracking.length - 1 && <div className="w-0.5 flex-1 bg-muted" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium text-card-foreground capitalize">{event.status.replace(/_/g, " ")}</p>
                          {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                          {event.location && <p className="text-xs text-muted-foreground">📍 {event.location}</p>}
                          <p className="mt-1 text-[10px] text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-right text-sm font-bold text-card-foreground">
                Total: ₹{Number(order.total_amount).toLocaleString()}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default OrderTracking;
