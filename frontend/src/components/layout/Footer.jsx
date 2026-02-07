import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping Info', href: '/shipping' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Return Policy', href: '/returns' },
      { name: 'Cancellation', href: '/cancellation' },
    ],
    categories: [
      { name: 'Fresh Fruits', href: '/products?category=fruits' },
      { name: 'Vegetables', href: '/products?category=vegetables' },
      { name: 'Grocery Items', href: '/products?category=grocery' },
      { name: 'All Products', href: '/products' },
    ],
  };

  const features = [
    { icon: <Truck className="h-6 w-6" />, title: 'Free Delivery', desc: 'On orders above ₹500' },
    { icon: <CreditCard className="h-6 w-6" />, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Quality Assured', desc: 'Fresh products daily' },
    { icon: <Headphones className="h-6 w-6" />, title: '24/7 Support', desc: 'Dedicated support team' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="p-3 bg-primary-600/20 text-primary-400 rounded-xl">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🥬</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Fresh<span className="text-primary-400">Mart</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your one-stop destination for fresh fruits, vegetables, and grocery items. 
              We deliver quality products right to your doorstep.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="tel:1800-123-4567" 
                className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Phone className="h-5 w-5" />
                1800-123-4567
              </a>
              <a 
                href="mailto:support@freshmart.com"
                className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
                support@freshmart.com
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>123 Green Street, Fresh City, India - 400001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a 
                href="#" 
                className="p-2.5 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-primary-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2.5 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-primary-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2.5 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-primary-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2.5 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-primary-600 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} FreshMart. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
