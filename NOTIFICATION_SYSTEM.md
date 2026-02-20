# 🔔 Notification System - Complete Implementation

## Overview
Comprehensive notification system with user preference management, real-time socket events, and smart notification delivery.

---

## ✨ Features Implemented

### 1. **User Notification Preferences**
Users can control which notifications they receive through Settings page:

**Notification Types:**
- **Order Updates** - Order status changes, delivery updates
- **Promotions** - New products, deals, sale announcements
- **Newsletter** - Marketing emails and newsletters
- **Stock Alerts** - Low stock warnings, out of stock notices

**Default Settings:**
```javascript
{
  orderUpdates: true,      // ✅ Enabled by default
  promotions: true,        // ✅ Enabled by default
  newsletter: false,       // ❌ Disabled by default (opt-in)
  stockAlerts: true        // ✅ Enabled by default
}
```

---

## 🎯 Backend Implementation

### 1. User Model - Notification Preferences
**File:** `/backend/src/models/userModel.js`

```javascript
notifications: {
  orderUpdates: { type: Boolean, default: true },
  promotions: { type: Boolean, default: true },
  newsletter: { type: Boolean, default: false },
  stockAlerts: { type: Boolean, default: true },
}
```

### 2. Update Notification Preferences API
**Endpoint:** `PATCH /api/auth/notifications`

**Request:**
```json
{
  "orderUpdates": true,
  "promotions": false,
  "newsletter": true,
  "stockAlerts": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "notifications": {
      "orderUpdates": true,
      "promotions": false,
      "newsletter": true,
      "stockAlerts": true
    }
  }
}
```

### 3. Socket Events with Preference Check
**File:** `/backend/src/services/orderService.js`

The `emitOrderStatusUpdate` function now checks user notification preferences before sending:

```javascript
const emitOrderStatusUpdate = async (order, oldStatus, newStatus) => {
  const io = getIO();
  if (!io) return;

  // Get user to check notification preferences
  const User = require('../models/userModel');
  const userId = order.user._id || order.user;
  const user = await User.findById(userId).select('notifications');
  
  // Only notify if orderUpdates notifications enabled
  if (user && user.notifications?.orderUpdates !== false) {
    io.to(`user:${userId}`).emit("order-status-updated", {
      orderId: order._id,
      orderNumber: order.orderNumber,
      message: `Your order ${order.orderNumber} is now ${newStatus}`,
    });
  }

  // Always notify admin
  io.to("admin").emit("order-status-updated", { ... });
};
```

**Benefits:**
- ✅ Respects user preferences before emitting
- ✅ Admin notifications always sent (critical)
- ✅ Async check for better performance
- ✅ Fallback to enabled if preferences not set

---

## 🎨 Frontend Implementation

### 1. Notification Helper Utility
**File:** `/frontend/src/utils/notificationHelpers.js`

**Key Functions:**

#### `showNotification(user, type, message, options)`
Base function that checks user preferences before showing notification.

#### `showOrderUpdateNotification(user, message, status)`
Shows order-related notifications with appropriate icons:
- ✅ Success (delivered)
- ℹ️ Info (confirmed, packed, shipped)
- ⚠️ Warning (cancelled)
- ❌ Error (failed)

#### `showStockAlertNotification(user, message, isOutOfStock)`
Shows stock alerts:
- ❌ Out of stock
- ⚠️ Low stock (≤ 5 items)

#### `showPromotionalNotification(user, message)`
Shows promotional content:
- 🎉 New products
- 🎉 Sales and deals

#### `showCriticalNotification(message, type)`
Always shows notification (bypasses user preferences):
- Use for critical system messages
- Security alerts
- Payment confirmations

#### `isNotificationEnabled(user, type)`
Check if notification type is enabled for user.

**Example Usage:**
```javascript
import { showOrderUpdateNotification } from '../utils/notificationHelpers';
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const { user } = useSelector((state) => state.auth);
  
  // This will only show if user has orderUpdates enabled
  showOrderUpdateNotification(user, 'Your order is delivered!', 'success');
};
```

### 2. Enhanced Socket Event Handling
**File:** `/frontend/src/hooks/useSocketEvents.js`

**Features:**
- ✅ Respects user notification preferences
- ✅ Shows appropriate icons for each event type
- ✅ Handles all socket events (orders, products, riders)
- ✅ Dispatches Redux actions for state updates

**Handled Events:**
1. **Product Updates** - Stock changes, price updates
2. **Product Created** - New products available
3. **Product Deleted** - Products removed
4. **Order Status Updates** - Order state changes
5. **Order Cancelled** - Order cancellations
6. **Rider Assigned** - Delivery rider assigned to order

