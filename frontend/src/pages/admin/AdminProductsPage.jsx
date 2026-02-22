import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  MoreVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { productApi } from "../../api";
import { formatPrice } from "../../utils/helpers";
import { getCategoryIcon } from "../../utils/iconHelpers";
import { CATEGORIES, UNITS } from "../../config/constants";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { ProductsSkeleton } from "../../components/ui/AdminSkeletons";
import toast from "react-hot-toast";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "fruits",
    price: "",
    stock: "",
    unit: "kg",
    description: "",
    image: null,
    isHotDeal: false,
    discount: "",
    discountExpiry: "",
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, searchQuery]);

  const fetchProducts = async () => {
    try {
      const params = { limit: 100 };
      if (categoryFilter) params.category = categoryFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await productApi.getProducts(params);
      setProducts(response.data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        unit: product.unit,
        description: product.description || "",
        image: null,
        isHotDeal: product.isHotDeal || false,
        discount: product.discount ? product.discount.toString() : "",
        discountExpiry: product.discountExpiry ? new Date(product.discountExpiry).toISOString().slice(0, 16) : "",
      });
      setImagePreview(product.image || null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "fruits",
        price: "",
        stock: "",
        unit: "kg",
        description: "",
        image: null,
        isHotDeal: false,
        discount: "",
        discountExpiry: "",
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("unit", formData.unit);
      if (formData.description) {
        data.append("description", formData.description.trim());
      }
      if (formData.image) {
        data.append("image", formData.image);
      }
      data.append("isHotDeal", formData.isHotDeal);
      if (formData.discount) {
        data.append("discount", formData.discount);
      }
      if (formData.discountExpiry) {
        data.append("discountExpiry", new Date(formData.discountExpiry).toISOString());
      }

      if (editingProduct) {
        await productApi.updateProduct(editingProduct._id, data);
        toast.success("Product updated successfully");
      } else {
        await productApi.createProduct(data);
        toast.success("Product created successfully");
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        toast.error(errorMessages);
      } else {
        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Failed to save product",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productApi.deleteProduct(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const formData = new FormData();
      formData.append("isActive", (!product.isActive).toString());
      await productApi.updateProduct(product._id, formData);
      toast.success(
        product.isActive ? "Product deactivated" : "Product activated",
      );
      fetchProducts();
    } catch {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">{products.length} products total</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => handleOpenModal()}
        >
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              leftIcon={<Search className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "", label: "All Categories" },
              ...CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
            ]}
            className="sm:w-48"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Price
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Stock
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Hot Deal
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getCategoryIcon(product.category, "h-6 w-6")
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">{product.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="capitalize text-gray-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        product.stock === 0
                          ? "danger"
                          : product.stock <= 10
                            ? "warning"
                            : "success"
                      }
                    >
                      {product.stock === 0 ? "Out of Stock" : product.stock}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={product.isActive ? "success" : "default"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    {product.isHotDeal ? (
                      <Badge variant="danger">
                        🔥 {product.discount}% OFF
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        {product.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first product.
              </p>
              <Button onClick={() => handleOpenModal()}>Add Product</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter product name"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
              required
            />
            <Select
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              options={UNITS.map((u) => ({ value: u, label: u }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none resize-none"
              placeholder="Product description..."
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Hot Deal Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHotDeal"
                  checked={formData.isHotDeal}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isHotDeal: e.target.checked }))
                  }
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Mark as Hot Deal</span>
                  <p className="text-xs text-gray-500">This product will appear on the Hot Deals page</p>
                </div>
              </label>

              {formData.isHotDeal && (
                <div className="space-y-3">
                  <Input
                    label="Discount (%)"
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="1"
                    placeholder="Enter discount percentage"
                  />

                  {formData.discount > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Expiry (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        name="discountExpiry"
                        value={formData.discountExpiry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty for no expiry. After this date, original price will be shown.
                      </p>
                    </div>
                  )}

                  {formData.price > 0 && formData.discount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Original Price:</span>
                        <span className="font-medium text-gray-900">₹{parseFloat(formData.price).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-700">Discount:</span>
                        <span className="font-medium text-red-600">-₹{(parseFloat(formData.price) * parseFloat(formData.discount) / 100).toFixed(2)} ({formData.discount}%)</span>
                      </div>
                      <div className="flex items-center justify-between text-base font-bold mt-2 pt-2 border-t border-green-200">
                        <span className="text-green-700">Final Price:</span>
                        <span className="text-green-700">₹{(parseFloat(formData.price) * (1 - parseFloat(formData.discount) / 100)).toFixed(2)}</span>
                      </div>
                      {formData.discountExpiry && (
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-green-200">
                          <span className="text-gray-600">Expires:</span>
                          <span className="font-medium text-amber-600">
                            {new Date(formData.discountExpiry).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            />
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
