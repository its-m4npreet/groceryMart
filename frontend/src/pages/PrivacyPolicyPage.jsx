import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Mail, UserCheck } from "lucide-react";
import { APP_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from "../config/constants";
import { maskPhone, maskEmail } from "../utils/masking";

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account or place an order, we collect your name, email address, phone number, delivery address, and payment information. This information is necessary to process and deliver your orders.",
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect information about how you interact with our platform, including your IP address, browser type, pages visited, and time spent on our site. This helps us improve our services.",
        },
        {
          subtitle: "Cookies and Tracking",
          text: "We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser.",
        },
      ],
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Order Processing",
          text: "Your personal information is used to process orders, arrange deliveries, process payments, and communicate order status updates to you.",
        },
        {
          subtitle: "Service Improvement",
          text: "We analyze usage data to understand customer preferences, improve our product offerings, enhance website functionality, and personalize your shopping experience.",
        },
        {
          subtitle: "Communication",
          text: "We may send you order confirmations, delivery updates, promotional offers, and newsletters. You can opt out of marketing communications at any time.",
        },
        {
          subtitle: "Legal Compliance",
          text: "We may use your information to comply with legal obligations, resolve disputes, enforce our agreements, and prevent fraud.",
        },
      ],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Protection and Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, alteration, or disclosure.",
        },
        {
          subtitle: "Payment Security",
          text: "All payment transactions are processed through secure payment gateways. We do not store your complete credit card information on our servers.",
        },
        {
          subtitle: "Data Retention",
          text: "We retain your personal information only as long as necessary to fulfill the purposes outlined in this privacy policy or as required by law.",
        },
      ],
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Third-Party Service Providers",
          text: "We may share your information with trusted third-party service providers who assist us in operating our platform, processing payments, and delivering orders. These providers are contractually bound to protect your data.",
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information when required by law, court order, or government request, or to protect our rights and safety.",
        },
        {
          subtitle: "We Do Not Sell Data",
          text: "We do not sell, trade, or rent your personal information to third parties for marketing purposes.",
        },
      ],
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Update",
          text: "You have the right to access, update, or correct your personal information at any time through your account settings.",
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your account and associated data by contacting our support team. Some information may be retained for legal or legitimate business purposes.",
        },
        {
          subtitle: "Marketing Preferences",
          text: "You can opt out of marketing communications by clicking the unsubscribe link in emails or updating your notification preferences in your account settings.",
        },
        {
          subtitle: "Cookie Management",
          text: "You can control or delete cookies through your browser settings. However, this may affect your ability to use certain features of our platform.",
        },
      ],
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Contact Us",
      content: [
        {
          subtitle: "Privacy Questions",
          text: `If you have any questions or concerns about our privacy practices, please contact us at ${maskEmail(SUPPORT_EMAIL)} or call us at ${maskPhone(SUPPORT_PHONE)}.`,
        },
        {
          subtitle: "Data Protection Officer",
          text: `For data protection inquiries, you can reach our Data Protection Officer at ${maskEmail(SUPPORT_EMAIL)}.`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-3 sm:p-4 bg-white/10 rounded-full mb-4 sm:mb-6">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Last Updated: January 2024
            </p>
            <p className="text-base sm:text-lg text-blue-100 mt-3 sm:mt-4">
              Your privacy is important to us. This policy explains how we collect,
              use, and protect your personal information.
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
              At {APP_NAME}, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy Policy
              explains how we collect, use, store, and protect your data when you use
              our website and services. By using our platform, you consent to the
              practices described in this policy.
            </p>
          </motion.div>

          {/* Policy Sections */}
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
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-lg">
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

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our services are not intended for children under the age of 18. We do
              not knowingly collect personal information from children. If you are a
              parent or guardian and believe your child has provided us with personal
              information, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes
              in our practices or legal requirements. We will notify you of any
              material changes by posting the updated policy on our website and
              updating the "Last Updated" date. Your continued use of our services
              after such changes constitutes your acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              International Users
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you are accessing our services from outside India, please note that
              your information may be transferred to, stored, and processed in India
              where our servers are located. By using our services, you consent to
              such transfer and processing.
            </p>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 mt-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Questions About Your Privacy?
            </h3>
            <p className="text-blue-100 mb-6">
              If you have any questions or concerns about our privacy practices,
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Privacy Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
