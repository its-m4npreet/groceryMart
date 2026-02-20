import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socketService';
import { updateProductInList, addProductToList, removeProductFromList } from '../store/slices/productSlice';
import { updateItemStock } from '../store/slices/cartSlice';
import { 
  showStockAlertNotification, 
  showOrderUpdateNotification,
  showInfoNotification 
} from '../utils/notificationHelpers';

export function useSocketEvents() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Connect if not already connected
    const token = localStorage.getItem('token');
    socketService.connect(token);

    // Listen for product updates
    socketService.onProductUpdate((data) => {
      dispatch(updateProductInList(data));
      dispatch(updateItemStock({ productId: data._id, stock: data.stock }));
      
      // Show toast for stock updates (respects user preferences)
      if (data.stock === 0) {
        showStockAlertNotification(user, `${data.name} is now out of stock`, true);
      } else if (data.stock <= 5) {
        showStockAlertNotification(user, `${data.name} is running low (${data.stock} left)`, false);
      }
    });

    // Listen for new products
    socketService.onProductCreated((data) => {
      dispatch(addProductToList(data));
      showInfoNotification(user, 'promotions', `New product available: ${data.name}`);
    });

    // Listen for deleted products
    socketService.onProductDeleted((data) => {
      dispatch(removeProductFromList(data._id));
    });

    // Listen for order status updates
    socketService.onOrderStatusUpdate((data) => {
      if (data.message) {
        // Determine notification type based on status
        const status = data.newStatus === 'delivered' ? 'success' : 
                      data.newStatus === 'cancelled' ? 'error' : 'info';
        showOrderUpdateNotification(user, data.message, status);
      }
    });

    // Listen for order cancellation
    socketService.on('order-cancelled', (data) => {
      if (data.message) {
        showOrderUpdateNotification(user, data.message, 'warning');
      }
    });

    // Listen for rider assignment (customer side)
    socketService.on('rider-assigned', (data) => {
      if (data.message) {
        showOrderUpdateNotification(user, data.message, 'info');
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.off('product-updated');
      socketService.off('product-created');
      socketService.off('product-deleted');
      socketService.off('order-status-updated');
      socketService.off('order-cancelled');
      socketService.off('rider-assigned');
    };
  }, [dispatch, user]);
}

export default useSocketEvents;
