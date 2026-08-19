# BJ'S Natural Care — Website Complete Guide
### All Panels, Menus & Features Explained

---

## 📌 Overview

The BJ'S Natural Care website has **2 main panels**:

| Panel | Who Uses It | URL |
|---|---|---|
| **Customer Storefront** | Shoppers / Customers | `yourwebsite.com/` |
| **Admin Panel** | Owner / Staff / Admin | `yourwebsite.com/admin` |

---

---

# 🛍️ PANEL 1 — CUSTOMER STOREFRONT

This is the main website that customers see and use to browse, shop, and manage their orders.

---

## 🔝 NAVBAR (Top Navigation Bar)

The navbar appears at the **top of every page**, fixed while scrolling. It has a dark glass effect.

### Desktop Navbar Items (Left → Right)

| Item | What It Does |
|---|---|
| **☰ Hamburger icon** | Opens mobile slide-out menu (mobile only) |
| **Logo (BJ'S)** | Clicking logo goes back to Home page |
| **Home** | Goes to homepage |
| **Categories ▼** | Dropdown menu with product categories |
| **About** | Goes to About Us page |
| **Contact** | Goes to Contact page |
| **Shop** | Goes to all products page |
| **🔍 Search icon** | Opens full-screen search overlay |
| **♡ Wishlist icon** | Shows saved/wishlist products (badge shows count) |
| **👤 Account icon** | Goes to Login page (if not logged in) or Account page |
| **🔔 Bell icon** | Notification dropdown (only shown when logged in) |
| **🛍 Cart icon** | Opens cart drawer (badge shows item count) |
| **Admin button** | Only visible to Admin users — goes to Admin panel |

### Categories Dropdown Menu (on hover)

When you hover over **"Categories"**, a dropdown appears:

| Menu Item | Goes To |
|---|---|
| Fragrance | `/shop?category=fragrance` |
| Hair Care | `/shop?category=hair-care` |
| Skin Care | `/shop?category=skin-care` |
| Natural Care | `/shop?category=natural-care` |

---

## 📱 MOBILE MENU (Slide-out Drawer)

On mobile/tablet, the hamburger ☰ opens a drawer from the left side with:

- **BJ'S Logo** at the top
- All navigation links: Home, Categories (+ sub-links), About, Contact, Shop
- Bottom action buttons: Account, Wishlist, Cart, Alerts (if logged in)

---

## 🔍 SEARCH OVERLAY

Clicking the search icon opens a **full-screen search modal**:

- Large text input box (auto-focused)
- **Live suggestions** appear as you type (after 2+ characters):
  - Shows product image, name, category, and price
  - Click any suggestion to go directly to that product
- **Recent Searches** shown when search box is empty (saves last 5 searches)
- "Clear All" button to clear recent searches
- Close button (✕) to dismiss the search

---

## 🛒 CART DRAWER

Clicking the cart icon slides in a **drawer from the right side**:
- Lists all items in cart with images, quantities, prices
- Can update quantities or remove items
- Shows total amount
- "Checkout" button to proceed to payment

---

## 📄 ALL WEBSITE PAGES (Customer)

### 1. 🏠 Home Page — `/`
The main landing page with:
- Hero banner section
- Featured categories
- Featured/new products
- Trust elements (free shipping, secure payment, etc.)
- Promo popups for first-time visitors

---

### 2. 🏪 Shop Page — `/shop`
Browse all products with:
- **Filters**: Category, Price Range, Sort by
- **Search bar** in page
- Product cards showing image, name, price, rating
- Pagination
- Can filter by URL: `/shop?category=fragrance`

---

### 3. 📦 Product Detail Page — `/products/[product-name]`
Individual product page showing:
- Product images (gallery)
- Product name, price, description
- Size/variant options
- Add to Cart button
- Add to Wishlist button
- Product reviews & ratings
- Related products section

---

### 4. 🛒 Cart Page — `/cart`
Full cart page showing:
- All cart items with images, quantities, prices
- Quantity update controls
- Remove item button
- Order summary (subtotal, shipping, total)
- "Proceed to Checkout" button

---

### 5. 💳 Checkout Page — `/checkout` *(Login required)*
Multi-step checkout:
- Step 1: Shipping address (saved addresses or new address)
- Step 2: Delivery method selection
- Step 3: Payment method (UPI, Card, COD)
- Coupon code input
- Order summary review
- Place Order button

---

### 6. ✅ Order Success Page — `/order-success` *(Login required)*
After successful payment:
- Order confirmation message
- Order number display
- "Continue Shopping" and "View My Orders" buttons

---

### 7. 👤 Account Page — `/account` *(Login required)*
Customer profile management:
- Edit personal details (name, email, phone)
- Change password
- Links to Orders and Addresses

---

### 8. 📍 Addresses Page — `/account/addresses` *(Login required)*
- View all saved delivery addresses
- Add new address
- Edit or delete existing addresses
- Set default address

---

### 9. 📋 My Orders Page — `/account/orders` *(Login required)*
- List of all past orders
- Order status badges (Pending, Processing, Shipped, Delivered, etc.)
- Click any order to view full details

---

### 10. 🧾 Order Detail Page — `/account/orders/[id]` *(Login required)*
- Full order information
- Items ordered with images and prices
- Shipping address used
- Payment method
- Track shipment status
- Download Invoice button
- Request Return/Refund option

---

### 11. ♡ Wishlist Page — `/wishlist` *(Login required)*
- All products saved to wishlist
- Add to Cart directly from wishlist
- Remove from wishlist

---

### 12. 📦 Track Order Page — `/track-order`
- Enter Order ID to track without logging in
- Shows current delivery status

---

### 13. ℹ️ About Us Page — `/about`
- Company story, mission, values
- Brand history and philosophy

---

### 14. 📞 Contact Page — `/contact`
- Contact form (Name, Email, Message)
- Phone number, email, address displayed

---

### 15. ❓ FAQ Page — `/faq`
- Frequently asked questions about products, shipping, returns

---

### 16. 🚚 Shipping Policy — `/shipping-policy`
- Delivery timelines, costs, areas served

---

### 17. 🔄 Return Policy — `/return-policy`
- Return & refund rules and process

---

### 18. 🔒 Privacy Policy — `/privacy-policy`
- Data privacy information

---

### 19. 📜 Terms & Conditions — `/terms`
- Legal terms of service

---

## 🔑 AUTH PAGES (Login / Register)

These pages have **no navbar or footer** — clean standalone design.

| Page | URL | What it does |
|---|---|---|
| **Login** | `/login` | Email + password login |
| **Register** | `/register` | New customer signup |
| **Forgot Password** | `/forgot-password` | Send password reset email |
| **Reset Password** | `/reset-password` | Set new password from email link |

---

## 🦶 FOOTER

The footer appears on all main pages. It has **5 columns**:

| Column | Contents |
|---|---|
| **Brand** | Logo, store description, Social icons (Instagram, Facebook, YouTube) |
| **SHOP** | All Products, Fragrance, Hair Care, Skin Care, Body Care, Natural Care, Gift Sets |
| **HELP** | Contact Us, FAQs, Shipping Policy, Return & Refund, Track Order |
| **COMPANY** | About Us, Privacy Policy, Terms & Conditions |
| **CUSTOMER SUPPORT** | Phone number, Email address, Store address |

**Bottom bar:** Copyright notice + Payment icons (VISA, Mastercard, UPI)

---

---

# ⚙️ PANEL 2 — ADMIN PANEL

Access at: `yourwebsite.com/admin`
**Only accessible to users with ADMIN or STAFF role.**

---

## 🗂️ ADMIN SIDEBAR MENU

The admin panel has a **left sidebar** with collapsible groups:

---

### GROUP 1 — Main

| Menu Item | What it does |
|---|---|
| **◉ Dashboard** | Overview with charts, stats, recent orders |

---

### GROUP 2 — 📦 Catalog *(collapsible)*

| Menu Item | What it does |
|---|---|
| **◈ Products** | Add, edit, delete products |
| **▤ Categories** | Manage product categories |
| **⊟ Inventory** | View and update stock levels |

---

### GROUP 3 — 📋 Orders *(collapsible)*

| Menu Item | What it does |
|---|---|
| **All Orders** | View all orders |
| **Pending** | Orders waiting to be confirmed |
| **Processing** | Orders being prepared |
| **Shipped** | Orders dispatched |
| **Delivered** | Completed deliveries |
| **Returns** | Return requests from customers |
| **Refunds** | Refunded orders |

---

### GROUP 4 — Standalone Items

| Menu Item | What it does |
|---|---|
| **◐ Customers** | View all customer accounts |
| **₹ Payments** | View payment transactions |

---

### GROUP 5 — 📣 Marketing *(collapsible)*

| Menu Item | What it does |
|---|---|
| **Banners** | Manage homepage/website banners |
| **Campaigns** | Create and manage marketing campaigns |
| **Coupons** | Create and manage discount codes |
| **Promotions** | Create offers and sale promotions |

---

### GROUP 6 — Reviews & Analytics

| Menu Item | What it does |
|---|---|
| **★ Reviews** | Moderate customer product reviews |
| **📈 Analytics** | Detailed analytics and reports |

---

### GROUP 7 — ✎ Content *(collapsible)*

| Menu Item | What it does |
|---|---|
| **Homepage** | Edit homepage content |
| **About** | Edit About Us page |
| **FAQ** | Edit FAQ questions and answers |
| **Policies** | Edit Shipping/Return/Privacy pages |

---

### GROUP 8 — System

| Menu Item | What it does |
|---|---|
| **⚙ Settings** | CMS and Store settings (10 tabs) |
| **≡ Admin Activity Logs** | Track all admin actions |

---

## 📊 ADMIN — DASHBOARD PAGE

Shows a complete overview:

- **Stats Cards:** Total Revenue, Total Orders, Total Customers, Avg Order Value
- **Revenue Chart:** Area chart over selected time period
- **Orders Chart:** Bar chart of orders per day
- **Filter Buttons:** Last 7 days / 30 days / This month / Custom date range
- **Recent Orders Table:** Last 5 orders with status badges
- **Recent Activity Log:** Last 6 admin actions

---

## ⚙️ ADMIN — SETTINGS / CMS PAGE (10 Tabs)

| Tab | What You Can Edit |
|---|---|
| **Store** | Store name, phone, email, address, description |
| **Payments** | Enable/disable COD, UPI, Card payments |
| **Shipping** | Free shipping threshold, standard rates |
| **Tax** | GST/tax rates |
| **Email** | Email templates, sender name and email |
| **Social** | Instagram, Facebook, YouTube links |
| **SEO** | Website title, meta description, keywords |
| **Pages** | Edit content for static pages |
| **Trust Elements** | Guarantee text, secure payment taglines |
| **Policies** | Shipping Policy, Return Policy, Privacy Policy text |

---

## 🔔 NOTIFICATION DROPDOWN

A bell icon appears in both customer navbar and admin topbar:
- Shows system notifications (new orders, low stock alerts, etc.)
- Unread count badge on bell icon
- Click to view and mark as read

---

## 🔐 ACCESS CONTROL SUMMARY

| Feature | Guest | Customer (Logged In) | Admin / Staff |
|---|---|---|---|
| Browse products | ✅ | ✅ | ✅ |
| Add to cart | ✅ | ✅ | ✅ |
| Checkout & order | ❌ | ✅ | ✅ |
| Wishlist | ❌ | ✅ | ✅ |
| View own orders | ❌ | ✅ | ✅ |
| Manage addresses | ❌ | ✅ | ✅ |
| Track order (by ID) | ✅ | ✅ | ✅ |
| Admin Panel access | ❌ | ❌ | ✅ |

---

## 📊 COMPLETE SUMMARY COUNT

| Category | Count |
|---|---|
| **Total Panels** | 2 (Customer + Admin) |
| **Customer Pages** | 24 pages |
| **Admin Management Pages** | 17 pages |
| **Navbar Main Links** | 5 (Home, Categories, About, Contact, Shop) |
| **Category Dropdown Items** | 4 (Fragrance, Hair Care, Skin Care, Natural Care) |
| **Footer Columns** | 5 |
| **Footer Shop Links** | 7 |
| **Footer Help Links** | 5 |
| **Admin Sidebar Groups** | 8 groups |
| **Admin Menu Items** | 22 total items |
| **Settings Tabs (CMS)** | 10 tabs |
| **Auth Pages** | 4 (Login, Register, Forgot Password, Reset Password) |

---

*Document prepared for BJ'S Natural Care client — covers all website panels, menus, and features.*
