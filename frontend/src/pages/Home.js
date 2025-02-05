import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaWallet, FaUser, FaCog, FaStore, FaBell, FaClipboardList } from "react-icons/fa";

const menuItems = [
  { label: "Wallet", path: "/wallet", color: "bg-blue-600", icon: <FaWallet /> },
  { label: "Profile", path: "/profile", color: "bg-green-600", icon: <FaUser /> },
  { label: "Settings", path: "/settings", color: "bg-yellow-600", icon: <FaCog /> },
  { label: "Market", path: "/section", color: "bg-red-600", icon: <FaStore /> },
  { label: "Notifications", path: "/notifications", color: "bg-purple-600", icon: <FaBell /> },
  { label: "Record", path: "/record", color: "bg-indigo-600", icon: <FaClipboardList /> },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-cream-white flex flex-col items-center justify-start p-6 pt-20 md:pt-24">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-gray-900"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Secxion
      </motion.h1>

      <p className="text-gray-700 text-center mt-4 text-base md:text-lg">
        Trusted platform for gift card trading and secure transactions.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-full max-w-3xl">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            className={`p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow ${item.color}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={item.path} className="flex flex-col items-center text-white" aria-label={item.label}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <span className="text-lg font-semibold md:text-xl">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <footer className="text-gray-600 text-sm md:text-base mt-12">
        <p>© 2025 Secxion. All rights reserved.</p>
        <div className="mt-2 flex gap-4 justify-center">
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/support" className="hover:underline">Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;