# Admin Actions Testing Guide

This guide explains how to test all admin actions in the GroceryMart application.

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. Frontend server running on `http://localhost:5173`
3. Admin user account (role: 'admin')
4. MongoDB database connected

## Admin Actions Endpoints

### 1. Bulk Price Update

**Endpoint:** `PATCH /api/admin/products/bulk-price`

**Request Body:**

```json
{
  "percentage": 10,
  "action": "increase" // or "decrease"
}
```

**Validation:**

- `percentage`: Must be a positive number, max 100
- `action`: Must be "increase" or "decrease"

**Test:**

1. Login as admin
2. Navigate to `/admin/actions`
3. Select "Increase" or "Decrease"
4. Enter percentage (e.g., 10)
5. Click "Apply"
6. Verify success message shows count of updated products

---

### 2. Bulk Stock Update

**Endpoint:** `PATCH /api/admin/products/bulk-stock`

**Request Body:**

```json
{
  "quantity": 50,
  "action": "add" // or "subtract" or "set"
}
```

**Validation:**

- `quantity`: Must be a non-negative integer
- `action`: Must be "add", "subtract", or "set"

**Test:**

1. Select action (Add/Subtract/Set)
2. Enter quantity
3. Click "Apply"
4. Verify all products' stock updated

---

### 3. Delete Out of Stock Products

**Endpoint:** `DELETE /api/admin/products/out-of-stock`

**Test:**

1. Add some products with stock: 0
2. Click "Delete All Out of Stock Products"
3. Confirm deletion
4. Verify deleted count in success message
5. Check database - products with stock=0 should be removed

---

### 4. Export Products to CSV

**Endpoint:** `GET /api/admin/export/products`

**Test:**

1. Click "Export Products"
2. CSV file should download automatically
3. Open file and verify columns: ID, Name, Category, Price, Stock, Description
4. Verify all products are included

---

### 5. Export Orders to CSV

**Endpoint:** `GET /api/admin/export/orders`

**Test:**

1. Click "Export Orders"
2. CSV file should download automatically
3. Verify columns: Order Number, User Name, User Email, Status, Total Amount, Created At
4. Verify all orders are included

---

### 6. Export Users to CSV

**Endpoint:** `GET /api/admin/export/users`

**Test:**

1. Click "Export Users"
2. CSV file should download automatically
3. Verify columns: ID, Name, Email, Role, Created At
4. Verify all users included (passwords excluded)

---

### 7. Clear Cache

**Endpoint:** `POST /api/admin/system/clear-cache`

**Test:**

1. Click "Clear Cache"
2. Verify success message
3. Note: Actual cache clearing implementation depends on your caching strategy

---

### 8. Database Cleanup

**Endpoint:** `POST /api/admin/system/cleanup-db`

**Test:**

1. Click "Database Cleanup"
2. Confirm action
3. Verify success message
4. Note: Implement actual cleanup logic for orphaned records

---

## Security Notes

✅ All endpoints require:

- Valid JWT token
- Admin role (role === 'admin')

✅ Validation applied:

- Request body validated with Zod schemas
- Input sanitization
- Type checking

✅ Error handling:

- Invalid input returns 400 with error message
- Unauthorized access returns 401
- Non-admin users return 403
- Server errors return 500 with generic message

---

## Testing with Postman/cURL

### Example: Bulk Price Update

```bash
curl -X PATCH http://localhost:5000/api/admin/products/bulk-price \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"percentage": 10, "action": "increase"}'
```

### Example: Export Products

```bash
curl -X GET http://localhost:5000/api/admin/export/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  --output products.csv
```

---

## Common Issues

### Issue: 401 Unauthorized

**Solution:** Ensure you're logged in as admin and token is valid

### Issue: 403 Forbidden

**Solution:** User must have role='admin' in database

### Issue: Validation Error (400)

**Solution:** Check request body matches schema requirements

### Issue: Export fails

**Solution:** Ensure products/orders/users exist in database

---

## Expected Behavior

### Bulk Price Update:

- ✅ Updates all products in one transaction
- ✅ Rounds prices to 2 decimal places
- ✅ Returns count of modified products

### Bulk Stock Update:

- ✅ Updates all products
- ✅ Prevents negative stock (subtract action)
- ✅ Returns count of modified products

### Delete Out of Stock:

- ✅ Only deletes products with stock === 0
- ✅ Returns count of deleted products
- ✅ Cannot be undone

### Export Functions:

- ✅ Returns CSV format
- ✅ Proper headers set
- ✅ Auto-downloads in browser
- ✅ Filename includes timestamp

---

## Next Steps

1. Run backend: `cd backend && npm start`
2. Run frontend: `cd frontend && npm run dev`
3. Create admin user in database
4. Login as admin
5. Test each action systematically
6. Verify database changes
7. Check logs for any errors
