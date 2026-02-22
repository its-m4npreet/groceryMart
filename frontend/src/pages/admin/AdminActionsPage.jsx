import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/ui";
import axios from "../../api/axios";

const AdminActionsPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [exportPeriod, setExportPeriod] = useState({
    products: 'all',
    orders: 'all',
    users: 'all'
  });

  const showResult = (type, message) => {
    setResult({ type, message });
    setTimeout(() => setResult(null), 5000);
  };

  const periodOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' }
  ];

  // Export Actions
  const handleExportProducts = async () => {
    setLoading(true);
    try {
      const params = exportPeriod.products !== 'all' ? `?period=${exportPeriod.products}` : '';
      const response = await axios.get(`/admin/export/products${params}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `products-${exportPeriod.products}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showResult("success", "Products exported successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to export products";
      showResult("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportOrders = async () => {
    setLoading(true);
    try {
      const params = exportPeriod.orders !== 'all' ? `?period=${exportPeriod.orders}` : '';
      const response = await axios.get(`/admin/export/orders${params}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders-${exportPeriod.orders}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showResult("success", "Orders exported successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to export orders";
      showResult("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    setLoading(true);
    try {
      const params = exportPeriod.users !== 'all' ? `?period=${exportPeriod.users}` : '';
      const response = await axios.get(`/admin/export/users${params}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users-${exportPeriod.users}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showResult("success", "Users exported successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to export users";
      showResult("error", message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Actions</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Perform bulk operations and system maintenance
        </p>
      </div>

      {/* Result Alert */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-3 sm:p-4 rounded-lg flex items-start sm:items-center gap-2 sm:gap-3 ${result.type === "success"
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
            }`}
        >
          {result.type === "success" ? (
            <CheckCircle size={20} className="shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0 mt-0.5 sm:mt-0" />
          )}
          <span className="text-sm sm:text-base">{result.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* Export Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <FileDown className="text-green-600 shrink-0" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">Export Data</h2>
          </div>

          <div className="space-y-4">
            {/* Products Export */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-gray-700">Products Export</label>
                <select
                  value={exportPeriod.products}
                  onChange={(e) => setExportPeriod({ ...exportPeriod, products: e.target.value })}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleExportProducts}
                disabled={loading}
                className="w-full justify-between text-sm sm:text-base"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <FileDown size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                  Export Products
                </span>
                <span className="text-xs sm:text-sm text-gray-500">CSV</span>
              </Button>
            </div>

            {/* Orders Export */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-gray-700">Orders Export</label>
                <select
                  value={exportPeriod.orders}
                  onChange={(e) => setExportPeriod({ ...exportPeriod, orders: e.target.value })}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleExportOrders}
                disabled={loading}
                className="w-full justify-between text-sm sm:text-base"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <FileDown size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                  Export Orders
                </span>
                <span className="text-xs sm:text-sm text-gray-500">CSV</span>
              </Button>
            </div>

            {/* Users Export */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-gray-700">Users Export</label>
                <select
                  value={exportPeriod.users}
                  onChange={(e) => setExportPeriod({ ...exportPeriod, users: e.target.value })}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleExportUsers}
                disabled={loading}
                className="w-full justify-between text-sm sm:text-base"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <FileDown size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                  Export Users
                </span>
                <span className="text-xs sm:text-sm text-gray-500">CSV</span>
              </Button>
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );
};

export default AdminActionsPage;
