import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Truck,
  Shield,
  Clock,
  Headphones,
  Leaf,
  Soup,
  Apple,
  Grape,
  Carrot,
} from "lucide-react";
import { productApi } from "../api";
import { CATEGORIES, FREE_DELIVERY_THRESHOLD } from "../config/constants";
import ProductCard from "../components/product/ProductCard";
import {
  ProductListSkeleton,
  CategoryCardSkeleton,
} from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import { getCategoryIcon } from "../utils/iconHelpers";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getProducts({
          limit: 8,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setFeaturedProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Delivery",
      desc: `On orders above ₹${FREE_DELIVERY_THRESHOLD}`,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Fresh Quality",
      desc: "100% organic products",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Fast Delivery",
      desc: "Same day delivery",
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24/7 Support",
      desc: "Dedicated support",
    },
  ];

  const promotions = [
    {
      title: "Everyday Fresh & Clean with Our Products",
      image: "/images/promo-1.jpg",
      color: "from-green-500 to-green-600",
      icon: Leaf,
    },
    {
      title: "Make your Breakfast Healthy and Easy",
      image: "/images/promo-2.jpg",
      color: "from-orange-400 to-orange-500",
      icon: Soup,
    },
    {
      title: "The Best Organic Products Online",
      image: "/images/promo-3.jpg",
      color: "from-primary-500 to-primary-600",
      icon: Apple,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary-50 via-green-50 to-emerald-50 overflow-hidden">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                🌿 100% Fresh & Organic
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Fresh Vegetables
                <br />
                <span className="text-primary-600">Big Discount</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Save up to 50% off on your first order. Fresh fruits,
                vegetables, and grocery items delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Shop Now
                  </Button>
                </Link>
                <Link to="/deals">
                  <Button size="lg" variant="outline">
                    View Deals
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-primary-100">
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    10K+
                  </div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    50K+
                  </div>
                  <div className="text-sm text-gray-500">Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    100+
                  </div>
                  <div className="text-sm text-gray-500">Cities</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-125 flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-br from-primary-200/30 to-green-200/30 rounded-full blur-3xl" />
                <div className="relative text-[300px]">🥗</div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-10 left-10"
                >
                  <Apple className="h-16 w-16 text-red-400" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-20 right-10"
                >
                  <Carrot className="h-14 w-14 text-orange-400" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-20 left-20"
                >
                  <Leaf className="h-14 w-14 text-green-400" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-32 right-20"
                >
                  <Grape className="h-12 w-12 text-purple-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(249 250 251)"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100"
              >
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Featured Categories
              </h2>
              <p className="text-gray-500 mt-1">
                Browse our popular categories
              </p>
            </div>
            <Link
              to="/products"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.id}`}
                  className={`block p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl ${category.color} hover:shadow-lg transition-all group`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 text-center sm:text-left">
                    <div className="group-hover:scale-110 transition-transform flex-shrink-0">
                      {getCategoryIcon(
                        category.id,
                        "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16",
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">
                        {category.name}
                      </h3>
                      <p className="hidden sm:block text-gray-600 text-xs md:text-sm truncate">
                        Shop fresh {category.id}
                      </p>
                      <span className="hidden md:inline-flex items-center gap-1 text-primary-600 font-medium text-xs md:text-sm mt-1 md:mt-2 group-hover:gap-2 transition-all">
                        Shop Now{" "}
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to="/products"
                  className={`block p-6 rounded-2xl bg-linear-to-r ${promo.color} text-white relative overflow-hidden group`}
                >
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2 max-w-52">
                      {promo.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 font-medium text-sm group-hover:gap-2 transition-all">
                      Shop Now <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="absolute right-4 bottom-2 text-7xl opacity-50 group-hover:scale-110 transition-transform">
                    <promo.icon className="h-16 w-16" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Popular Products
              </h2>
              <p className="text-gray-500 mt-1">Most loved by our customers</p>
            </div>
            <Link
              to="/products"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <ProductListSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-linear-to-r from-primary-600 to-green-600 rounded-3xl p-8 lg:p-12 text-center"
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
              Stay Updated with Fresh Deals
            </h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter and get exclusive discounts on fresh
              fruits, vegetables, and grocery items.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button
                type="submit"
                className="bg-white/10 text-primary-600 hover:bg-white/20 focus:ring-white/50"
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
