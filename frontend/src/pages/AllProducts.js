import React, { useEffect, useState } from "react";
import UploadProduct from "../Components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../Components/AdminProductCard";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    try {
      const response = await fetch(SummaryApi.allProduct.url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const dataResponse = await response.json();
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="bg-white py-2 px-4 flex justify-between items-center shadow-md rounded">
        <h2 className="font-bold text-lg">All Products</h2>
        <button
          className="border-2 border-purple-900 text-black hover:bg-purple-800 hover:text-white transition-all py-1 px-3 rounded"
          onClick={() => setOpenUploadProduct(true)}
          aria-label="Upload Product"
        >
          Upload Product
        </button>
      </header>

      <main className="flex items-center flex-wrap gap-3 py-8 h-[calc(100vh-190px)] overflow-y-auto">
        {allProduct.length > 0 ? (
          allProduct.map((product, index) => (
            <AdminProductCard data={product} key={index} fetchdata={fetchAllProduct} />
          ))
        ) : (
          <p className="text-center w-full">No products available.</p>
        )}
      </main>

      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default AllProducts;