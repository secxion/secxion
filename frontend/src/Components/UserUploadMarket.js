import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const UserUploadMarket = ({
  onClose = () => {},
  fetchData = () => {},
  productDetails = {},
}) => {
  const [data, setData] = useState({
    Image: [],
    totalAmount: "",
    description: "",
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);

    setData((prev) => ({
      ...prev,
      Image: [...prev.Image, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteImage = (index) => {
    const newImages = [...data.Image];
    newImages.splice(index, 1);

    setData((prev) => ({
      ...prev,
      Image: newImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.userMarket.url, {
      method: SummaryApi.userMarket.method,
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
    } else if (responseData.error) {
      toast.error(responseData.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-gray-800 bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center pt-16'>
      <div className='bg-white p-6 rounded-xl w-full max-w-2xl overflow-y-auto shadow-lg' style={{ maxHeight: '90vh' }}>
        {/* Header Section */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='font-bold text-lg text-gray-700'>Upload Product</h2>
          <div
            className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer'
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        {/* Product Details Section */}
        {productDetails && (
          <div className='border rounded-lg p-4 bg-gray-100 mb-6'>
            <div className='flex items-center gap-4'>
              <img
                src={productDetails.productImage || ''}
                alt='Product'
                className='w-20 h-20 object-cover rounded-lg'
              />
              <div>
                <h3 className='font-bold text-gray-700 text-lg'>{productDetails.productName}</h3>
                <p className='text-gray-500'>Rate: {productDetails.rate}</p>
                <p className='text-gray-500'>Price: {productDetails.sellingPrice}</p>
              </div>
            </div>
            <p className='text-gray-600 mt-4'>{productDetails.description}</p>
          </div>
        )}

        {/* Upload Form Section */}
        <form
          className='grid gap-4'
          onSubmit={handleSubmit}
        >
          {/* Image Upload */}
          <div>
            <label htmlFor='Image' className='font-medium text-gray-700'>Images:</label>
            <label htmlFor='uploadImageInput'>
              <div className='p-4 border rounded-lg bg-gray-50 flex justify-center items-center cursor-pointer hover:bg-gray-100'>
                <div className='text-gray-500 flex flex-col items-center'>
                  <FaCloudUploadAlt className='text-3xl' />
                  <p className='text-sm'>Upload Product Image</p>
                </div>
              </div>
              <input
                type='file'
                id='uploadImageInput'
                className='hidden'
                onChange={handleUploadImage}
              />
            </label>
            <div className='flex gap-2 mt-4'>
              {data?.Image.length > 0 ? (
                data.Image.map((el, index) => (
                  <div className='relative group' key={index}>
                    <img
                      src={el}
                      alt={`product-${index}`}
                      className='w-20 h-20 object-cover rounded-lg border cursor-pointer'
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <div
                      className='absolute bottom-1 right-1 p-1 bg-red-600 text-white rounded-full hidden group-hover:block cursor-pointer'
                      onClick={() => handleDeleteImage(index)}
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-red-600 text-sm'>*Please upload at least one product image</p>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div>
            <label htmlFor='totalAmount' className='font-medium text-gray-700'>Total Amount:</label>
            <input
              type='number'
              id='totalAmount'
              name='totalAmount'
              value={data.totalAmount}
              onChange={handleOnChange}
              placeholder='Enter total amount'
              className='w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-yellow-300'
              required
            />
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor='description' className='font-medium text-gray-700'>Remarks:</label>
            <textarea
              id='description'
              name='description'
              value={data.description}
              onChange={handleOnChange}
              placeholder='Enter product description'
              rows={4}
              className='w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-yellow-300'
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700'
          >
            Upload Product
          </button>
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

export default UserUploadMarket;
