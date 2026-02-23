# GroceryMart - Complete Project Documentation

## Project Overview

GroceryMart is a modern, full-stack e-commerce platform designed for fresh grocery shopping. The application provides a seamless shopping experience with real-time updates, secure authentication, and comprehensive admin management capabilities.

**Project Type:** E-Commerce Web Application  
**Target Industry:** Fresh Groceries & Food Retail  
**Architecture:** MERN Stack (MongoDB, Express.js, React, Node.js)

---

## 🎯 Key Features

### Customer Features
- **Product Browsing & Search** - Advanced filtering by category, price range, stock availability
- **Shopping Cart** - Real-time cart management with session persistence
- **Hot Deals** - Special offers and promotional products
- **Order Tracking** - Track orders from placement to delivery with real-time status updates
- **User Profiles** - Manage account information and preferences
- **Wishlist** - Save favorite products for later
- **Notification Preferences** - Customizable notification settings for order updates, promotions, and stock alerts
- **WhatsApp Support** - Direct customer support integration
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Admin Features
- **Product Management** - Full CRUD operations with image uploads
- **Order Management** - Process and track all customer orders
- **Bulk Operations** - Update prices and stock in bulk
- **Data Export** - Export products, orders, and users to CSV
- **User Management** - View and manage customer accounts
- **Analytics Dashboard** - Order statistics and revenue tracking
- **System Maintenance** - Cache clearing and database cleanup tools
- **Newsletter Management** - Manage email subscriptions

### Real-time Features
- **Live Product Updates** - Stock changes reflect instantly across all connected clients
- **Order Notifications** - Real-time order status updates for customers and admins
- **Socket.io Integration** - Bidirectional event-based communication

---

## 🏗️ Technical Architecture

### Backend Stack

**Runtime & Framework:**
- Node.js - JavaScript runtime environment
- Express.js v5.2.1 - Web application framework

**Database:**
- MongoDB with Mongoose v9.1.6 - NoSQL database with ODM

**Authentication & Security:**
- JWT (jsonwebtoken v9.0.3) - Token-based authentication
- bcryptjs v3.0.3 - Password hashing
- Helmet v8.1.0 - Security headers
- Express Rate Limit v8.2.1 - API rate limiting
- Zod v4.3.6 - Schema validation

**File Handling:**
- Cloudinary v2.9.0 - Cloud-based image storage and optimization
- Multer v2.0.2 - Multipart form data handling

**Real-time Communication:**
- Socket.io v4.8.3 - WebSocket implementation

**Email Services:**
- Nodemailer v8.0.1 - Email sending functionality

**Additional Libraries:**
- CORS v2.8.6 - Cross-origin resource sharing
- Morgan v1.10.1 - HTTP request logger
- Validator v13.15.26 - String validation
- Dotenv v17.2.4 - Environment variable management

### Frontend Stack

**Core Framework:**
- React 19.2.0 - UI library
- Vite (Rolldown) - Build tool and development server

**State Management:**
- Redux Toolkit v2.11.2 - State management
- React Redux v9.2.0 - React bindings for Redux

**Routing:**
- React Router DOM v7.13.0 - Client-side routing

**UI & Styling:**
- Tailwind CSS v4.1.18 - Utility-first CSS framework
- Framer Motion v12.33.0 - Animation library
- Lucide React v0.563.0 - Icon library
- clsx v2.1.1 - Conditional className utility

**HTTP & Real-time:**
- Axios v1.13.4 - HTTP client
- Axios Retry v4.5.0 - Request retry logic
- Socket.io Client v4.8.3 - Real-time communication

**Forms & Notifications:**
- React Hook Form v7.71.1 - Form management
- React Hot Toast v2.6.0 - Toast notifications

**Additional Libraries:**
- React Loading Skeleton v3.5.0 - Loading placeholders

---

## 📊 Database Schema

