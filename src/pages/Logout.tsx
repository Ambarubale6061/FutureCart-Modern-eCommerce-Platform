import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    const hardLogout = () => {
      // Clear everything in localStorage
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        allKeys.push(localStorage.key(i));
      }
      allKeys.forEach(key => {
        if (key && (key.includes("supabase") || key.includes("sb-") || key.includes("auth"))) {
          localStorage.removeItem(key);
        }
      });
      
      // Also clear all sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes("supabase") || key.includes("sb-") || key.includes("auth"))) {
          sessionStorage.removeItem(key);
        }
      }
      
      // Kill any cookies that might contain auth (optional)
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Force a hard reload to the home page, adding a random param to bypass cache
      window.location.href = "/?t=" + Date.now();
    };
    
    // Execute after a tiny delay to ensure any pending operations are cancelled
    const timer = setTimeout(hardLogout, 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Logging out, please wait...</p>
      </div>
    </div>
  );
};

export default Logout;