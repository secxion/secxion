import React, {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { PiDotsNine } from "react-icons/pi";

import displayUSDCurrency from "../helpers/displayCurrency";
import UserUploadMarket from "./UserUploadMarket";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    facevalue: "",
    sellingPrice: "",
  });

  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);


  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    setLoading(false);
    const dataResponse = await response.json();

    setData(dataResponse?.data);
    setActiveImage(dataResponse?.data.productImage[0]);
  };

  console.log("data", data);

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleSell = () => {
    setShowUploadForm(true);
  };

  return (
    <>
      <div>ProductDetails.js</div>

      <div className="container mx-auto p-4">
        <div className="min-h-[200px] flex flex-col lg:flex-row gap-4">
          {/**product Image */}
          <div className="h-96 flex flex-col lg:flex-row-reverse gap-4">
            <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200">
              <img
                src={activeImage}
                alt=""
                className="h-full w-full object-scale-down mix-blend-multiply"
              />
            </div>
            <div className="h-full">
              {loading ? (
                <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full ">
                  {productImageListLoading.map((el, index) => {
                    return (
                      <div
                        className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                        key={"loadingImage" + index}
                      ></div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full ">
                  {data.productImage?.map((imgURL, index) => {
                    return (
                      <div
                        className="h-20 w-20 bg-slate-200 rounded p-1"
                        key={imgURL}
                      >
                        <img
                          src={imgURL}
                          alt=""
                          className="w-full h-full object-scale-down mix-blend-multiply"
                          onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div></div>
          </div>

          {/**product details */}
          {loading ? (
            <div className="grid gap-1 w-full">
              <p className="bg-slate-200 animate-pulse  h-6 rounded-full inline-block w-full"></p>
              <h2 className="text-2xl lg:text-4xl font-medium h-6 bg-slate-200 animate-pulse w-full"></h2>
              <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 w-full"></p>
              <div className="text-slate-600 flex items-center gap-1 animate-pulse w-full">
                <PiDotsNine />
                <PiDotsNine />
                <PiDotsNine />
                <PiDotsNine />
                <PiDotsNine />
              </div>

              <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 animate-pulse w-full">              <p className="text-slate-400"></p>
                <p className="text-slate-400 underline w-full"></p>
                <p className="text-slate-200 bg-slate-400 w-full"></p>
              </div>

              <div className="grid items-center gap-3 my-2 w-full">
                <button className="h-6 bg-slate-200 rounded animate-pulse w-full"></button>
                <button className="h-6 bg-slate-200 rounded animate-pulse w-full"></button>
              </div>

              <div>
                <p className="text-slate-600 font-medium my-1 h-6  bg-slate-200 rounded animate-pulse w-full"></p>
                <p className="text-slate-600 font-medium my-1 h-6  bg-slate-200 rounded animate-pulse w-full"></p>
              </div>
            </div>
          ) : (
            <div className="gap-1 flex flex-col">
              <p className="bg-emerald-400 text-black px-2 rounded-full inline-block w-fit">{data?.brandName}</p>
              <h2 className="text-2xl lg:text-4xl font-medium">{data?.productName}</h2>
              <p className="capitalize text-slate-400">{data?.category}</p>
              <div className="text-emerald-600 flex items-center gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <div className="grid items-center gap-2 text-2xl font-medium">
                <p>{displayUSDCurrency(data.sellingPrice)}</p>
                <p className="text-slate-400">facevalue</p>
                <p className="text-slate-400 underline">{data.facevalue}</p>
              </div>

              <div className="grid items-center gap-3 my-2">
                <button className="border-2 border-emerald-900 px-3 py-1 min-w-[120px] font-medium hover:bg-yellow-600" onClick={handleSell}>Sell</button>
              </div>

              <div>
                <p className="text-slate-600 font-medium my-1">Offer Terms:</p>
                <p>{data?.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUploadForm && (
        <UserUploadMarket
          onClose={() => setShowUploadForm(false)}
          fetchData={() => {}}
          productDetails={{
            productName: data.productName,
            productImage: data.productImage,
            rate: data.sellingPrice,
            description: data.description,
          }}
        />
      )}
    </>
  );
};

export default ProductDetails;
