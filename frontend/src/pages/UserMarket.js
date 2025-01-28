import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import UserUploadMarket from "../Components/UserUploadMarket";
import HistoryCard from "../Components/HistoryCard";

const UserMarket = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.myMarket.url);
    const dataResponse = await response.json();

    console.log("product data", dataResponse)

    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);
  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">Record</h2>
        <button
          className="border-2 border-purple-900 text-black hover:bg-purple-800 hover:text-white transition-all py-1 px-3 "
          onClick={() => setOpenUploadProduct(true)}
        >
          Sell Gift Card
        </button>
      </div>

      {/**all product */}
      <div className="flex items-center flex-wrap gap-3 py-8 p-4 h-[calc(100vh-190px)] overflow-y-scroll">

        {allProduct.map((product, index) => {
          return (
            <HistoryCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>
           
          );
        })}
      </div>

      {/**upload prouct component */}
      {openUploadProduct && (
        <UserUploadMarket onClose={() => setOpenUploadProduct(false)}fetchData={fetchAllProduct}/>
      )}
    </div>
  );
};

export default UserMarket;
