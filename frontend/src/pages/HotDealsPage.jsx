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
  const [regularProducts, setRegularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegular, setLoadingRegular] = useState(true);
  const [filter, setFilter] = useState("all"); // all, high-discount, low-stock

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProducts({
          isHotDeal: 'true',
          limit: 100,
          sortBy: "discount",
          sortOrder: "desc",
          inStock: true,
        });

        // Filter out products with expired discounts
        const validDeals = (response.data || []).filter(product => {
          // Use backend field if available, otherwise calculate
          if (product.isDiscountActive !== undefined) {
            return product.isDiscountActive;
          }
          if (!product.discount || product.discount <= 0) return false;
          if (!product.discountExpiry) return true;
          return new Date(product.discountExpiry) > new Date();
        });
        setDealsProducts(validDeals);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
        setDealsProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegularProducts = async () => {
      setLoadingRegular(true);
      try {
        const response = await productApi.getProducts({
          limit: 20,
          inStock: true,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        // Filter out hot deal products
        const nonHotDeals = (response.data || []).filter(p => !p.isHotDeal);
        setRegularProducts(nonHotDeals);
      } catch (error) {
        console.error("Failed to fetch regular products:", error);
        setRegularProducts([]);
      } finally {
        setLoadingRegular(false);
      }
    };

    fetchDeals();
    fetchRegularProducts();
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

  const isMobile = window.innerWidth <= 768;

  // Group products by discount ranges
  const getProductsByDiscountRange = () => {
    const ranges = [
      { label: "50%+ OFF - Mega Savings", min: 50, max: 100, color: "red" },
      { label: "30-49% OFF - Super Deals", min: 30, max: 49, color: "orange" },
      { label: "20-29% OFF - Great Offers", min: 20, max: 29, color: "yellow" },
      { label: "10-19% OFF - Good Deals", min: 10, max: 19, color: "green" },
      { label: "Up to 10% OFF", min: 0, max: 9, color: "blue" },
    ];

    return ranges
      .map((range) => ({
        ...range,
        products: filteredProducts.filter(
          (p) => p.discount >= range.min && p.discount <= range.max
        ),
      }))
      .filter((range) => range.products.length > 0);
  };

  const discountRanges = getProductsByDiscountRange();

  // Calculate total savings
  // const totalSavings = dealsProducts.reduce((sum, p) => {
  //   const savings = p.price * (p.discount / 100);
  //   return sum + savings;
  // }, 0);

  // const stats = [
  //   {
  //     icon: <Flame className="h-5 w-5" />,
  //     label: "Hot Deals",
  //     value: dealsProducts.length,
  //     color: "text-red-500 bg-red-50",
  //   },
  //   {
  //     icon: <Percent className="h-5 w-5" />,
  //     label: "Avg Discount",
  //     value:
  //       dealsProducts.length > 0
  //         ? `${Math.round(
  //             dealsProducts.reduce((sum, p) => sum + (p.discount || 0), 0) /
  //               dealsProducts.length,
  //           )}%`
  //         : "0%",
  //     color: "text-orange-500 bg-orange-50",
  //   },
  //   {
  //     icon: <TrendingDown className="h-5 w-5" />,
  //     label: "Up to",
  //     value:
  //       dealsProducts.length > 0
  //         ? `${Math.max(...dealsProducts.map((p) => p.discount || 0))}% OFF`
  //         : "0% OFF",
  //     color: "text-green-500 bg-green-50",
  //   },
  //   {
  //     icon: <Package className="h-5 w-5" />,
  //     label: "Total Savings",
  //     value: dealsProducts.length > 0 ? `₹${totalSavings.toFixed(0)}` : "₹0",
  //     color: "text-blue-500 bg-blue-50",
  //   },
  // ];

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
      {/* <div className="container mx-auto px-4 -mt-8">
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
      </div> */}

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              All Deals ({dealsProducts.length})
            </button>
            <button
              onClick={() => setFilter("high-discount")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "high-discount"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              20%+ Off ({dealsProducts.filter((p) => p.discount >= 20).length})
            </button>
            <button
              onClick={() => setFilter("low-stock")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "low-stock"
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
            title="No hot deals available"
            description="Check back soon for exciting offers and discounts!"
            action={
              <Button as={Link} to="/products" size="lg">
                Browse All Products
              </Button>
            }
          />
        ) : (
          <>
            {discountRanges.map((range, rangeIndex) => (
              <motion.div
                key={rangeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rangeIndex * 0.1 }}
                className="mb-12"
              >
                {/* Discount Range Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${range.color === 'red' ? 'bg-red-100 text-red-700' :
                    range.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                      range.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        range.color === 'green' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                    }`}>
                    <Flame className="h-5 w-5" />
                    <span className="font-bold text-lg">{range.label}</span>
                  </div>
                  {/* <span className="text-gray-500">
                    ({range.products.length} {range.products.length === 1 ? 'product' : 'products'})
                  </span> */}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {range.products.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Regular Products Section */}
      {!loading && filteredProducts.length > 0 && (
        <div className="container mx-auto px-4 py-8 border-t border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="h-6 w-6 text-primary-600" />
              Regular Products
            </h2>
            <p className="text-gray-600">
              More great products at everyday prices
            </p>
          </div>

          {loadingRegular ? (
            <ProductListSkeleton count={8} />
          ) : regularProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No regular products available</p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
            >
              {regularProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Call to Action */}
      {!loading && !isMobile && filteredProducts.length > 0 && (
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
