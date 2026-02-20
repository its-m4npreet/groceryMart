# User Settings Update Testing Guide

## Changes Made

### Backend Updates

1. **User Model (`userModel.js`)**
   - ✅ Added `phone` field (String)
   - ✅ Added `address` object with:
     - street
     - city
     - state
     - pincode
     - country (default: "India")
   - ✅ Added `notifications` object with:
     - orderUpdates (default: true)
     - promotions (default: true)
     - newsletter (default: false)
     - stockAlerts (default: true)

2. **Auth Controller (`authController.js`)**
   - ✅ Updated `updateProfile` to handle phone and address
   - ✅ Updated all endpoints to return complete user data including:
     - phone
     - address
     - notifications
   - ✅ Updated `updateNotifications` to return updated user data

### Frontend Updates

1. **Settings Page (`SettingsPage.jsx`)**
   - ✅ Added address input fields:
     - Street Address
     - City
     - State
     - Pincode
     - Country
   - ✅ Syncs notification settings from user data on load
   - ✅ Updates Redux store after profile changes
   - ✅ Updates Redux store after notification changes
   - ✅ All changes persist to secure localStorage

2. **Redux Store (`authSlice.js`)**
   - ✅ `setUser` action properly updates state and localStorage
   - ✅ User data persists encrypted in localStorage

## How to Test

### 1. Test Profile Updates

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Login to your account

4. Navigate to Settings page (`/settings`)

5. **Test Name Change:**
   - Update your name
   - Click "Save Changes"
   - Verify success message appears
   - Refresh the page
   - Confirm name is still updated
   - Check if name appears in header/profile

6. **Test Email Change:**
   - Update your email
   - Click "Save Changes"
   - Verify success message
   - Refresh page to confirm persistence

7. **Test Phone Number:**
   - Add/update phone number
   - Click "Save Changes"
   - Verify it persists after refresh

8. **Test Address:**
   - Fill in all address fields:
     - Street Address
     - City
     - State
     - Pincode
     - Country
   - Click "Save Changes"
   - Verify success message
   - Refresh page
   - Confirm all address fields are still populated

### 2. Test Password Change

1. Go to "Security" tab in Settings

2. Enter:
   - Current password
   - New password (min 6 characters)
   - Confirm new password

3. Click "Change Password"

4. Verify success message

5. Logout and try logging in with new password

6. Verify you can login successfully

### 3. Test Notification Preferences

1. Go to "Notifications" tab in Settings

2. Toggle different notification options:
   - Order Updates
   - Promotions & Offers
   - Newsletter
   - Stock Alerts

3. Click "Save Preferences"

4. Verify success message

5. Refresh the page

6. Confirm all toggles maintain their state

### 4. Test Data Persistence Across Sessions

1. Make changes to profile, password, or notifications

2. Logout

3. Login again

4. Go to Settings

5. Verify all your changes are still there

### 5. Test Real-time Updates

1. Update your profile information

2. Without refreshing, navigate to other pages

3. Check if header/navigation shows updated name

4. Return to settings

5. Verify data is still current

## API Endpoints Involved

- `PATCH /api/auth/profile` - Update user profile (name, email, phone, address)
- `PATCH /api/auth/change-password` - Change password
- `PATCH /api/auth/notifications` - Update notification preferences
- `GET /api/auth/verify` - Verify token and get user data

## Expected Behavior

✅ All changes should immediately reflect in:
- Settings form fields
- Redux store (`state.auth.user`)
- Encrypted localStorage (`user` key)
- Backend database

✅ After page refresh:
- All data should persist
- Form fields should be pre-populated with saved data

✅ After logout/login:
- All saved settings should remain
- User sees their personalized data

## Troubleshooting

If changes don't persist:

1. **Check Browser Console** for errors
2. **Check Network Tab** - verify API responses include updated user data
3. **Check Redux DevTools** - verify `state.auth.user` is updated
4. **Check localStorage** - verify encrypted user data is stored
5. **Check Backend Logs** - verify data is saved to database

## Database Verification

You can verify data is saved in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.findOne({ email: "your@email.com" })
```

Should show:
```json
{
  "name": "Updated Name",
  "email": "your@email.com",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "notifications": {
    "orderUpdates": true,
    "promotions": false,
    "newsletter": true,
    "stockAlerts": true
  }
}
```

## Security Features

✅ User data encrypted in localStorage
✅ Password hashed in database
✅ Email validation on update
✅ Password strength validation
✅ Current password verification for password change
