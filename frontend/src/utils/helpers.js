import { clsx } from 'clsx';

// Combine class names utility
export function cn(...inputs) {
  return clsx(inputs);
}

// Format price in INR
export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// Format date
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Date(date).toLocaleDateString('en-IN', defaultOptions);
}

// Format date with time
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate text
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Calculate discount percentage
export function calculateDiscount(originalPrice, discountedPrice) {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Get stock status
export function getStockStatus(stock) {
  if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
  if (stock <= 5) return { text: 'Low Stock', color: 'text-amber-600', bgColor: 'bg-amber-100' };
  if (stock <= 10) return { text: 'Limited Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
}

// Debounce function
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get initials from name
export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Indian)
export function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Get category color
export function getCategoryColor(category) {
  const colors = {
    fruits: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    vegetables: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    grocery: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  };
  return colors[category] || colors.grocery;
}
