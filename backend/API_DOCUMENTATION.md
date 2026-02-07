# Grocery E-Commerce API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Sign Up
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "user"
}
```

**Response (201):**
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

### Sign In
```http
POST /api/auth/signin
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Response (200):**
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

---

## 📦 Product Endpoints

### Get All Products (Public)
```http
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| category | string | Filter by category (fruits/vegetables/grocery) |
| search | string | Search by name or description |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| sortBy | string | Sort field (name/price/createdAt/stock) |
| sortOrder | string | Sort order (asc/desc) |
| inStock | boolean | Filter in-stock products only |

**Example Request:**
```http
GET /api/products?category=fruits&page=1&limit=10&sortBy=price&sortOrder=asc
```

**Response (200):**
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
      "description": "Fresh red apples from Himachal",
      "isActive": true,
      "createdAt": "2026-02-06T10:00:00.000Z",
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

### Get Single Product (Public)
```http
GET /api/products/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "6789abcdef123456",
    "name": "Fresh Apples",
    "category": "fruits",
    "price": 150,
    "stock": 100,
    "unit": "kg",
    "image": "https://res.cloudinary.com/...",
    "description": "Fresh red apples from Himachal",
    "isActive": true,
    "createdAt": "2026-02-06T10:00:00.000Z"
  }
}
```

### Search Products (Public)
```http
GET /api/products/search?q=apple
```

### Get Products by Category (Public)
```http
GET /api/products/category/fruits
```

### Create Product (Admin Only)
```http
POST /api/products
```

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name |
| category | string | Yes | fruits/vegetables/grocery |
| price | number | Yes | Product price |
| stock | number | Yes | Available stock |
| unit | string | Yes | kg/g/piece/dozen/pack/liter/ml |
| description | string | No | Product description |
| image | file | No | Product image (jpg/png/webp, max 5MB) |

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "6789abcdef123456",
    "name": "Fresh Tomatoes",
    "category": "vegetables",
    "price": 40,
    "stock": 200,
    "unit": "kg",
    "image": "https://res.cloudinary.com/...",
    "description": "Fresh organic tomatoes",
    "isActive": true,
    "createdAt": "2026-02-06T10:00:00.000Z"
  }
}
```

### Update Product (Admin Only)
```http
PUT /api/products/:id
```

**Form Data:** Same as create (all fields optional)

### Update Stock (Admin Only)
```http
PATCH /api/products/:id/stock
```

**Request Body:**
```json
{
  "stock": 50,
  "operation": "add"
}
```

**Operation values:** `add`, `subtract`, or omit for absolute value

### Delete Product - Soft Delete (Admin Only)
```http
DELETE /api/products/:id
```

### Permanently Delete Product (Admin Only)
```http
DELETE /api/products/:id/permanent
```

---

## 🛒 Order Endpoints

### Create Order (Authenticated)
```http
POST /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "product": "6789abcdef123456",
      "quantity": 2
    },
    {
      "product": "6789abcdef654321",
      "quantity": 1
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

**Response (201):**
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
    "items": [
      {
        "product": "6789abcdef123456",
        "name": "Fresh Apples",
        "price": 150,
        "quantity": 2,
        "unit": "kg",
        "subtotal": 300
      }
    ],
    "totalAmount": 300,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "9876543210"
    },
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2026-02-06T10:00:00.000Z"
      }
    ],
    "createdAt": "2026-02-06T10:00:00.000Z"
  }
}
```

### Get My Orders (Authenticated)
```http
GET /api/orders/my-orders
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter by status |

### Get Order by ID (Authenticated - Owner or Admin)
```http
GET /api/orders/:id
```

### Get All Orders (Admin Only)
```http
GET /api/orders
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | Filter by status |
| startDate | string | Filter orders from date (ISO format) |
| endDate | string | Filter orders until date (ISO format) |

### Update Order Status (Admin Only)
```http
PATCH /api/orders/:id/status
```

**Request Body:**
```json
{
  "status": "packed"
}
```

**Valid Status Transitions:**
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `packed`, `cancelled`
- `packed` → `shipped`, `cancelled`
- `shipped` → `delivered`
- `delivered` → (final)
- `cancelled` → (final)

**For Cancellation:**
```json
{
  "status": "cancelled",
  "cancellationReason": "Customer requested cancellation"
}
```

### Cancel Order (User - Own Orders Only)
```http
PATCH /api/orders/:id/cancel
```

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

*Note: Users can only cancel orders in `pending` or `confirmed` status*

### Get Order Statistics (Admin Only)
```http
GET /api/orders/stats
```

**Response (200):**
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

## 🔌 Socket.io Events

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

### Example: Real-time Stock Updates
```javascript
socket.on('product:stockUpdated', (data) => {
  console.log(`${data.productName}: ${data.oldStock} → ${data.newStock}`);
  // Update UI accordingly
});
```

### Example: Admin Order Notifications
```javascript
// Join admin room
socket.emit('join:admin');

socket.on('order:created', (data) => {
  console.log(`New order: ${data.order.orderNumber}`);
  // Show notification, update order list
});
```

---

## ❌ Error Responses

### Validation Error (400)
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

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "message": "Too many requests, please try again after 15 minutes"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 📋 Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests / 15 min |
| Auth endpoints | 10 requests / 15 min |
| Order creation | 10 orders / hour |
| File uploads | 20 uploads / hour |

---

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/grocery_ecommerce
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```
