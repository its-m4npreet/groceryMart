import { motion } from "framer-motion";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import {
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_CHARGE,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
} from "../config/constants";

const ShippingInfoPage = () => {
  const deliveryGuidelines = [
    {
      title: "Order Placement",
      description: "Browse our fresh collection and place your order using our secure checkout.",
      icon: <Package className="h-6 w-6" />,
    },
    {
      title: "Quality Check",
      description: "Our experts hand-pick the freshest products and perform strict quality checks.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      title: "Hygienic Packing",
      description: "Products are packed in eco-friendly, sanitized packaging to maintain freshness.",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      title: "Fast Delivery",
      description: "Our delivery partners ensure your groceries reach you in the selected time slot.",
      icon: <Truck className="h-6 w-6" />,
    },
  ];

  const informationCards = [
    {
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      title: "Delivery Schedule",
      content: `We deliver 7 days a week. Orders placed before 12:00 PM are eligible for same-day delivery. Choose from multiple convenient slots throughout the day.`,
    },
    {
      icon: <Truck className="h-8 w-8 text-indigo-600" />,
      title: "Delivery Charges",
      content: `Standard delivery charge of ₹${DELIVERY_CHARGE} applies to all orders. Enjoy FREE delivery on all orders above ₹${FREE_DELIVERY_THRESHOLD}!`,
    },
    {
      icon: <MapPin className="h-8 w-8 text-indigo-600" />,
      title: "Service Areas",
      content: "We currently serve major residential and commercial areas across the city. Enter your location at checkout to see specific availability for your address.",
    },
    {
      icon: <Headphones className="h-8 w-8 text-indigo-600" />,
      title: "Dedicated Support",
      content: `Have questions about your delivery? Our support team is here to help you every step of the way via phone or email.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-3 sm:p-4 bg-white/10 rounded-full mb-4 sm:mb-6">
              <Truck className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Shipping & Delivery
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 px-4">
              Freshness delivered to your doorstep with speed and care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Delivery Promise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We follow a structured process to ensure that every item you receive is of the highest quality and delivered on time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {deliveryGuidelines.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center"
              >
                <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {informationCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 p-8 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div className="flex-shrink-0">{card.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Large Alert - Free Delivery */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-indigo-600 rounded-3xl p-10 text-center text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Truck className="h-32 w-32 rotate-12" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Free Shipping!</h2>
            <p className="text-xl text-indigo-100 mb-0">
              Order over <span className="text-white font-bold">₹{FREE_DELIVERY_THRESHOLD}</span> and we'll deliver it to you for absolutely <span className="text-white font-bold underline">FREE</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help with Your Order?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Our customer support team is available from 8:00 AM to 10:00 PM to assist you with any questions.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="inline-flex items-center justify-center px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
            >
              Call {SUPPORT_PHONE}
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingInfoPage;
