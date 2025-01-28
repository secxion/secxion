import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import currencyData from "../helpers/currencyData"; // Ensure this file exists and is imported
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    _id: productData?._id || "", // Include _id in the state
    productName: productData?.productName || "",
    brandName: productData?.brandName || "",
    category: productData?.category || "",
    productImage: productData?.productImage || [],
    description: productData?.description || "",
    pricing: productData?.pricing || [{ currency: "", faceValues: [] }],
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: newProductImage }));
  };

  const handleAddCurrency = () => {
    setData((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { currency: "", faceValues: [] }],
    }));
  };

  const handleAddFaceValue = (index) => {
    const updatedPricing = [...data.pricing];
    updatedPricing[index].faceValues.push({ faceValue: "", sellingPrice: "" });
    setData((prev) => ({ ...prev, pricing: updatedPricing }));
  };

  const handleUpdatePricing = (currencyIndex, faceValueIndex, field, value) => {
    setData((prev) => {
      const updatedPricing = [...prev.pricing];
      if (faceValueIndex !== undefined) {
        updatedPricing[currencyIndex].faceValues[faceValueIndex][field] = value;
      } else {
        updatedPricing[currencyIndex].currency = value;
      }
      return { ...prev, pricing: updatedPricing };
    });
  };

  const handleDeleteFaceValue = (currencyIndex, faceValueIndex) => {
    setData((prev) => {
      const updatedPricing = [...prev.pricing];
      updatedPricing[currencyIndex].faceValues.splice(faceValueIndex, 1);
      return { ...prev, pricing: updatedPricing };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Data:", data); // Debugging line

    const transformedData = {
      ...data,
      pricing: data.pricing.map((currency) => ({
        ...currency,
        faceValues: currency.faceValues.map((fv) => ({
          ...fv,
          faceValue: parseFloat(fv.faceValue),
          sellingPrice: parseFloat(fv.sellingPrice),
        })),
      })),
    };

    if (!data._id) {
      toast.error("Product ID (_id) is required");
      return;
    }

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(transformedData),
    });

    const responseData = await response.json();
    console.log("Response:", responseData); // Debugging line

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchdata();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };
  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Edit Product</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form className="grid p-4 gap-2 overflow-y-scroll h-full pb-5" onSubmit={handleSubmit}>
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName">Brand Name:</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category">Category:</label>
          <select
            name="category"
            value={data.category}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          >
            <option value="">Select Category</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={index}>
                {el.label}
              </option>
            ))}
          </select>

          <label htmlFor="productImage">Product Image:</label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex flex-col items-center">
                <FaCloudUploadAlt className="text-4xl" />
                <p className="text-sm">Upload Product Image</p>
              </div>
            </div>
          </label>
          <input
            type="file"
            id="uploadImageInput"
            className="hidden"
            onChange={handleUploadProduct}
          />

          <div>
            {data.productImage.map((img, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={img}
                  alt={`product-${index}`}
                  className="w-20 h-20 bg-slate-100 border cursor-pointer"
                  onClick={() => {
                    setOpenFullScreenImage(true);
                    setFullScreenImage(img);
                  }}
                />
                <MdDelete
                  className="absolute top-0 right-0 text-red-600 cursor-pointer"
                  onClick={() => handleDeleteProductImage(index)}
                />
              </div>
            ))}
          </div>

          <label>Pricing:</label>
          {data.pricing.map((currency, currencyIndex) => (
            <div key={currencyIndex} className="border p-2 mb-2 rounded">
              <select
                value={currency.currency}
                onChange={(e) => handleUpdatePricing(currencyIndex, undefined, "currency", e.target.value)}
                className="p-2 bg-slate-100 border rounded"
              >
                <option value="">Select Currency</option>
                {currencyData.map((cur, index) => (
                  <option value={cur.value} key={index}>
                    {cur.label}
                  </option>
                ))}
              </select>

              {currency.faceValues.map((faceValue, faceValueIndex) => (
                <div key={faceValueIndex} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Face Value"
                    value={faceValue.faceValue}
                    onChange={(e) =>
                      handleUpdatePricing(currencyIndex, faceValueIndex, "faceValue", e.target.value)
                    }
                    className="p-2 bg-slate-100 border rounded flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Selling Price"
                    value={faceValue.sellingPrice}
                    onChange={(e) =>
                      handleUpdatePricing(currencyIndex, faceValueIndex, "sellingPrice", e.target.value)
                    }
                    className="p-2 bg-slate-100 border rounded flex-1"
                  />
                  <MdDelete
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDeleteFaceValue(currencyIndex, faceValueIndex)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddFaceValue(currencyIndex)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Face Value
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCurrency}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Currency
          </button>

          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleOnChange}
            rows="3"
            className="p-2 bg-slate-100 border rounded resize-none"
          />

          <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-4">
            Update Product
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}
    </div>
  );
};

export default AdminEditProduct;
