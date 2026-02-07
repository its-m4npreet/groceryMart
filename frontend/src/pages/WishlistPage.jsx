import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { formatPrice } from "../utils/helpers";
import { getCategoryIcon } from "../utils/iconHelpers";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    };
    loadWishlist();
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = (items) => {
    localStorage.setItem("wishlist", JSON.stringify(items));
    setWishlistItems(items);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item._id !== productId,
    );
    saveWishlist(updatedWishlist);
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error("Product is out of stock");
    }
  };

  const handleAddAllToCart = () => {
    const availableProducts = wishlistItems.filter((item) => item.stock > 0);
    if (availableProducts.length === 0) {
      toast.error("No products available in stock");
      return;
    }

    availableProducts.forEach((product) => {
      dispatch(addToCart({ product, quantity: 1 }));
    });
    toast.success(`${availableProducts.length} items added to cart`);
  };

  const clearWishlist = () => {
    saveWishlist([]);
    toast.success("Wishlist cleared");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <EmptyState
          icon={<Heart className="h-16 w-16" />}
          title="Your Wishlist is Empty"
          description="Start adding products to your wishlist to save them for later"
          action={
            <Button as={Link} to="/products" size="lg">
              Browse Products
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearWishlist}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Clear All
              </Button>
              <Button
                onClick={handleAddAllToCart}
                leftIcon={<ShoppingCart className="h-4 w-4" />}
              >
                Add All to Cart
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Link to={`/products/${product._id}`}>
                  {product.image && !imageErrors[product._id] ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => {
                        setImageErrors((prev) => ({
                          ...prev,
                          [product._id]: true,
                        }));
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-50">
                      {getCategoryIcon(product.category, "h-16 w-16")}
                    </div>
                  )}
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="h-5 w-5 fill-current text-red-600" />
                </button>

                {/* Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="error">Out of Stock</Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-500 mb-3 capitalize">
                  {product.category}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full"
                  size="sm"
                  leftIcon={<ShoppingCart className="h-4 w-4" />}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-primary-50 rounded-2xl p-8"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              💡 Wishlist Tips
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Heart className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">
                  Save for Later
                </h3>
                <p className="text-sm text-gray-600">
                  Keep track of products you love
                </p>
              </div>
              <div>
                <ShoppingCart className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Quick Add</h3>
                <p className="text-sm text-gray-600">
                  Add items to cart anytime
                </p>
              </div>
              <div>
                <Badge className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Price Alerts</h3>
                <p className="text-sm text-gray-600">
                  Get notified of price drops (coming soon)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;
