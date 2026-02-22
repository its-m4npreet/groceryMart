import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "./store";
import { checkAuth } from "./store/slices/authSlice";
import socketService from "./services/socketService";

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
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // Check if there's a token and validate it
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch(checkAuth()).finally(() => {
        setIsInitialized(true);
      });
    } else {
      // Defer state update to avoid synchronous setState in effect
      setTimeout(() => {
        setIsInitialized(true);
      }, 0);
    }
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
      // Don't disconnect on unmount if still authenticated
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  // Show a loading indicator while checking auth
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex items-center gap-2.5 mb-7">
          <img src="/leaf.png" alt="" className="w-10 h-10 animate-pulse" />
          <span className="text-2xl font-bold text-primary-600 tracking-tight">THETAHLIADDAA MART</span>
        </div>
        <div className="w-9 h-9 border-3 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 text-sm">Loading fresh goodness...</p>
      </div>
    );
  }

  return children;
};

function AppRoutes() {
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


        {/* 404 Route */}
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
