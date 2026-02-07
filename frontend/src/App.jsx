import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from './store';
import { checkAuth } from './store/slices/authSlice';
import socketService from './services/socketService';

// Layouts
import MainLayout from './components/layout/MainLayout';
import { AdminLayout } from './pages/admin';

// Auth Components
import { ProtectedRoute, AdminRoute } from './components/auth';

// Pages
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  LoginPage,
  SignupPage,
  OrdersPage,
  OrderDetailPage,
  DashboardPage,
  AdminProductsPage,
  AdminOrdersPage,
  NotFoundPage,
} from './pages';

// Auth Initialization Component
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if there's a token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    // Connect socket when authenticated
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

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
          
          {/* Auth Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

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
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
