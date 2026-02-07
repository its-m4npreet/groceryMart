import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { openCart, toggleMobileMenu, closeMobileMenu } from '../../store/slices/uiSlice';
import { CATEGORIES } from '../../config/constants';
// Utility imports

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { isMobileMenuOpen } = useSelector((state) => state.ui);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-300 text-sm hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Delivering across India
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                1800-123-4567
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/help" className="hover:text-white transition-colors">
                Help Center
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <span className="text-primary-400">Welcome, {user?.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🥬</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Fresh<span className="text-primary-600">Mart</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for fruits, vegetables, groceries..."
                className="w-full h-11 pl-5 pr-12 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:flex p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(openCart())}
              className="flex items-center gap-2 p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="hidden sm:block text-sm font-medium">Cart</span>
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="bg-gray-50 border-t border-gray-100 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 h-12">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowCategoryMenu(true)}
                onMouseLeave={() => setShowCategoryMenu(false)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <Menu className="h-4 w-4" />
                All Categories
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setShowCategoryMenu(true)}
                    onMouseLeave={() => setShowCategoryMenu(false)}
                    className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <span className="text-xl">{category.icon}</span>
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6">
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/products?category=fruits"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Fresh Fruits
              </Link>
              <Link
                to="/products?category=vegetables"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Vegetables
              </Link>
              <Link
                to="/products?category=grocery"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Grocery
              </Link>
              <Link
                to="/deals"
                className="text-red-600 font-medium hover:text-red-700 transition-colors flex items-center gap-1"
              >
                🔥 Hot Deals
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(closeMobileMenu())}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => dispatch(closeMobileMenu())}
                >
                  <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🥬</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    Fresh<span className="text-primary-600">Mart</span>
                  </span>
                </Link>
                <button
                  onClick={() => dispatch(closeMobileMenu())}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-100">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Mobile Navigation */}
              <nav className="p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    onClick={() => dispatch(closeMobileMenu())}
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                  >
                    <span className="text-xl">{category.icon}</span>
                    {category.name}
                  </Link>
                ))}

                <div className="border-t border-gray-100 my-4" />

                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Links
                </h3>
                <Link
                  to="/products"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  All Products
                </Link>
                <Link
                  to="/orders"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  <Package className="h-5 w-5" />
                  My Orders
                </Link>

                {!isAuthenticated && (
                  <>
                    <div className="border-t border-gray-100 my-4" />
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => dispatch(closeMobileMenu())}
                        className="block w-full text-center py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => dispatch(closeMobileMenu())}
                        className="block w-full text-center py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
