import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button, Input } from "../components/ui";
import {
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  BUSINESS_HOURS,
  BUSINESS_DAYS,
  BUSINESS_ADDRESS,
  WHATSAPP_NUMBER,
} from "../config/constants";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construct mailto link
      const subject = encodeURIComponent(`${formData.subject} - Contact Form`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}`
      );

      const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

      // Open mail client
      window.location.href = mailtoLink;

      setResult({
        type: "success",
        message: "Opening your email client... Please send the generated email to reach us.",
      });

      // Clear form after a delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setResult({
        type: "error",
        message: "Something went wrong. Please try again or email us directly.",
      });
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      value: SUPPORT_PHONE,
      href: `tel:${SUPPORT_PHONE}`,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: SUPPORT_EMAIL,
      href: `mailto:${SUPPORT_EMAIL}`,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      value: BUSINESS_ADDRESS,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        BUSINESS_ADDRESS
      )}`,
      color: "bg-red-100 text-red-600",
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      href: "#",
      color: "hover:bg-blue-600",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "#",
      color: "hover:bg-pink-600",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "#",
      color: "hover:bg-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-lg ${method.color} mb-4`}>
                {method.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-sm text-gray-600">{method.value}</p>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>

            {result && (
              <div
                className={`mb-6 p-4 rounded-lg ${result.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
                  }`}
              >
                {result.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us more about your query..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full md:w-auto"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{BUSINESS_DAYS}</p>
                <p>{BUSINESS_HOURS}</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-3 bg-gray-100 rounded-lg text-gray-600 ${social.color} hover:text-white transition-colors`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Our Location</h3>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-3">{BUSINESS_ADDRESS}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
