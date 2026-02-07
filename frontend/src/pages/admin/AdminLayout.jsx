import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import socketService from "../../services/socketService";
import { SOCKET_EVENTS } from "../../config/constants";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Join admin room and listen for notifications
  useEffect(() => {
    socketService.joinAdmin();

    // Listen for new orders
    socketService.onNewOrder((order) => {
      const notification = {
        id: Date.now(),
        type: "order",
        title: "New Order",
        message: `Order #${order.orderNumber || order._id?.slice(-8)} received`,
        data: order,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
      toast.success(`New order received! #${order.orderNumber || order._id?.slice(-8)}`);
    });

    // Listen for order status updates
    socketService.onOrderStatusUpdate((data) => {
      const notification = {
        id: Date.now(),
        type: "order-update",
        title: "Order Updated",
        message: `Order #${data.orderNumber || data._id?.slice(-8)} ${data.status}`,
        data: data,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
    });

    // Listen for order cancellations
    socketService.onOrderCancelled((data) => {
      const notification = {
        id: Date.now(),
        type: "order-cancelled",
        title: "Order Cancelled",
        message: `Order #${data.orderNumber || data._id?.slice(-8)} was cancelled`,
        data: data,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
      toast.error(`Order cancelled: #${data.orderNumber || data._id?.slice(-8)}`);
    });

    // Listen for product updates
    socketService.onProductUpdate((data) => {
      if (data.type === "stock" && data.oldStock > 10 && data.newStock <= 10) {
        const notification = {
          id: Date.now(),
          type: "low-stock",
          title: "Low Stock Alert",
          message: `${data.name} stock is low (${data.newStock} left)`,
          data: data,
          timestamp: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev]);
      }
    });

    return () => {
      socketService.off(SOCKET_EVENTS.NEW_ORDER);
      socketService.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED);
      socketService.off(SOCKET_EVENTS.ORDER_CANCELLED);
      socketService.off(SOCKET_EVENTS.PRODUCT_UPDATED);
    };
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Actions", href: "/admin/actions", icon: Zap },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return "🛒";
      case "order-update":
        return "📦";
      case "order-cancelled":
        return "❌";
      case "low-stock":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div 
      className="min-h-screen bg-gray-100"
      onClick={() => showNotifications && setShowNotifications(false)}
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🥬</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full"
          >
            <LogOut className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-gray-900 hidden lg:block">
                {navigation.find((item) => isActive(item))?.name || "Admin"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                          {unreadCount > 0 && (
                            <span className="ml-2 text-sm text-gray-500">
                              ({unreadCount} unread)
                            </span>
                          )}
                        </h3>
                        {notifications.length > 0 && (
                          <div className="flex gap-2">
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              Mark all read
                            </button>
                            <button
                              onClick={clearAll}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Clear all
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  !notif.read ? "bg-blue-50" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl">
                                    {getNotificationIcon(notif.type)}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notif.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                      {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {timeAgo(notif.timestamp)}
                                    </p>
                                  </div>
                                  {!notif.read && (
                                    <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Store Link */}
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
              >
                View Store
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
