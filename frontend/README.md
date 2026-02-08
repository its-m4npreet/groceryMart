# GroceryMart Frontend

A modern e-commerce platform for fresh groceries built with React, Redux, and Tailwind CSS.

## Features

- 🛒 Product browsing and search
- 🔥 Hot deals and special offers
- 🛍️ Shopping cart and checkout
- 👤 User authentication and profiles
- 📦 Order tracking
- 💬 WhatsApp support integration
- 📱 Responsive design
- ⚡ Real-time updates with Socket.io

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd groceryMart/frontend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then update the values in `.env` according to your setup.

### Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=THETAHLIADDA MART
VITE_APP_URL=http://localhost:5173

# Contact Information
VITE_SUPPORT_PHONE=1800-123-4567
VITE_SUPPORT_EMAIL=support@THETAHLIADDA MART.com
VITE_WHATSAPP_NUMBER=918001234567
VITE_WHATSAPP_MESSAGE=Hi%20THETAHLIADDA MART%2C%20I%20need%20help%20with

# Business Information
VITE_BUSINESS_HOURS=8:00 AM - 10:00 PM
VITE_BUSINESS_DAYS=Monday - Sunday
VITE_BUSINESS_ADDRESS=123 Fresh Street, Green Valley, Mumbai, Maharashtra 400001

# Free Delivery Threshold (in rupees)
VITE_FREE_DELIVERY_THRESHOLD=500
VITE_DELIVERY_CHARGE=40

# Feature Flags
VITE_ENABLE_LIVE_CHAT=false
VITE_ENABLE_WHATSAPP=true
```

**Important Notes:**

- All Vite environment variables must be prefixed with `VITE_`
- Update `VITE_API_URL` and `VITE_SOCKET_URL` to match your backend server
- Update `VITE_WHATSAPP_NUMBER` with your actual WhatsApp Business number (format: country code + number, no spaces or special characters)
- For production, update all URLs and contact information accordingly

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client and endpoints
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── config/         # Configuration and constants
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # External services (socket, etc.)
│   ├── store/          # Redux store and slices
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── .env                # Environment variables (not committed)
├── .env.example        # Example environment variables
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
