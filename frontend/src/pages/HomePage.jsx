import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Apple,
  Carrot,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Zap,
  Star,
  Package,
} from "lucide-react";
import { productApi } from "../api";
import { CATEGORIES } from "../config/constants";
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
  const [fruitsProducts, setFruitsProducts] = useState([]);
  const [vegetablesProducts, setVegetablesProducts] = useState([]);
  const [groceryProducts, setGroceryProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileCurrentSlide, setMobileCurrentSlide] = useState(0);


  // Mobile carousel slides
  const mobileSlides = [
    {
      id: 1,
      image: "/@finefaresupermarket.jpeg",
    },
    {
      id: 2,
      image: "/Vegetables banners, farm market food veggies.jpeg",
    },
    {
      id: 3,
      image: "/personal_care.jpeg",
    }
  ];

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

    const fetchCategoryProducts = async () => {
      try {
        setCategoryLoading(true);
        // Fetch products by category
        const [fruits, vegetables, grocery, trending] = await Promise.all([
          productApi.getProducts({ category: "fruits", limit: 6 }),
          productApi.getProducts({ category: "vegetables", limit: 6 }),
          productApi.getProducts({ category: "grocery", limit: 6 }),
          productApi.getProducts({ limit: 8, sortBy: "views", sortOrder: "desc" })
        ]);

        setFruitsProducts(fruits.data || []);
        setVegetablesProducts(vegetables.data || []);
        setGroceryProducts(grocery.data || []);
        setTrendingProducts(trending.data || []);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchProducts();
    fetchCategoryProducts();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Auto-play mobile carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setMobileCurrentSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [mobileSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };



  return (
    <div>
      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden bg-gray-50">
        {/* Desktop Carousel - Hidden on Mobile */}
        <div className="relative h-100 sm:h-125 md:h-150 hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-linear-to-r ${heroSlides[currentSlide].gradient}`}
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
                    className="relative lg:flex items-center justify-center h-full"
                  >
                    <div className="relative w-full h-full max-w-lg max-h-112.5 flex items-center justify-center p-4">
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
                className={`transition-all rounded-full ${currentSlide === index
                  ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-primary-600"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Banner Images - Visible only on Mobile */}
        <div className="md:hidden pt-4 pb-6 px-4">
          <div className="relative overflow-hidden aspect-[2/1] bg-white group mt-2 mb-4">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={mobileCurrentSlide}
                initial={{ opacity: 0.5, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.5, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
                  if (swipe && offset.x > 0) {
                    setMobileCurrentSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
                  } else if (swipe && offset.x < 0) {
                    setMobileCurrentSlide((prev) => (prev + 1) % mobileSlides.length);
                  }
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <img
                  src={mobileSlides[mobileCurrentSlide].image}
                  alt={`Special Offer ${mobileSlides[mobileCurrentSlide].id}`}
                  className="w-full h-full object-contain select-none pointer-events-none"
                  loading={mobileCurrentSlide === 0 ? "eager" : "lazy"}
                />
              </motion.div>
            </AnimatePresence>

            {/* Mobile Dots Indicator - Floating with better contrast */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {mobileSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMobileCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full h-1 ${mobileCurrentSlide === index
                    ? "w-6 bg-primary-600"
                    : "w-1.5 bg-gray-300"
                    }`}
                  aria-label={`Go to mobile slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Visual cues for mobile - subtle gradient at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
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
              <span className="hidden sm:inline">View All</span> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 sm:gap-4 md:gap-6 pb-2 min-w-max">
              {CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="shrink-0 w-24 sm:w-28 md:w-32 lg:w-36"
                >
                  <Link
                    to={`/products?category=${category.id}`}
                    className={`block p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl ${category.color} hover:shadow-lg transition-all group h-full`}
                  >
                    <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 text-center">
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
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Trending Products */}
      <section className="py-16 bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-r from-orange-500 to-amber-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Trending Now
                </h2>
                <p className="text-gray-600 mt-1">Hot picks of the week</p>
              </div>
            </div>
            <Link
              to="/products"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              <span className="hidden sm:inline">View All</span> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categoryLoading ? (
            <ProductListSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {trendingProducts.map((product, index) => (
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

      {/* Fresh Fruits Section */}
      <section className="py-16 bg-linear-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-r from-red-500 to-pink-500 rounded-xl">
                <Apple className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Fresh Fruits
                </h2>
                <p className="text-gray-600 mt-1">100% Fresh & Organic fruits</p>
              </div>
            </div>
            <Link
              to="/products?category=fruits"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              <span className="hidden sm:inline">View All</span> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categoryLoading ? (
            <ProductListSkeleton count={6} />
          ) : fruitsProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {fruitsProducts.slice(0, 10).map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Apple className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No fruits available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Fresh Vegetables Section */}
      <section className="py-16 bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl">
                <Carrot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Fresh Vegetables
                </h2>
                <p className="text-gray-600 mt-1">Farm fresh vegetables daily</p>
              </div>
            </div>
            <Link
              to="/products?category=vegetables"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              <span className="hidden sm:inline">View All</span> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categoryLoading ? (
            <ProductListSkeleton count={6} />
          ) : vegetablesProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {vegetablesProducts.slice(0, 10).map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Carrot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No vegetables available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Grocery & Essentials Section */}
      <section className="py-16 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Grocery & Essentials
                </h2>
                <p className="text-gray-600 mt-1">Daily needs at best prices</p>
              </div>
            </div>
            <Link
              to="/products?category=grocery"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              <span className="hidden sm:inline">View All</span> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categoryLoading ? (
            <ProductListSkeleton count={6} />
          ) : groceryProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {groceryProducts.slice(0, 10).map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No grocery items available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-16 bg-linear-to-r from-purple-100 via-pink-100 to-red-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              Limited Time Offer
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Deal of the Day
            </h2>
            <p className="text-gray-600">Don't miss out on today's special offers!</p>
          </div>

          {loading ? (
            <ProductListSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
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

      {/* Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-r from-amber-500 to-orange-500 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Popular Products
                </h2>
                <p className="text-gray-600 mt-1">Most loved by our customers</p>
              </div>
            </div>
            <Link
              to="/products"
              className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              <span className="hidden sm:inline">View All</span> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <ProductListSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {featuredProducts.slice(0, 10).map((product, index) => (
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


    </div>
  );
};

export default HomePage;
