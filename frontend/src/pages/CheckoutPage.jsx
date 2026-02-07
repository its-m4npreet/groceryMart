import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  CreditCard,
  Truck,
  CheckCircle,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { orderApi } from "../api";
import { clearCart } from "../store/slices/cartSlice";
import { formatPrice } from "../utils/helpers";
import { PAYMENT_METHODS } from "../config/constants";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const deliveryFee = totalAmount >= 500 ? 0 : 40;
  const finalTotal = totalAmount + deliveryFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      notes: "",
    },
  });

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add some products to your cart before checkout.
            </p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <Alert variant="warning" className="mb-6">
              Please sign in to continue with checkout
            </Alert>
            <Link to="/login" state={{ from: { pathname: "/checkout" } }}>
              <Button>Sign In to Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.phone,
        },
        paymentMethod,
        notes: data.notes,
      };

      const response = await orderApi.createOrder(orderData);

      toast.success("Order placed successfully!");
      dispatch(clearCart());
      navigate(`/orders/${response.data._id}`, {
        state: { justPlaced: true },
      });
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Cart
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      placeholder="Enter your street address"
                      error={errors.street?.message}
                      {...register("street", {
                        required: "Street address is required",
                      })}
                    />
                  </div>
                  <Input
                    label="City"
                    placeholder="Enter city"
                    error={errors.city?.message}
                    {...register("city", {
                      required: "City is required",
                    })}
                  />
                  <Input
                    label="State"
                    placeholder="Enter state"
                    error={errors.state?.message}
                    {...register("state", {
                      required: "State is required",
                    })}
                  />
                  <Input
                    label="Pincode"
                    placeholder="Enter pincode"
                    error={errors.pincode?.message}
                    {...register("pincode", {
                      required: "Pincode is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Enter a valid 6-digit pincode",
                      },
                    })}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Enter phone number"
                    leftIcon={<Phone className="h-5 w-5" />}
                    error={errors.phone?.message}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit phone number",
                      },
                    })}
                  />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium text-gray-900">
                        {method.name}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Notes (Optional)
                </h2>
                <textarea
                  placeholder="Any special instructions for your order..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none resize-none"
                  {...register("notes")}
                />
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : item.category === "fruits" ? (
                          "🍎"
                        ) : item.category === "vegetables" ? (
                          "🥬"
                        ) : (
                          "🛒"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-gray-100 pt-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span
                      className={
                        deliveryFee === 0 ? "text-green-600" : "text-gray-900"
                      }
                    >
                      {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-lg pt-3 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<CheckCircle className="h-5 w-5" />}
                >
                  Place Order
                </Button>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <Truck className="h-4 w-4" />
                  <span>Secure checkout • Fast delivery</span>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
