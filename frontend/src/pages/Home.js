import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaWallet, FaUser, FaCog, FaStore, 
  FaBell, FaClipboardList, FaComment, FaEnvelope, 
  FaComments, FaTelegramPlane, FaWhatsapp 
} from "react-icons/fa";

const menuItems = [
  { label: "Wallet", path: "/wallet", color: "bg-blue-600", icon: <FaWallet className="text-5xl md:text-6xl" /> },
  { label: "Profile", path: "/profile", color: "bg-green-600", icon: <FaUser className="text-5xl md:text-6xl" /> },
  { label: "Settings", path: "/settings", color: "bg-yellow-600", icon: <FaCog className="text-5xl md:text-6xl" /> },
  { label: "Market", path: "/section", color: "bg-red-600", icon: <FaStore className="text-5xl md:text-6xl" /> },
  { label: "Notifications", path: "/notifications", color: "bg-purple-600", icon: <FaBell className="text-5xl md:text-6xl" /> },
  { label: "Record", path: "/record", color: "bg-indigo-600", icon: <FaClipboardList className="text-5xl md:text-6xl" /> },
];

const contactOptions = [
  { label: " Email", icon: <FaEnvelope />, link: "mailto:support@secxion.com" },
  { label: " Live Chat", icon: <FaComments />, link: "/chat" },
  { label: " Telegram", icon: <FaTelegramPlane />, link: "https://t.me/secxion" },
  { label: " WhatsApp", icon: <FaWhatsapp />, link: "https://wa.me/1234567890" }
];

const Home = () => {
  const [showContactOptions, setShowContactOptions] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-start p-6 pt-20 md:pt-24">
      {/* Header */}
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Secxion
      </motion.h1>

      <p className="text-gray-700 dark:text-gray-300 text-center mt-4 text-lg md:text-xl max-w-2xl">
        Your trusted platform for secure transactions and seamless gift card trading.
      </p>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-full max-w-4xl">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            className={`p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow ${item.color} transform`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={item.path} className="flex flex-col items-center text-white" aria-label={item.label}>
              {item.icon}
              <span className="text-xl md:text-2xl font-semibold mt-3">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Contact Support Button */}
      <div 
        className="relative mt-12"
        onMouseEnter={() => setShowContactOptions(true)}
        onMouseLeave={() => setShowContactOptions(false)}
      >
        <button 
          className="flex items-center justify-center p-4 px-6 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 text-xl font-semibold"
          onClick={() => setShowContactOptions(!showContactOptions)}
        >
          <FaComment className="text-2xl mr-3" />
          Contact Support
        </button>

        {/* Contact Options Popup */}
        <AnimatePresence>
          {showContactOptions && (
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 mt-4 bg-white dark:bg-gray-800 shadow-xl rounded-lg w-56 py-2 z-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {contactOptions.map((option, index) => (
                <a 
                  key={index}
                  href={option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-900 dark:text-gray-200"
                >
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <span className="text-lg font-medium">{option.label}</span>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-16">
        <p>© 2025 Secxion. All rights reserved.</p>
        <div className="mt-2 flex gap-6 justify-center">
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/support" className="hover:underline">Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
