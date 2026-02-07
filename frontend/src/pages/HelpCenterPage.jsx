import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Package,
  CreditCard,
  Shield,
  User,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE,
  BUSINESS_HOURS,
  BUSINESS_DAYS,
  BUSINESS_ADDRESS,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_CHARGE,
} from "../config/constants";

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
      answer: `No minimum order value is required. However, free delivery is available on orders above ₹${FREE_DELIVERY_THRESHOLD}. Orders below ₹${FREE_DELIVERY_THRESHOLD} will have a delivery charge of ₹${DELIVERY_CHARGE}.`,
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
      contact: SUPPORT_PHONE,
      action: "Call Now",
      colorClasses: "bg-blue-100 text-blue-600",
      onClick: () => (window.location.href = `tel:${SUPPORT_PHONE}`),
    },
    {
      icon: <Mail className="h-10 w-10" />,
      title: "Email Us",
      description: "We reply within 24 hours",
      contact: SUPPORT_EMAIL,
      action: "Send Email",
      colorClasses: "bg-orange-100 text-orange-600",
      onClick: () => (window.location.href = `mailto:${SUPPORT_EMAIL}`),
    },
    {
      icon: (
        <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      title: "WhatsApp Support",
      description: "Quick response guaranteed",
      contact: "Chat with us on WhatsApp",
      action: "Open WhatsApp",
      colorClasses: "bg-green-100 text-green-600",
      onClick: () =>
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
          "_blank",
        ),
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
      <div className="bg-linear-to-br from-primary-600 to-primary-800 text-white py-16">
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 text-gray-200 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
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
                className={`inline-flex p-3 ${method.colorClasses} rounded-xl mb-4`}
              >
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 mb-2">{method.description}</p>
              <p className="text-gray-900 font-medium mb-4">{method.contact}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={method.onClick}
              >
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
                      <ChevronUp className="h-5 w-5 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 shrink-0" />
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
                <p className="text-gray-600 mb-2">{BUSINESS_DAYS}</p>
                <p className="text-gray-900 font-medium">{BUSINESS_HOURS}</p>
              </div>
              <div>
                <MapPin className="h-10 w-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Head Office
                </h3>
                <p className="text-gray-600">
                  {BUSINESS_ADDRESS.split(",").slice(0, -2).join(",")}
                  <br />
                  {BUSINESS_ADDRESS.split(",").slice(-2).join(",")}
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
          <svg
            className="h-16 w-16 text-primary-600 mx-auto mb-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help
            you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => (window.location.href = `mailto:${SUPPORT_EMAIL}`)}
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
              onClick={() =>
                window.open(
                  `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
                  "_blank",
                )
              }
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
