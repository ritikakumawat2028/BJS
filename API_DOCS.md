# BJ's Natural Care - API Documentation

## Authentication (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Authenticate and receive JWT
- `POST /refresh`: Refresh access token
- `POST /logout`: Clear authentication

## Products & Categories (`/api/products`, `/api/categories`)
- `GET /products`: Fetch paginated products with optional filters
- `GET /products/:slug`: Get detailed product information
- `GET /categories`: List all active categories

## Cart & Checkout (`/api/cart`, `/api/orders`, `/api/payments`)
- `GET /cart`: Retrieve current user or session cart
- `POST /cart/items`: Add item to cart
- `POST /cart/coupon`: Validate and apply coupon to cart
- `POST /orders`: Finalize cart and create a pending Order
- `POST /payments/create`: Generate a Razorpay Order ID for a pending order
- `POST /payments/verify`: Webhook to securely verify Razorpay signature and mark order as PAID

## Admin Endpoints (`/api/admin`)
*(Requires `Authorization: Bearer <token>` and Admin Role)*
- `GET /dashboard`: Fetch aggregated sales and order analytics
- `GET /customers`: Retrieve list of all users and order history
- `GET /shipping-zones`: List all configured delivery zones and rates
- `GET /coupons`: Manage active promotional codes
- `GET /inventory/stats`: Overview of stock levels and low-stock alerts
