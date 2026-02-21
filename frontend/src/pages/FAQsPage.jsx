import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle, Search } from "lucide-react";
import { Input } from "../components/ui";

const FAQsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqCategories = [
    {
      category: "Orders & Delivery",
      icon: "📦",
      faqs: [
        {
          question: "What is the minimum order value?",
          answer: "There is no minimum order value. However, orders above ₹499 in Zone 1, ₹699 in Zone 2, and ₹999 in Zone 3 qualify for free delivery.",
        },
        {
          question: "How long does delivery take?",
          answer: "Delivery time varies by zone: Zone 1 (City Center) takes 1-2 hours, Zone 2 (Nearby Areas) takes 2-4 hours, and Zone 3 (Outskirts) takes 4-6 hours. Orders placed before 12 PM are eligible for same-day delivery.",
        },
        {
          question: "Can I choose a specific delivery time?",
          answer: "Yes! We offer 5 delivery slots throughout the day: 6-9 AM, 9 AM-12 PM, 12-3 PM, 3-6 PM, and 6-9 PM. You can select your preferred slot during checkout.",
        },
        {
          question: "Can I track my order?",
          answer: "Absolutely! Once your order is confirmed, you can track it in real-time through your account dashboard or the order tracking link sent via SMS/email.",
        },
        {
          question: "What if I'm not home during delivery?",
          answer: "You can provide delivery instructions during checkout or contact our delivery partner. We'll attempt delivery and send you a notification. If delivery fails, we'll retry or you can reschedule.",
        },
      ],
    },
    {
      category: "Payments",
      icon: "💳",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, Wallets, and Cash on Delivery (COD) for select areas.",
        },
        {
          question: "Is it safe to pay online?",
          answer: "Yes! All online payments are processed through secure, PCI-DSS compliant payment gateways with SSL encryption. We never store your complete card details.",
        },
        {
          question: "When will my payment be deducted?",
          answer: "For online payments, the amount is deducted immediately upon order confirmation. For COD, payment is collected at the time of delivery.",
        },
        {
          question: "Can I use multiple payment methods for one order?",
          answer: "Currently, we support one payment method per order. You can choose from our available payment options at checkout.",
        },
        {
          question: "What if my payment fails?",
          answer: "If payment fails, the order won't be processed. You'll receive a notification and can retry payment or choose a different payment method.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      icon: "🔄",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "Perishable items must be reported within 24 hours of delivery. Non-perishable items can be returned within 7 days. Damaged, defective, wrong, or poor quality items are eligible for return.",
        },
        {
          question: "How do I return a product?",
          answer: "Contact customer support or raise a return request through your account. Once approved, we'll schedule a pickup from your address.",
        },
        {
          question: "How long does it take to get a refund?",
          answer: "Refunds are processed within 5-7 business days for online payments, 3-5 days for bank transfers, and instantly for store credit or COD orders (via bank transfer).",
        },
        {
          question: "Can I get a replacement instead of a refund?",
          answer: "Yes! For damaged or defective products, you can choose a replacement. It will be delivered within 2-3 business days at no additional cost, subject to availability.",
        },
        {
          question: "What items cannot be returned?",
          answer: "Perishable items after 24 hours, products with broken seals or used items, items without original packaging, opened personal care products, and products damaged due to mishandling cannot be returned.",
        },
      ],
    },
    {
      category: "Products & Quality",
      icon: "🥬",
      faqs: [
        {
          question: "Are your products fresh and organic?",
          answer: "We source fresh produce daily from trusted local farmers and suppliers. Products labeled 'Organic' are certified organic. All items undergo strict quality checks before dispatch.",
        },
        {
          question: "How do you ensure product quality?",
          answer: "Every product is carefully inspected by our quality team before packing. We use temperature-controlled storage and eco-friendly packaging to maintain freshness during delivery.",
        },
        {
          question: "What if I receive expired or spoiled products?",
          answer: "This is very rare, but if it happens, please contact us immediately with photos. We'll arrange a replacement or full refund within 24 hours.",
        },
        {
          question: "Can I see product images before ordering?",
          answer: "Yes! Each product listing includes multiple high-quality images and detailed descriptions. However, actual products may vary slightly due to natural variations.",
        },
        {
          question: "Do you have a product availability guarantee?",
          answer: "We update product availability in real-time. If an item becomes unavailable after you order, we'll contact you to suggest alternatives or remove it from your order with a refund.",
        },
      ],
    },
    {
      category: "Account & Security",
      icon: "🔐",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' and provide your name, email, phone number, and create a password. You'll receive a verification code to activate your account.",
        },
        {
          question: "I forgot my password. What should I do?",
          answer: "Click 'Forgot Password' on the login page, enter your registered email, and follow the instructions sent to reset your password.",
        },
        {
          question: "How is my personal information protected?",
          answer: "We use industry-standard encryption (SSL) to protect your data. We never share your personal information with third parties without consent. Read our Privacy Policy for details.",
        },
        {
          question: "Can I update my delivery address?",
          answer: "Yes! Go to Account Settings > Manage Addresses. You can add, edit, or delete delivery addresses anytime. You can also add a new address during checkout.",
        },
        {
          question: "How do I delete my account?",
          answer: "Contact our support team to request account deletion. We'll process your request within 7 working days. Note that some data may be retained for legal compliance.",
        },
      ],
    },
    {
      category: "Offers & Discounts",
      icon: "🎁",
      faqs: [
        {
          question: "How do I apply a promo code?",
          answer: "Enter the promo code in the 'Apply Coupon' field during checkout and click 'Apply'. The discount will be reflected in your order total.",
        },
        {
          question: "Can I use multiple coupons on one order?",
          answer: "No, only one promo code can be applied per order. Choose the one that gives you the maximum discount.",
        },
        {
          question: "Why is my promo code not working?",
          answer: "Check if the code is valid, not expired, and meets minimum order requirements. Some codes are category-specific or for first-time users only.",
        },
        {
          question: "Do you have a loyalty program?",
          answer: "Yes! Earn points on every purchase and redeem them for discounts. Premium members get exclusive offers, free delivery, and early access to deals.",
        },
        {
          question: "How can I stay updated on offers?",
          answer: "Subscribe to our newsletter, enable push notifications, or follow us on social media. You can also check the 'Hot Deals' section on our website.",
        },
      ],
    },
  ];

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.faqs.length > 0);

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenFAQ(openFAQ === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-3 sm:p-4 bg-white/10 rounded-full mb-4 sm:mb-6">
              <HelpCircle className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-teal-50 mb-6 sm:mb-8">
              Find answers to common questions about our services
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 text-base sm:text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {searchQuery && filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try different keywords or browse categories below
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {(searchQuery ? filteredCategories : faqCategories).map(
                (category, categoryIndex) => (
                  <motion.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 sm:p-6 border-b border-teal-200">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <span className="text-2xl sm:text-3xl">{category.icon}</span>
                        <span className="break-words">{category.category}</span>
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {category.faqs.map((faq, faqIndex) => {
                        const isOpen = openFAQ === `${categoryIndex}-${faqIndex}`;
                        return (
                          <div key={faqIndex} className="p-4 sm:p-6">
                            <button
                              onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                              className="w-full text-left flex items-start justify-between gap-3 sm:gap-4 group"
                            >
                              <span className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-teal-600 transition-colors">
                                {faq.question}
                              </span>
                              {isOpen ? (
                                <ChevronDown className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-teal-600 flex-shrink-0 mt-0.5 transition-colors" />
                              )}
                            </button>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed"
                              >
                                {faq.answer}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-12 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl text-teal-50 mb-8">
              Our support team is ready to help you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
              >
                Call +91 98765 43210
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-teal-400 text-white font-semibold rounded-lg hover:bg-teal-300 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQsPage;
