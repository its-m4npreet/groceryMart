import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Animation library
import { Search, Eye, Package, Calendar, Filter, Edit3, Bike, UserCheck } from "lucide-react";
import { adminApi } from "../../api";
import { formatPrice, formatDate } from "../../utils/helpers";
import { ORDER_STATUSES } from "../../config/constants";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { OrdersSkeleton } from "../../components/ui/AdminSkeletons";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Rider assignment states
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [activeRiders, setActiveRiders] = useState([]);
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchActiveRiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;

      const response = await adminApi.getAllOrders(params);
      setOrders(response.data);
      setMeta(response.meta);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveRiders = async () => {
    try {
      const response = await adminApi.getAllRiders({ status: "active" });
      setActiveRiders(response.data || []);
    } catch {
      // Non-fatal: just leave the rider list empty
      setActiveRiders([]);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      await adminApi.updateOrderStatus(selectedOrder._id, {
        status: newStatus,
      });
      toast.success("Order status updated successfully");
      setShowStatusModal(false);
      fetchOrders(meta.page);
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const openRiderModal = (order) => {
    setSelectedOrder(order);
    setSelectedRiderId(order.assignedRider?._id || "");
    setShowRiderModal(true);
  };

  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRiderId) return;
    
    setIsAssigning(true);
    try {
      await adminApi.assignRider(selectedOrder._id, selectedRiderId);
      toast.success("Rider assigned successfully");
      setShowRiderModal(false);
      setSelectedRiderId("");
      fetchOrders(meta.page);
    } catch (error) {
      toast.error(error.message || "Failed to assign rider");
    } finally {
      setIsAssigning(false);
    }
  };

  const getAllAvailableStatuses = (currentStatus) => {
    // Return all statuses except the current one
    const allStatuses = [
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    return allStatuses.filter((status) => status !== currentStatus);
  };

  if (loading && orders.length === 0) {
    return <OrdersSkeleton />;
  }

  const statusOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Order
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Items
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Rider
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Date
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const statusConfig = ORDER_STATUSES[order.status] || {};
                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        #
                        {order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {order.items.length} items
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      {order.assignedRider ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                            <UserCheck className="h-3 w-3 text-primary-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {order.assignedRider.name}
                            </p>
                          </div>
                        </div>
                      ) : !["cancelled", "delivered"].includes(order.status) ? (
                        <button
                          onClick={() => openRiderModal(order)}
                          className="text-xs text-gray-500 hover:text-primary-600 underline"
                        >
                          Assign Rider
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openStatusModal(order)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        title="Click to update status"
                      >
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
                          {statusConfig.label}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!["cancelled", "delivered"].includes(order.status) && (
                          <button
                            onClick={() => openRiderModal(order)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title={order.assignedRider ? "Reassign Rider" : "Assign Rider"}
                          >
                            <Bike className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openStatusModal(order)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Update Status"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                Orders will appear here when customers place them.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Order Status"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Order</p>
              <p className="font-medium text-gray-900">
                #
                {selectedOrder.orderNumber ||
                  selectedOrder._id.slice(-8).toUpperCase()}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ℹ️ You can change the order status to any available status. The
                customer will be notified of the change.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <Badge
                variant={
                  selectedOrder.status === "delivered"
                    ? "success"
                    : selectedOrder.status === "cancelled"
                      ? "danger"
                      : selectedOrder.status === "pending"
                        ? "warning"
                        : "info"
                }
                size="lg"
              >
                {ORDER_STATUSES[selectedOrder.status]?.label}
              </Badge>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update to
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getAllAvailableStatuses(selectedOrder.status).map((status) => {
                  const statusConfig = ORDER_STATUSES[status] || {};
                  return (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors text-left ${newStatus === status
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${status === "delivered"
                              ? "bg-green-500"
                              : status === "cancelled"
                                ? "bg-red-500"
                                : status === "pending"
                                  ? "bg-yellow-500"
                                  : status === "shipped"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                            }`}
                        />
                        {statusConfig.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                disabled={!newStatus || newStatus === selectedOrder.status}
              >
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Rider Assignment Modal */}
      <Modal
        isOpen={showRiderModal}
        onClose={() => setShowRiderModal(false)}
        title="Assign Delivery Rider"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Order</p>
              <p className="font-medium text-gray-900">
                #{selectedOrder.orderNumber || selectedOrder._id.slice(-8).toUpperCase()}
              </p>
            </div>

            {selectedOrder.assignedRider && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Currently Assigned
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <UserCheck className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.assignedRider.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.assignedRider.phone || selectedOrder.assignedRider.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedOrder.assignedRider ? "Change Rider" : "Select Rider"}
              </label>
              {activeRiders.length > 0 ? (
                <select
                  value={selectedRiderId}
                  onChange={(e) => setSelectedRiderId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
                >
                  <option value="">Select a rider...</option>
                  {activeRiders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name}
                      {rider.phone ? ` • ${rider.phone}` : ""}
                      {rider.deliveryStats?.total 
                        ? ` • ${rider.deliveryStats.total} deliveries`
                        : ""
                      }
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    No active riders available at the moment.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRiderModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRider}
                className="flex-1"
                isLoading={isAssigning}
                disabled={!selectedRiderId || activeRiders.length === 0}
              >
                <Bike className="h-4 w-4 mr-2" />
                {selectedOrder.assignedRider ? "Reassign Rider" : "Assign Rider"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
