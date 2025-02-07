import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import DisplayImage from './DisplayImage';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const HistoryDetailView = ({
  onClose = () => {},
  fetchData = () => {},
  productDetails = {},
}) => {
  const [data] = useState({
    _id: productDetails?._id || "",
    Image: productDetails?.Image || [],
    totalAmount: productDetails?.totalAmount || "",
    userRemark: productDetails?.userRemark || "",
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(SummaryApi.marketRecord.url, {
        method: SummaryApi.marketRecord.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData.message);
        onClose();
        fetchData();
      } else {
        toast.error(responseData.message || "An error occurred.");
      }
    } catch (error) {
      toast.error("Failed to update record.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg transition-transform transform scale-95 hover:scale-100 duration-300"
           style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-extrabold text-2xl text-gray-800">Record Details</h2>
          <button className="text-2xl text-gray-500 hover:text-red-600 cursor-pointer" onClick={onClose}>
            <CgClose />
          </button>
        </div>

        {productDetails && (
          <div className="border rounded-lg p-4 bg-gray-50 shadow-inner mb-6">
            <div className="flex items-center gap-4">
              {productDetails?.productImage?.[0] && (
                <img
                  src={productDetails.productImage[0]}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              )}
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{productDetails.productName}</h3>
                <p className="text-gray-600">Currency: {productDetails.pricing?.[0]?.currency || 'N/A'}</p>
                <p className="text-gray-600">Face Value: {productDetails.pricing?.[0]?.faceValues?.[0]?.faceValue || 'N/A'}</p>
                <p className="text-gray-600">Rate: {productDetails.pricing?.[0]?.faceValues?.[0]?.sellingPrice || 'N/A'}</p>
              </div>
            </div>
            {productDetails.description && (
              <p className="text-gray-600 mt-4">{productDetails.description}</p>
            )}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Images:</label>           
            <div className="flex gap-2 mt-4 flex-wrap">
              {data?.Image.length > 0 ? (
                data.Image.map((el, index) => (
                  <div className="relative group" key={index}>
                    <img
                      src={el}
                      alt={`product-${index}`}
                      className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-red-600 text-sm">*No image uploaded</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="totalAmount" className="block font-medium text-gray-700 mb-2">Total Amount:</label>
            <div>{productDetails.totalAmount}</div>
          </div>

          {/* Remarks Field */}
          <div>
            <label htmlFor="userRemark" className="block font-medium text-gray-700 mb-2">Remarks:</label>
            <div>{productDetails.userRemark}</div>
          </div>

         
        </form>
      </div>

      {/* Fullscreen Image Display */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default HistoryDetailView;
