import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  DollarSign,
  Zap,
  FileDown,
  Trash2,
  Database,
} from "lucide-react";
import { adminApi } from "../../api";
import { formatPrice } from "../../utils/helpers";
import Card from "../../components/ui/Card";
import { Loading } from "../../components/ui/Spinner";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, lowStockRes, ordersRes] = await Promise.all([
        adminApi.getDashboard(30),
        adminApi.getLowStock(10),
        adminApi.getAllOrders({
          page: 1,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ]);
      console.log("Dashboard data:", dashboardRes.data);
      setStats(dashboardRes.data);
      setLowStockProducts(lowStockRes.data?.products || []);
      setRecentOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  // Calculate dynamic changes based on real data
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`,
      trend: change >= 0 ? "up" : "down",
    };
  };

  // Calculate today's metrics vs average
  const todayRevenue = stats?.today?.revenue || 0;
  const totalRevenue = stats?.overall?.totalRevenue || 0;
  const todayOrders = stats?.today?.orders || 0;
  const totalOrders = stats?.overall?.totalOrders || 0;
  const daysInPeriod = stats?.period?.days || 30;

  const avgDailyRevenue = totalOrders > 0 ? totalRevenue / daysInPeriod : 0;
  const avgDailyOrders = totalOrders > 0 ? totalOrders / daysInPeriod : 0;

  const revenueChange = calculateChange(todayRevenue, avgDailyRevenue);
  const ordersChange = calculateChange(todayOrders, avgDailyOrders);

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      change: revenueChange?.value,
      trend: revenueChange?.trend,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      change: ordersChange?.value,
      trend: ordersChange?.trend,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Products",
      value: stats?.totalProducts || stats?.bestSellingProducts?.length || 0,
      change: null, // No historical product data available
      trend: null,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: stats?.ordersByStatus?.pending?.count || 0,
      change: null, // Show count only
      trend: null,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "Bulk Operations",
      description: "Update prices & stock",
      icon: Zap,
      color: "bg-blue-500",
      href: "/admin/actions",
    },
    {
      title: "Export Data",
      description: "Download CSV reports",
      icon: FileDown,
      color: "bg-green-500",
      href: "/admin/actions",
    },
    {
      title: "Delete Out of Stock",
      description: "Clean up inventory",
      icon: Trash2,
      color: "bg-red-500",
      href: "/admin/actions",
    },
    {
      title: "System Maintenance",
      description: "Cache & DB cleanup",
      icon: Database,
      color: "bg-purple-500",
      href: "/admin/actions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {stat.change && stat.trend && (
                    <span
                      className={`flex items-center text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <Card.Header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <Link
              to="/admin/actions"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Charts and Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          key="recent-orders"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <Card.Header className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <Link
                to="/admin/orders"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="divide-y divide-gray-100">
                {recentOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order._id}
                    to={`/admin/orders/${order._id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        #
                        {order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.name || "Customer"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
                {recentOrders.length === 0 && (
                  <div className="px-5 py-8 text-center text-gray-500">
                    No orders yet
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          key="low-stock-alert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <Card.Header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Low Stock Alert</h3>
              </div>
              <Link
                to="/admin/products"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Manage
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="divide-y divide-gray-100">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {product.category === "fruits"
                          ? "🍎"
                          : product.category === "vegetables"
                            ? "🥬"
                            : "🛒"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : `${product.stock} left`}
                    </span>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <div className="px-5 py-8 text-center text-gray-500">
                    All products are well stocked
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Best Selling Products */}
      <motion.div
        key="best-selling"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-gray-900">
              Best Selling Products
            </h3>
          </Card.Header>
          <Card.Body className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Sold
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.bestSellingProducts &&
                stats.bestSellingProducts.length > 0 ? (
                  stats.bestSellingProducts.slice(0, 5).map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                            {product.category === "fruits"
                              ? "🍎"
                              : product.category === "vegetables"
                                ? "🥬"
                                : "🛒"}
                          </div>
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 capitalize">
                        {product.category}
                      </td>
                      <td className="px-5 py-4 text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-5 py-4 text-gray-900">
                        {product.totalSold || 0}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {formatPrice(product.totalRevenue || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="no-data">
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No sales data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
