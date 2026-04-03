import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  is_default: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  discount_amount: number;
  delivery_charge: number;
  status: string;
  payment_method: string | null;
  address: any;
  items?: { product_name: string; price: number; quantity: number; product_image: string | null }[];
}

export interface Profile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: SupaUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  addresses: Address[];
  orders: Order[];
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    if (data) setProfile({ full_name: data.full_name, phone: data.phone, avatar_url: data.avatar_url });
  }, []);

  const checkAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    setIsAdmin(!!data);
  }, []);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setAddresses(data as Address[]);
  }, [user]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (ordersData) {
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: items } = await supabase
            .from("order_items")
            .select("product_name, price, quantity, product_image")
            .eq("order_id", order.id);
          return { ...order, items: items || [] } as Order;
        })
      );
      setOrders(ordersWithItems);
    }
  }, [user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        await fetchProfile(u.id);
        await checkAdmin(u.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setAddresses([]);
        setOrders([]);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u.id);
        checkAdmin(u.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, checkAdmin]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchOrders();
    }
  }, [user, fetchAddresses, fetchOrders]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    await supabase.from("profiles").update(updates).eq("user_id", user.id);
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const addAddress = async (address: Omit<Address, "id">) => {
    if (!user) return;
    await supabase.from("addresses").insert({ ...address, user_id: user.id });
    await fetchAddresses();
  };

  const removeAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AuthContext.Provider value={{
      user, profile, isAuthenticated: !!user, isAdmin, loading,
      addresses, orders, login, signup, logout, updateProfile,
      addAddress, removeAddress, fetchOrders, fetchAddresses,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
