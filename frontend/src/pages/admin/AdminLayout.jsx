import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import socketService from '../../services/socketService';
import { SOCKET_EVENTS } from '../../config/constants';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Join admin room and listen for notifications
  useEffect(() => {
    socketService.joinAdmin();
    
    socketService.onNewOrder((order) => {
      setNotifications((prev) => [
        { id: Date.now(), type: 'order', message: `New order #${order.orderNumber}`, data: order },
        ...prev
      ]);
      toast.success(`New order received! #${order.orderNumber}`);
    });

    return () => {
      socketService.off(SOCKET_EVENTS.NEW_ORDER);
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🥬</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              Admin Panel
            </span>
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
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
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
                {navigation.find((item) => isActive(item))?.name || 'Admin'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
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
