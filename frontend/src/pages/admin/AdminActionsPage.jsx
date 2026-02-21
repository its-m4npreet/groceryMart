import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  DollarSign,
  Package,
  Users,
  FileDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Database,
} from "lucide-react";
import { Button } from "../../components/ui";
import axios from "../../api/axios";

const AdminActionsPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bulkPriceChange, setBulkPriceChange] = useState({
    percentage: 0,
    action: "increase",
  });
  const [bulkStockChange, setBulkStockChange] = useState({
    quantity: 0,
    action: "add",
  });

  const showResult = (type, message) => {
    setResult({ type, message });
    setTimeout(() => setResult(null), 5000);
  };

  // Bulk Product Actions
  const handleBulkPriceUpdate = async () => {
    if (!bulkPriceChange.percentage || bulkPriceChange.percentage <= 0) {
      showResult("error", "Please enter a valid percentage");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to ${bulkPriceChange.action} all product prices by ${bulkPriceChange.percentage}%?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch("/admin/products/bulk-price", {
        percentage: bulkPriceChange.percentage,
        action: bulkPriceChange.action,
      });
      showResult(
        "success",
        `Updated ${response.data.data.modifiedCount} products successfully`,
      );
      setBulkPriceChange({ percentage: 0, action: "increase" });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update prices";
      showResult("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStockUpdate = async () => {
    if (!bulkStockChange.quantity || bulkStockChange.quantity <= 0) {
      showResult("error", "Please enter a valid quantity");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to ${bulkStockChange.action} ${bulkStockChange.quantity} units to all products?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch("/admin/products/bulk-stock", {
        quantity: bulkStockChange.quantity,
        action: bulkStockChange.action,
      });
      showResult(
        "success",
        `Updated ${response.data.data.modifiedCount} products successfully`,
      );
      setBulkStockChange({ quantity: 0, action: "add" });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update stock";
      showResult("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutOfStock = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all out-of-stock products? This cannot be undone!",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete("/admin/products/out-of-stock");
      showResult(
        "success",
        `Deleted ${response.data.data.deletedCount} out-of-stock products`,
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete products";
      showResult("error", message);
    } finally {
      setLoading(false);
    }
  };

  // Export Actions
  const handleExportProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/export/products", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `products-${Date.now()}.csv`);
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
      const response = await axios.get("/admin/export/orders", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders-${Date.now()}.csv`);
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
      const response = await axios.get("/admin/export/users", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users-${Date.now()}.csv`);
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

  // System Actions
  const handleRefreshCache = async () => {
    setLoading(true);
    try {
      await axios.post("/admin/system/clear-cache");
      showResult("success", "Cache cleared successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to clear cache";
      showResult("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseCleanup = async () => {
    if (
      !window.confirm(
        "This will clean up orphaned data and optimize the database. Continue?",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await axios.post("/admin/system/cleanup-db");
      showResult("success", "Database cleanup completed");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to cleanup database";
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
          className={`p-3 sm:p-4 rounded-lg flex items-start sm:items-center gap-2 sm:gap-3 ${
            result.type === "success"
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
        {/* Bulk Product Operations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <Package className="text-blue-600 shrink-0" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">Bulk Product Actions</h2>
          </div>

          <div className="space-y-4">
            {/* Bulk Price Update */}
            <div className="border-b pb-4">
              <h3 className="text-sm sm:text-base font-medium mb-3 flex items-center gap-2">
                <DollarSign size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                Bulk Price Update
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={bulkPriceChange.action}
                  onChange={(e) =>
                    setBulkPriceChange({
                      ...bulkPriceChange,
                      action: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <option value="increase">Increase</option>
                  <option value="decrease">Decrease</option>
                </select>
                <input
                  type="number"
                  placeholder="Percentage"
                  value={bulkPriceChange.percentage || ""}
                  onChange={(e) =>
                    setBulkPriceChange({
                      ...bulkPriceChange,
                      percentage: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleBulkPriceUpdate} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                  Apply
                </Button>
              </div>
            </div>

            {/* Bulk Stock Update */}
            <div className="border-b pb-4">
              <h3 className="text-sm sm:text-base font-medium mb-3 flex items-center gap-2">
                <Package size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                Bulk Stock Update
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={bulkStockChange.action}
                  onChange={(e) =>
                    setBulkStockChange({
                      ...bulkStockChange,
                      action: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                  <option value="set">Set to</option>
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={bulkStockChange.quantity || ""}
                  onChange={(e) =>
                    setBulkStockChange({
                      ...bulkStockChange,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="flex-1 px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleBulkStockUpdate} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                  Apply
                </Button>
              </div>
            </div>

            {/* Delete Out of Stock */}
            <div>
              <h3 className="text-sm sm:text-base font-medium mb-3 flex items-center gap-2">
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
                Delete Out of Stock
              </h3>
              <Button
                onClick={handleDeleteOutOfStock}
                variant="danger"
                disabled={loading}
                className="w-full text-sm sm:text-base"
              >
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="truncate">Delete All Out of Stock Products</span>
              </Button>
            </div>
          </div>
        </motion.div>

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

          <div className="space-y-3">
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
        </motion.div>

        {/* System Maintenance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <Database className="text-purple-600 shrink-0" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">System Maintenance</h2>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRefreshCache}
              disabled={loading}
              className="w-full justify-start text-sm sm:text-base"
              variant="outline"
            >
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
              Clear Cache
            </Button>

            <Button
              onClick={handleDatabaseCleanup}
              disabled={loading}
              className="w-full justify-start text-sm sm:text-base"
              variant="outline"
            >
              <Database size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />
              Database Cleanup
            </Button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs sm:text-sm text-yellow-800 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                System maintenance actions may temporarily affect performance.
                Use with caution.
              </span>
            </p>
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <Users className="text-orange-600 shrink-0" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">User Management</h2>
          </div>

          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              User management features coming soon. You'll be able to:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600 shrink-0" />
                Ban/unban users
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600 shrink-0" />
                Promote users to admin
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600 shrink-0" />
                View user activity
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600 shrink-0" />
                Send bulk notifications
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminActionsPage;
