import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Package,
    CheckCircle,
    Truck,
    Clock,
    ChevronRight,
    Star,
} from 'lucide-react';
import riderApi from '../../api/riderApi';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

const StatCard = ({ label, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4"
    >
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
    </motion.div>
);

const RiderDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            riderApi.getStats(),
            riderApi.getMyOrders({ limit: 5 }),
        ])
            .then(([statsRes, ordersRes]) => {
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data || []);
            })
            .catch(() => toast.error('Failed to load dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 h-24" />
                    ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 h-64" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Assigned', value: stats?.total ?? 0, icon: Package, color: 'bg-blue-500' },
        { label: "Today's Deliveries", value: stats?.todayDeliveries ?? 0, icon: Star, color: 'bg-amber-500' },
        { label: 'Out for Delivery', value: stats?.out_for_delivery ?? 0, icon: Truck, color: 'bg-purple-500' },
        { label: 'Delivered', value: stats?.delivered ?? 0, icon: CheckCircle, color: 'bg-green-500' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Your delivery overview for today</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <StatCard key={i} {...card} />
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <h2 className="font-semibold text-gray-900">Recent Assigned Orders</h2>
                    <Link
                        to="/rider/orders"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                        View all <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="py-16 text-center">
                        <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No orders assigned yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {recentOrders.map((order) => {
                            const cfg = statusConfig[order.deliveryStatus] || statusConfig.pending;
                            return (
                                <Link
                                    key={order._id}
                                    to={`/rider/orders/${order._id}`}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">
                                            #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            {order.shippingAddress?.fullName} · {order.shippingAddress?.city}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(order.createdAt)}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${cfg.color}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                        {cfg.label}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiderDashboardPage;
