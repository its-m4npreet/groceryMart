import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
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
  Leaf,
  Flame,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import {
  openCart,
  toggleMobileMenu,
  closeMobileMenu,
} from "../../store/slices/uiSlice";
import { CATEGORIES, SUPPORT_PHONE } from "../../config/constants";
import { getCategoryIcon } from "../../utils/iconHelpers";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { isMobileMenuOpen } = useSelector((state) => state.ui);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categoryScrollRef = useRef(null);

  // Detect scroll for shrinking header on desktop with hysteresis to prevent blinking
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          
          // Add hysteresis: different thresholds for scrolling down vs up
          if (!isScrolled && scrollPosition > 60) {
            setIsScrolled(true);
          } else if (isScrolled && scrollPosition < 40) {
            setIsScrolled(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Check scroll position for category navigation
  useEffect(() => {
    const checkScroll = () => {
      if (categoryScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = categoryScrollRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [isScrolled]);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = categoryScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      categoryScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className={`sticky top-0 z-40 bg-white shadow-sm transition-all duration-300 ${isScrolled ? 'lg:py-0' : ''}`}>
      {/* Top Bar - Hide on scroll for desktop */}
      <div className={`bg-gray-900 text-gray-300 text-sm hidden md:block transition-all duration-300 ease-in-out ${isScrolled ? 'lg:h-0 lg:overflow-hidden lg:opacity-0' : 'lg:opacity-100'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Delivering across India
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {SUPPORT_PHONE}
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
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'lg:h-14' : 'h-16 lg:h-20'}`}>
          {/* Mobile Menu Button */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`bg-primary-600 rounded-xl flex items-center justify-center text-white transition-all duration-300 ${isScrolled ? 'lg:h-8 lg:w-8' : 'h-10 w-10'}`}>
              <Leaf className={`transition-all duration-300 ${isScrolled ? 'lg:h-5 lg:w-5' : 'h-6 w-6'}`} />
            </div>
            <span className={`font-bold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-sm lg:text-base hidden sm:block' : 'text-lg sm:text-xl hidden sm:block'}`}>
              THETAHLIADDA<span className="text-primary-600">MART</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex flex-1 transition-all duration-300 ${isScrolled ? 'lg:max-w-md mx-2 lg:mx-4' : 'max-w-xl mx-4 lg:mx-8'}`}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for fruits, vegetables, groceries..."
                className={`w-full pl-4 md:pl-5 pr-10 md:pr-12 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm md:text-base ${isScrolled ? 'lg:h-9' : 'h-10 md:h-11'}`}
              />
              <button
                type="submit"
                className={`absolute right-1 top-1/2 -translate-y-1/2 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-all ${isScrolled ? 'h-7 w-7 lg:h-7 lg:w-7' : 'h-8 w-8 md:h-9 md:w-9'}`}
              >
                <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:flex p-2 sm:p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(openCart())}
              className="flex items-center gap-1 sm:gap-2 p-2 sm:p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <span className="hidden sm:block text-sm font-medium">Cart</span>
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 sm:gap-2 p-2 sm:p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm sm:text-base">
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
                        <p className="font-medium text-gray-900">
                          {user?.name}
                        </p>
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
                        {user?.role === "admin" && (
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

      {/* Category Navigation - Merge with header when scrolled on desktop */}
      <nav className={`bg-gray-50 border-t border-gray-100 hidden lg:block transition-all duration-300 ${isScrolled ? 'lg:hidden' : ''}`}>
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
                        {getCategoryIcon(category.id, "h-5 w-5")}
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
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Home
              </Link>
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
                to="/products?category=bakery"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Bakery
              </Link>
              <Link
                to="/products?category=snacks"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Snacks
              </Link>
              <Link
                to="/products?category=daily-essentials"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Daily Essentials
              </Link>
              <Link
                to="/deals"
                className="text-red-600 font-medium hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <Flame className="h-4 w-4" />
                Hot Deals
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Compact Category Navigation when scrolled - Desktop only */}
      {isScrolled && (
        <div className="hidden lg:block border-t border-gray-100 bg-gray-50 relative">
          <div className="container mx-auto px-4 relative">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
            )}

            {/* Scrollable Categories */}
            <div 
              ref={categoryScrollRef}
              className="flex items-center gap-3 py-2 overflow-x-auto scrollbar-hide scroll-smooth"
            >
              <Link
                to="/"
                className="text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors whitespace-nowrap px-3 py-1"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors whitespace-nowrap px-3 py-1"
              >
                All Products
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors whitespace-nowrap px-3 py-1 flex items-center gap-1.5"
                >
                  {getCategoryIcon(category.id, "h-3.5 w-3.5")}
                  {category.name}
                </Link>
              ))}
              <Link
                to="/deals"
                className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors flex items-center gap-1 whitespace-nowrap px-3 py-1"
              >
                <Flame className="h-3 w-3" />
                Hot Deals
              </Link>
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={() => scrollCategories('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      )}

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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => dispatch(closeMobileMenu())}
                >
                  <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    THETAHLIADDA<span className="text-primary-600">MART</span>
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
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-10 pl-4 pr-10 text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
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
              <nav className="p-3 sm:p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    onClick={() => dispatch(closeMobileMenu())}
                    className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                  >
                    <span className="text-lg sm:text-xl">{category.icon}</span>
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
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  All Products
                </Link>
                <Link
                  to="/orders"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
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
