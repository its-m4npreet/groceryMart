import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import { useSocketEvents } from '../../hooks/useSocketEvents';

const MainLayout = () => {
  // Initialize socket event listeners
  useSocketEvents();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
