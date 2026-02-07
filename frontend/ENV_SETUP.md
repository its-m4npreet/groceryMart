# Environment Variables Setup - Summary

## Files Created

1. **`.env`** - Contains actual environment variables (not committed to git)
2. **`.env.example`** - Template file with example values (committed to git)

## Environment Variables Configured

### API Configuration

- `VITE_API_URL` - Backend API base URL
- `VITE_SOCKET_URL` - WebSocket server URL

### App Configuration

- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Frontend application URL

### Contact Information

- `VITE_SUPPORT_PHONE` - Customer support phone number
- `VITE_SUPPORT_EMAIL` - Customer support email
- `VITE_WHATSAPP_NUMBER` - WhatsApp Business number
- `VITE_WHATSAPP_MESSAGE` - Default WhatsApp message template

### Business Information

- `VITE_BUSINESS_HOURS` - Operating hours
- `VITE_BUSINESS_DAYS` - Operating days
- `VITE_BUSINESS_ADDRESS` - Physical address

### Application Settings

- `VITE_FREE_DELIVERY_THRESHOLD` - Minimum order for free delivery (₹)
- `VITE_DELIVERY_CHARGE` - Standard delivery fee (₹)

### Feature Flags

- `VITE_ENABLE_LIVE_CHAT` - Enable/disable live chat feature
- `VITE_ENABLE_WHATSAPP` - Enable/disable WhatsApp support

## Files Updated to Use Environment Variables

### 1. `/src/config/constants.js`

Added exports for all environment variables with fallback defaults:

- API configuration
- App configuration
- Contact information
- Business information
- Delivery settings
- Feature flags

### 2. `/src/pages/HelpCenterPage.jsx`

Updated to use:

- `SUPPORT_PHONE` - Phone number in contact cards and links
- `SUPPORT_EMAIL` - Email address in contact cards and links
- `WHATSAPP_NUMBER` - WhatsApp number for support
- `WHATSAPP_MESSAGE` - Pre-filled WhatsApp message
- `BUSINESS_HOURS` - Displayed in business info section
- `BUSINESS_DAYS` - Displayed in business info section
- `BUSINESS_ADDRESS` - Displayed in business info section
- `FREE_DELIVERY_THRESHOLD` - In FAQ answer
- `DELIVERY_CHARGE` - In FAQ answer

### 3. `/src/components/layout/Header.jsx`

Updated to use:

- `SUPPORT_PHONE` - Phone number in top bar

### 4. `/src/components/layout/Footer.jsx`

Updated to use:

- `SUPPORT_PHONE` - Phone number in contact info
- `SUPPORT_EMAIL` - Email in contact info
- `FREE_DELIVERY_THRESHOLD` - In features section

### 5. `/src/pages/HomePage.jsx`

Updated to use:

- `FREE_DELIVERY_THRESHOLD` - In features section

### 6. `/src/pages/ProductDetailPage.jsx`

Updated to use:

- `FREE_DELIVERY_THRESHOLD` - In delivery information

### 7. `/frontend/README.md`

Completely updated with:

- Project overview and features
- Tech stack details
- Installation instructions
- Environment variables documentation
- Project structure
- Available scripts

## How to Use

### For Development

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update values in `.env` as needed for your local environment

3. Restart the dev server to load new variables:
   ```bash
   npm run dev
   ```

### For Production

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)

2. Update the following variables for production:
   - `VITE_API_URL` - Your production API URL
   - `VITE_SOCKET_URL` - Your production WebSocket URL
   - `VITE_APP_URL` - Your production frontend URL
   - `VITE_SUPPORT_PHONE` - Your actual support phone
   - `VITE_SUPPORT_EMAIL` - Your actual support email
   - `VITE_WHATSAPP_NUMBER` - Your WhatsApp Business number

3. Build the project:
   ```bash
   npm run build
   ```

## Important Notes

1. **All Vite environment variables must be prefixed with `VITE_`**
   - This is a Vite requirement for security
   - Only variables with this prefix are exposed to the frontend

2. **`.env` file is gitignored**
   - Never commit `.env` file to version control
   - Add sensitive values only to `.env`, not `.env.example`

3. **Changes require restart**
   - After changing `.env`, restart the dev server
   - Build process automatically picks up env variables

4. **WhatsApp Number Format**
   - Use country code without + or spaces
   - Example: `918001234567` (91 = India, followed by number)

5. **URL Message Encoding**
   - WhatsApp message must be URL encoded
   - Spaces = `%20`, special chars need encoding

## Benefits

✅ **Centralized Configuration** - All important settings in one place
✅ **Environment-specific Settings** - Different values for dev/staging/production
✅ **Easy Updates** - Change settings without modifying code
✅ **Security** - Sensitive data not hardcoded in source
✅ **Team Collaboration** - `.env.example` helps team members set up quickly
✅ **Deployment Ready** - Easy to configure in hosting platforms

## Testing

After setup, verify that:

- [ ] Phone numbers are clickable and correct
- [ ] Email links open mail client with correct address
- [ ] WhatsApp button opens WhatsApp with correct number and message
- [ ] Business hours and address display correctly
- [ ] Free delivery threshold shows correct amount
- [ ] API calls work with configured URLs

## Troubleshooting

**Problem**: Environment variables not loading
**Solution**: Make sure variables are prefixed with `VITE_` and restart dev server

**Problem**: Changes not reflecting
**Solution**: Clear browser cache and rebuild: `npm run build`

**Problem**: WhatsApp not opening
**Solution**: Check number format (no spaces, includes country code)

**Problem**: 404 errors on API calls
**Solution**: Verify `VITE_API_URL` is correct and backend is running
