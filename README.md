# 🛒 FutureCart — Modern eCommerce Platform

<div align="center">

![FutureCart Logo](public/logo.png)

**A full-stack, feature-rich eCommerce platform built with React, TypeScript, and Supabase.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://futurecart-e-commerce.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🌐 Live Demo

> 🔗 [https://futurecart-e-commerce.vercel.app/](https://futurecart-e-commerce.vercel.app/)

---

## 📸 Screenshots

### 🏠 Homepage UI

![Homepage](./public/home.png)

### 🛒 Cart & Checkout

![Cart](./public/cart.png)

---

## ✨ Features

### 🛍️ Shopping Experience

- Product browsing with modern UI
- Advanced filtering (category, price, rating, discount)
- Full-text smart search
- Product detail with image gallery & highlights
- **Ratings & Reviews** — star rating, review form, distribution bars, verified-purchase badges
- Deals, top-rated & trending sections powered by live product data
- Category-based navigation

---

### 🧺 Cart & Checkout

- Persistent cart (Context API)
- Wishlist system
- Smooth checkout flow
- Payment integration via Supabase Edge Function
- Order tracking system with live timeline
- Payment success page

---

### 👤 Auth & User System

- Signup / Login (Supabase Auth)
- Session management
- Profile page with editable personal information
- Saved addresses management
- Recently viewed products tracking

---

### 📦 Order History

- Dedicated `/orders` page (Amazon / Flipkart style)
- Status filter tabs — All, Active, Delivered, Cancelled
- Search orders by number or product name
- Expandable order cards showing all items
- **Track Order** button for active orders
- **Rate** button per item on delivered orders (deep-links to review form)
- Total spent summary footer
- One-click refresh

---

### ⭐ Reviews & Ratings

- Users can rate products 1–5 stars
- Reviews are restricted to verified purchasers (delivered orders only)
- One review per product per order
- Star distribution bar chart on product detail page
- Database trigger auto-updates `products.rating` and `products.reviews_count` on every review change
- Verified-purchase badge on each review
- "Your Review" highlight for the signed-in user's own review

---

### 🧑‍💼 Seller Features

- Seller dashboard — add & manage products
- Image upload to Supabase Storage
- Products enter an approval queue before going live

---

### 🛡️ Admin Features

- **Hidden admin login** — accessible only via `/admin`, completely invisible on the public `/login` page
- Embedded red-themed login form on the `/admin` route itself
- Non-admin accounts see an "Access Denied" screen (no session disruption)
- Full dashboard: overview stats, orders, users, products, seller approvals
- Approve / reject seller-submitted products
- Add tracking updates per order (status, description, location)
- Update order status in real time

---

### ⚡ Real-Time System

- Powered by Supabase Realtime
- Instant UI updates when a product is approved, updated, or deleted
- No manual refresh needed

---

### 🤖 UI & UX Enhancements

- ChatBot integration
- Toast notifications (Sonner)
- Smooth page & element animations (Framer Motion)
- Back-to-top button
- Fully responsive (mobile + desktop)

---

## 🧠 System Architecture

### 🔥 Dynamic Product Engine

FutureCart uses a **fully dynamic Supabase-powered product system**:

- Products stored in Supabase + pre-generated JSON catalogue for instant load
- Sellers add products → admin approves → UI updates in real time
- `ProductsContext` merges both sources and exposes a single `allProducts` array

### 🔄 Real-Time Flow

```
Seller adds product → Admin approves → Supabase event → UI updates instantly
```

### 🔄 Review Flow

```
User buys product → Order delivered → "Rate" button unlocks → Review submitted
→ DB trigger recalculates product rating & review count automatically
```

### 🔐 Admin Access Flow

```
User visits /admin → Embedded login form shown (not on /login)
→ Wrong credentials: error toast
→ Non-admin account: Access Denied screen
→ Admin account: Full dashboard unlocked
```

---

## 🧩 State Management

| Context               | Purpose                             |
| --------------------- | ----------------------------------- |
| AuthContext           | Authentication + orders + addresses |
| CartContext           | Cart state                          |
| WishlistContext       | Wishlist                            |
| ProductsContext       | Merged product catalogue            |
| RecentlyViewedContext | User browsing history               |

---

## 🗄️ Database Schema

| Table             | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `profiles`        | User profile data                            |
| `user_roles`      | Role-based access (admin / moderator / user) |
| `addresses`       | Saved delivery addresses                     |
| `products`        | Product catalogue with approval status       |
| `orders`          | Order records                                |
| `order_items`     | Line items per order                         |
| `order_tracking`  | Per-order tracking timeline events           |
| `product_reviews` | Ratings & reviews (verified purchase only)   |

### Key Database Trigger

```sql
-- Auto-recalculates product rating & review count after every review change
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();
```

---

## 🔐 Authentication

- Powered by Supabase Auth
- Email / password login
- Persistent sessions via localStorage
- Admin detection by email match + `user_roles` table
- Bulletproof logout: clears Supabase tokens + React state + forces page reload

---

## 🛒 Checkout Flow

1. Add product to cart
2. Navigate to checkout
3. Supabase Edge Function triggered
4. Payment processed
5. Order created in DB with items & tracking entry
6. Redirect to `/payment-success`

---

## 📦 Order History Page (`/orders`)

- Accessible from Header → "My Orders" or Profile sidebar
- Filter tabs: **All · Active · Delivered · Cancelled** with live counts
- Search by order number or product name
- Each order card shows: status badge, items (expandable if > 2), payment method, delivery city, total
- Action buttons per order:
  - Active → **Track Order** (`/order-tracking/:orderNumber`)
  - Delivered → **View Details** + per-item **Rate** button
  - Cancelled → status label
- Summary bar: total delivered, total active, total amount spent

---

## ⭐ Reviews & Ratings (Product Detail)

- Rating summary with large average score + star distribution bars
- Write-a-review form gated behind:
  - User must be logged in
  - Order containing the product must have `status = "delivered"`
  - User must not have already reviewed this product for that order
- Star picker with hover labels (Poor / Fair / Good / Very Good / Excellent)
- Optional title and body fields
- Review list with: star row, reviewer name avatar, date, Verified Purchase badge
- Deep-link from Order History: `/product/:id?review=1` auto-scrolls to review section

---

## 🛠 Tech Stack

### Frontend

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Framer Motion

### Backend

- Supabase (Database + Auth + Realtime + Storage + Edge Functions)

### State & Data

- Context API
- TanStack React Query

### UI Libraries

- Radix UI primitives
- Lucide Icons
- Sonner (toasts)

### Testing

- Vitest
- Playwright

---

## 📂 Project Structure

```
src/
 ├── components/
 │   ├── cart/
 │   ├── home/
 │   ├── layout/
 │   ├── product/
 │   ├── products/
 │   └── ui/
 ├── contexts/
 │   ├── AuthContext.tsx
 │   ├── CartContext.tsx
 │   ├── ProductsContext.tsx
 │   ├── RecentlyViewedContext.tsx
 │   └── WishlistContext.tsx
 ├── pages/
 │   ├── AdminDashboard.tsx   ← hidden admin login embedded
 │   ├── Login.tsx            ← user + seller only (admin tab removed)
 │   ├── OrderHistory.tsx     ← NEW — full order history page
 │   ├── ProductDetail.tsx    ← reviews & ratings section added
 │   ├── Profile.tsx
 │   └── ...
 ├── hooks/
 ├── lib/
 ├── integrations/supabase/
 └── data/

supabase/
 ├── functions/create-checkout/
 └── migrations/
     └── 20260409000000_reviews_and_order_history.sql   ← NEW
```

---

## 🚀 Getting Started

### 1. Clone Repo

```bash
git clone https://github.com/your-username/futurecart.git
cd futurecart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 4. Run Migrations

Apply all SQL migration files in order from the `supabase/migrations/` folder via the Supabase dashboard SQL editor or CLI:

```bash
supabase db push
```

> ⚠️ The `20260409000000_reviews_and_order_history.sql` migration must be run before using the Reviews & Ratings feature.

### 5. Run Project

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

---

## 📜 Scripts

| Command           | Description           |
| ----------------- | --------------------- |
| `npm run dev`     | Start dev server      |
| `npm run build`   | Production build      |
| `npm run preview` | Preview build locally |
| `npm run lint`    | Lint code             |
| `npm run test`    | Run unit tests        |

---

## ☁️ Deployment

Deploy easily on:

- **Vercel** (recommended)
- Netlify

Set the environment variables in your deployment dashboard and the app is production-ready.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Ambar Ubale**

- 💼 Full Stack Developer
- 🌐 Portfolio: [https://ambarportfolio.vercel.app/](https://ambarportfolio.vercel.app/)
- 🔗 LinkedIn: [https://www.linkedin.com/in/ambar-ubale-137214230](https://www.linkedin.com/in/ambar-ubale-137214230)

> Passionate about building real-world scalable apps & modern UI experiences.

---

🔥 _FutureCart is a modern, scalable, real-time eCommerce platform built for production-level applications._
