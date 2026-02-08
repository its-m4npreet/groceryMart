import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import { formatPrice } from "../utils/helpers";
import { getCategoryIcon } from "../utils/iconHelpers";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_CHARGE } from "../config/constants";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);

  const deliveryFee = totalAmount >= 500 ? 0 : 40;
  const finalTotal = totalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<ShoppingBag className="h-16 w-16" />}
            title="Your cart is empty"
            description="Looks like you haven't added any products yet. Start shopping to fill your cart with fresh goodies!"
            action={
              <Link to="/products">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start Shopping
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-1">{totalItems} items in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={() => dispatch(clearCart())}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </button>
            </div>

            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${item._id}`}
                  className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getCategoryIcon(item.category, "h-12 w-12")}
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item._id}`}
                    className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 capitalize mt-1">
                    {item.category}
                  </p>
                  <p className="text-primary-600 font-medium mt-1">
                    {formatPrice(item.price)}/{item.unit}
                  </p>

                  {/* Mobile: Price and Controls Row */}
                  <div className="flex items-center justify-between mt-4 lg:mt-6">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(decrementQuantity(item._id))}
                        disabled={item.quantity <= 1}
                        className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(incrementQuantity(item._id))}
                        disabled={item.quantity >= item.stock}
                        className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      {item.stock <= 5 && item.stock > 0 && (
                        <span className="text-xs text-amber-600">
                          Only {item.stock} left
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span
                    className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}
                  >
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="bg-primary-50 rounded-lg p-3">
                    <p className="text-sm text-primary-700">
                      Add {formatPrice(500 - totalAmount)} more for free
                      delivery!
                    </p>
                    <div className="mt-2 h-2 bg-primary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{ width: `${(totalAmount / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button
                  className="w-full"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Proceed to Checkout
                </Button>
              </Link>

              <Link
                to="/products"
                className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