```javascript
// Example: Stock alert with user preferences
socketService.onProductUpdate((data) => {
  dispatch(updateProductInList(data));
  
  // Only shows if user has stockAlerts enabled
  if (data.stock === 0) {
    showStockAlertNotification(user, `${data.name} is now out of stock`, true);
  }
});
```

### 3. Settings Page - Notification Preferences
**File:** `/frontend/src/pages/SettingsPage.jsx`

**UI Features:**
- ✅ Toggle switches for each notification type
- ✅ Real-time updates
- ✅ Sync with Redux state
- ✅ Visual feedback (success/error messages)

**Implementation:**
```javascript
const handleNotificationUpdate = async () => {
  try {
    const response = await axios.patch("/auth/notifications", notifications);
    if (response.data.user) {
      dispatch(setUser(response.data.user)); // Update Redux
    }
    showResult("success", "Notification preferences updated");
  } catch (error) {
    showResult("error", "Failed to update preferences");
  }
};
```

---

## 🔌 Socket Events Reference

### Frontend (constants.js)
```javascript
export const SOCKET_EVENTS = {
  // Product events
  PRODUCT_CREATED: "product-created",
  PRODUCT_UPDATED: "product-updated",
  PRODUCT_DELETED: "product-deleted",
  
  // Order events
  NEW_ORDER: "new-order",
  ORDER_STATUS_UPDATED: "order-status-updated",
  ORDER_CANCELLED: "order-cancelled",
  
  // Rider events
  RIDER_ASSIGNED: "rider-assigned",
  ORDER_ASSIGNED: "order-assigned",
  DELIVERY_STATUS_UPDATED: "delivery-status-updated",
  ACCOUNT_STATUS_CHANGED: "account-status-changed",
  RIDER_STATUS_CHANGED: "rider-status-changed",
};
```

### Backend (events.js)
All events match frontend constants for consistency.

---

## 📊 Notification Flow

### Order Status Update Flow
```
1. Admin updates order status
   ↓
2. Backend: updateOrderStatus() in orderService.js
   ↓
3. Backend: emitOrderStatusUpdate()
   ├─ Check user notification preferences
   ├─ If enabled: emit to customer
   └─ Always emit to admin
   ↓
4. Frontend: useSocketEvents hook receives event
   ↓
5. Frontend: showOrderUpdateNotification()
   ├─ Check user preferences in Redux
   ├─ If enabled: show toast
   └─ If disabled: skip
```

### Stock Alert Flow
```
1. Product stock updated (low or out of stock)
   ↓
2. Backend: emit 'product-updated' event
   ↓
3. Frontend: useSocketEvents receives event
   ↓
4. Frontend: dispatch(updateProductInList())
   ↓
5. Frontend: showStockAlertNotification()
   ├─ Check user.notifications.stockAlerts
   ├─ If enabled: show toast
   └─ If disabled: skip
```

---

## 🧪 Testing Guide

### Test 1: Disable Order Notifications
```bash
# 1. Login as user
# 2. Go to Settings → Notifications
# 3. Toggle "Order Updates" OFF
# 4. Place an order
# 5. Have admin update order status
# Expected: No toast notification shown
```

### Test 2: Enable Stock Alerts
```bash
# 1. Login as user
# 2. Ensure "Stock Alerts" is ON in Settings
# 3. Admin updates product stock to 3
# Expected: Toast shows "Product X is running low (3 left)"
```

### Test 3: Promotional Notifications
```bash
# 1. Login as user
# 2. Toggle "Promotions" OFF
# 3. Admin creates new product
# Expected: No "New product available" toast
# 4. Toggle "Promotions" ON
# 5. Admin creates another product
# Expected: Toast shows "New product available: Product Y"
```

### Test 4: Critical Notifications (Always Show)
```bash
# Login as user
# Any critical notification should show regardless of preferences:
# - Payment confirmations
# - Security alerts
# - System maintenance notices
```

### Test 5: Admin Notifications (Always Show)
```bash
# Login as admin
# All notifications should show regardless of user preferences:
# - New orders
# - Order updates
# - Product stock alerts
# - Rider status changes
```

---

## 📱 User Experience

### Notification Types & Icons

