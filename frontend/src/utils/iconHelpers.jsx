/* eslint-disable react-refresh/only-export-components */
import * as Icons from "lucide-react";

/**
 * Dynamically render a Lucide icon by name
 * @param {string} iconName - Name of the Lucide icon (e.g., 'Apple', 'Leaf', 'ShoppingCart')
 * @param {object} props - Props to pass to the icon component (className, size, etc.)
 * @returns {JSX.Element|null} - The icon component or null if not found
 */
export const DynamicIcon = ({ iconName, className = "h-5 w-5", ...props }) => {
  const IconComponent = Icons[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in lucide-react`);
    return null;
  }

  return <IconComponent className={className} {...props} />;
};

/**
 * Get icon component by name for categories
 * @param {string} categoryId - Category ID ('fruits', 'vegetables', 'grocery')
 * @param {string} className - Icon className
 * @returns {JSX.Element} - Icon component
 */
export const getCategoryIcon = (categoryId, className = "h-6 w-6") => {
  const iconMap = {
    fruits: <Icons.Apple className={className} />,
    vegetables: <Icons.Leaf className={className} />,
    grocery: <Icons.ShoppingCart className={className} />,
  };

  return iconMap[categoryId] || <Icons.ShoppingCart className={className} />;
};

/**
 * Get icon component for order status
 * @param {string} status - Order status ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')
 * @param {string} className - Icon className
 * @returns {JSX.Element} - Icon component
 */
export const getOrderStatusIcon = (status, className = "h-5 w-5") => {
  const iconMap = {
    pending: <Icons.Clock className={className} />,
    confirmed: <Icons.CheckCircle className={className} />,
    packed: <Icons.Package className={className} />,
    shipped: <Icons.Truck className={className} />,
    delivered: <Icons.CheckCircle2 className={className} />,
    cancelled: <Icons.XCircle className={className} />,
  };

  return iconMap[status] || <Icons.Clock className={className} />;
};

/**
 * Get icon component for payment method
 * @param {string} methodId - Payment method ID ('cod', 'online')
 * @param {string} className - Icon className
 * @returns {JSX.Element} - Icon component
 */
export const getPaymentMethodIcon = (methodId, className = "h-5 w-5") => {
  const iconMap = {
    cod: <Icons.Banknote className={className} />,
    online: <Icons.CreditCard className={className} />,
  };

  return iconMap[methodId] || <Icons.CreditCard className={className} />;
};

export default DynamicIcon;
