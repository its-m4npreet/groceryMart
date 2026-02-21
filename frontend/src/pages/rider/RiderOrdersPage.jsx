import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Truck, CheckCircle, Clock, Filter, Wallet, CreditCard } from 'lucide-react';
import riderApi from '../../api/riderApi';
import { formatDateTime, formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ALL_FILTERS = [
    { key: '', label: 'All' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
];

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

const RiderOrdersPage = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('');

    useEffect(() => {
        riderApi.getMyOrders({ limit: 100 })
            .then((res) => setAllOrders(res.data || []))
            .catch(() => toast.error('Failed to load orders'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = activeFilter
        ? allOrders.filter((o) => o.deliveryStatus === activeFilter)
        : allOrders;

    if (loading) {
        return (
            <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 h-20" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="text-sm text-gray-500 mt-1">{allOrders.length} orders assigned to you</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {ALL_FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === key
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {label}
                        <span className="ml-1.5 tabular-nums text-xs opacity-70">
                            {key === '' ? allOrders.length : allOrders.filter((o) => o.deliveryStatus === key).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders in this category</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order, i) => {
                        const cfg = statusConfig[order.deliveryStatus] || statusConfig.pending;
                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Link
                                    to={`/rider/orders/${order._id}`}
                                    className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-200 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1 font-medium">
                                                {order.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                {[
                                                    order.shippingAddress?.street,
                                                    order.shippingAddress?.city,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                            {order.user?.phone && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    📞 {order.user.phone}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {order.paymentMethod === 'cod' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                                                        <Wallet className="h-3 w-3" />
                                                        COD - {formatPrice(order.totalAmount)}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                                        <CreditCard className="h-3 w-3" />
                                                        Paid Online
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                        <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
                                        <p className="text-xs text-gray-600 font-medium">
                                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RiderOrdersPage;
