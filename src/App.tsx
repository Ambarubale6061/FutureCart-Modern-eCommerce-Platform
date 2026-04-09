import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import ChatBot from "@/components/ChatBot";
import ScrollToTop from "@/components/ScrollToTop";
import BackToTop from "@/components/BackToTop";

import Index          from "./pages/Index";
import ProductListing from "./pages/ProductListing";
import ProductDetail  from "./pages/ProductDetail";
import Cart           from "./pages/Cart";
import Wishlist       from "./pages/Wishlist";
import SearchResults  from "./pages/SearchResults";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import Profile        from "./pages/Profile";
import Checkout       from "./pages/Checkout";
import OrderTracking  from "./pages/OrderTracking";
import OrderHistory   from "./pages/OrderHistory";   // ← NEW
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import NotFound       from "./pages/NotFound";
import Logout         from "@/pages/Logout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <div className="flex flex-col min-h-screen">
                    <Routes>
                      <Route path="/"                              element={<Index />}          />
                      <Route path="/products"                      element={<ProductListing />} />
                      <Route path="/product/:id"                   element={<ProductDetail />}  />
                      <Route path="/cart"                          element={<Cart />}            />
                      <Route path="/wishlist"                      element={<Wishlist />}        />
                      <Route path="/search"                        element={<SearchResults />}  />
                      <Route path="/login"                         element={<Login />}           />
                      <Route path="/logout"                        element={<Logout />}          />
                      <Route path="/signup"                        element={<Signup />}          />
                      <Route path="/profile"                       element={<Profile />}         />
                      <Route path="/orders"                        element={<OrderHistory />}   /> {/* NEW */}
                      <Route path="/checkout"                      element={<Checkout />}        />
                      <Route path="/order-tracking/:orderNumber"   element={<OrderTracking />}  />
                      <Route path="/payment-success"               element={<PaymentSuccess />} />
                      <Route path="/admin"                         element={<AdminDashboard />} />
                      <Route path="/seller"                        element={<SellerDashboard />}/>
                      <Route path="*"                              element={<NotFound />}        />
                    </Routes>
                  </div>
                  <ChatBot />
                  <BackToTop />
                </BrowserRouter>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ProductsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;