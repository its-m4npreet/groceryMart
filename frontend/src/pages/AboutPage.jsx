import { motion } from "framer-motion";
import {
  Leaf,
  Target,
  Award,
  TrendingUp,
  Heart,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { APP_NAME } from "../config/constants";

const AboutPage = () => {
  const stats = [
    { icon: <ShoppingBag className="h-6 w-6" />, value: "500+", label: "Products" },
    { icon: <Clock className="h-6 w-6" />, value: "Fast", label: "Delivery" },
    { icon: <Leaf className="h-6 w-6" />, value: "Fresh", label: "Daily" },
    { icon: <Heart className="h-6 w-6" />, value: "Quality", label: "Assured" },
  ];

  const values = [
    {
      icon: <Leaf />,
      title: "Fresh & Organic",
      description: "We source only the freshest organic produce directly from local farmers.",
    },
    {
      icon: <Heart />,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to serve you better.",
    },
    {
      icon: <Award />,
      title: "Quality Assured",
      description: "Every product undergoes strict quality checks before reaching you.",
    },
    {
      icon: <TrendingUp />,
      title: "Best Prices",
      description: "Competitive pricing without compromising on quality or freshness.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About {APP_NAME}
            </h1>
            <p className="text-xl text-primary-100">
              Your trusted partner for fresh groceries and daily essentials
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center"
              >
                <div className="inline-flex p-2 sm:p-3 bg-primary-100 text-primary-600 rounded-lg mb-2 sm:mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {APP_NAME} is your one-stop online grocery shopping destination,
                  committed to bringing fresh, quality produce right to your doorstep.
                </p>
                <p>
                  We believe everyone deserves access to fresh, quality groceries without
                  the hassle of visiting crowded markets. Our platform makes it easy to
                  order your daily essentials from the comfort of your home.
                </p>
                <p>
                  We work with trusted local suppliers to ensure you get the freshest
                  fruits, vegetables, and groceries at competitive prices. Your
                  satisfaction is our priority.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-1">
                <div className="w-full h-full bg-white rounded-2xl p-8 flex items-center justify-center">
                  <Leaf className="h-32 w-32 text-primary-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-4 bg-primary-100 text-primary-600 rounded-2xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8"
            >
              <div className="inline-flex p-3 bg-blue-100 text-blue-600 rounded-lg mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To provide fresh, quality groceries with convenient online shopping
                and fast delivery, making daily grocery shopping hassle-free for our
                customers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8"
            >
              <div className="inline-flex p-3 bg-green-100 text-green-600 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To become a trusted online grocery platform that makes fresh,
                quality food accessible to everyone while supporting local
                suppliers and promoting healthy living.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience Freshness?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Start shopping for fresh groceries and daily essentials delivered
              to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary">
                  Start Shopping
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
