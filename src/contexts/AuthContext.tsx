import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

// ... (keep all interfaces same as before)

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "futurecart@gmail.com";

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

  const checkAdmin = useCallback((userEmail: string | undefined) => {
    setIsAdmin(userEmail === ADMIN_EMAIL);
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
        checkAdmin(u.email);
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
        checkAdmin(u.email);
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

  // 🔥 BULLETPROOF LOGOUT
  const logout = async () => {
    try {
      // 1. Call Supabase signOut (but don't rely on it)
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase signOut error:", err);
    }
    
    // 2. Manually remove all Supabase-related storage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes("supabase") || key.includes("sb-"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Also clear sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes("supabase") || key.includes("sb-"))) {
        sessionStorage.removeItem(key);
      }
    }
    
    // 3. Reset all React state immediately
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setAddresses([]);
    setOrders([]);
    
    // 4. Force a full page reload and redirect to home
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