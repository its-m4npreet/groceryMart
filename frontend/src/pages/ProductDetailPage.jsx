import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
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
import { getCategoryIcon } from "../utils/iconHelpers";
import { FREE_DELIVERY_THRESHOLD, SOCKET_EVENTS } from "../config/constants";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Loading } from "../components/ui/Spinner";
import ProductCard from "../components/product/ProductCard";
import socketService from "../services/socketService";
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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const cartItem = items.find((item) => item._id === id);
  const currentCartQuantity = cartItem?.quantity || 0;

  // Check if discount is valid - use backend field if available, otherwise calculate
  const isDiscountValid = product && (
    product.isDiscountActive !== undefined
      ? product.isDiscountActive
      : (product.discount &&
        product.discount > 0 &&
        (!product.discountExpiry || new Date(product.discountExpiry) > new Date()))
  );

  // Check if product is in wishlist
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.some((item) => item._id === id));
  }, [id]);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await productApi.getProductById(id);
      setProduct(response.data);
    } catch {
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Listen for real-time updates
  useEffect(() => {
    const handleProductUpdated = (data) => {
      // Refresh this product if it was updated
      if (data.productId === id || data.product?._id === id) {
        fetchProduct();
      }
    };

    const handleDealsExpired = () => {
      console.log('[ProductDetail] Deals expired, refreshing...');
      fetchProduct();
    };

    socketService.on(SOCKET_EVENTS.PRODUCT_UPDATED, handleProductUpdated);
    socketService.on(SOCKET_EVENTS.DEALS_EXPIRED, handleDealsExpired);

    return () => {
      socketService.off(SOCKET_EVENTS.PRODUCT_UPDATED, handleProductUpdated);
      socketService.off(SOCKET_EVENTS.DEALS_EXPIRED, handleDealsExpired);
    };
  }, [id, fetchProduct]);

  // Fetch related products from same category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      setLoadingRelated(true);
      try {
        const response = await productApi.getProducts({
          category: product.category,
          limit: 8,
          inStock: true,
        });

        // Filter out the current product
        const related = (response.data || []).filter(p => p._id !== product._id);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
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
        <nav className="hidden lg:flex items-center gap-2 text-sm text-gray-500 mb-8">
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
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  {getCategoryIcon(
                    product.category,
                    "h-32 w-32 lg:h-40 lg:w-40",
                  )}
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
                    className={`h-5 w-5 transition-colors ${isInWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                      }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  aria-label="Share product"
                >
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
                {isDiscountValid ? (
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-3xl font-bold text-primary-600">
                        {formatPrice(product.price * (1 - product.discount / 100))}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <Badge variant="danger" size="lg">
                        {product.isHotDeal ? '🔥 ' : ''}{product.discount}% OFF
                      </Badge>
                    </div>
                    <span className="text-lg text-gray-500">/{product.unit}</span>
                    {product.discountExpiry && (
                      <p className="text-sm text-amber-600 mt-2">
                        ⏰ Offer expires: {new Date(product.discountExpiry).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-lg text-gray-500">/{product.unit}</span>
                  </div>
                )}
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
                  <span>
                    Free delivery on orders above ₹{FREE_DELIVERY_THRESHOLD}
                  </span>
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Related Products
            </h2>
            <p className="text-gray-600">
              More products from {product.category}
            </p>
          </div>

          {loadingRelated ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          )}

          {relatedProducts.length > 4 && (
            <div className="text-center mt-8">
              <Link to={`/products?category=${product.category}`}>
                <Button variant="outline" size="lg">
                  View All {product.category}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
