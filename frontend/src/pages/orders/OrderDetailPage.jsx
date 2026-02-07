import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  MapPin,
  Phone,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { orderApi } from "../../api";
import socketService from "../../services/socketService";
import { formatPrice, formatDateTime } from "../../utils/helpers";
import { ORDER_STATUSES, SOCKET_EVENTS } from "../../config/constants";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Loading } from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();

    // Listen for order status updates
    socketService.onOrderStatusUpdate((data) => {
      if (data._id === id) {
        setOrder((prev) => ({ ...prev, ...data }));
        toast.success(
          `Order status updated to ${ORDER_STATUSES[data.status]?.label}`,
        );
      }
    });

    return () => {
      socketService.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderApi.getOrderById(id);
      setOrder(response.data);
    } catch {
      toast.error("Order not found");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      await orderApi.cancelOrder(id, cancelReason);
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading order details..." />;
  }

  if (!order) {
    return null;
  }

  const canCancel = ["pending", "confirmed"].includes(order.status);
  const statusConfig = ORDER_STATUSES[order.status] || {};

  // Order progress steps
  const steps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "packed", label: "Packed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Success Alert */}
        {justPlaced && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="success" title="Order Placed Successfully!">
              Thank you for your order. We'll send you updates as your order
              progresses.
            </Alert>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Orders
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-500 mt-1">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <Badge
              variant={
                order.status === "delivered"
                  ? "success"
                  : order.status === "cancelled"
                    ? "danger"
                    : order.status === "pending"
                      ? "warning"
                      : "info"
              }
              size="lg"
            >
              {statusConfig.icon} {statusConfig.label}
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            {!isCancelled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Progress
                </h2>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200">
                    <div
                      className="h-full bg-primary-600 transition-all duration-500"
                      style={{
                        width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const StepIcon = step.icon;

                      return (
                        <div
                          key={step.key}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                              isCompleted
                                ? "bg-primary-600 text-white"
                                : "bg-gray-200 text-gray-400"
                            } ${isCurrent ? "ring-4 ring-primary-100" : ""}`}
                          >
                            <StepIcon className="h-5 w-5" />
                          </div>
                          <span
                            className={`mt-2 text-xs font-medium text-center ${
                              isCompleted ? "text-primary-600" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cancelled Alert */}
            {isCancelled && (
              <Alert variant="error" title="Order Cancelled">
                {order.cancellationReason || "This order has been cancelled."}
              </Alert>
            )}

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl">
                      {item.category === "fruits"
                        ? "🍎"
                        : item.category === "vegetables"
                          ? "🥬"
                          : "🛒"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}/{item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Timeline
                </h2>
                <div className="space-y-4">
                  {order.statusHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Clock className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {ORDER_STATUSES[entry.status]?.label || entry.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>
              <div className="text-gray-600 space-y-1">
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>Pincode: {order.shippingAddress?.pincode}</p>
                <p className="flex items-center gap-2 pt-2">
                  <Phone className="h-4 w-4" />
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>
                <Badge
                  variant={
                    order.paymentStatus === "paid" ? "success" : "warning"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </motion.div>

            {/* Cancel Button */}
            {canCancel && (
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowCancelModal(true)}
                leftIcon={<XCircle className="h-4 w-4" />}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Cancel Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Order"
        >
          <div className="space-y-4">
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4 mr-2 inline" />
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </Alert>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're cancelling..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Order
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleCancelOrder}
                isLoading={isCancelling}
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OrderDetailPage;
