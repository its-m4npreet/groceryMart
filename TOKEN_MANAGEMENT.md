# Token Authentication & Session Management

## Overview

The GroceryMart application uses JWT (JSON Web Tokens) for authentication with a **30-day expiration period**. This document explains how token management works and ensures users don't need to login repeatedly.

## Token Expiration Configuration

### Backend (.env)

```env
JWT_EXPIRE=30d
```

This setting controls how long JWT tokens remain valid. Format options:

- `30d` = 30 days (default)
- `7d` = 7 days
- `24h` = 24 hours
- `60m` = 60 minutes

### Frontend (.env)

```env
VITE_TOKEN_EXPIRE_DAYS=30
```

Should match the backend JWT_EXPIRE setting (in days).

## How It Works

### 1. User Login

When a user logs in:

1. Backend generates a JWT token with 30-day expiration
2. Frontend stores three items in localStorage:
   - `token` - The JWT token
   - `user` - User information (name, email, role)
   - `tokenTimestamp` - When the token was created (milliseconds)

### 2. Token Persistence

- Token persists across browser sessions (survives page refresh/close)
- User stays logged in until:
  - Token expires (after 30 days)
  - User manually logs out
  - Token is invalidated on backend

### 3. Automatic Token Validation

On app load, the app:

1. Checks if token exists in localStorage
2. Checks if token timestamp is within expiration period
3. Verifies token with backend (/api/auth/verify)
4. If valid: User stays logged in
5. If expired/invalid: Clears token and shows login page

### 4. API Request Authentication

Every API request:

1. Axios interceptor automatically adds token to Authorization header
2. Backend validates token
3. If expired: Returns 401 error
4. Frontend handles 401 gracefully (clears token, redirects to login)

## Key Features

### ✅ Persistent Login

- Users don't need to login repeatedly
- Login session lasts 30 days
- Works across browser tabs/windows

### ✅ Graceful Token Expiration

- Token expiration checked on app load
- No abrupt logouts during active sessions
- Clear error messages when token expires

### ✅ Secure Token Handling

- Tokens stored in localStorage (persistent)
- Automatic cleanup on logout/expiration
- Token validation on every API request

### ✅ Smart Error Handling

- 401 errors during auth verification don't trigger redirects
- Only actual API failures cause login redirects
- Expired tokens cleared automatically

## File Changes

### Backend Files Modified

1. **`/backend/src/controllers/authController.js`**
   - Uses `process.env.JWT_EXPIRE` for token expiration
   - Ensures consistency with .env configuration

2. **`/backend/.env`**
   - `JWT_EXPIRE=30d` - Token expiration setting

3. **`/backend/.env.example`**
   - Added documentation for JWT_EXPIRE formats

### Frontend Files Modified

1. **`/frontend/src/api/axios.js`**
   - Smart 401 error handling
   - Doesn't redirect during auth verification
   - Clears token and localStorage on expiration

2. **`/frontend/src/store/slices/authSlice.js`**
   - Stores `tokenTimestamp` on login
   - Checks token expiration on app initialization
   - Auto-clears expired tokens
   - Imports `TOKEN_EXPIRE_MS` constant

3. **`/frontend/src/config/constants.js`**
   - Added `TOKEN_EXPIRE_DAYS` - Configurable expiration (days)
   - Added `TOKEN_EXPIRE_MS` - Expiration in milliseconds

4. **`/frontend/.env` and `/frontend/.env.example`**
   - Added `VITE_TOKEN_EXPIRE_DAYS=30`

## Testing Token Management

### Test Cases

#### ✅ Fresh Login

1. Login with valid credentials
2. Token stored in localStorage
3. User stays logged in

#### ✅ Page Refresh

1. Refresh browser
2. Token validated automatically
3. User remains logged in (no redirect)

#### ✅ Close & Reopen Browser

1. Close all browser windows
2. Reopen application
3. User still logged in (within 30 days)

