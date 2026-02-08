import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
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
import fruitsImage from "../assets/fruits.png";
import vegetablesImage from "../assets/vegetable.png";
import groceryImage from "../assets/Grocery.png";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero carousel slides
  const heroSlides = [
    {
      id: 1,
      badge: "🌿 100% Fresh & Organic",
      title: "Fresh Vegetables",
      subtitle: "Big Discount",
      description:
        "Save up to 50% off on your first order. Fresh fruits, vegetables, and grocery items delivered to your doorstep.",
      gradient: "from-primary-50 via-green-50 to-emerald-50",
      image: vegetablesImage,
    },
    {
      id: 2,
      badge: "🍎 Farm Fresh Fruits",
      title: "Organic Fruits",
      subtitle: "Season Special",
      description:
        "Get the freshest seasonal fruits delivered to your home. 100% organic and handpicked for quality.",
      gradient: "from-red-50 via-orange-50 to-yellow-50",
      image: fruitsImage,
    },
    {
      id: 3,
      badge: "🥛 Daily Essentials",
      title: "Grocery Items",
      subtitle: "Best Prices",
      description:
        "Stock up on daily essentials at unbeatable prices. Quality products from trusted brands.",
      gradient: "from-blue-50 via-indigo-50 to-purple-50",
      image: groceryImage,
    },
  ];

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

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // const features = [
  //   {
  //     icon: <Truck className="h-6 w-6" />,
  //     title: "Free Delivery",
  //     desc: `On orders above ₹${FREE_DELIVERY_THRESHOLD}`,
  //   },
  //   {
  //     icon: <Shield className="h-6 w-6" />,
  //     title: "Fresh Quality",
  //     desc: "100% organic products",
  //   },
  //   {
  //     icon: <Clock className="h-6 w-6" />,
  //     title: "Fast Delivery",
  //     desc: "Same day delivery",
  //   },
  //   {
  //     icon: <Headphones className="h-6 w-6" />,
  //     title: "24/7 Support",
  //     desc: "Dedicated support",
  //   },
  // ];

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
      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient}`}
            >
              <div className="container mx-auto px-4 h-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-8 sm:py-12">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="z-10"
                  >
                    <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur text-primary-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                      {heroSlides[currentSlide].badge}
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                      {heroSlides[currentSlide].title}
                      <br />
                      <span className="text-primary-600">
                        {heroSlides[currentSlide].subtitle}
                      </span>
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-lg">
                      {heroSlides[currentSlide].description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Link to="/products">
                        <Button
                          size="lg"
                          rightIcon={<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                          className="w-full sm:w-auto"
                        >
                          Shop Now
                        </Button>
                      </Link>
                      <Link to="/deals">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                          View Deals
                        </Button>
                      </Link>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex gap-6 lg:gap-8 mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-gray-200">
                      <div>
                        <div className="text-2xl lg:text-3xl font-bold text-primary-600">
                          10K+
                        </div>
                        <div className="text-xs lg:text-sm text-gray-500">
                          Products
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl lg:text-3xl font-bold text-primary-600">
                          50K+
                        </div>
                        <div className="text-xs lg:text-sm text-gray-500">
                          Customers
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl lg:text-3xl font-bold text-primary-600">
                          100+
                        </div>
                        <div className="text-xs lg:text-sm text-gray-500">
                          Cities
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Image illustration */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative hidden lg:flex items-center justify-center h-full"
                  >
                    <div className="relative w-full h-full max-w-lg max-h-[450px] flex items-center justify-center p-4">
                      <img
                        src={heroSlides[currentSlide].image}
                        alt={heroSlides[currentSlide].title}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        loading="eager"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/80 backdrop-blur hover:bg-white rounded-full shadow-lg transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/80 backdrop-blur hover:bg-white rounded-full shadow-lg transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all rounded-full ${
                  currentSlide === index
                    ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-primary-600"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* <section className="py-8 bg-gray-50">
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
      </section> */}

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

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-6">
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
                  <div className="flex flex-col  items-center gap-2 sm:gap-3 md:gap-4 text-center sm:text-left">
                    <div className="group-hover:scale-110 transition-transform shrink-0">
                      {getCategoryIcon(
                        category.id,
                        "h-10 w-10 md:h-12 md:w-12",
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">
                        {category.name}
                      </h3>
                      {/* <p className="hidden sm:block text-gray-600 text-xs md:text-sm truncate">
                        Shop fresh {category.id}
                      </p> */}
                      {/* <span className="hidden md:inline-flex items-center gap-1 text-primary-600 font-medium text-xs md:text-sm mt-1 md:mt-2 group-hover:gap-2 transition-all">
                        Shop Now{" "}
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                      </span> */}
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
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
