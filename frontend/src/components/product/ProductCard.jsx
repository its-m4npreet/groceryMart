import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Eye } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { formatPrice, getStockStatus, getCategoryColor } from '../../utils/helpers';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  
  const cartItem = items.find((item) => item._id === product._id);
  const remainingStock = product.stock - (cartItem?.quantity || 0);
  const isOutOfStock = product.stock === 0;
  const stockStatus = getStockStatus(product.stock);
  const categoryColor = getCategoryColor(product.category);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }
    
    if (remainingStock <= 0) {
      toast.error('Maximum quantity reached');
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
    >
      <Link to={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-100 to-gray-50">
              {product.category === 'fruits' ? '🍎' : 
               product.category === 'vegetables' ? '🥬' : '🛒'}
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={
                isOutOfStock ? 'danger' :
                product.stock <= 5 ? 'warning' : 'success'
              }
            >
              {stockStatus.text}
            </Badge>
          </div>

          {/* Quick View Button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <span
              className="p-3 bg-white rounded-full text-gray-900 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer"
            >
              <Eye className="h-5 w-5" />
            </span>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="p-3 bg-white rounded-full text-gray-900 hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${categoryColor.bg} ${categoryColor.text} capitalize mb-2`}>
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">/{product.unit}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || remainingStock <= 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isOutOfStock || remainingStock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add'}
            </button>
          </div>

          {/* Cart quantity indicator */}
          {cartItem && (
            <div className="mt-2 text-sm text-primary-600 font-medium">
              {cartItem.quantity} in cart
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
