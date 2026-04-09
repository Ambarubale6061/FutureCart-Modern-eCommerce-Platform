import {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

/* ─── Exported types (used by OrderHistory, Profile, etc.) ─── */
export interface Profile {
  full_name:  string | null;
  phone:      string | null;
  avatar_url: string | null;
}

export interface Address {
  id:         string;
  name:       string;
  phone:      string;
  street:     string;
  city:       string;
  state:      string;
  pincode:    string;
  type:       string;
  is_default: boolean;
}

export interface OrderItem {
  product_id:    string;
  product_name:  string;
  price:         number;
  quantity:      number;
  product_image: string | null;
}

export interface Order {
  id:               string;
  order_number:     string;
  status:           string;
  total_amount:     number;
  discount_amount:  number;
  delivery_charge:  number;
  payment_method:   string | null;
  address:          any;
  created_at:       string;
  updated_at:       string;
  items?:           OrderItem[];
}

interface AuthContextType {
  user:            SupaUser | null;
  profile:         Profile | null;
  isAuthenticated: boolean;
  isAdmin:         boolean;
  loading:         boolean;
  addresses:       Address[];
  orders:          Order[];
  login:           (email: string, password: string) => Promise<{ error?: string }>;
  signup:          (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout:          () => Promise<void>;
  updateProfile:   (updates: Partial<Profile>) => Promise<void>;
  addAddress:      (address: Omit<Address, "id">) => Promise<void>;
  removeAddress:   (id: string) => Promise<void>;
  fetchOrders:     () => Promise<void>;
  fetchAddresses:  () => Promise<void>;
}

/* ─── Constants ─── */
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_EMAIL = "futurecart@gmail.com";

/* ─── Provider ─── */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUser]      = useState<SupaUser | null>(null);
  const [profile,   setProfile]   = useState<Profile | null>(null);
  const [isAdmin,   setIsAdmin]   = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders,    setOrders]    = useState<Order[]>([]);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles").select("*").eq("user_id", userId).single();
    if (data) setProfile({ full_name: data.full_name, phone: data.phone, avatar_url: data.avatar_url });
  }, []);

  const checkAdmin = useCallback((email: string | undefined) => {
    setIsAdmin(email === ADMIN_EMAIL);
  }, []);

  const fetchAddresses = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    const { data } = await supabase
      .from("addresses").select("*").eq("user_id", u.id)
      .order("created_at", { ascending: false });
    if (data) setAddresses(data as Address[]);
  }, []);

  const fetchOrders = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    const { data: ordersData } = await supabase
      .from("orders").select("*")
      .eq("user_id", u.id)
      .order("created_at", { ascending: false });
    if (!ordersData) return;

    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("product_id, product_name, price, quantity, product_image")
          .eq("order_id", order.id);
        return { ...order, items: items || [] } as Order;
      })
    );
    setOrders(ordersWithItems);
  }, []);

  /* ─── Auth state listener ─── */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          await fetchProfile(u.id);
          checkAdmin(u.email);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setAddresses([]);
          setOrders([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) { fetchProfile(u.id); checkAdmin(u.email); }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, checkAdmin]);

  useEffect(() => {
    if (user) { fetchAddresses(); fetchOrders(); }
  }, [user, fetchAddresses, fetchOrders]);

  /* ─── Auth actions ─── */
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    try { await supabase.auth.signOut(); } catch { /* intentional */ }

    // Clear all supabase storage
    [localStorage, sessionStorage].forEach((store) => {
      const keys: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k && (k.includes("supabase") || k.includes("sb-"))) keys.push(k);
      }
      keys.forEach((k) => store.removeItem(k));
    });

    setUser(null); setProfile(null); setIsAdmin(false);
    setAddresses([]); setOrders([]);
    window.location.replace("/");
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
      addresses, orders,
      login, signup, logout, updateProfile,
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