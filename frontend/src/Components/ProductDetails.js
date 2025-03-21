import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserUploadMarket from "./UserUploadMarket";
import SummaryApi from "../common";
import currencyFullNames from "../helpers/currencyFullNames";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    pricing: [],
  });
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(null);
  const [selectedFaceValue, setSelectedFaceValue] = useState(null);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(SummaryApi.productDetails.url, {
          method: SummaryApi.productDetails.method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId: id }),
        });

        if (!response.ok) throw new Error("Failed to fetch product details");

        const dataResponse = await response.json();
        setData(dataResponse?.data);
        setActiveCurrency(dataResponse?.data?.pricing?.[0] || null);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleCurrencyChange = (currency) => {
    const selectedCurrency = data.pricing.find(item => item.currency === currency);
    setActiveCurrency(selectedCurrency);
    setSelectedFaceValue(null);
  };

  const handleSell = (faceValue) => {
    setSelectedFaceValue(faceValue);
    setShowUploadForm(true);
  };

  return (
    <>
      <div className="container mx-auto p-8 rounded-xl shadow-2xl bg-gradient-to-br from-blue-900 to-gray-800 text-white">
        <div className="flex flex-col lg:flex-row gap-8 overflow-hidden">
          <div className="flex-1">
            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <p className="bg-slate-200 h-6 rounded-full w-1/2"></p>
                <p className="bg-slate-200 h-6 rounded-full w-1/3"></p>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <p className="bg-emerald-400 text-black px-4 py-2 rounded-full w-fit">{data?.brandName}</p>
                <h2 className="text-3xl font-semibold">{data?.productName}</h2>
                <p className="text-lg text-gray-300">{data?.category}</p>

                <div className="mt-8">
                  <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                    {data?.pricing?.map((currency) => {
                      const fullCurrencyName = currencyFullNames[currency.currency] || currency.currency;
                      return (
                        <div
                          key={currency.currency}
                          className={`flex-shrink-0 p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${activeCurrency?.currency === currency.currency ? 'bg-emerald-500 text-white' : 'bg-white text-gray-800'}`}
                          onClick={() => handleCurrencyChange(currency.currency)}
                        >
                          <h3 className="text-lg font-semibold">{fullCurrencyName}</h3>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {activeCurrency && (
                  <div className="mt-6 max-h-[300px] overflow-y-auto">
                    <table className="min-w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden text-gray-800">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-3 px-6 text-left text-sm font-semibold">Face Value</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold">Rate</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeCurrency?.faceValues?.map((fv, index) => (
                          <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="py-3 px-6">{fv.faceValue}</td>
                            <td className="py-3 px-6 text-emerald-600">{fv.sellingPrice}</td>
                            <td className="py-3 px-6">
                              <button
                                className="px-6 py-2 rounded-full font-bold text-lg transition-all duration-300 bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:scale-105 active:scale-95"
                                onClick={() => handleSell(fv)}
                              >
                                🚀 Sell Now
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showUploadForm && selectedFaceValue && (
        <UserUploadMarket
          onClose={() => setShowUploadForm(false)}
          fetchData={() => setShowUploadForm(false)}
          productDetails={{
            productName: data.productName,
            productImage: data.productImage[0],
            currency: activeCurrency?.currency,
            rate: selectedFaceValue?.sellingPrice,
            faceValue: selectedFaceValue?.faceValue,
            description: data.description,
          }}
        />
      )}
    </>
  );
};

export default ProductDetails;