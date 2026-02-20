import { motion } from "framer-motion";
import {
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Package,
  CheckCircle,
  Calendar,
  DollarSign,
} from "lucide-react";

const ShippingInfoPage = () => {
  const deliveryZones = [
    {
      zone: "Zone 1 - City Center",
      areas: "Downtown, Central Market, Old City",
      fee: "Free",
      time: "1-2 hours",
      headerClass: "bg-green-500",
    },
    {
      zone: "Zone 2 - Nearby Areas",
      areas: "Suburbs, Residential Areas",
      fee: "₹29",
      time: "2-4 hours",
      headerClass: "bg-blue-500",
    },
    {
      zone: "Zone 3 - Outskirts",
      areas: "Extended City Limits",
      fee: "₹49",
      time: "4-6 hours",
      headerClass: "bg-purple-500",
    },
  ];

  const deliverySlots = [
    { time: "6:00 AM - 9:00 AM", label: "Early Morning", icon: "🌅", popular: false },
    { time: "9:00 AM - 12:00 PM", label: "Morning", icon: "☀️", popular: true },
    { time: "12:00 PM - 3:00 PM", label: "Afternoon", icon: "🌤️", popular: false },
    { time: "3:00 PM - 6:00 PM", label: "Evening", icon: "🌆", popular: true },
    { time: "6:00 PM - 9:00 PM", label: "Night", icon: "🌙", popular: true },
  ];

  const freeDeliveryConditions = [
    { icon: <DollarSign className="h-5 w-5" />, text: "Orders above ₹499 in Zone 1" },
    { icon: <DollarSign className="h-5 w-5" />, text: "Orders above ₹699 in Zone 2" },
    { icon: <DollarSign className="h-5 w-5" />, text: "Orders above ₹999 in Zone 3" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "First-time customers (on first order)" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Premium members get free delivery on all orders" },
  ];

  const deliveryGuidelines = [
    {
      title: "Order Placement",
      description: "Place your order and select your preferred delivery slot and address.",
      icon: <Package />,
    },
    {
      title: "Order Confirmation",
      description: "You'll receive an order confirmation via SMS and email immediately.",
      icon: <CheckCircle />,
    },
    {
      title: "Preparation",
      description: "Our team carefully picks and packs your items ensuring quality.",
      icon: <Clock />,
    },
    {
      title: "On the Way",
      description: "Track your order in real-time as our delivery partner heads to you.",
      icon: <Truck />,
    },
    {
      title: "Delivery",
      description: "Receive your order at your doorstep. Inspect and enjoy fresh groceries!",
      icon: <MapPin />,
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
              Shipping & Delivery Information
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 px-4">
              Fast, reliable delivery to your doorstep. Fresh groceries delivered with care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Delivery Zones & Charges
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              We deliver across the city with different zones based on location
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {deliveryZones.map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className={`${zone.headerClass} p-4 text-white`}>
                  <h3 className="text-lg sm:text-xl font-bold">{zone.zone}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{zone.areas}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">Delivery Fee: <strong className="text-gray-900">{zone.fee}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">Delivery Time: <strong className="text-gray-900">{zone.time}</strong></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Free Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🎉 Free Delivery Available!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {freeDeliveryConditions.map((condition, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-600 flex-shrink-0 mt-0.5">
                    {condition.icon}
                  </span>
                  <span>{condition.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Delivery Slots */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Delivery Slot
            </h2>
            <p className="text-lg text-gray-600">
              Select a convenient time slot for delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {deliverySlots.map((slot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white border-2 rounded-xl p-6 text-center hover:shadow-lg transition-shadow ${
                  slot.popular ? "border-indigo-500" : "border-gray-200"
                }`}
              >
                {slot.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <div className="text-4xl mb-3">{slot.icon}</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {slot.label}
                </div>
                <div className="text-xs text-gray-600">{slot.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Delivery Works
            </h2>
            <p className="text-lg text-gray-600">
              From order to doorstep in simple steps
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-200 -z-10 hidden lg:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {deliveryGuidelines.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg text-center relative"
                >
                  <div className="inline-flex p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Same-Day Delivery
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Orders placed before 12:00 PM are eligible for same-day delivery.
                Orders placed after 12:00 PM will be delivered the next day.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Truck className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Order Tracking
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Track your order in real-time through our app or website. You'll
                receive updates at every stage of the delivery process.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Packaging
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We use eco-friendly packaging materials. Fresh produce is packed
                separately to maintain quality and freshness.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Quality Assurance
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Every order is carefully inspected before dispatch. We ensure that
                only the best quality products reach you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Questions About Delivery?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Our customer support team is ready to help you with any
              delivery-related queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Call +91 98765 43210
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition-colors"
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

export default ShippingInfoPage;
