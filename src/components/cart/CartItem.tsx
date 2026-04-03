import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 border-b py-4 last:border-0">
      <Link to={`/product/${product.id}`} className="h-24 w-24 flex-shrink-0">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
      </Link>
      <div className="flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-card-foreground hover:text-primary">{product.name}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.brand}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-base font-bold text-card-foreground">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
          <span className="text-xs font-medium text-flipkart-green">{product.discount}% off</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center rounded border">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-muted"
            >
              <Minus size={14} />
            </button>
            <span className="flex h-7 w-9 items-center justify-center border-x text-sm font-medium text-card-foreground">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:bg-muted"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => removeFromCart(product.id)}
            className="text-xs font-semibold uppercase text-muted-foreground hover:text-destructive"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
