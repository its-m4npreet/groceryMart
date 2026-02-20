# 🔔 Notification System - Quick Reference

## ✅ What's Implemented

### User Notification Preferences
Users can control 4 types of notifications in Settings:
1. **Order Updates** ✅ (default ON) - Order status, delivery updates
2. **Promotions** ✅ (default ON) - New products, deals
3. **Newsletter** ❌ (default OFF) - Marketing emails
4. **Stock Alerts** ✅ (default ON) - Low stock warnings

### Backend Changes
- ✅ User model has `notifications` object
- ✅ API endpoint: `PATCH /api/auth/notifications`
- ✅ Socket emissions check user preferences
- ✅ Admin notifications always sent

### Frontend Changes
- ✅ Created `/frontend/src/utils/notificationHelpers.js`
- ✅ Updated `/frontend/src/hooks/useSocketEvents.js` to respect preferences
- ✅ Settings page has notification toggles
- ✅ All socket events handled properly

---

## 🎯 How It Works

### 1. Backend Flow
```
Order status updated
  ↓
Check user.notifications.orderUpdates
  ↓
If enabled → emit socket event to user
If disabled → skip user notification
  ↓
Always emit to admin
```

### 2. Frontend Flow
```
Socket event received
  ↓
useSocketEvents hook
  ↓
Check user.notifications.{type}
  ↓
If enabled → showNotification()
If disabled → skip
```

---

## 📝 Key Files Modified/Created

### Backend
1. `/backend/src/models/userModel.js` - Added `notifications` field
2. `/backend/src/services/orderService.js` - Check preferences before emit
3. `/backend/src/sockets/events.js` - Added new event types

### Frontend
1. `/frontend/src/utils/notificationHelpers.js` - **NEW** - Notification utilities
2. `/frontend/src/hooks/useSocketEvents.js` - Respects user preferences
3. `/frontend/src/config/constants.js` - Added new SOCKET_EVENTS
4. `/frontend/src/pages/SettingsPage.jsx` - Already has notification toggles

---

## 🚀 Usage

### Show Order Notification (Respects Preferences)
```javascript
import { showOrderUpdateNotification } from '../utils/notificationHelpers';
import { useSelector } from 'react-redux';

const { user } = useSelector((state) => state.auth);
showOrderUpdateNotification(user, 'Order delivered!', 'success');
```

### Show Stock Alert (Respects Preferences)
```javascript
import { showStockAlertNotification } from '../utils/notificationHelpers';

showStockAlertNotification(user, `${product.name} is low on stock`, false);
```

### Critical Notification (Always Shows)
```javascript
import { showCriticalNotification } from '../utils/notificationHelpers';

showCriticalNotification('Payment successful!', 'success');
```

---

## 🧪 Testing Steps

1. **Test Disabled Notifications:**
   - Login → Settings → Toggle "Order Updates" OFF
   - Admin updates order status
   - Expected: No toast shown

2. **Test Enabled Notifications:**
   - Login → Settings → Toggle "Stock Alerts" ON  
   - Admin sets product stock to 3
   - Expected: Toast shows "Product is running low (3 left)"

3. **Test Admin Notifications:**
   - Login as admin
   - All notifications should show (always enabled)

---

## 📊 Notification Types & Icons

| Type | Preference | Icon | Example |
|------|-----------|------|---------|
| Order Delivered | orderUpdates | ✅ | "Your order is delivered!" |
| Order Updated | orderUpdates | ℹ️ | "Order confirmed" |
| Stock Out | stockAlerts | ❌ | "Product out of stock" |
| Stock Low | stockAlerts | ⚠️ | "Product low (3 left)" |
| New Product | promotions | 🎉 | "New product available" |
| Rider Assigned | orderUpdates | ℹ️ | "Rider assigned to order" |

---

## ⚙️ API Endpoint

### Update Notification Preferences
```http
PATCH /api/auth/notifications
Authorization: Bearer {token}

Body:
{
  "orderUpdates": true,
  "promotions": false,
  "newsletter": true,
  "stockAlerts": true
}

Response:
{
  "success": true,
  "message": "Notification preferences updated",
  "user": {
    "id": "...",
    "name": "...",
    "notifications": {
      "orderUpdates": true,
      "promotions": false,
      "newsletter": true,
      "stockAlerts": true
    }
  }
}
```

---

## 🎨 Frontend Helpers

### Available Functions
```javascript
// Base function
showNotification(user, type, message, options)

// Specific helpers
showOrderUpdateNotification(user, message, status)
showStockAlertNotification(user, message, isOutOfStock)
showPromotionalNotification(user, message)
showCriticalNotification(message, type) // Bypasses preferences

// Check preference
isNotificationEnabled(user, type)
```

---

## 🔢 Socket Events

### Events That Check Preferences
- `order-status-updated` → Checks `orderUpdates`
- `product-updated` (stock) → Checks `stockAlerts`
- `product-created` → Checks `promotions`
- `rider-assigned` → Checks `orderUpdates`
- `order-cancelled` → Checks `orderUpdates`

### Events Always Shown (Admin)
- `new-order`
- `delivery-status-updated`
- `rider-status-changed`

---

## ✨ Benefits

1. **User Control** - Users decide what notifications they receive
2. **Better UX** - No notification spam
3. **Privacy** - Users can opt-out of marketing
4. **Flexibility** - Easy to add new notification types
5. **Consistent** - Same logic across all notifications
6. **Admin Priority** - Admins always get important alerts

---

## 🐛 Common Issues

**Issue:** Notifications still showing when disabled
- **Fix:** Make sure using `showOrderUpdateNotification()` not raw `toast()`

**Issue:** No notifications at all
- **Fix:** Check Settings page, enable notification type

**Issue:** Admin not getting notifications
- **Fix:** Ensure `socketService.joinAdmin()` called in AdminLayout

---

## 📚 Documentation

- Full details: [NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md)
- Settings page: [frontend/src/pages/SettingsPage.jsx](frontend/src/pages/SettingsPage.jsx)
- Notification utils: [frontend/src/utils/notificationHelpers.js](frontend/src/utils/notificationHelpers.js)
- Socket events: [frontend/src/hooks/useSocketEvents.js](frontend/src/hooks/useSocketEvents.js)

---

**All notification features working properly! ✅**
