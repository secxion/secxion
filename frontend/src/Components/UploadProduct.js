import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import currencyData from "../helpers/currencyData";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    pricing: [],
  });
  const [newCurrency, setNewCurrency] = useState("");
  const [newFaceValue, setNewFaceValue] = useState("");
  const [newSellingPrice, setNewSellingPrice] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPricing = () => {
    if (!newCurrency || !newFaceValue || !newSellingPrice) {
      toast.error("Please fill in all pricing fields.");
      return;
    }

    const currencyIndex = data.pricing.findIndex((p) => p.currency === newCurrency);
    if (currencyIndex !== -1) {
      // If currency exists, add face value under it
      const updatedPricing = [...data.pricing];
      updatedPricing[currencyIndex].faceValues.push({
        faceValue: newFaceValue,
        sellingPrice: parseFloat(newSellingPrice),
      });
      setData((prev) => ({ ...prev, pricing: updatedPricing }));
    } else {
      // If currency doesn't exist, create new currency entry
      setData((prev) => ({
        ...prev,
        pricing: [
          ...prev.pricing,
          {
            currency: newCurrency,
            faceValues: [
              {
                faceValue: newFaceValue,
                sellingPrice: parseFloat(newSellingPrice),
              },
            ],
          },
        ],
      }));
    }

    // Clear input fields
    setNewCurrency("");
    setNewFaceValue("");
    setNewSellingPrice("");
  };

  const handleDeleteCurrency = (currencyIndex) => {
    const updatedPricing = [...data.pricing];
    updatedPricing.splice(currencyIndex, 1);
    setData((prev) => ({ ...prev, pricing: updatedPricing }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const uploadImageCloudinary = await uploadImage(file);

    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteProductImage = (index) => {
    const updatedImages = [...data.productImage];
    updatedImages.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: updatedImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.productImage.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Upload Product</h2>
          <div className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer" onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className="grid p-4 gap-2 overflow-y-scroll h-full pb-5" onSubmit={handleSubmit}>
          <label htmlFor="productName">Product Name :</label>
          <input
            type="text"
            id="productName"
            placeholder="Enter product name"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName" className="mt-3">
            Brand Name :
          </label>
          <input
            type="text"
            id="brandName"
            placeholder="Enter brand name"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category" className="mt-3">
            Category :
          </label>
          <select
            required
            value={data.category}
            name="category"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value={""}>Select Category</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={el.value + index}>
                {el.label}
              </option>
            ))}
          </select>

          <label htmlFor="productImage" className="mt-3">
            Product Image:
          </label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Upload Product Image</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>
          <div>
            {data?.productImage[0] ? (
              <div className="flex items-center gap-2">
                {data.productImage.map((el, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={el}
                      alt={`Uploaded-${index}`}
                      width={80}
                      height={80}
                      className="bg-slate-100 border cursor-pointer"
                    />
                    <div
                      className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                      onClick={() => handleDeleteProductImage(index)}
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-600 text-xs">*Please upload a product image</p>
            )}
          </div>

          <label htmlFor="currency" className="mt-3">
            Currency :
          </label>
          <select
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value)}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value="">Select Currency</option>
            {currencyData.map((cur) => (
              <option value={cur.value} key={cur.value}>
                {cur.label}
              </option>
            ))}
          </select>

          <label htmlFor="faceValue" className="mt-3">
            Face Value :
          </label>
          <input
            type="text"
            placeholder="Enter face value"
            value={newFaceValue}
            onChange={(e) => setNewFaceValue(e.target.value)}
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="sellingPrice" className="mt-3">
            Selling Price :
          </label>
          <input
            type="number"
            placeholder="Enter selling price"
            value={newSellingPrice}
            onChange={(e) => setNewSellingPrice(e.target.value)}
            className="p-2 bg-slate-100 border rounded"
          />

          <button type="button" onClick={handleAddPricing} className="px-3 py-2 bg-green-600 text-white mt-3">
            Add Pricing
          </button>

          {/* Display Pricing */}
          <div className="mt-5">
            {data.pricing.map((pricing, currencyIndex) => (
              <div key={currencyIndex} className="mb-4 border rounded p-3">
                <h4 className="font-bold">{pricing.currency}</h4>
                <ul className="list-disc pl-4">
                  {pricing.faceValues.map((fv, index) => (
                    <li key={index}>
                      {fv.faceValue} - ${fv.sellingPrice}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handleDeleteCurrency(currencyIndex)}
                  className="text-red-500 text-sm"
                >
                  Delete Currency
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700">
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
