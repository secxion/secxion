import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import { FaCreditCard, FaGift, FaMoneyBillWave, FaBars } from "react-icons/fa";
import VerticalCard from "../Components/VerticalCard";
import debounce from "lodash.debounce";
import ClipLoader from "react-spinners/ClipLoader";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const urlCategoryListObject = urlCategoryListinArray.reduce((acc, el) => ({ ...acc, [el]: true }), {});

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState(Object.keys(urlCategoryListObject));

  useEffect(() => {
    const selectedCategories = Object.keys(selectCategory).filter((key) => selectCategory[key]);
    setFilterCategoryList(selectedCategories);
  }, [selectCategory]);

  useEffect(() => {
    navigate(`/product-category?${filterCategoryList.map((cat) => `category=${cat}`).join("&")}`);

    const fetchData = debounce(async (categories) => {
      if (categories.length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${SummaryApi.filterProduct.url}`, {
          method: SummaryApi.filterProduct.method,
          headers: { "Content-Type": "application/json" },
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
    }, 500);

    fetchData(filterCategoryList);
  }, [filterCategoryList, navigate]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({ ...prev, [value]: checked }));
  };

  return (
    <div className="fixed top-[80px] left-0 right-0 bottom-0 flex flex-col md:flex-row">
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex justify-between items-center bg-blue-200 p-3">
        <h3 className="text-lg font-bold text-blue-800">Market Categories</h3>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-blue-700">
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar for Category Selection */}
      <div className={`md:w-[300px] bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6 shadow-lg overflow-y-auto transition-all ${
        mobileMenuOpen ? "block" : "hidden md:block"
      }`}>
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
              />
              <span className="text-slate-700">{category.label}</span>
            </label>
          ))}
        </form>
      </div>

      {/* Product Display Section */}
      <div className="flex-1 bg-white shadow-lg p-4 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader loading={loading} size={50} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center">Select a category.</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-4">Search Results: {data.length}</p>
            <div className="h-[calc(100vh-140px)] overflow-y-auto">
              <VerticalCard data={data} loading={loading} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProduct;
