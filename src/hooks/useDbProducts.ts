import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  reviews_count: number;
  image: string;
  images: string[];
  brand: string;
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  highlights: string[];
  in_stock: boolean;
}

export const useDbProducts = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("approval_status", "approved")
          .order("created_at", { ascending: false });
        setProducts((data || []) as DbProduct[]);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { products, loading };
};
