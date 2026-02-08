import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  User,
  Mail,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { adminApi } from "../../api";
import { formatPrice, formatDateTime } from "../../utils/helpers";
import { getCategoryIcon } from "../../utils/iconHelpers";
import { ORDER_STATUSES } from "../../config/constants";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Loading } from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await adminApi.getOrderById(id);
      setOrder(response.data);
    } catch {
      toast.error("Order not found");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["packed", "cancelled"],
      packed: ["shipped"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    return statusFlow[currentStatus] || [];
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      await adminApi.updateOrderStatus(order._id, { status: newStatus });
      toast.success(
        `Order status updated to ${ORDER_STATUSES[newStatus]?.label}`,
      );
      setShowStatusModal(false);
      setNewStatus("");
      fetchOrder();
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading order details..." />;
  }

  if (!order) {
    return null;
  }

  const statusConfig = ORDER_STATUSES[order.status] || {};
  const isCancelled = order.status === "cancelled";

  // Order progress steps
  const steps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "packed", label: "Packed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === order.status);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/orders")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            {statusConfig.label}
          </Badge>
          {!isCancelled && order.status !== "delivered" && (
            <Button onClick={() => setShowStatusModal(true)}>
              Update Status
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cancellation Alert */}
          {isCancelled && order.cancellationReason && (
            <Alert variant="error" title="Order Cancelled">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Cancellation Reason:</p>
                  <p className="text-sm">{order.cancellationReason}</p>
                </div>
              </div>
            </Alert>
          )}

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
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="relative flex items-start gap-4"
                      >
                        <div
                          className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <StepIcon
                            className={`h-5 w-5 ${isCompleted ? "text-primary-600" : "text-gray-400"}`}
                          />
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-primary-600 mt-1">
                              Current Status
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
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
                  <Link
                    to={`/products/${item.product?._id || item.product}`}
                    className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden hover:ring-2 hover:ring-primary-300 transition-all"
                  >
                    {item.image || item.product?.image ? (
                      <img
                        src={item.image || item.product?.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getCategoryIcon(item.category || item.product?.category, "h-8 w-8")
                    )}
                  </Link>
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

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-gray-900">Free</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-primary-600">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
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
              <div className="space-y-3">
                {order.statusHistory
                  .slice()
                  .reverse()
                  .map((history, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Clock className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {ORDER_STATUSES[history.status]?.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(history.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {order.user?.name || "Guest User"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 break-all">
                    {order.user?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress?.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping Address
              </h2>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {order.shippingAddress?.fullName}
              </p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.pincode}
              </p>
              <p className="pt-2">
                <Phone className="h-3.5 w-3.5 inline mr-1" />
                {order.shippingAddress?.phone}
              </p>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  variant={
                    order.paymentStatus === "paid" ? "success" : "warning"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.notes && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Order Status"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Order</p>
            <p className="font-medium text-gray-900">
              #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
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
              {ORDER_STATUSES[order.status]?.label}
            </Badge>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update to
            </label>
            <div className="flex flex-wrap gap-2">
              {getNextStatuses(order.status).map((status) => (
                <button
                  key={status}
                  onClick={() => setNewStatus(status)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    newStatus === status
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {ORDER_STATUSES[status]?.label}
                </button>
              ))}
            </div>
            {getNextStatuses(order.status).length === 0 && (
              <p className="text-gray-500 text-sm">
                This order cannot be updated further.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowStatusModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              className="flex-1"
              isLoading={isUpdating}
              disabled={!newStatus || newStatus === order.status}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrderDetailPage;