#### ✅ Token Expiration

1. Wait 30 days (or modify timestamp for testing)
2. Reload page
3. Token cleared, redirected to login
4. Error message: "Session expired"

#### ✅ Invalid Token

1. Manually modify token in localStorage
2. Make an API request
3. Token cleared, redirected to login

#### ✅ Manual Logout

1. Click logout button
2. Token removed from localStorage
3. Redirected to home/login page

## Testing Token Expiration (Development)

To test token expiration without waiting 30 days:

### Option 1: Modify Timestamp

```javascript
// In browser console
const timestamp = Date.now() - 31 * 24 * 60 * 60 * 1000; // 31 days ago
localStorage.setItem("tokenTimestamp", timestamp.toString());
location.reload();
```

### Option 2: Shorten Expiration

Temporarily change backend .env:

```env
JWT_EXPIRE=1m  # 1 minute for testing
```

Restart backend server, login, wait 1 minute, test.

### Option 3: Mock Time

```javascript
// In frontend constants temporarily
export const TOKEN_EXPIRE_MS = 60000; // 1 minute
```

## Storage Details

### localStorage Keys

| Key              | Value       | Purpose              |
| ---------------- | ----------- | -------------------- |
| `token`          | JWT string  | Authentication token |
| `user`           | JSON object | User profile data    |
| `tokenTimestamp` | Number (ms) | Token creation time  |

### Why localStorage?

- **Persistence**: Survives page refresh and browser close
- **Accessibility**: Easy to access from any component
- **Standard**: Common practice for web apps

Note: For higher security requirements, consider httpOnly cookies with backend session management.

## Security Considerations

### ✅ Current Security Features

- Token expiration (30 days)
- HTTPS recommended in production
- Token validated on every request
- Automatic cleanup on expiration
- No token in URL/query parameters

### 🔒 Production Recommendations

1. Use strong JWT_SECRET (random, 256+ bits)
2. Enable HTTPS only
3. Set secure CORS policies
4. Consider refresh tokens for longer sessions
5. Implement token blacklisting for immediate logout
6. Add rate limiting on auth endpoints

## Troubleshooting

### Problem: User logged out unexpectedly

**Causes:**

- Token expired (>30 days old)
- localStorage cleared (by user or extension)
- Backend JWT_SECRET changed
- Browser privacy mode deleted storage

**Solution:** User needs to login again

### Problem: Token expired immediately

**Causes:**

- Backend JWT_EXPIRE misconfigured
- Frontend TOKEN_EXPIRE_DAYS doesn't match backend
- System clock incorrect

**Solution:** Check .env settings on both frontend/backend

### Problem: "Session expired" on every page load

**Causes:**

- tokenTimestamp not being saved
- TOKEN_EXPIRE_MS calculation error

**Solution:** Clear localStorage and login again

### Problem: Stuck in login loop

**Causes:**

- axios interceptor redirecting during auth check
- checkAuth failing silently

**Solution:**

- Fixed in current version
- Check browser console for errors
- Verify backend is running

## Backend API Endpoints

### POST /api/auth/signin

Login user and get token

```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### GET /api/auth/verify

Verify token and get user data (requires Authorization header)

```json
Headers:
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

## Summary of Changes

### What was fixed:

1. ✅ Token now properly expires after 30 days (not immediately)
2. ✅ Users don't need to login repeatedly
3. ✅ Token timestamp tracked for client-side expiration check
4. ✅ Smart error handling prevents unnecessary redirects
5. ✅ Token expiration configurable via environment variables
6. ✅ Auto-cleanup of expired tokens on app load

### What users will experience:

1. ✅ Login once, stay logged in for 30 days
2. ✅ No interruptions during active use
3. ✅ Smooth page refreshes (no re-login needed)
4. ✅ Browser close/reopen keeps session alive
5. ✅ Clear "Session expired" message after 30 days
6. ✅ Manual logout still works immediately
