import React, { useState, useEffect } from "react";
import SummaryApi from "../common";
import UserUploadMarket from "../Components/UserUploadMarket";
import HistoryCard from "../Components/HistoryCard";

const UserMarket = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.myMarket.url);
    const dataResponse = await response.json();
    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">Record</h2>
        
      </div>

      <div className="flex items-center flex-wrap gap-3 py-8 p-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allProduct.map((product) => (
          <HistoryCard key={product._id} data={product} fetchData={fetchAllProduct} />
        ))}
      </div>

      {openUploadProduct && (
        <UserUploadMarket onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default UserMarket;
