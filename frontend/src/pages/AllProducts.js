import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UploadProduct from "../Components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../Components/AdminProductCard";

const fetchAllProducts = async () => {
  try {
    const response = await fetch(SummaryApi.allProduct.url, {
      method: "GET",
      credentials: "include", 
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    const dataResponse = await response.json();
    return dataResponse?.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; 
  }
};

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);

  const { data: allProduct = [], isLoading, error, refetch } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry 2 times if the request fails
  });

  return (
    <div className="container mx-auto p-4">
      <header className="bg-white py-2 px-4 flex justify-between items-center shadow-md rounded">
        <h2 className="font-bold text-lg">Products</h2>
        <button
          className="border-2 border-purple-900 text-black hover:bg-purple-800 hover:text-white transition-all py-1 px-3 rounded"
          onClick={() => setOpenUploadProduct(true)}
          aria-label="Upload Product"
        >
          Upload Product
        </button>
      </header>

      {/* Products Grid */}
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8 h-[calc(100vh-190px)] overflow-y-auto">
        {isLoading ? (
          <p className="text-center w-full animate-pulse">Loading products...</p>
        ) : error ? (
          <p className="text-center w-full text-red-500">Error fetching products.</p>
        ) : allProduct.length > 0 ? (
          allProduct.map((product, index) => (
            <AdminProductCard data={product} key={index} fetchData={refetch} />
          ))
        ) : (
          <p className="text-center w-full">No Market.</p>
        )}
      </main>

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={refetch} />
      )}
    </div>
  );
};

export default AllProducts;
