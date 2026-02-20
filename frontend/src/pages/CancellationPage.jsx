import { motion } from "framer-motion";
import { XCircle, Clock, RefreshCcw, CreditCard, AlertTriangle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const CancellationPage = () => {
  const cancellationTimeline = [
    {
      status: "Order Placed",
      time: "Within 5 minutes",
      action: "Instant cancellation available",
      borderClass: "border-green-500",
      bgClass: "bg-green-50",
      iconClass: "text-green-600",
      timeClass: "text-green-700",
    },
    {
      status: "Order Confirmed",
      time: "Within 30 minutes",
      action: "Easy cancellation with full refund",
      borderClass: "border-blue-500",
      bgClass: "bg-blue-50",
      iconClass: "text-blue-600",
      timeClass: "text-blue-700",
    },
    {
      status: "Order Processing",
      time: "30 minutes - 2 hours",
      action: "Cancellation with minor fee may apply",
      borderClass: "border-yellow-500",
      bgClass: "bg-yellow-50",
      iconClass: "text-yellow-600",
      timeClass: "text-yellow-700",
    },
    {
      status: "Out for Delivery",
      time: "After 2 hours",
      action: "Cancellation not available",
      borderClass: "border-red-500",
      bgClass: "bg-red-50",
      iconClass: "text-red-600",
      timeClass: "text-red-700",
    },
  ];

  const refundTimeline = [
    {
      method: "UPI / Online Payment",
      timeline: "3-5 business days",
      description: "Refund to original payment source",
    },
    {
      method: "Credit / Debit Card",
      timeline: "5-7 business days",
      description: "Refund will appear in your card statement",
    },
    {
      method: "Cash on Delivery",
      timeline: "Instant",
      description: "No payment was made, no refund needed",
    },
    {
      method: "Wallet / Store Credit",
      timeline: "Instant",
      description: "Credits added to your account immediately",
    },
  ];

  const cancellationReasons = [
    "Changed my mind about the order",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Need to modify order items",
    "Delivery time not suitable",
    "Payment issues",
    "Other reasons",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-3 sm:p-4 bg-white/10 rounded-full mb-4 sm:mb-6">
              <XCircle className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Cancellation Policy
            </h1>
            <p className="text-lg sm:text-xl text-red-100">
              Easy cancellation process with transparent refund timelines
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <p className="text-gray-600 leading-relaxed mb-4">
              At THETAHLIADDA Mart, we understand that plans can change. Our cancellation
              policy is designed to be fair and transparent, giving you flexibility
              while ensuring efficient operations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The ability to cancel an order depends on its current status. The sooner
              you cancel, the easier and faster the process.
            </p>
          </motion.div>

          {/* Cancellation Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              When Can I Cancel?
            </h2>
            <div className="space-y-4">
              {cancellationTimeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border-l-4 ${item.borderClass} ${item.bgClass}`}
                >
                  <div className="flex-shrink-0">
                    <Clock className={`h-6 w-6 ${item.iconClass}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {item.status}
                      </h3>
                      <span className={`text-sm font-medium ${item.timeClass}`}>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How to Cancel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Cancel Your Order
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <RefreshCcw className="h-5 w-5 text-blue-600" />
                  Via Website/App
                </h3>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">1.</span>
                    <span>Go to "My Orders" in your account</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">2.</span>
                    <span>Select the order you want to cancel</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">3.</span>
                    <span>Click on "Cancel Order" button</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">4.</span>
                    <span>Select a cancellation reason</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">5.</span>
                    <span>Confirm cancellation</span>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Via Customer Support
                </h3>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-green-600">1.</span>
                    <span>Call us at +91 98765 43210</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-green-600">2.</span>
                    <span>Provide your order number and registered mobile</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-green-600">3.</span>
                    <span>Confirm cancellation with support agent</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-green-600">4.</span>
                    <span>Receive confirmation via SMS/Email</span>
                  </li>
                </ol>
              </div>
            </div>
          </motion.div>

          {/* Cancellation Reasons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Common Cancellation Reasons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cancellationReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Refund Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Refund Timeline
            </h2>
            <div className="space-y-4">
              {refundTimeline.map((refund, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <CreditCard className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {refund.method}
                      </h3>
                      <span className="text-sm text-blue-600 font-medium">
                        {refund.timeline}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{refund.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cancellation Fees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cancellation Fees
            </h2>
            <div className="space-y-4 text-gray-600">
              <p><strong className="text-gray-900">No Fee:</strong> Cancellations within 30 minutes of order placement</p>
              <p><strong className="text-gray-900">₹20 Fee:</strong> Cancellations between 30 minutes to 2 hours</p>
              <p><strong className="text-gray-900">Not Allowed:</strong> Cancellations after order is out for delivery</p>
              <p className="text-sm text-gray-500 mt-4">
                * Cancellation fees are deducted from your refund amount. For Cash on Delivery orders, fees do not apply.
              </p>
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
                  Important Information
                </h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      Frequent cancellations may affect your account status and future
                      order placements.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      Once an order is out for delivery, it cannot be cancelled. You
                      may refuse delivery and initiate a return instead.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      Partial cancellations are not allowed. You must cancel the entire
                      order.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>
                      Refund processing time depends on your bank or payment provider.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Modification Alternative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need to Modify Instead?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you want to add or remove items from your order, you don't need to
              cancel! Contact our customer support immediately, and we'll try our best
              to modify your order if it hasn't been processed yet.
            </p>
            <p className="text-gray-600 text-sm">
              Note: Order modifications are subject to product availability and can only
              be done within 15 minutes of order placement.
            </p>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Need Help with Cancellation?</h3>
            <p className="text-red-100 mb-6">
              Our customer support team is ready to assist you with order
              cancellations and refunds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call +91 98765 43210
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-colors"
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

export default CancellationPage;
