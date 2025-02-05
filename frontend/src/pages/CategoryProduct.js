import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import { motion } from "framer-motion";
import { FaCreditCard, FaGift, FaPaypal } from "react-icons/fa";
import VerticalCard from "../Components/VerticalCard";

const CategoryProduct = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [sortBy, setSortBy] = useState(""); 
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters for categories
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ category: filterCategoryList }),
      });

      const dataResponse = await response.json();
      setData(dataResponse?.data || []); // Fallback to an empty array
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update selected categories
  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  // Fetch data when filterCategoryList changes
  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  // Update category filters and URL when selection changes
  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).filter(
      (key) => selectCategory[key]
    );
    setFilterCategoryList(arrayOfCategory);

    const queryParams = arrayOfCategory.map((cat) => `category=${cat}`).join("&");
    navigate(`/product-category?${queryParams}`);
  }, [selectCategory]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-[300px,1fr] gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6 rounded-lg shadow-lg sticky top-6 z-20 overflow-y-auto max-h-[calc(100vh-120px)]"
        >
          <h3 className="text-lg font-bold text-blue-800 mb-4"> <br/> </h3>
          <h3 className="text-lg font-bold text-blue-800 mb-4">Market Categories</h3>
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-2">Sort by</h4>
            
          </div>
          <form className="space-y-4">
            {productCategory.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded-lg cursor-pointer transition"
              >
                {category.value === "gift cards" && (
                  <FaGift className="text-blue-600 w-5 h-5" />
                )}
                {category.value === "visa / creditcards" && (
                  <FaCreditCard className="text-blue-600 w-5 h-5" />
                )}
                {category.value === "Online Payments" && (
                  <FaPaypal className="text-blue-600 w-5 h-5" />
                )}
                <input
                  type="checkbox"
                  name="category"
                  checked={selectCategory[category.value]}
                  value={category.value}
                  onChange={handleSelectCategory}
                  className="accent-blue-600"
                />
                <span className="text-slate-700">{category.label}</span>
              </label>
            ))}
          </form>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto"
        >
          <p className="text-lg font-medium mb-4">
            Search Results: {data.length}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <VerticalCard data={data} loading={loading} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryProduct;
