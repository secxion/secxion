import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import { motion } from "framer-motion";
import { FaCreditCard, FaGift, FaMoneyBillWave } from "react-icons/fa";
import VerticalCard from "../Components/VerticalCard";
import "./CategoryProduct.css";
import debounce from "lodash.debounce";
import ClipLoader from "react-spinners/ClipLoader";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const urlCategoryListObject = urlCategoryListinArray.reduce((acc, el) => ({ ...acc, [el]: true }), {});

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState(Object.keys(urlCategoryListObject));

  const fetchData = useCallback(
    debounce(async (categories) => {
      if (categories.length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${SummaryApi.filterProduct.url}`, {
          method: SummaryApi.filterProduct.method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ category: categories }),
        });
        if (!response.ok) throw new Error("Failed to fetch data. Please try again later.");
        const dataResponse = await response.json();
        setData(dataResponse?.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const selectedCategories = Object.keys(selectCategory).filter((key) => selectCategory[key]);
    setFilterCategoryList(selectedCategories);
  }, [selectCategory]);

  useEffect(() => {
    navigate(`/product-category?${filterCategoryList.map((cat) => `category=${cat}`).join("&")}`);
    fetchData(filterCategoryList);
  }, [filterCategoryList, navigate, fetchData]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({ ...prev, [value]: checked }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-[300px,1fr] gap-8">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6 rounded-lg shadow-lg sticky top-6 z-20 overflow-y-auto max-h-[calc(100vh-120px)]">
          <h3 className="text-lg font-bold text-blue-800 mb-4">Market Categories</h3>
          <form className="space-y-4">
            {productCategory.map((category) => (
              <label key={category.id} className="flex items-center gap-3 p-2 hover:bg-blue-200 rounded-lg cursor-pointer transition">
                {category.value === "gift cards" && <FaGift className="text-blue-600 w-5 h-5" />}
                {category.value === "visa / creditcards" && <FaCreditCard className="text-blue-600 w-5 h-5" />}
                {category.value === "Online Payments" && <FaMoneyBillWave className="text-blue-600 w-5 h-5" />}
                <input 
                  type="checkbox" 
                  name="category" 
                  checked={!!selectCategory[category.value]} 
                  value={category.value} 
                  onChange={handleSelectCategory} 
                  className="accent-blue-600" 
                  aria-label={`Select ${category.label}`} 
                />
                <span className="text-slate-700">{category.label}</span>
              </label>
            ))}
          </form>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center" aria-live="polite">
              <ClipLoader loading={loading} size={50} />
            </div>
          ) : error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500 text-center">Select a category.</p>
          ) : (
            <>
              <p className="text-lg font-medium mb-4">Search Results: {data.length}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <VerticalCard data={data} loading={loading} />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryProduct;
