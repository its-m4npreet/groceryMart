# Rider Role Implementation - API Documentation

## Overview
This document describes the RIDER role implementation for the eCommerce delivery system. Riders are delivery staff who can view and update the delivery status of orders assigned to them.

## Role System

### Available Roles
- `user` - Regular customers (default)
- `admin` - System administrators
- `rider` - Delivery staff

### Role Hierarchy
```
ADMIN → Full access to all endpoints
RIDER → Access to assigned orders only
USER → Access to own orders only
```

## Authentication

All rider endpoints require a valid JWT token with the `rider` role.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

The JWT token payload includes:
```json
{
  "user": {
    "id": "userId",
    "role": "rider"
  }
}
```

## Rider API Endpoints

### 1. Get Assigned Orders
Get all orders assigned to the logged-in rider.

**Endpoint:** `GET /api/rider/orders`

**Access:** Private/Rider

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `deliveryStatus` (optional) - Filter by status: `pending`, `assigned`, `out_for_delivery`, `delivered`

**Response:**
```json
{
  "success": true,
  "message": "Assigned orders retrieved successfully",
  "data": [
    {
      "_id": "orderId",
      "orderNumber": "ORD-12345678",
      "user": {
        "_id": "userId",
        "name": "Customer Name",
        "phone": "1234567890",
        "email": "customer@example.com"
      },
      "items": [
        {
          "product": {
            "_id": "productId",
            "name": "Product Name",
            "image": "imageUrl",
            "category": "fruits"
          },
          "name": "Product Name",
          "price": 100,
          "quantity": 2,
          "unit": "kg",
          "subtotal": 200
        }
      ],
      "totalAmount": 200,
      "status": "shipped",
      "deliveryStatus": "out_for_delivery",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "phone": "1234567890"
      },
      "createdAt": "2026-02-20T10:00:00.000Z",
      "updatedAt": "2026-02-20T11:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Get Single Order Details
Get details of a specific order assigned to the rider.

**Endpoint:** `GET /api/rider/orders/:id`

**Access:** Private/Rider

**Response:**
```json
{
  "success": true,
  "message": "Order details retrieved successfully",
  "data": {
    "_id": "orderId",
    "orderNumber": "ORD-12345678",
    "user": {
      "_id": "userId",
      "name": "Customer Name",
      "phone": "1234567890",
      "email": "customer@example.com"
    },
    "items": [...],
    "totalAmount": 200,
    "status": "shipped",
    "deliveryStatus": "out_for_delivery",
    "shippingAddress": {...},
    "deliveryStatusHistory": [
      {
        "status": "assigned",
        "timestamp": "2026-02-20T10:00:00.000Z",
        "updatedBy": "adminId"
      },
      {
        "status": "out_for_delivery",
        "timestamp": "2026-02-20T11:00:00.000Z",
        "updatedBy": "riderId"
      }
    ]
  }
}
```

### 3. Update Delivery Status
Update the delivery status of an assigned order.

**Endpoint:** `PATCH /api/rider/orders/:id/delivery-status`

**Access:** Private/Rider

**Request Body:**
```json
{
  "deliveryStatus": "out_for_delivery"
}
```

**Allowed Status Values:**
- `out_for_delivery` - Rider is on the way to deliver
- `delivered` - Order has been delivered to customer

**Status Transitions:**
```
assigned → out_for_delivery → delivered
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery status updated successfully",
  "data": {
    "orderId": "orderId",
    "orderNumber": "ORD-12345678",
    "deliveryStatus": "out_for_delivery",
    "status": "shipped",
    "deliveredAt": null
  }
}
```

**When status is `delivered`:**
```json
{
  "success": true,
  "message": "Delivery status updated successfully",
  "data": {
    "orderId": "orderId",
    "orderNumber": "ORD-12345678",
    "deliveryStatus": "delivered",
    "status": "delivered",
    "deliveredAt": "2026-02-20T12:00:00.000Z"
  }
}
```

### 4. Get Rider Statistics
Get delivery statistics for the logged-in rider.

**Endpoint:** `GET /api/rider/stats`

**Access:** Private/Rider

**Response:**
```json
{
  "success": true,
  "message": "Rider statistics retrieved successfully",
  "data": {
    "total": 50,
    "pending": 0,
    "assigned": 10,
    "out_for_delivery": 5,
    "delivered": 35,
    "todayDeliveries": 8
  }
}
```

## Admin Endpoints for Rider Management

### 1. Assign Rider to Order
Admin can assign a rider to an order for delivery.

**Endpoint:** `PATCH /api/orders/:id/assign-rider`

**Access:** Private/Admin

**Request Body:**
```json
{
  "riderId": "mongoObjectId"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rider assigned successfully",
  "data": {
    "orderId": "orderId",
    "orderNumber": "ORD-12345678",
    "assignedRider": {
      "id": "riderId",
      "name": "Rider Name",
      "phone": "9876543210"
    },
    "deliveryStatus": "assigned"
  }
}
```

**Error Responses:**
- `404` - Rider not found
- `400` - User is not a rider
- `400` - Cannot assign rider to cancelled/delivered order

## Real-time Socket Events

### Events Emitted by System

#### 1. order-assigned (to rider)
Emitted when admin assigns an order to a rider.

**Room:** `user_{riderId}`

**Payload:**
```json
{
  "orderId": "orderId",
  "orderNumber": "ORD-12345678",
  "customerName": "Customer Name",
  "deliveryAddress": {...},
  "message": "New order assigned to you"
}
```

#### 2. rider-assigned (to customer)
Emitted when a rider is assigned to customer's order.

**Room:** `user_{customerId}`

**Payload:**
```json
{
  "orderId": "orderId",
  "orderNumber": "ORD-12345678",
  "riderName": "Rider Name",
  "riderPhone": "9876543210",
  "message": "Delivery rider assigned to your order"
}
```

#### 3. order-status-updated (to customer)
Emitted when rider updates delivery status.

**Room:** `user_{customerId}`

**Payload:**
```json
{
  "orderId": "orderId",
  "orderNumber": "ORD-12345678",
  "status": "shipped",
  "deliveryStatus": "out_for_delivery",
  "message": "Your order is out for delivery"
}
```

#### 4. delivery-status-updated (to admin)
Emitted when rider updates delivery status.

**Room:** `admin`

**Payload:**
```json
{
  "orderId": "orderId",
  "orderNumber": "ORD-12345678",
  "riderId": "riderId",
  "riderName": "Rider Name",
  "deliveryStatus": "out_for_delivery",
  "status": "shipped"
}
```

## Database Schema Changes

### User Model
```javascript
{
  role: {
    type: String,
    enum: ["user", "admin", "rider"],  // Added "rider"
    default: "user",
  }
}
```

### Order Model
```javascript
{
  assignedRider: {
    type: ObjectId,
    ref: 'User',
    default: null,
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'assigned', 'out_for_delivery', 'delivered'],
    default: 'pending',
  },
  deliveryStatusHistory: [
    {
      status: String,
      timestamp: Date,
      updatedBy: ObjectId
    }
  ]
}
```

**New Index:**
```javascript
{ assignedRider: 1, deliveryStatus: 1 }
```

## Security Features

### 1. Role-Based Access Control
- Riders can ONLY access orders assigned to them
- Riders CANNOT:
  - Access admin endpoints
  - View all orders
  - Modify products
  - View payment details
  - Access other riders' orders

### 2. Status Validation
- Delivery status transitions are validated
- Invalid transitions are rejected
- Cannot update cancelled/delivered orders

### 3. Data Privacy
- Riders cannot see payment status
- Riders cannot see order notes
- Sensitive customer data is limited

## Error Handling

### Common Error Codes
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (wrong role)
- `404` - Resource not found
- `400` - Bad request (invalid data or status transition)

### Example Error Response
```json
{
  "success": false,
  "message": "Access denied. Rider privileges required",
  "error": "Forbidden"
}
```

## Testing the Implementation

### 1. Create a Rider User
Use signup endpoint with role or create directly in database:
```javascript
{
  "name": "John Rider",
  "email": "rider@example.com",
  "password": "SecurePass123!",
  "role": "rider",
  "phone": "9876543210"
}
```

### 2. Login as Rider
```bash
POST /api/auth/signin
{
  "email": "rider@example.com",
  "password": "SecurePass123!"
}
```

### 3. Admin Assigns Order
```bash
PATCH /api/orders/{orderId}/assign-rider
Authorization: Bearer {adminToken}
{
  "riderId": "riderUserId"
}
```

### 4. Rider Views Orders
```bash
GET /api/rider/orders
Authorization: Bearer {riderToken}
```

### 5. Rider Updates Status
```bash
PATCH /api/rider/orders/{orderId}/delivery-status
Authorization: Bearer {riderToken}
{
  "deliveryStatus": "out_for_delivery"
}
```

## Migration Notes

### For Existing Orders
Existing orders will have:
- `assignedRider: null`
- `deliveryStatus: 'pending'`
- Empty `deliveryStatusHistory: []`

No data migration required - fields have default values.

### Backward Compatibility
All existing functionality remains unchanged:
- User orders work as before
- Admin order management works as before
- Only new rider features are added

## Best Practices

1. **Always assign orders before shipping** - Admins should assign riders to orders in 'confirmed' or 'packed' status

2. **Status flow** - Follow the proper delivery status flow:
   - Admin assigns → `assigned`
   - Rider picks up → `out_for_delivery`
   - Rider delivers → `delivered`

3. **Real-time updates** - Connect to socket events for live status tracking

4. **Error handling** - Always check for specific error messages when status transitions fail

## Support

For issues or questions about the rider implementation, please refer to:
- Backend code: `/backend/src/controllers/riderController.js`
- Routes: `/backend/src/routes/riderRoutes.js`
- Models: `/backend/src/models/orderModel.js`, `/backend/src/models/userModel.js`
