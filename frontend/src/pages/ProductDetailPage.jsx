import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
// Animation library
import {
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { productApi } from "../api";
import { addToCart } from "../store/slices/cartSlice";
import {
  formatPrice,
  getStockStatus,
  getCategoryColor,
} from "../utils/helpers";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Loading } from "../components/ui/Spinner";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const cartItem = items.find((item) => item._id === id);
  const currentCartQuantity = cartItem?.quantity || 0;

  // Check if product is in wishlist
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.some((item) => item._id === id));
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getProductById(id);
        setProduct(response.data);
      } catch {
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <Loading fullScreen text="Loading product..." />;
  }

  if (!product) {
    return null;
  }

  const stockStatus = getStockStatus(product.stock);
  const categoryColor = getCategoryColor(product.category);
  const isOutOfStock = product.stock === 0;
  const maxQuantity = product.stock - currentCartQuantity;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > maxQuantity) {
      toast.error("Maximum quantity reached");
      return;
    }

    dispatch(addToCart({ product, quantity }));
    toast.success(`${quantity} ${product.name} added to cart`);
    setQuantity(1);
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isAlreadyInWishlist = wishlist.some(
      (item) => item._id === product._id,
    );

    if (isAlreadyInWishlist) {
      const updatedWishlist = wishlist.filter(
        (item) => item._id !== product._id,
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
      toast.success("Removed from wishlist");
    } else {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(true);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-primary-600 capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square bg-gray-50 flex items-center justify-center"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[200px]">
                  {product.category === "fruits"
                    ? "🍎"
                    : product.category === "vegetables"
                      ? "🥬"
                      : "🛒"}
                </div>
              )}

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  variant={
                    isOutOfStock
                      ? "danger"
                      : product.stock <= 5
                        ? "warning"
                        : "success"
                  }
                  size="lg"
                >
                  {stockStatus.text}
                </Badge>
              </div>

              {/* Share & Wishlist */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={toggleWishlist}
                  className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isInWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
                <button className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 lg:p-10"
            >
              {/* Category */}
              <span
                className={`inline-block px-3 py-1.5 text-sm font-medium rounded-full ${categoryColor.bg} ${categoryColor.text} capitalize mb-4`}
              >
                {product.category}
              </span>

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-500">/{product.unit}</span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Stock Info */}
              <div className="mb-6">
                <span className="text-sm text-gray-500">Availability:</span>
                <span className={`ml-2 font-medium ${stockStatus.color}`}>
                  {isOutOfStock
                    ? "Out of Stock"
                    : `${product.stock} ${product.unit}s available`}
                </span>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-sm text-gray-700 font-medium">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-16 text-center font-medium text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity}
                      className="p-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {currentCartQuantity > 0 && (
                    <span className="text-sm text-primary-600">
                      ({currentCartQuantity} in cart)
                    </span>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || maxQuantity <= 0}
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                  className="flex-1"
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : maxQuantity <= 0
                      ? "Max in Cart"
                      : "Add to Cart"}
                </Button>
                <Button
                  size="lg"
                  variant={isInWishlist ? "primary" : "outline"}
                  onClick={toggleWishlist}
                  leftIcon={
                    <Heart
                      className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
                    />
                  }
                >
                  {isInWishlist ? "In Wishlist" : "Wishlist"}
                </Button>
              </div>

              {/* Features */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="h-5 w-5 text-primary-600" />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="h-5 w-5 text-primary-600" />
                  <span>100% fresh & quality guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <RotateCcw className="h-5 w-5 text-primary-600" />
                  <span>Easy returns within 24 hours</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
