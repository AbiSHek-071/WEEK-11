import React, { useEffect, useState } from "react";
import EditProductPop from "./EditProductPop";
import { Card, CardContent } from "../../ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { removeOffer } from "@/APIs/Products/Offer";

function ProductCard({ product, categories, setReload, offers }) {
  const [isListed, setIsListed] = useState(product.listed);
  const [currentOffer, setCurrentOffer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const offer = offers.find((offer) => offer.target_id === product._id);
    setCurrentOffer(offer || null);
  }, [product._id, offers]);

  async function handleToggle(_id, isActive) {
    try {
      const response = await axiosInstance.put("/admin/products/status", {
        _id,
        isActive,
      });
      toast.success(response.data.message);
      setReload(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return toast.error(err.response.data.message);
      }
      console.log(err);
      toast.error("An error occurred. Please try again.");
    }
  }

  async function handleRemoveOffer() {
    try {
      const response = await removeOffer(product._id);
      toast.success(response.data.message);
      setCurrentOffer(null);
      setReload(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 h-64 sm:h-auto relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {currentOffer && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
              {currentOffer.offer_value}% off
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between bg-gray-50">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <span className="text-sm px-2 py-1 bg-gray-200 rounded-full">
                {product.category.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg text-green-600">
                Rs.{product.salePrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                Sleeve: {product.sleeve}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <EditProductPop
              product={product}
              categories={categories}
              setReload={setReload}
            />

            {currentOffer ? (
              <button
                onClick={handleRemoveOffer}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
              >
                Remove Offer
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate(
                    `/admin/product-offer/${product._id}/${product.name}`
                  );
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
              >
                Add Offer
              </button>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                checked={product.isActive}
                onCheckedChange={() =>
                  handleToggle(product._id, product.isActive)
                }
                aria-label="Toggle listing"
              />
              <span className="text-sm font-medium">
                {product.isActive ? "Listed" : "Unlisted"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(ProductCard);
