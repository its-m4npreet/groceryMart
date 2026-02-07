import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Headphones,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer:
        "Browse our products, add items to your cart, and proceed to checkout. You can pay securely using various payment methods including credit/debit cards, UPI, and cash on delivery.",
    },
    {
      id: 2,
      question: "What is the delivery time?",
      answer:
        "Standard delivery takes 1-3 business days. Express delivery is available for select locations and can deliver within 24 hours. Delivery times may vary based on your location.",
    },
    {
      id: 3,
      question: "What is your return policy?",
      answer:
        "We have a 7-day return policy for fresh produce. If you receive damaged or unsatisfactory products, contact us within 24 hours for a replacement or refund.",
    },
    {
      id: 4,
      question: "Is there a minimum order value?",
      answer:
        "No minimum order value is required. However, free delivery is available on orders above ₹500. Orders below ₹500 will have a delivery charge of ₹40.",
    },
    {
      id: 5,
      question: "How can I track my order?",
      answer:
        'Once your order is placed, you can track it from the "My Orders" section in your account. You will also receive SMS and email updates about your order status.',
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, UPI, net banking, wallets, and cash on delivery. All online payments are processed through secure payment gateways.",
    },
    {
      id: 7,
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel your order before it is dispatched. Once dispatched, cancellation is not possible, but you can return the product as per our return policy.",
    },
    {
      id: 8,
      question: "Do you deliver to my area?",
      answer:
        "We deliver across major cities in India. Enter your pincode during checkout to check if delivery is available in your area.",
    },
  ];

  const contactMethods = [
    {
      icon: <Phone className="h-10 w-10" />,
      title: "Call Us",
      description: "Mon-Sun (8 AM - 10 PM)",
      contact: "1800-123-4567",
      action: "Call Now",
      color: "blue",
    },
    {
      icon: <Mail className="h-10 w-10" />,
      title: "Email Us",
      description: "We reply within 24 hours",
      contact: "support@freshmart.com",
      action: "Send Email",
      color: "green",
    },
    {
      icon: <MessageCircle className="h-10 w-10" />,
      title: "Live Chat",
      description: "Available 24/7",
      contact: "Start chatting with us",
      action: "Start Chat",
      color: "purple",
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : faqs;

  // Contact categories for future use
  // eslint-disable-next-line no-unused-vars
  const categories = [
    {
      icon: <Package className="h-6 w-6" />,
      title: "Orders & Delivery",
      count: 15,
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment & Refunds",
      count: 12,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Returns & Exchanges",
      count: 10,
    },
    {
      icon: <User className="h-6 w-6" />,
      title: "Account & Profile",
      count: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Headphones className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Search our knowledge base or get in touch with our support team
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="container mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div
                className={`inline-flex p-3 bg-${method.color}-100 text-${method.color}-600 rounded-xl mb-4`}
              >
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 mb-2">{method.description}</p>
              <p className="text-gray-900 font-medium mb-4">{method.contact}</p>
              <Button variant="outline" size="sm" className="w-full">
                {method.action}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <HelpCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                    }
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No matching questions found. Try a different search term or
                contact support.
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Clock className="h-10 w-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Business Hours
                </h3>
                <p className="text-gray-600 mb-2">Monday - Sunday</p>
                <p className="text-gray-900 font-medium">8:00 AM - 10:00 PM</p>
              </div>
              <div>
                <MapPin className="h-10 w-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Head Office
                </h3>
                <p className="text-gray-600">
                  123 Fresh Street, Green Valley
                  <br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-3xl mx-auto mb-16"
        >
          <MessageCircle className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help
            you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </Button>
            <Button size="lg" variant="outline">
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Live Chat
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Import missing icons
import { Package, CreditCard, Shield, User } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default HelpCenterPage;
