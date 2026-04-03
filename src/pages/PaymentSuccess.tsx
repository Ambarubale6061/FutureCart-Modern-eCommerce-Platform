import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderNumber = params.get("order") || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[600px] px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-10 text-center shadow-lg border border-border/50">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <CheckCircle size={80} className="mx-auto text-flipkart-green" />
          </motion.div>
          <h1 className="mt-6 text-2xl font-bold text-card-foreground">Payment Successful!</h1>
          <p className="mt-2 text-muted-foreground">Your payment has been processed successfully.</p>
          <div className="mt-4 rounded-xl bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-lg font-bold text-primary">{orderNumber}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to={`/order-tracking/${orderNumber}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
              <Package size={16} /> Track Order
            </Link>
            <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium text-card-foreground">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
