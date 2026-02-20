import { motion } from "framer-motion";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  Package,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const ReturnPolicyPage = () => {
  const eligibleItems = [
    { icon: <CheckCircle className="h-5 w-5" />, text: "Damaged or defective products" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Wrong or missing items in your order" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Products past expiry date" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Poor quality or spoiled fresh produce" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Packaging damaged or unsealed" },
  ];

  const nonEligibleItems = [
    { icon: <XCircle className="h-5 w-5" />, text: "Perishable items after 24 hours of delivery" },
    { icon: <XCircle className="h-5 w-5" />, text: "Products with broken seals or used items" },
    { icon: <XCircle className="h-5 w-5" />, text: "Items without original packaging" },
    { icon: <XCircle className="h-5 w-5" />, text: "Personal care products once opened" },
    { icon: <XCircle className="h-5 w-5" />, text: "Products damaged due to mishandling" },
  ];

  const returnProcess = [
    {
      step: "1",
      title: "Contact Us",
      description: "Call our customer support at +91 98765 43210 or raise a return request through your account within the eligible return window.",
      icon: <Phone className="h-6 w-6" />,
    },
    {
      step: "2",
      title: "Verification",
      description: "Our team will verify your request and may ask for photos or additional information about the issue.",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      step: "3",
      title: "Pickup Scheduled",
      description: "Once approved, we'll schedule a pickup from your address at your convenience. Keep the product in its original condition.",
      icon: <Package className="h-6 w-6" />,
    },
    {
      step: "4",
      title: "Refund Processed",
      description: "After receiving and inspecting the returned item, we'll process your refund within 5-7 business days.",
      icon: <CreditCard className="h-6 w-6" />,
    },
  ];

  const refundMethods = [
    {
      method: "Original Payment Method",
      timeline: "5-7 business days",
      description: "Refund will be credited to the original payment source (credit card, debit card, UPI, etc.)",
    },
    {
      method: "Store Credit",
      timeline: "Instant",
      description: "Get instant store credit to use on your next purchase with additional 5% bonus",
    },
    {
      method: "Bank Transfer",
      timeline: "3-5 business days",
      description: "Direct bank transfer to your registered account",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-4 bg-white/10 rounded-full mb-6">
              <RotateCcw className="h-12 w-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Return & Refund Policy
            </h1>
            <p className="text-xl text-green-100">
              Your satisfaction is our priority. Easy returns and hassle-free refunds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <p className="text-gray-600 leading-relaxed mb-4">
              At THETAHLIADDA Mart, we are committed to providing you with the highest
              quality products and services. However, if you're not completely satisfied
              with your purchase, we're here to help with our easy return and refund
              process.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This policy outlines the conditions, procedures, and timelines for
              returning products and receiving refunds.
            </p>
          </motion.div>

          {/* Return Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Return Window
                </h2>
                <div className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                  <p>
                    <span className="font-semibold">Perishable Items:</span> Must be
                    reported within 24 hours of delivery
                  </p>
                  <p>
                    <span className="font-semibold">Non-Perishable Items:</span> Can be
                    returned within 7 days of delivery
                  </p>
                  <p>
                    <span className="font-semibold">Damaged/Wrong Items:</span> Report
                    immediately upon delivery or within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Eligible Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            {/* Returnable */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Returnable Items
                </h3>
              </div>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="text-green-600 flex-shrink-0 mt-0.5">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Returnable */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                  <XCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Non-Returnable Items
                </h3>
              </div>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="text-red-600 flex-shrink-0 mt-0.5">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Return Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How to Return
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnProcess.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-4">
                      {step.icon}
                    </div>
                    <div className="absolute top-6 left-1/2 w-full h-0.5 bg-green-200 -z-10 hidden lg:block last:hidden" />
                    <div className="mb-2 text-3xl font-bold text-green-600">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Refund Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Refund Methods
            </h2>
            <div className="space-y-4">
              {refundMethods.map((refund, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <CreditCard className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {refund.method}
                      </h3>
                      <span className="text-sm text-green-600 font-medium">
                        {refund.timeline}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{refund.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 rounded-lg p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-3">
                  Important Notes
                </h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      Please inspect your order at the time of delivery. Report any
                      issues immediately to our delivery personnel.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      Keep products in their original packaging until you're sure
                      you won't need to return them.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      Refund timelines may vary based on your bank or payment
                      provider's processing time.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      For Cash on Delivery orders, refunds will be processed via
                      bank transfer or store credit.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Additional Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Replacement Policy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              In case of damaged or defective products, you may choose a replacement
              instead of a refund. Replacements are subject to product availability
              and will be delivered within 2-3 business days at no additional cost.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cancellation After Delivery
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you wish to return a product without any quality issues, a restocking
              fee of 10% may apply for non-perishable items. This policy helps us
              maintain our competitive pricing and service quality.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Need Help with a Return?</h3>
            <p className="text-green-100 mb-6">
              Our customer support team is here to assist you with any return or
              refund queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call +91 98765 43210
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicyPage;