### User Model
```
{
  name: String (required),
  email: String (required, unique, validated),
  password: String (required, hashed),
  role: String (enum: 'user', 'admin', default: 'user'),
  notifications: {
    orderUpdates: Boolean (default: true),
    promotions: Boolean (default: true),
    newsletter: Boolean (default: false),
    stockAlerts: Boolean (default: true)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```
{
  name: String (required, unique),
  category: String (enum: 'fruits', 'vegetables', 'grocery'),
  price: Number (required, positive),
  stock: Number (required, min: 0),
  unit: String (enum: 'kg', 'g', 'piece', 'dozen', 'pack', 'liter', 'ml'),
  image: String (Cloudinary URL),
  description: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```
{
  orderNumber: String (auto-generated, format: ORD-XXXXXXXX),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    unit: String,
    subtotal: Number
  }],
  totalAmount: Number,
  status: String (enum: 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'),
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMethod: String (enum: 'cod', 'online'),
  paymentStatus: String (enum: 'pending', 'paid', 'failed'),
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: ObjectId
  }],
  cancellationReason: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Newsletter Model
```
{
  email: String (required, unique, validated),
  subscribedAt: Date,
  isActive: Boolean (default: true)
}
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Sign Up
**POST** `/api/auth/signup`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "user"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "6789abcdef123456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Sign In
**POST** `/api/auth/signin`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

Response (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6789abcdef123456",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Update Notification Preferences
**PATCH** `/api/auth/notifications`

Request Body:
```json
{
  "orderUpdates": true,
  "promotions": false,
  "newsletter": true,
  "stockAlerts": true
}
```

---

### Product Endpoints

#### Get All Products (Public)
**GET** `/api/products`

Query Parameters:
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `category` (string) - Filter by category (fruits/vegetables/grocery)
- `search` (string) - Search by name or description
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `sortBy` (string) - Sort field (name/price/createdAt/stock)
- `sortOrder` (string) - Sort order (asc/desc)
- `inStock` (boolean) - Filter in-stock products only

Response (200):
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "6789abcdef123456",
      "name": "Fresh Apples",
      "category": "fruits",
      "price": 150,
      "stock": 100,
      "unit": "kg",
      "image": "https://res.cloudinary.com/...",
      "description": "Fresh red apples",
      "isActive": true,
      "formattedPrice": "₹150.00/kg"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get Single Product (Public)
**GET** `/api/products/:id`

#### Create Product (Admin Only)
**POST** `/api/products`

Headers:
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

Form Data:
- `name` (string, required) - Product name
- `category` (string, required) - fruits/vegetables/grocery
- `price` (number, required) - Product price
- `stock` (number, required) - Available stock
- `unit` (string, required) - kg/g/piece/dozen/pack/liter/ml
- `description` (string, optional) - Product description
- `image` (file, optional) - Product image (jpg/png/webp, max 5MB)

#### Update Product (Admin Only)
**PUT** `/api/products/:id`

#### Update Stock (Admin Only)
**PATCH** `/api/products/:id/stock`

Request Body:
```json
{
  "stock": 50,
  "operation": "add"
}
```

Operations: `add`, `subtract`, or omit for absolute value

#### Delete Product - Soft Delete (Admin Only)
**DELETE** `/api/products/:id`

#### Permanently Delete Product (Admin Only)
**DELETE** `/api/products/:id/permanent`

---

### Order Endpoints

#### Create Order (Authenticated)
**POST** `/api/orders`

Request Body:
```json
{
  "items": [
    {
      "product": "6789abcdef123456",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "9876543210"
  },
  "paymentMethod": "cod",
  "notes": "Please deliver in evening"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "6789abcdef789012",
    "orderNumber": "ORD-EF789012",
    "user": {
      "_id": "6789abcdef123456",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [...],
    "totalAmount": 300,
    "status": "pending",
    "shippingAddress": {...},
    "paymentMethod": "cod",
    "paymentStatus": "pending"
  }
}
```

#### Get My Orders (Authenticated)
**GET** `/api/orders/my-orders`

Query Parameters:
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `status` (string) - Filter by status

#### Get Order by ID (Authenticated)
**GET** `/api/orders/:id`

User can only view their own orders. Admins can view all orders.

#### Get All Orders (Admin Only)
**GET** `/api/orders`

Query Parameters:
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status
- `startDate` (string) - Filter orders from date (ISO format)
- `endDate` (string) - Filter orders until date (ISO format)

#### Update Order Status (Admin Only)
**PATCH** `/api/orders/:id/status`

Request Body:
```json
{
  "status": "packed"
}
```

Valid Status Transitions:
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `packed`, `cancelled`
- `packed` → `shipped`, `cancelled`
- `shipped` → `delivered`
- `delivered` (final)
- `cancelled` (final)

For Cancellation:
```json
{
  "status": "cancelled",
  "cancellationReason": "Customer requested cancellation"
}
```

#### Cancel Order (User - Own Orders Only)
**PATCH** `/api/orders/:id/cancel`

Request Body:
```json
{
  "reason": "Changed my mind"
}
```

*Note: Users can only cancel orders in `pending` or `confirmed` status*

#### Get Order Statistics (Admin Only)
**GET** `/api/orders/stats`

Response (200):
```json
{
  "success": true,
  "message": "Order statistics retrieved successfully",
  "data": {
    "statusWise": {
      "pending": { "count": 10, "totalAmount": 5000 },
      "confirmed": { "count": 5, "totalAmount": 2500 },
      "packed": { "count": 3, "totalAmount": 1500 },
      "delivered": { "count": 100, "totalAmount": 50000 }
    },
    "totalOrders": 118,
    "totalRevenue": 59000,
    "todayOrders": 5
  }
}
```

---

### Admin Action Endpoints

#### Bulk Price Update (Admin Only)
**PATCH** `/api/admin/products/bulk-price`

Request Body:
```json
{
  "percentage": 10,
  "action": "increase"
}
```

Actions: `increase` or `decrease`

#### Bulk Stock Update (Admin Only)
**PATCH** `/api/admin/products/bulk-stock`

Request Body:
```json
{
  "quantity": 50,
  "action": "add"
}
```

Actions: `add`, `subtract`, or `set`

#### Delete Out of Stock Products (Admin Only)
**DELETE** `/api/admin/products/out-of-stock`

Permanently deletes all products with 0 stock.

#### Export Products (Admin Only)
**GET** `/api/admin/export/products`

Downloads CSV file with all products.

#### Export Orders (Admin Only)
**GET** `/api/admin/export/orders`

Downloads CSV file with all orders.

#### Export Users (Admin Only)
**GET** `/api/admin/export/users`

Downloads CSV file with all users (passwords excluded).

#### Clear Cache (Admin Only)
**POST** `/api/admin/system/clear-cache`

Clears application cache.

#### Cleanup Database (Admin Only)
**POST** `/api/admin/system/cleanup-db`

Removes orphaned data and optimizes database.

---

### Newsletter Endpoints

#### Subscribe
**POST** `/api/newsletter/subscribe`

Request Body:
```json
{
  "email": "user@example.com"
}
```

#### Unsubscribe
**POST** `/api/newsletter/unsubscribe`

Request Body:
```json
{
  "email": "user@example.com"
}
```

---

## 🔌 Real-time Socket.io Events

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Client Events (Emit)

| Event | Description | Payload |
|-------|-------------|---------|
| `join:admin` | Join admin room (admin only) | - |
| `join:room` | Join a specific room | `roomName` |
| `leave:room` | Leave a room | `roomName` |

### Server Events (Listen)

| Event | Description | Payload |
|-------|-------------|---------|
| `product:created` | New product added | `{ product, message }` |
| `product:updated` | Product updated | `{ productId, product, changes, message }` |
| `product:deleted` | Product deleted | `{ productId, message }` |
| `product:stockUpdated` | Stock changed | `{ productId, productName, oldStock, newStock, message }` |
| `order:created` | New order (admin only) | `{ order, message }` |
| `order:statusUpdated` | Order status changed | `{ orderId, orderNumber, oldStatus, newStatus, message }` |
| `order:cancelled` | Order cancelled | `{ orderId, orderNumber, reason, message }` |

### Real-time Features

**For Customers:**
- Receive instant notifications when order status changes
- See real-time stock updates while browsing
- Get notified of new deals and promotions (if enabled in preferences)

**For Admins:**
- Receive notifications of new orders immediately
- See real-time product updates across dashboard
- Monitor order status changes

---

## 🔒 Security Features

### Authentication & Authorization
- JWT-based token authentication
- Secure password hashing with bcryptjs
- Role-based access control (User/Admin)
- Token expiration and validation
- Protected routes with middleware

### Data Security
- **Encrypted Local Storage** - AES-GCM encryption for sensitive data
- **Key Derivation** - PBKDF2 with 100,000 iterations
- **Browser Fingerprinting** - Device-specific encryption keys
- **Input Validation** - Zod schema validation on all inputs
- **SQL Injection Protection** - MongoDB ODM with sanitization

### Network Security
- CORS configuration for trusted origins
- Helmet.js for security headers
- Rate limiting on API endpoints
- HTTPS support (production)

### File Upload Security
- File type validation (images only)
- File size limits (max 5MB)
- Cloudinary integration for secure storage
- Automatic image optimization

### Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| General API | 100 requests / 15 min |
| Auth endpoints | 10 requests / 15 min |
| Order creation | 10 orders / hour |
| File uploads | 20 uploads / hour |

---

## 🔔 Notification System

### User Preferences

Users can customize notification settings through their profile:

**Notification Types:**
- **Order Updates** - Status changes, delivery updates (default: enabled)
- **Promotions** - New products, deals (default: enabled)
- **Newsletter** - Marketing emails (default: disabled, opt-in)
- **Stock Alerts** - Low stock warnings (default: enabled)

### Notification Delivery

The system respects user preferences when sending:
- Real-time socket notifications
- Email notifications
- In-app notifications

Users receive notifications only for categories they've enabled, ensuring a non-intrusive experience.

---

## 🎨 Frontend Features

### User Interface
- Modern, clean design with Tailwind CSS
- Smooth animations with Framer Motion
- Responsive across all device sizes
- Loading skeletons for better UX
- Toast notifications for user feedback

### State Management
- Centralized Redux store
- Persistent cart state
- User session management
- Product catalog caching

### Performance Optimizations
- Code splitting by routes
- Lazy loading of components
- Image optimization via Cloudinary
- Axios request retry logic
- Socket connection management

### Pages & Routes

**Public Pages:**
- Home Page - Featured products and deals
- Products Page - Filterable product catalog
- Product Detail Page - Individual product view
- Hot Deals Page - Special offers
- About Page
- Contact Page
- FAQ Page
- Help Center
- Privacy Policy
- Terms & Conditions
- Shipping Information
- Return Policy
- Cancellation Policy

**Authenticated Pages:**
- Cart Page
- Checkout Page
- Orders Page - Order history and tracking
- Wishlist Page
- Settings Page - Profile and notification preferences

**Admin Pages:**
- Admin Dashboard - Statistics and overview
- Product Management - CRUD operations
- Order Management - Process orders
- User Management - View customers
- Admin Actions - Bulk operations and exports
- Newsletter Management

---

## 📦 Installation & Setup

### Backend Setup

**Prerequisites:**
- Node.js v16 or higher
- MongoDB database
- Cloudinary account

**Steps:**

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/grocery_ecommerce
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Client URL
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

---

### Frontend Setup

**Prerequisites:**
- Node.js v16 or higher

**Steps:**

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=GroceryMart
VITE_APP_URL=http://localhost:5173

# Contact Information
VITE_SUPPORT_PHONE=1800-123-4567
VITE_SUPPORT_EMAIL=support@grocerymart.com
VITE_WHATSAPP_NUMBER=918001234567
VITE_WHATSAPP_MESSAGE=Hi%20GroceryMart%2C%20I%20need%20help%20with

# Business Information
VITE_BUSINESS_HOURS=8:00 AM - 10:00 PM
VITE_BUSINESS_DAYS=Monday - Sunday
VITE_BUSINESS_ADDRESS=123 Fresh Street, Green Valley, Mumbai 400001

# Delivery Configuration
VITE_FREE_DELIVERY_THRESHOLD=500
VITE_DELIVERY_CHARGE=40

# Secure Storage
VITE_STORAGE_SECRET=your_random_secret_key_for_encryption

# Feature Flags
VITE_ENABLE_LIVE_CHAT=false
VITE_ENABLE_WHATSAPP=true
```

4. Start the development server:
```bash
npm run dev
```

Application will run on `http://localhost:5173`

5. Build for production:
```bash
npm run build
```

6. Preview production build:
```bash
npm run preview
```

---

## 🚀 Deployment Considerations

### Backend Deployment

**Environment:**
- Set `NODE_ENV=production`
- Use secure JWT_SECRET (long, random string)
- Configure production MongoDB URI
- Set up SSL/TLS certificates
- Configure CORS for production domain

**Recommended Platforms:**
- Railway
- Render
- DigitalOcean
- AWS EC2
- Heroku

### Frontend Deployment

**Build Configuration:**
- Update all `VITE_*` environment variables for production URLs
- Ensure API and Socket URLs point to production backend
- Enable production optimizations

**Recommended Platforms:**
- Vercel (included vercel.json configuration)
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront

**Vercel Configuration:**
The project includes a `vercel.json` file for seamless deployment on Vercel with proper routing.

---

## 📊 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   ├── db.js               # MongoDB connection
│   │   └── multer.js           # File upload configuration
│   ├── controllers/
│   │   ├── adminController.js  # Admin operations
│   │   ├── authController.js   # Authentication logic
│   │   ├── newsletterController.js
│   │   ├── orderController.js  # Order management
│   │   └── productController.js # Product CRUD
│   ├── middleware/
│   │   ├── auth.js             # JWT verification & authorization
│   │   ├── errorHandler.js     # Global error handling
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── validate.js         # Request validation
│   ├── models/
│   │   ├── newsletterModel.js
│   │   ├── orderModel.js       # Order schema
│   │   ├── productModel.js     # Product schema
│   │   └── userModel.js        # User schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── services/
│   │   ├── analyticsService.js # Analytics calculations
│   │   ├── dealCleanupService.js # Scheduled tasks
│   │   ├── orderService.js     # Order business logic
│   │   └── stockService.js     # Stock management
│   ├── sockets/
│   │   ├── events.js           # Socket event handlers
│   │   └── index.js            # Socket.io setup
│   ├── utils/
│   │   ├── emailService.js     # Email sending
│   │   ├── helpers.js          # Utility functions
│   │   └── validationSchemas.js # Zod schemas
│   └── index.js                # Application entry point
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/
│   │   ├── adminApi.js         # Admin API calls
│   │   ├── authApi.js          # Authentication API
│   │   ├── axios.js            # Axios instance with interceptors
│   │   ├── newsletterApi.js
│   │   ├── orderApi.js         # Order API calls
│   │   └── productApi.js       # Product API calls
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/
│   │   ├── auth/               # Login, Signup components
│   │   ├── cart/               # Cart-related components
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── product/            # Product cards, filters
│   │   └── ui/                 # Reusable UI components
│   ├── config/
│   │   └── constants.js        # App constants
│   ├── hooks/
│   │   ├── useProducts.js      # Product data hook
│   │   └── useSocketEvents.js  # Socket event hook
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── admin/              # Admin pages
│   │   ├── auth/               # Auth pages
│   │   └── orders/             # Order pages
│   ├── services/
│   │   └── socketService.js    # Socket.io client
│   ├── store/
│   │   ├── index.js            # Redux store configuration
│   │   └── slices/             # Redux slices
│   ├── utils/
│   │   ├── helpers.js          # Utility functions
│   │   ├── iconHelpers.jsx     # Icon utilities
│   │   ├── masking.js          # Data masking
│   │   ├── navigationService.js # Navigation helpers
│   │   ├── notificationHelpers.js # Notification utilities
│   │   └── secureStorage.js    # Encrypted localStorage
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔍 Error Handling

### API Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "message": "Too many requests, please try again after 15 minutes"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 📈 Business Logic

### Order Status Workflow

```
pending → confirmed → packed → shipped → delivered
   ↓         ↓          ↓
cancelled  cancelled  cancelled
```

**Status Descriptions:**
- **Pending** - Order received, awaiting confirmation
- **Confirmed** - Order confirmed, preparing for packing
- **Packed** - Order packed, ready for shipment
- **Shipped** - Order dispatched for delivery
- **Delivered** - Order successfully delivered (final)
- **Cancelled** - Order cancelled (final)

### Stock Management

**Automatic Stock Reduction:**
- Stock is automatically reduced when order is placed
- If stock becomes insufficient during order, order fails with error

**Stock Update Operations:**
- **Add** - Increases stock by specified quantity
- **Subtract** - Decreases stock by specified quantity
- **Set** - Sets stock to absolute value

**Stock Restoration:**
- When order is cancelled, stock is automatically restored to products

### Payment Methods

**Current Support:**
- Cash on Delivery (COD)
- Online Payment (infrastructure ready)

**Payment Status:**
- Pending - Payment not yet received
- Paid - Payment confirmed
- Failed - Payment attempt failed

---

## 🎯 Key Functionalities

### 1. Product Search & Filtering
- Text search across name and description
- Category filtering (fruits, vegetables, grocery)
- Price range filtering
- Stock availability filtering
- Multiple sorting options (price, name, date, stock)

### 2. Shopping Cart
- Add/remove items
- Update quantities
- Real-time price calculation
- Persistent cart (survives page refresh)
- Stock validation before checkout

### 3. Order Processing
- Multi-step checkout process
- Address validation
- Order summary preview
- Email confirmation (when configured)
- Order tracking with status history

### 4. Admin Dashboard
- Order statistics by status
- Revenue tracking
- Today's orders count
- Quick actions for common tasks

### 5. Bulk Operations
- Update all product prices by percentage
- Update all product stock quantities
- Delete products with zero stock
- Export data to CSV

### 6. Real-time Updates
- Stock changes reflect instantly
- Order status updates push notifications
- New order alerts for admins
- Product catalog updates

---

## 🌟 Best Practices Implemented

### Code Quality
- Consistent error handling patterns
- Modular, reusable components
- Clear separation of concerns
- Environment-based configuration
- Comprehensive input validation

### Security
- Never expose sensitive data in responses
- Password hashing before storage
- JWT tokens for stateless authentication
- Rate limiting to prevent abuse
- File upload validation and sanitization

### Performance
- Database indexing on frequently queried fields
- Pagination for large data sets
- Image optimization via Cloudinary
- Request caching where appropriate
- Efficient socket room management

### User Experience
- Loading states on all async operations
- Error messages in user-friendly language
- Consistent UI patterns
- Responsive design for all screen sizes
- Toast notifications for user feedback

---

## 📞 Support & Maintenance

### Monitoring Recommendations

**Application Monitoring:**
- Server uptime monitoring
- API response time tracking
- Error rate monitoring
- Database performance metrics

**User Monitoring:**
- Active user tracking
- Order completion rates
- Cart abandonment rates
- Feature usage analytics

### Backup Strategy

**Database Backups:**
- Regular MongoDB backups
- Point-in-time recovery capability
- Backup retention policy

**Media Backups:**
- Cloudinary automatic backups
- CDN redundancy

### Maintenance Tasks

**Regular Tasks:**
- Database cleanup (orphaned records)
- Cache clearing
- Log rotation
- Security updates
- Dependency updates

**Periodic Reviews:**
- Performance optimization
- Security audit
- User feedback implementation
- Feature enhancement

---

## 📝 Additional Notes

### Future Enhancement Possibilities

- Payment gateway integration (Razorpay, Stripe)
- Advanced analytics and reporting
- Multi-language support
- Mobile app (React Native)
- Product reviews and ratings
- Loyalty points system
- Referral program
- Advanced inventory management
- Vendor/supplier management
- Automated reordering
- Push notifications (PWA)
- Live chat support
- AI-powered product recommendations

### Customization Options

The application is designed to be easily customizable:
- Brand colors via Tailwind configuration
- Business information via environment variables
- Email templates can be modified
- Additional product categories can be added
- Custom validation rules can be implemented
- New notification types can be added

---

## 🤝 Technical Support

For technical issues or questions:

**Documentation:**
- API Documentation: `/backend/API_DOCUMENTATION.md`
- Admin Actions Guide: `/ADMIN_ACTIONS_SUMMARY.md`
- Notification System: `/NOTIFICATION_SYSTEM.md`
- Secure Storage Guide: `/SECURE_STORAGE.md`
- Frontend README: `/frontend/README.md`

**Code Comments:**
The codebase includes extensive inline comments explaining complex logic and business rules.

---

## 📄 License

This project is proprietary software developed for GroceryMart.

---

**Document Version:** 1.0  
**Last Updated:** February 22, 2026  
**Prepared For:** Client Review

---

This documentation provides a complete overview of the GroceryMart e-commerce platform. For specific implementation details or technical questions, please refer to the individual documentation files or contact the development team.
