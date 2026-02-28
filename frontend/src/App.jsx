import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";
import store from "./store";
import { checkAuth } from "./store/slices/authSlice";
import socketService from "./services/socketService";
import { setNavigate } from "./utils/navigationService";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AdminLayout } from "./pages/admin";

// Auth Components
import { ProtectedRoute, AdminRoute } from "./components/auth";

// Pages
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  HotDealsPage,
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  OrdersPage,
  OrderDetailPage,
  DashboardPage,
  AdminProductsPage,
  AdminOrdersPage,
  AdminOrderDetailPage,
  AdminActionsPage,
  NotFoundPage,
  HelpCenterPage,
  WishlistPage,
  SettingsPage,
  ContactPage,
  AboutPage,
  PrivacyPolicyPage,
  TermsPage,
  ReturnPolicyPage,
  ShippingInfoPage,
  CancellationPage,
  FAQsPage,
} from "./pages";

// Auth Initialization Component
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { isGlobalLoading } = useSelector((state) => state.ui);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Check if we are on the Home Page to decide if we wait for home data
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (error) {
          console.error("Auth check failed:", error);
        } finally {
          setIsAuthInitialized(true);
        }
      } else {
        setIsAuthInitialized(true);
      }
    };
    handleAuth();
  }, [dispatch]);

  useEffect(() => {
    // Connect socket when authenticated
    if (isAuthenticated && token) {
      const storedToken = localStorage.getItem("token");
      socketService.connect(storedToken);
    } else {
      socketService.disconnect();
    }

    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  // COMBINED LOADING LOGIC:
  // 1. Auth is NOT yet initialized (first mount).
  // 2. We ARE on the home page AND it says it's still loading (isGlobalLoading true).
  const isAuthLoading = !isAuthInitialized;
  const isHomeDataLoading = isHomePage && isGlobalLoading;

  return (
    <>
      <AnimatePresence>
        {(isAuthLoading || isHomeDataLoading) && (
          <motion.div
            key="global-loader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: "blur(8px)",
              transition: { duration: 0.6, ease: "easeOut" }
            }}
            className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]"
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg"
              >
                <Leaf className="h-7 w-7 stroke-[2.5px]" />
              </motion.div>
              <span className="text-2xl font-black text-primary-600 tracking-tight">
                {import.meta.env.VITE_APP_NAME}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-3 border-gray-100 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">
                Preparing freshness...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthInitialized && (
        <motion.div
          key="app-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <AuthInitializer>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="deals" element={<HotDealsPage />} />
          <Route path="help" element={<HelpCenterPage />} />
          <Route path="wishlist" element={<WishlistPage />} />

          {/* Informational Pages */}
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="returns" element={<ReturnPolicyPage />} />
          <Route path="cancellation" element={<CancellationPage />} />
          <Route path="shipping" element={<ShippingInfoPage />} />
          <Route path="faqs" element={<FAQsPage />} />

          {/* Auth Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected User Routes */}
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="actions" element={<AdminActionsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthInitializer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
