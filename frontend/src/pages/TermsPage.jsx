import { motion } from "framer-motion";
import {
  FileText,
  ShoppingCart,
  CreditCard,
  Package,
  UserCheck,
  AlertCircle,
  Scale,
  Shield,
} from "lucide-react";
import { APP_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from "../config/constants";
import { maskPhone, maskEmail } from "../utils/masking";

const TermsPage = () => {
  const sections = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: `By accessing and using ${APP_NAME}'s website and services, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.`,
        },
        {
          subtitle: "Modification of Terms",
          text: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of our services after changes are posted constitutes your acceptance of the modified terms.",
        },
      ],
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "User Accounts",
      content: [
        {
          subtitle: "Account Registration",
          text: "To place orders, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        },
        {
          subtitle: "Account Eligibility",
          text: "You must be at least 18 years old to create an account and place orders. By creating an account, you represent that you meet this age requirement.",
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate your account at any time for violations of these terms, fraudulent activity, or any other reason we deem necessary.",
        },
      ],
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Orders and Purchases",
      content: [
        {
          subtitle: "Order Acceptance",
          text: "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including product unavailability, pricing errors, or suspected fraudulent transactions.",
        },
        {
          subtitle: "Product Information",
          text: "We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is error-free. If a product is not as described, your sole remedy is to return it according to our Return Policy.",
        },
        {
          subtitle: "Pricing",
          text: "All prices are listed in Indian Rupees (INR) and are subject to change without notice. We make every effort to ensure pricing accuracy, but errors may occur. If a pricing error is discovered, we will notify you and give you the option to continue with the order at the correct price or cancel it.",
        },
        {
          subtitle: "Order Cancellation",
          text: "You may cancel your order before it is dispatched. Once dispatched, cancellation is subject to our Cancellation Policy. We reserve the right to cancel orders that cannot be fulfilled.",
        },
      ],
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment Terms",
      content: [
        {
          subtitle: "Payment Methods",
          text: "We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery (where available). All payments are processed through secure payment gateways.",
        },
        {
          subtitle: "Payment Authorization",
          text: "By providing payment information, you authorize us to charge the total amount of your order, including product costs, taxes, and delivery fees.",
        },
        {
          subtitle: "Failed Payments",
          text: "If payment fails or is declined, your order will not be processed. We are not responsible for delays or failures caused by payment gateway issues.",
        },
      ],
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Delivery and Shipping",
      content: [
        {
          subtitle: "Delivery Areas",
          text: "We deliver to specific areas as indicated during checkout. Delivery times are estimates and not guaranteed. We are not liable for delays caused by weather, traffic, or other unforeseen circumstances.",
        },
        {
          subtitle: "Delivery Charges",
          text: "Delivery charges vary based on order value, location, and delivery time slot. These charges will be clearly displayed before you confirm your order.",
        },
        {
          subtitle: "Failed Deliveries",
          text: "If delivery fails due to incorrect address, unavailability, or refusal to accept the order, you may be charged for redelivery or the order may be cancelled with applicable charges.",
        },
      ],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Product Quality and Returns",
      content: [
        {
          subtitle: "Quality Assurance",
          text: "We ensure all products meet quality standards before delivery. Perishable items should be inspected upon delivery and any issues should be reported immediately.",
        },
        {
          subtitle: "Returns and Refunds",
          text: "Returns are accepted for damaged, defective, or incorrect products as per our Return Policy. Perishable items have specific return conditions. Refunds are processed according to our Refund Policy.",
        },
      ],
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "User Conduct",
          text: "You agree not to: (1) Use the site for any illegal purpose, (2) Attempt to gain unauthorized access to our systems, (3) Interfere with the proper functioning of the site, (4) Engage in fraudulent activities, (5) Impersonate any person or entity, (6) Violate any applicable laws or regulations.",
        },
        {
          subtitle: "Consequences",
          text: "Violation of these terms may result in immediate account termination, legal action, and reporting to appropriate authorities.",
        },
      ],
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Limitation of Liability",
      content: [
        {
          subtitle: "Service Availability",
          text: "We strive to maintain uninterrupted service but do not guarantee that the site will be available at all times. We are not liable for any loss or damage arising from service interruptions.",
        },
        {
          subtitle: "Product Liability",
          text: "Our liability for any claim related to products or services is limited to the purchase price of the product. We are not liable for indirect, incidental, or consequential damages.",
        },
        {
          subtitle: "Third-Party Links",
          text: "Our site may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of these external sites.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-3 sm:p-4 bg-white/10 rounded-full mb-4 sm:mb-6">
              <Scale className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg sm:text-xl text-purple-100">
              Last Updated: March 2026
            </p>
            <p className="text-base sm:text-lg text-purple-100 mt-3 sm:mt-4">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <p className="text-gray-600 leading-relaxed">
              Welcome to {APP_NAME}. These Terms and Conditions govern your use
              of our website and services. By using our platform, you enter into a
              legally binding agreement with {APP_NAME}. Please read these terms
              carefully. If you do not agree with any part of these terms, please do
              not use our services.
            </p>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-lg">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All content on this website, including text, images, logos, graphics,
              and software, is the property of {APP_NAME} and is protected by
              Indian and international copyright and trademark laws. You may not
              reproduce, distribute, or use any content without our written permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms and Conditions are governed by and construed in accordance
              with the laws of India. Any disputes arising from these terms or your use
              of our services shall be subject to the exclusive jurisdiction of the
              courts in [Your City], India.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Severability
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If any provision of these terms is found to be invalid or unenforceable,
              the remaining provisions shall continue in full force and effect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at
              {maskEmail(SUPPORT_EMAIL)} or call {maskPhone(SUPPORT_PHONE)}.
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 rounded-lg p-6 mt-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Important Notice
                </h3>
                <p className="text-amber-800">
                  By using {APP_NAME}'s services, you acknowledge that you have
                  read, understood, and agree to be bound by these Terms and
                  Conditions. If you have any questions or concerns, please contact us
                  before using our services.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