| Type | Icon | Duration | Example |
|------|------|----------|---------|
| Order Delivered | ✅ | 4s | "Your order #ORD-123 is delivered!" |
| Order Confirmed | ℹ️ | 4s | "Your order #ORD-123 is confirmed" |
| Order Cancelled | ⚠️ | 4s | "Your order #ORD-123 was cancelled" |
| Stock Out | ❌ | 3.5s | "Fresh Apples is now out of stock" |
| Stock Low | ⚠️ | 3.5s | "Fresh Apples is running low (3 left)" |
| New Product | 🎉 | 4s | "New product available: Organic Milk" |
| Rider Assigned | ℹ️ | 4s | "Delivery rider assigned to your order" |

---

## 🔧 Configuration

### Default Notification Preferences
**File:** `/backend/src/models/userModel.js`

```javascript
notifications: {
  orderUpdates: { type: Boolean, default: true },   // Most important
  promotions: { type: Boolean, default: true },     // Engagement
  newsletter: { type: Boolean, default: false },    // Opt-in only
  stockAlerts: { type: Boolean, default: true },    // Helpful
}
```

### Toast Duration Settings
**File:** `/frontend/src/utils/notificationHelpers.js`

```javascript
{
  success: 3000ms,     // Quick confirmation
  error: 4000ms,       // Needs attention
  info: 3000ms,        // General info
  warning: 3500ms,     // Important notice
  orderUpdate: 4000ms, // Important updates
  stockAlert: 3500ms,  // Inventory changes
  promotion: 4000ms,   // Marketing content
}
```

---

## ✅ Implementation Checklist

### Backend
- [x] User model with notification preferences
- [x] Update notifications API endpoint
- [x] Socket event emission with preference check
- [x] Order status update notifications
- [x] Stock alert notifications
- [x] Rider event notifications

### Frontend
- [x] Notification helper utilities
- [x] useSocketEvents hook with preferences
- [x] Settings page notification toggles
- [x] Redux state synchronization
- [x] Socket event listeners
- [x] Toast notifications with icons

### Features
- [x] User preference management
- [x] Real-time socket notifications
- [x] Smart notification filtering
- [x] Admin always receives notifications
- [x] Critical notification bypass
- [x] Icon-based notification types

---

## 🚀 Usage Examples

### Example 1: Simple Order Notification
```javascript
import { showOrderUpdateNotification } from '../utils/notificationHelpers';
import { useSelector } from 'react-redux';

const { user } = useSelector((state) => state.auth);
showOrderUpdateNotification(user, 'Order delivered!', 'success');
```

### Example 2: Stock Alert
```javascript
import { showStockAlertNotification } from '../utils/notificationHelpers';

showStockAlertNotification(user, 'Product is low on stock', false);
```

### Example 3: Check Preference Before Action
```javascript
import { isNotificationEnabled } from '../utils/notificationHelpers';

if (isNotificationEnabled(user, 'promotions')) {
  // Show promotional banner
}
```

### Example 4: Critical Notification
```javascript
import { showCriticalNotification } from '../utils/notificationHelpers';

// Always shows, bypasses user preferences
showCriticalNotification('Payment successful!', 'success');
```

---

## 🎯 Best Practices

1. **Respect User Preferences**
   - Always check preferences before showing notifications
   - Use notification helpers, not raw toast()

2. **Admin Notifications**
   - Always show admin notifications
   - Use raw toast() or showCriticalNotification()

3. **Critical Notifications**
   - Use showCriticalNotification() for important alerts
   - Examples: payments, security, legal notices

4. **Appropriate Icons**
   - Success: ✅ (completed actions)
   - Error: ❌ (failures, out of stock)
   - Warning: ⚠️ (low stock, cancellations)
   - Info: ℹ️ (general updates)
   - Promo: 🎉 (new products, sales)

5. **Duration Guidelines**
   - Quick actions: 3000ms
   - Important info: 4000ms
   - Errors/warnings: 4000ms

---

## 🐛 Troubleshooting

### Issue: Notifications not showing
**Check:**
1. User notification preferences in Settings
2. Redux state has updated user object
3. Socket connection is active
4. Backend is emitting events

### Issue: All notifications showing despite being disabled
**Check:**
1. Using notification helpers (not raw toast)
2. Passing user object to helpers
3. User object has notifications property

### Issue: Admin not receiving notifications
**Check:**
1. Socket connection established
2. Joined admin room with socketService.joinAdmin()
3. Event listeners are registered

---

## 📈 Future Enhancements

- [ ] Push notifications (browser API)
- [ ] Email notifications for critical events
- [ ] SMS notifications for orders
- [ ] In-app notification center
- [ ] Notification history
- [ ] Do Not Disturb mode
- [ ] Scheduled quiet hours
- [ ] Notification grouping
- [ ] Sound preferences
- [ ] Desktop notifications

---

**All notification features are fully implemented and tested! 🎉**
