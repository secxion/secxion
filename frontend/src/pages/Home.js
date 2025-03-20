import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaWallet, FaUser, FaCog, FaStore, FaBell, FaClipboardList, FaComment, FaEnvelope, FaComments, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const menuItems = [
  { label: "Wallet", path: "/wallet", color: "bg-blue-600", icon: <FaWallet className="text-4xl md:text-5xl" /> },
  { label: "Profile", path: "/profile", color: "bg-green-600", icon: <FaUser className="text-4xl md:text-5xl" /> },
  { label: "Settings", path: "/settings", color: "bg-yellow-600", icon: <FaCog className="text-4xl md:text-5xl" /> },
  { label: "Market", path: "/section", color: "bg-red-600", icon: <FaStore className="text-4xl md:text-5xl" /> },
  { label: "Notifications", path: "/notifications", color: "bg-purple-600", icon: <FaBell className="text-4xl md:text-5xl" /> },
  { label: "Record", path: "/record", color: "bg-indigo-600", icon: <FaClipboardList className="text-4xl md:text-5xl" /> },
];

const contactOptions = [
  { label: "Email", icon: <FaEnvelope />, link: "mailto:support@secxion.com" },
  { label: "Live Chat", icon: <FaComments />, link: "/chat" },
  { label: "Telegram", icon: <FaTelegramPlane />, link: "https://t.me/secxion" },
  { label: "WhatsApp", icon: <FaWhatsapp />, link: "https://wa.me/1234567890" }
];

const Home = () => {
  const [showContactOptions, setShowContactOptions] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-start p-6 pt-20 md:pt-24 w-full">
      {/* Header */}
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Secxion
      </motion.h1>

      <p className="text-gray-700 dark:text-gray-300 text-center mt-4 text-lg md:text-xl max-w-2xl">
        Secure transactions and seamless gift card trading.
      </p>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-full max-w-6xl">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-xl shadow-lg transition-shadow ${item.color} transform w-full`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={item.path} className="flex flex-col items-center text-white w-full" aria-label={item.label}>
              {item.icon}
              <span className="text-lg md:text-xl font-semibold mt-2">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Contact Support Button */}
      <div className="relative mt-12">
        <button
          className="flex items-center justify-center p-3 px-5 bg-green-600 text-white rounded-full shadow-md text-lg font-semibold"
          onClick={() => setShowContactOptions(!showContactOptions)}
        >
          <FaComment className="text-xl mr-2" /> Contact Support
        </button>

        {/* Contact Options Popup */}
        <AnimatePresence>
          {showContactOptions && (
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg w-56 py-2 z-50"
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
                  className="flex items-center px-4 py-3 text-gray-900 dark:text-gray-200"
                >
                  <span className="text-xl mr-3">{option.icon}</span>
                  <span className="text-md font-medium">{option.label}</span>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>    
    </div>
  );
};

export default Home;