import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { closeCart } from '../../store/slices/uiSlice';
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/helpers';
import Button from '../ui/Button';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.ui);
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Shopping Cart
                </h2>
                <span className="bg-primary-100 text-primary-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {totalItems} items
                </span>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-6 bg-gray-100 rounded-full mb-4">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some fresh products to your cart
                  </p>
                  <Button
                    onClick={() => dispatch(closeCart())}
                    as={Link}
                    to="/products"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-4xl">
                            {item.category === 'fruits' ? '🍎' : 
                             item.category === 'vegetables' ? '🥬' : '🛒'}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)}/{item.unit}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                dispatch(decrementQuantity(item._id))
                              }
                              disabled={item.quantity <= 1}
                              className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                dispatch(incrementQuantity(item._id))
                              }
                              disabled={item.quantity >= item.stock}
                              className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() =>
                                dispatch(removeFromCart(item._id))
                              }
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.stock <= 5 && item.stock > 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            Only {item.stock} left in stock
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-green-600">
                      {totalAmount >= 500 ? 'Free' : formatPrice(40)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatPrice(totalAmount >= 500 ? totalAmount : totalAmount + 40)}
                    </span>
                  </div>
                </div>

                {/* Free Delivery Progress */}
                {totalAmount < 500 && (
                  <div className="bg-primary-50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-primary-700">
                        Add {formatPrice(500 - totalAmount)} for free delivery
                      </span>
                      <span className="text-primary-600 font-medium">
                        {Math.round((totalAmount / 500) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{ width: `${Math.min((totalAmount / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    to="/cart"
                    onClick={() => dispatch(closeCart())}
                    className="flex-1 text-center py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => dispatch(closeCart())}
                    className="flex-1 text-center py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
