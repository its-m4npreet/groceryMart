import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, Search } from "lucide-react";
import { orderApi } from "../../api";
import { formatPrice, formatDate } from "../../utils/helpers";
import { getCategoryIcon } from "../../utils/iconHelpers";
import { ORDER_STATUSES } from "../../config/constants";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Loading } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;

      const response = await orderApi.getMyOrders(params);
      setOrders(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (loading && orders.length === 0) {
    return <Loading fullScreen text="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === option.value
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-16 w-16" />}
            title="No orders found"
            description={
              statusFilter
                ? `No ${statusFilter} orders found. Try a different filter.`
                : "You haven't placed any orders yet."
            }
            action={
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/orders/${order._id}`}
                  className="block bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary-50 rounded-xl">
                          <Package className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              Order #
                              {order.orderNumber ||
                                order._id.slice(-8).toUpperCase()}
                            </h3>
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
                            >
                              {ORDER_STATUSES[order.status]?.label ||
                                order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDate(order.createdAt)}
                            </span>
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount & Arrow */}
                      <div className="flex items-center justify-between lg:justify-end gap-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 overflow-x-auto">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <Link
                            key={idx}
                            to={`/products/${item.product?._id || item.product}`}
                            className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary-300 transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.image || item.product?.image ? (
                              <img
                                src={item.image || item.product?.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getCategoryIcon(item.category || item.product?.category, "h-6 w-6")
                            )}
                          </Link>
                        ))}
                        {order.items.length > 4 && (
                          <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => fetchOrders(meta.page - 1)}
            >
              Previous
            </Button>
            <span className="px-4 text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => fetchOrders(meta.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
