# 🎯 Admin Panel - Rider Management System

## Overview
Complete rider/delivery staff management system for admin panel with full CRUD operations, status control, and comprehensive statistics.

---

## 🔑 Key Features

### ✅ View All Riders
- Paginated list of all delivery staff
- Filter by status (all/active/inactive)
- Delivery statistics for each rider
- Quick overview of assigned orders

### ✅ Rider Details
- Complete rider information (name, email, phone, address)
- Detailed delivery statistics
- Recent order history
- Performance metrics (success rate, completion rate)

### ✅ Assign Riders to Orders
- Assign active riders to pending orders
- Validation prevents assigning to inactive riders
- Real-time notifications to rider and customer
- Automatic status updates

### ✅ Activate/Deactivate Riders
- Toggle rider account status
- Prevents deactivation if rider has active orders
- Real-time notifications to affected rider
- Automatic access restriction for deactivated riders

---

## 📡 API Endpoints

### 1. Get All Riders
```http
GET /api/admin/riders
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50) - Items per page
- `status` (string, default: "all") - Filter: "all" | "active" | "inactive"

**Response:**
```json
{
  "success": true,
  "message": "Riders retrieved successfully",
  "data": [
    {
      "_id": "rider_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "rider",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "address": {
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      },
      "deliveryStats": {
        "total": 45,
        "pending": 0,
        "assigned": 2,
        "out_for_delivery": 3,
        "delivered": 40
      }
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalResults": 15,
    "resultsPerPage": 50,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 2. Get Rider Details by ID
```http
GET /api/admin/riders/:id
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Rider details retrieved successfully",
  "data": {
    "rider": {
      "_id": "rider_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "rider",
      "isActive": true,
      "address": {
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      },
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "deliveryStats": {
      "total": 45,
      "pending": 0,
      "assigned": 2,
      "out_for_delivery": 3,
      "delivered": 40
    },
    "recentOrders": [
      {
        "_id": "order_id",
        "orderNumber": "ORD-20240220-1234",
        "totalAmount": 1299,
        "deliveryStatus": "out_for_delivery",
        "status": "shipped",
        "createdAt": "2024-02-20T14:30:00.000Z",
        "user": {
          "name": "Customer Name",
          "phone": "9123456789"
        }
      }
    ],
    "performance": {
      "completedOrders": 40,
      "successRate": "88.89%",
      "activeOrders": 5
    }
  }
}
```

---

### 3. Activate/Deactivate Rider
```http
PATCH /api/admin/riders/:id/toggle-status
Authorization: Bearer {admin_token}
```

**Request Body:** None required (toggles current status)

**Response (Activation):**
```json
{
  "success": true,
  "message": "Rider activated successfully",
  "data": {
    "riderId": "rider_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true
  }
}
```

**Response (Deactivation with Active Orders):**
```json
{
  "success": false,
  "message": "Cannot deactivate rider. They have 3 active order(s). Please reassign these orders first.",
  "data": null
}
```

**Response (Successful Deactivation):**
```json
{
  "success": true,
  "message": "Rider deactivated successfully",
  "data": {
    "riderId": "rider_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": false
  }
}
```

---

### 4. Assign Rider to Order
```http
PATCH /api/orders/:orderId/assign-rider
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "riderId": "rider_user_id"
}
```

**Validation:**
- Rider must exist
- Rider must have role "rider"
- Rider must be active (isActive: true)
- Order cannot be cancelled or delivered

**Response:**
```json
{
  "success": true,
  "message": "Rider assigned successfully",
  "data": {
    "_id": "order_id",
    "orderNumber": "ORD-20240220-1234",
    "assignedRider": {
      "_id": "rider_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "deliveryStatus": "assigned",
    "status": "confirmed"
  }
}
```

**Error Response (Inactive Rider):**
```json
{
  "success": false,
  "message": "Cannot assign order to an inactive rider",
  "data": null
}
```

---

## 🔔 Real-time Events (Socket.io)

### 1. Rider Account Status Changed
**Event:** `account-status-changed`  
**Target:** Specific rider (`user_${riderId}`)

```javascript
{
  "isActive": false,
  "message": "Your account has been deactivated. You will not receive new orders."
}
```

### 2. Rider Status Changed (Admin Notification)
**Event:** `rider-status-changed`  
**Target:** All admins (`admins` room)

```javascript
{
  "riderId": "rider_id",
  "riderName": "John Doe",
  "isActive": false
}
```

### 3. Order Assigned to Rider
**Event:** `order-assigned`  
**Target:** Specific rider (`user_${riderId}`)

```javascript
{
  "orderId": "order_id",
  "orderNumber": "ORD-20240220-1234",
  "customerName": "Customer Name",
  "deliveryAddress": {
    "street": "456 Park Ave",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002"
  },
  "message": "New order assigned to you"
}
```

### 4. Rider Assigned to Order (Customer Notification)
**Event:** `rider-assigned`  
**Target:** Specific customer (`user_${customerId}`)

```javascript
{
  "orderId": "order_id",
  "orderNumber": "ORD-20240220-1234",
  "riderName": "John Doe",
  "riderPhone": "9876543210",
  "message": "Delivery rider assigned to your order"
}
```

---

## 🛡️ Security & Access Control

### Rider Access Restrictions

When a rider is **deactivated**:
1. ✅ Cannot login to rider dashboard
2. ✅ Cannot access any rider endpoints
3. ✅ Cannot view assigned orders
4. ✅ Cannot update delivery status
5. ✅ Receives immediate notification of deactivation
6. ✅ Cannot be assigned to new orders

**Middleware Protection:**
```javascript
// All rider routes check isActive status
router.use(protect, authorize('rider'));
// authorize() now checks: req.user.role === 'rider' && req.user.isActive
```

### Admin Protections

**Prevent Data Loss:**
- Cannot deactivate rider with active orders
- Must reassign orders before deactivation
- Clear error messages guide admin actions

**Prevent Invalid Assignments:**
- Cannot assign inactive riders to orders
- Validation at controller level
- Real-time checks before assignment

---

## 📊 Database Schema Changes

### User Model Updates
```javascript
{
  // Existing fields...
  isActive: {
    type: Boolean,
    default: true  // All users active by default
  }
}
```

**Migration:** No migration needed - field has default value

**Backward Compatibility:** 
- Existing users get `isActive: true` by default
- No breaking changes to existing functionality

---

## 🎨 Frontend Integration Guide

### Admin Dashboard - Rider Management Component

#### 1. Riders List Page
```jsx
// Example React component structure
const RidersManagement = () => {
  const [riders, setRiders] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRiders(page, filter);
  }, [page, filter]);

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      <RidersTable riders={riders} />
      <Pagination page={page} setPage={setPage} />
    </div>
  );
};
```

**UI Elements:**
- **Filter Tabs**: All / Active / Inactive
- **Rider Cards/Table**: Name, Email, Phone, Status Badge, Delivery Stats
- **Action Buttons**: View Details, Toggle Status, Assign Order
- **Status Badge**: Green (Active) / Red (Inactive)

#### 2. Rider Details Modal/Page
```jsx
const RiderDetails = ({ riderId }) => {
  const [rider, setRider] = useState(null);

  useEffect(() => {
    fetchRiderById(riderId);
  }, [riderId]);

  return (
    <div>
      <RiderInfo rider={rider.rider} />
      <DeliveryStats stats={rider.deliveryStats} />
      <PerformanceMetrics performance={rider.performance} />
      <RecentOrders orders={rider.recentOrders} />
      <ActionButtons riderId={riderId} isActive={rider.rider.isActive} />
    </div>
  );
};
```

**Display Sections:**
- **Personal Info**: Name, Email, Phone, Address
- **Account Status**: Active/Inactive toggle button
- **Delivery Statistics**: Total, Pending, Assigned, Out for Delivery, Delivered
- **Performance Metrics**: Completion rate, Success rate, Active orders
- **Recent Orders**: Last 10 orders with status

#### 3. Toggle Status Confirmation
```jsx
const toggleRiderStatus = async (riderId, currentStatus) => {
  const action = currentStatus ? 'deactivate' : 'activate';
  
  if (confirm(`Are you sure you want to ${action} this rider?`)) {
    try {
      await axios.patch(`/api/admin/riders/${riderId}/toggle-status`);
      toast.success(`Rider ${action}d successfully`);
      refreshRidersList();
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message); // Shows active orders warning
      } else {
        toast.error(`Failed to ${action} rider`);
      }
    }
  }
};
```

#### 4. Assign Rider to Order
```jsx
const AssignRiderModal = ({ orderId, onClose }) => {
  const [activeRiders, setActiveRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);

  useEffect(() => {
    // Fetch only active riders
    fetchRiders(1, 'active');
  }, []);

  const handleAssign = async () => {
    try {
      await axios.patch(`/api/orders/${orderId}/assign-rider`, {
        riderId: selectedRider
      });
      toast.success('Rider assigned successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign rider');
    }
  };

  return (
    <Modal>
      <Select
        options={activeRiders}
        value={selectedRider}
        onChange={setSelectedRider}
        placeholder="Select a rider..."
      />
      <Button onClick={handleAssign}>Assign Rider</Button>
    </Modal>
  );
};
```

---

## 🧪 Testing Guide

### Test Scenario 1: View All Riders
```bash
# Get all riders
curl -X GET "http://localhost:5000/api/admin/riders?page=1&limit=10&status=all" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get only active riders
curl -X GET "http://localhost:5000/api/admin/riders?status=active" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get only inactive riders
curl -X GET "http://localhost:5000/api/admin/riders?status=inactive" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test Scenario 2: View Rider Details
```bash
curl -X GET "http://localhost:5000/api/admin/riders/RIDER_ID" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test Scenario 3: Deactivate Rider (Success)
```bash
# First, ensure rider has no active orders
curl -X PATCH "http://localhost:5000/api/admin/riders/RIDER_ID/toggle-status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Expected: "Rider deactivated successfully"
```

### Test Scenario 4: Deactivate Rider (Fail - Has Active Orders)
```bash
# Assign an order to rider first
curl -X PATCH "http://localhost:5000/api/orders/ORDER_ID/assign-rider" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"riderId": "RIDER_ID"}'

# Try to deactivate
curl -X PATCH "http://localhost:5000/api/admin/riders/RIDER_ID/toggle-status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Expected: Error "Cannot deactivate rider. They have 1 active order(s)..."
```

### Test Scenario 5: Assign Inactive Rider (Should Fail)
```bash
# First deactivate a rider
curl -X PATCH "http://localhost:5000/api/admin/riders/RIDER_ID/toggle-status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Try to assign them to an order
curl -X PATCH "http://localhost:5000/api/orders/ORDER_ID/assign-rider" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"riderId": "RIDER_ID"}'

# Expected: Error "Cannot assign order to an inactive rider"
```

### Test Scenario 6: Deactivated Rider Cannot Access API
```bash
# Login as rider to get token
RIDER_TOKEN=$(curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "rider@example.com", "password": "password"}' \
  | jq -r '.data.token')

# Deactivate the rider (as admin)
curl -X PATCH "http://localhost:5000/api/admin/riders/RIDER_ID/toggle-status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Try to access rider endpoints
curl -X GET "http://localhost:5000/api/rider/orders" \
  -H "Authorization: Bearer $RIDER_TOKEN"

# Expected: 403 Forbidden - "Your account is currently deactivated. Please contact admin."
```

---

## 🔧 Common Use Cases

### Use Case 1: Onboarding New Rider
1. Admin creates rider account (via user creation with role='rider')
2. Rider is automatically active (`isActive: true`)
3. Admin can view rider in riders list
4. Admin can assign orders to new rider

### Use Case 2: Temporary Rider Suspension
1. Admin views rider details
2. Admin clicks "Deactivate" button
3. System checks for active orders
4. If none, rider is deactivated
5. Rider receives real-time notification
6. Rider cannot access any endpoints
7. Cannot be assigned new orders

### Use Case 3: Reactivating Suspended Rider
1. Admin views inactive riders list
2. Admin selects rider to reactivate
3. Admin clicks "Activate" button
4. Rider is reactivated immediately
5. Rider receives real-time notification
6. Rider can access endpoints again
7. Can be assigned to orders

### Use Case 4: Rider Performance Review
1. Admin opens rider details page
2. Views delivery statistics (total, completed, pending)
3. Reviews performance metrics (success rate)
4. Checks recent order history
5. Makes decision to keep active or suspend

### Use Case 5: Handling Rider Resignation
1. Admin checks rider's active orders
2. Reassigns active orders to other riders
3. Once no active orders remain
4. Admin deactivates rider account
5. Rider data preserved for history/analytics

---

## 📈 Performance Metrics

### Delivery Statistics Per Rider
- **Total Orders**: All orders ever assigned
- **Pending**: Orders assigned but not yet picked up
- **Assigned**: Orders assigned and accepted
- **Out for Delivery**: Orders currently being delivered
- **Delivered**: Successfully completed deliveries

### Performance Calculation
```javascript
completedOrders = stats.delivered
totalOrders = stats.total
successRate = (completedOrders / totalOrders * 100).toFixed(2)
activeOrders = stats.assigned + stats.out_for_delivery
```

---

## ⚠️ Important Notes

### Backward Compatibility
- All existing users automatically get `isActive: true`
- No database migration required
- Existing functionality unaffected
- Only new rider-specific checks added

### Data Integrity
- Cannot delete riders with order history
- Deactivation preserves all data
- Can reactivate at any time
- Order history remains intact

### Security Best Practices
- All endpoints require admin authentication
- Rider status checked on every request
- Real-time notifications for status changes
- Validation at multiple levels (middleware, controller, model)

### Scalability Considerations
- Pagination on all list endpoints
- Aggregation queries optimized for large datasets
- Indexes on `role` and `isActive` fields recommended
- Recent orders limited to 10 for performance

---

## 🚀 Future Enhancements

**Potential Features:**
- Bulk activate/deactivate riders
- Rider performance rankings
- Automated rider assignment based on location/availability
- Rider shift management
- Delivery zone assignments
- Rider ratings and reviews
- Commission/payment tracking
- SMS notifications for riders
- Mobile app for rider management

---

## 📞 Support

For issues or questions:
- Check error messages carefully
- Review validation requirements
- Test with Postman/curl first
- Check server logs for detailed errors
- Verify user roles and active status

---

## ✨ Summary

The Admin Rider Management system provides:
✅ Complete rider lifecycle management  
✅ Real-time status control  
✅ Comprehensive statistics and analytics  
✅ Secure access control  
✅ Data integrity protection  
✅ Scalable architecture  
✅ Frontend-ready API design  

**All admin requirements fulfilled!** 🎉
