import React from "react";
import { Link } from "react-router-dom";
import scrollTop from "../helpers/scrollTop";
import { motion } from "framer-motion";
import "./VerticalCard.css";

const VerticalCard = React.memo(({ loading, data = [] }) => {
  const loadingList = new Array(8).fill(null);

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-500 text-center">No products available.</p>;
  }

  return (
    <>
      {loading
        ? loadingList.map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow animate-pulse border border-gray-300"
            >
              <div className="h-32 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md"></div>
            </div>
          ))
        : data.map((product) => (
            <motion.div
              key={product._id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }} 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }} 
              className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-blue-500 border border-gray-300"
            >
              <Link to={`/product/${product._id}`} onClick={scrollTop} className="block">
                <div className="h-32 overflow-hidden rounded-lg mb-4 bg-gray-100 flex items-center justify-center border-b border-gray-300 shadow-sm">
                  <img
                    src={product.productImage?.[0] || "placeholder.jpg"}
                    alt={product.productName}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 ease-in-out transform hover:scale-110"
                  />
                </div>
                <div className="pt-4">
                  <h3 className="font-medium text-sm md:text-base text-black line-clamp-2 hover:text-blue-500 transition-colors duration-300">
                    {product.productName}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
    </>
  );
});

export default VerticalCard;