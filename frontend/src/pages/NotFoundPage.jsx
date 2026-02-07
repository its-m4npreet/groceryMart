import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-2">404</div>
          <div className="text-6xl">🥬</div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to our fresh groceries.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            to="/"
            leftIcon={<Home className="h-4 w-4" />}
            size="lg"
          >
            Go Home
          </Button>
          <Button
            as={Link}
            to="/products"
            variant="outline"
            leftIcon={<ShoppingBag className="h-4 w-4" />}
            size="lg"
          >
            Browse Products
          </Button>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous page
        </button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
