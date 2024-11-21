import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [stars, setStars] = useState(0);
  const {
    name,
    salePrice,
    description,
    rating,
    category,
    sleeve,
    discount,
    discountAmount,
    discountedAmount,
    images,
    totalStock,
  } = product;
  useEffect(() => {
    async function fetchreviewcount(params) {
      try {
        const response = await axiosInstance.get(
          `/user/products/${product._id}/reviews/average-rating`
        );

        setStars(response.data.averageRating);
      } catch (err) {
        console.log(err);
      }
    }
    fetchreviewcount();
    console.log("total Stock", totalStock);
  }, [product]);

  return (
    <div
      onClick={() => {
        navigate(`/product/${product._id}`);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      className="group relative bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={images[0]}
          alt={name}
          className="w-full max-h-[470px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {totalStock === 0 && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1">
            Out of Stock
          </div>
        )}
        {totalStock != 0 && discount != 0 && (
          <p className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
            {discount}%
          </p>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{name}</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-lg">₹{discountedAmount || salePrice}</p>

          <div className="flex items-center">
            {[...Array(stars)].map((_, index) => (
              <Star
                key={index}
                className="w-4 h-4 fill-current text-yellow-400"
              />
            ))}
            <span className="ml-1 text-sm">{rating}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{category?.name}</span>
          <span>{sleeve} Sleeve</span>
        </div>
        {/* <div className='mt-2 flex flex-wrap gap-1'>
          {sizes.map((size, index) => (
            <span
              key={index}
              className='text-xs border border-gray-300 px-2 py-1 rounded'>
              {size}
            </span>
          ))}
        </div> */}
      </div>
    </div>
  );
}
