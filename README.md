# BJ's Natural Care - E-Commerce Platform

A premium, full-stack e-commerce platform built for **BJ's Natural Care**. It features a luxurious "Black + Gold + Ivory" visual identity and provides a fully-functional customer storefront alongside a comprehensive administrative dashboard for business management.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Database Structure](#database-structure)
7. [Environment Variables](#environment-variables)
8. [Local Setup](#local-setup)
9. [Development Commands](#development-commands)
10. [Production Build](#production-build)
11. [Deployment Instructions](#deployment-instructions)
12. [Admin Setup](#admin-setup)
13. [Payment Configuration](#payment-configuration)
14. [Image Storage Configuration](#image-storage-configuration)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview
BJ's Natural Care is an end-to-end e-commerce solution. It includes a user-facing React application designed with a luxury aesthetic (smooth animations, edge-to-edge photography, and elegant typography), and an admin portal for inventory, orders, campaigns, and shipping management.

## Features
- **Customer Storefront:** Bestsellers, New Arrivals, interactive product cards with hover actions, wishlists, and reviews.
- **Dynamic Cart & Checkout:** Real-time stock validation, automated shipping calculation based on zones, and promo code discounts.
- **Admin Dashboard:** Real-time sales analytics, audit logs, and customer CRM.
- **Campaign Engine:** Time-based promotional banners that dynamically activate and deactivate.
- **Inventory & Delivery Management:** Automatic stock deduction on purchase, and dynamic shipping charges (e.g. Free above ₹999).
- **Payment Processing:** Integrated securely with Razorpay (with signature verification).
- **Security:** Rate-limiting, CORS policies, JWT-based authentication, and Helmet HTTP headers.

## Tech Stack
- **Frontend:** React (Vite), TypeScript, Zustand (State), React Query, Framer Motion (Animations).
- **Backend:** Node.js, Express, TypeScript.
- **Database:** Prisma ORM, SQLite.
- **Payments:** Razorpay.
- **Security:** `express-rate-limit`, `helmet`, `bcryptjs`, `jsonwebtoken`.

## Architecture
- **Client-Server Model:** The React frontend runs independently and communicates with the Express backend via RESTful APIs (`/api/*`).
- **State Management:** `Zustand` handles global state (Cart, Wishlist, Auth), while `React Query` handles server-state (fetching products, submitting orders).
- **Database Layer:** Prisma serves as the type-safe ORM connecting the Express controllers to the SQLite database.

## Folder Structure
```text
/
├── /backend
│   ├── /src
│   │   ├── /config       # Prisma client and environment config
│   │   ├── /controllers  # Business logic (auth, orders, products)
│   │   ├── /middleware   # JWT verification, Error handling
│   │   ├── /routes       # Express API routes
│   │   └── /services     # Reusable services (Notifications, Razorpay)
│   ├── /prisma
│   │   └── schema.prisma # Database schema definition
│   └── package.json
└── /frontend
    ├── /src
    │   ├── /admin        # Admin dashboard pages and components
    │   ├── /components   # Reusable UI (ProductCards, Modals)
    │   ├── /pages        # Public storefront pages
    │   ├── /services     # Axios API wrappers (api.ts)
    │   ├── /store        # Zustand stores
    │   └── /styles       # Global CSS (globals.css, vars)
    └── package.json
```

## Database Structure
The Prisma schema includes highly relational models:
- **Users/Auth:** `User`, `Role`, `Address`
- **Catalog:** `Product`, `Category`, `ProductVariant`, `ProductImage`
- **Sales:** `Order`, `OrderItem`, `Payment`, `Cart`, `Coupon`, `Shipping`
- **CMS/Promotions:** `Banner`, `Campaign`, `Promotion`, `Review`

*See `/backend/src/prisma/schema.prisma` for the exact relationships.*

## Environment Variables
Create a `.env` file in the `/backend` directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# Security
JWT_SECRET="generate-a-strong-secret-key-here"
JWT_REFRESH_SECRET="generate-another-strong-secret-key-here"

# Razorpay Payments
RAZORPAY_KEY_ID="rzp_test_yourkeyid"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```
Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL="http://localhost:5000/api"
VITE_RAZORPAY_KEY_ID="rzp_test_yourkeyid"
```

## Local Setup
1. **Clone & Install Dependencies**
   ```bash
   # Install Backend
   cd backend
   npm install
   
   # Install Frontend
   cd ../frontend
   npm install
   ```
2. **Database Initialization**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   # Optionally run a seed script if created
   ```

## Development Commands
**Run Backend (Port 5000):**
```bash
cd backend
npm run dev
```

**Run Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

## Production Build
To prepare the application for production deployment:
```bash
# Build Frontend
cd frontend
npm run build
# The optimized static files will be in /frontend/dist

# Build Backend
cd backend
npm run build
# The compiled JS will be in /backend/dist
```

## Deployment Instructions
1. **Backend (Node.js Environment):**
   - Deploy the compiled `/backend/dist` to a server (e.g., Render, Heroku, AWS EC2).
   - Set all production environment variables.
   - Run `npx prisma db push` (or `migrate deploy`) on the production database.
   - Start the server using `npm start` (which runs `node dist/index.js`).
2. **Frontend (Static Hosting):**
   - Deploy the `/frontend/dist` directory to a static host (e.g., Vercel, Netlify, AWS S3).
   - Ensure you set rewriting rules so that all traffic routes to `index.html` (for React Router to work properly).

## Admin Setup
1. Register a new account via the frontend `/register` page.
2. Open your SQLite database (e.g. using Prisma Studio: `npx prisma studio` in the backend folder).
3. Find your user record in the `User` table.
4. Create an `ADMIN` role in the `Role` table if it doesn't exist.
5. Assign the `ADMIN` role ID to your user record.
6. Log in again; you will now have access to the Admin Dashboard.

## Payment Configuration
1. Create an account at [Razorpay](https://razorpay.com).
2. Generate **Test Keys** in the Razorpay Dashboard.
3. Add the `Key ID` and `Key Secret` to the `.env` files (both backend and frontend).
4. For production, swap these out with your **Live Keys**.
5. Set up a Webhook in Razorpay pointing to `https://your-backend-url.com/api/payments/webhook` listening for `payment.captured` events.

## Image Storage Configuration
Currently, images are stored locally in `/backend/public/uploads`. 
For a production environment, it is highly recommended to refactor `upload.controller.ts` to utilize cloud storage:
1. Set up an AWS S3 Bucket or Cloudinary account.
2. Update the multer configuration in the backend to stream uploads directly to the cloud provider.
3. Update the database to store the absolute URL returned by the cloud provider.

## Troubleshooting
- **CORS Errors:** Ensure your `FRONTEND_URL` in the backend `.env` perfectly matches the URL your frontend is hosted on (including HTTP/HTTPS).
- **Payment Verification Failing:** Double-check that your `RAZORPAY_KEY_SECRET` in the backend exactly matches the secret for the `RAZORPAY_KEY_ID` used on the frontend.
- **Empty Homepage:** If the Bestsellers or New Arrivals sections are missing, log into the Admin panel and ensure products are actively flagged with those statuses.
