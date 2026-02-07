import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socketService from '../services/socketService';
import { updateProductInList, addProductToList, removeProductFromList } from '../store/slices/productSlice';
import { updateItemStock } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

export function useSocketEvents() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect if not already connected
    const token = localStorage.getItem('token');
    socketService.connect(token);

    // Listen for product updates
    socketService.onProductUpdate((data) => {
      dispatch(updateProductInList(data));
      dispatch(updateItemStock({ productId: data._id, stock: data.stock }));
      
      // Show toast for stock updates
      if (data.stock === 0) {
        toast.error(`${data.name} is now out of stock`);
      } else if (data.stock <= 5) {
        toast(`${data.name} is running low (${data.stock} left)`, {
          icon: '⚠️',
        });
      }
    });

    // Listen for new products
    socketService.onProductCreated((data) => {
      dispatch(addProductToList(data));
    });

    // Listen for deleted products
    socketService.onProductDeleted((data) => {
      dispatch(removeProductFromList(data._id));
    });

    // Cleanup on unmount
    return () => {
      socketService.off('product-updated');
      socketService.off('product-created');
      socketService.off('product-deleted');
    };
  }, [dispatch]);
}

export default useSocketEvents;
