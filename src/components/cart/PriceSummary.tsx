import { useCart } from "@/contexts/CartContext";

const PriceSummary = () => {
  const { totalItems, totalPrice, totalOriginalPrice, totalDiscount } = useCart();
  const deliveryCharge = totalPrice > 499 ? 0 : 40;

  return (
    <div className="rounded bg-card p-4 shadow-sm">
      <h3 className="mb-3 border-b pb-2 text-sm font-bold uppercase text-muted-foreground">
        Price Details
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-card-foreground">
          <span>Price ({totalItems} items)</span>
          <span>₹{totalOriginalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-flipkart-green">
          <span>Discount</span>
          <span>−₹{totalDiscount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-card-foreground">
          <span>Delivery Charges</span>
          <span className={deliveryCharge === 0 ? "text-flipkart-green" : ""}>
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
          </span>
        </div>
        <div className="flex justify-between border-t border-dashed pt-3 text-base font-bold text-card-foreground">
          <span>Total Amount</span>
          <span>₹{(totalPrice + deliveryCharge).toLocaleString()}</span>
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-flipkart-green">
        You will save ₹{totalDiscount.toLocaleString()} on this order
      </p>
    </div>
  );
};

export default PriceSummary;
