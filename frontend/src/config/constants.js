// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || "THETAHLIADDA MART";
export const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

// Contact Information
export const SUPPORT_PHONE =
  import.meta.env.VITE_SUPPORT_PHONE || "1800-123-4567";
export const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || "support@THETAHLIADDA MART.com";
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "918001234567";
export const WHATSAPP_MESSAGE =
  import.meta.env.VITE_WHATSAPP_MESSAGE ||
  "Hi%20THETAHLIADDA MART%2C%20I%20need%20help%20with";

// Business Information
export const BUSINESS_HOURS =
  import.meta.env.VITE_BUSINESS_HOURS || "8:00 AM - 10:00 PM";
export const BUSINESS_DAYS =
  import.meta.env.VITE_BUSINESS_DAYS || "Monday - Sunday";
export const BUSINESS_ADDRESS =
  import.meta.env.VITE_BUSINESS_ADDRESS ||
  "123 Fresh Street, Green Valley, Mumbai, Maharashtra 400001";

// Delivery Configuration
export const FREE_DELIVERY_THRESHOLD =
  parseInt(import.meta.env.VITE_FREE_DELIVERY_THRESHOLD) || 500;
export const DELIVERY_CHARGE =
  parseInt(import.meta.env.VITE_DELIVERY_CHARGE) || 40;

// Feature Flags
export const ENABLE_LIVE_CHAT =
  import.meta.env.VITE_ENABLE_LIVE_CHAT === "true";
export const ENABLE_WHATSAPP = import.meta.env.VITE_ENABLE_WHATSAPP !== "false"; // Default true

// Authentication
export const TOKEN_EXPIRE_DAYS =
  parseInt(import.meta.env.VITE_TOKEN_EXPIRE_DAYS) || 30;
export const TOKEN_EXPIRE_MS = TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds

// Product Categories
export const CATEGORIES = [
  { id: "fruits", name: "Fresh Fruits", icon: "Apple", color: "bg-red-100" },
  { id: "vegetables", name: "Vegetables", icon: "Leaf", color: "bg-green-100" },
  {
    id: "grocery",
    name: "Grocery",
    icon: "ShoppingCart",
    color: "bg-amber-100",
  },
  {
    id: "bakery",
    name: "Bakery",
    icon: "Croissant",
    color: "bg-orange-100",
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: "Coffee",
    color: "bg-brown-100",
  },
  {
    id: "snacks",
    name: "Snacks",
    icon: "Cookie",
    color: "bg-yellow-100",
  },
  {
    id: "cold-drinks",
    name: "Cold Drinks",
    icon: "GlassWater",
    color: "bg-blue-100",
  },
  {
    id: "dairy",
    name: "Dairy Products",
    icon: "Milk",
    color: "bg-sky-100",
  },
  {
    id: "frozen",
    name: "Frozen Foods",
    icon: "Snowflake",
    color: "bg-cyan-100",
  },
  {
    id: "personal-care",
    name: "Personal Care",
    icon: "Sparkles",
    color: "bg-pink-100",
  },
  {
    id: "daily-essentials",
    name: "Daily Essentials",
    icon: "Home",
    color: "bg-violet-100",
  },
];

// Product Units
export const UNITS = [
  "kg",
  "g",
  "piece",
  "dozen",
  "pack",
  "liter",
  "ml",
  "tube",
  "box",
  "bottle",
  "can",
  "jar",
  "bag",
  "bundle",
  "tray",
  "carton",
];

// Order Statuses
export const ORDER_STATUSES = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: "Clock",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: "CheckCircle",
  },
  packed: {
    label: "Packed",
    color: "bg-indigo-100 text-indigo-800",
    icon: "Package",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    icon: "Truck",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: "CheckCircle2",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: "XCircle",
  },
};

// Payment Methods
export const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", icon: "Banknote" },
  { id: "online", name: "Online Payment", icon: "CreditCard" },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48];

// Image Placeholders
export const PLACEHOLDER_PRODUCT_IMAGE = "/images/placeholder-product.png";
export const PLACEHOLDER_USER_AVATAR = "/images/placeholder-avatar.png";

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  JOIN_ADMIN: "join-admin",
  ADMIN_JOINED: "admin-joined",
  PRODUCT_CREATED: "product-created",
  PRODUCT_UPDATED: "product-updated",
  PRODUCT_DELETED: "product-deleted",
  NEW_ORDER: "new-order",
  ORDER_STATUS_UPDATED: "order-status-updated",
  ORDER_CANCELLED: "order-cancelled",
};
