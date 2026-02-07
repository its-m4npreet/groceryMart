import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Clock, TrendingDown, Percent, Package } from "lucide-react";
import { productApi } from "../api";
import ProductCard from "../components/product/ProductCard";
import { ProductListSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

const HotDealsPage = () => {
  const [dealsProducts, setDealsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, high-discount, low-stock

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProducts({
          limit: 50,
          sortBy: "discount",
          sortOrder: "desc",
          inStock: true,
        });

        // Filter products with discount > 0
        const productsWithDeals = (response.data || []).filter(
          (product) => product.discount && product.discount > 0,
        );

        setDealsProducts(productsWithDeals);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
        setDealsProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const getFilteredProducts = () => {
    switch (filter) {
      case "high-discount":
        return dealsProducts.filter((p) => p.discount >= 20);
      case "low-stock":
        return dealsProducts.filter((p) => p.stock < 20);
      default:
        return dealsProducts;
    }
  };

  const filteredProducts = getFilteredProducts();

  const stats = [
    {
      icon: <Flame className="h-5 w-5" />,
      label: "Hot Deals",
      value: dealsProducts.length,
      color: "text-red-500 bg-red-50",
    },
    {
      icon: <Percent className="h-5 w-5" />,
      label: "Avg Discount",
      value:
        dealsProducts.length > 0
          ? `${Math.round(
              dealsProducts.reduce((sum, p) => sum + (p.discount || 0), 0) /
                dealsProducts.length,
            )}%`
          : "0%",
      color: "text-orange-500 bg-orange-50",
    },
    {
      icon: <TrendingDown className="h-5 w-5" />,
      label: "Up to",
      value:
        dealsProducts.length > 0
          ? `${Math.max(...dealsProducts.map((p) => p.discount || 0))}% OFF`
          : "0% OFF",
      color: "text-green-500 bg-green-50",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Limited Time",
      value: "Offer",
      color: "text-blue-500 bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-red-500 via-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              <Flame className="h-4 w-4 animate-pulse" />
              Limited Time Offers
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Flame className="h-10 w-10 lg:h-12 lg:w-12" /> Hot Deals &
              Special Offers
            </h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
              Grab amazing discounts on fresh groceries before they're gone!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className={`inline-flex p-3 rounded-lg ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Deals ({dealsProducts.length})
            </button>
            <button
              onClick={() => setFilter("high-discount")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "high-discount"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              20%+ Off ({dealsProducts.filter((p) => p.discount >= 20).length})
            </button>
            <button
              onClick={() => setFilter("low-stock")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "low-stock"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Limited Stock ({dealsProducts.filter((p) => p.stock < 20).length})
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <ProductListSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Package className="h-16 w-16" />}
            title="No deals available"
            description="Check back soon for exciting offers and discounts!"
            action={
              <Button as={Link} to="/products" size="lg">
                Browse All Products
              </Button>
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      {!loading && filteredProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-r from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 text-center text-white"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              Don't Miss Out! <Clock className="h-7 w-7 lg:h-8 lg:w-8" />
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              These deals won't last forever. Stock up on your favorites while
              supplies last!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span>Real-time inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span>Fresh products daily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span>Best prices guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HotDealsPage;
