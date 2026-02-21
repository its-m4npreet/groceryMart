import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    MapPin,
    Phone,
    Package,
    Truck,
    CheckCircle,
    Clock,
    User,
    Navigation,
} from 'lucide-react';
import riderApi from '../../api/riderApi';
import { formatPrice, formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400', icon: Clock },
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', icon: Package },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', dot: 'bg-green-500', icon: CheckCircle },
};

// What actions are available from each status
const nextActions = {
    assigned: [{ status: 'out_for_delivery', label: 'Start Delivery', icon: Truck, className: 'bg-amber-500 hover:bg-amber-600 text-white' }],
    out_for_delivery: [{ status: 'delivered', label: 'Mark Delivered', icon: CheckCircle, className: 'bg-green-600 hover:bg-green-700 text-white' }],
    delivered: [],
    pending: [],
};

const RiderOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        riderApi.getOrderById(id)
            .then((res) => setOrder(res.data))
            .catch(() => {
                toast.error('Order not found');
                navigate('/rider/orders');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdateStatus = async (deliveryStatus) => {
        setActionLoading(true);
        try {
            const res = await riderApi.updateDeliveryStatus(id, deliveryStatus);
            // Update order in state
            setOrder((prev) => ({
                ...prev,
                deliveryStatus: res.data?.deliveryStatus || deliveryStatus,
                status: res.data?.status || prev.status,
            }));
            toast.success(`Status updated to "${statusConfig[deliveryStatus]?.label}"`);
        } catch (err) {
            toast.error(err.message || 'Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-32 bg-gray-200 rounded-lg" />
                <div className="bg-white rounded-xl border border-gray-100 h-48" />
                <div className="bg-white rounded-xl border border-gray-100 h-40" />
            </div>
        );
    }

    if (!order) return null;

    const cfg = statusConfig[order.deliveryStatus] || statusConfig.pending;
    const StatusIcon = cfg.icon;
    const actions = nextActions[order.deliveryStatus] || [];

    const addr = order.shippingAddress;
    const fullAddress = [addr?.addressLine1, addr?.addressLine2, addr?.city, addr?.state, addr?.pincode]
        .filter(Boolean)
        .join(', ');

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

    return (
        <div className="space-y-5">
            {/* Back */}
            <button
                onClick={() => navigate('/rider/orders')}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Orders
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${cfg.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {cfg.label}
                    </span>
                </div>

                {/* Action Buttons */}
                {actions.length > 0 && (
                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                        {actions.map(({ status, label, icon: Icon, className }) => (
                            <button
                                key={status}
                                onClick={() => handleUpdateStatus(status)}
                                disabled={actionLoading}
                                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
                            >
                                {actionLoading ? (
                                    <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Icon className="h-4 w-4" />
                                )}
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {order.deliveryStatus === 'delivered' && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-4 py-3">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        Delivered successfully. Great work!
                    </div>
                )}
            </div>

            {/* Customer & Delivery Address */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-100 p-5 space-y-4"
            >
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    Customer
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">Name</p>
                        <p className="font-medium text-gray-900">{addr?.fullName || order.user?.name}</p>
                    </div>
                    {order.user?.phone && (
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                            <a
                                href={`tel:${order.user.phone}`}
                                className="inline-flex items-center gap-1.5 font-medium text-primary-600 hover:underline"
                            >
                                <Phone className="h-3.5 w-3.5" />
                                {order.user.phone}
                            </a>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-50 pt-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        Delivery Address
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{fullAddress}</p>
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary-600 hover:underline font-medium"
                    >
                        <Navigation className="h-4 w-4" />
                        Open in Maps
                    </a>
                </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-gray-50">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        Items ({order.items?.length})
                    </h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {order.items?.map((item) => (
                        <div key={item._id} className="px-5 py-3 flex items-center gap-3">
                            {item.product?.image && (
                                <img
                                    src={item.product.image}
                                    alt={item.name}
                                    className="h-12 w-12 rounded-lg object-cover shrink-0 bg-gray-100"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 shrink-0">
                                {formatPrice(item.subtotal)}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="px-5 py-3 bg-gray-50 flex justify-between">
                    <span className="text-sm font-semibold text-gray-700">Total</span>
                    <span className="text-base font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                </div>
            </motion.div>
        </div>
    );
};

export default RiderOrderDetailPage;
