import React, { useEffect, useState } from "react";
import { Heart, Minus, Plus, Slash, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "../../App.css";
import { AnimatePresence, motion } from "framer-motion";
import axiosInstance from "@/AxiosConfig";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  addToWishListApi,
  checkIsExistOnWishlistApi,
  removeFromWishListApi,
} from "@/APIs/Products/WishlistApis";

export default function ProductDetails({
  product,
  averageRating,
  totalReviews,
}) {
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const userData = useSelector((store) => store.user.userDatas);

  const [size, setSize] = useState(null);
  const [error, setError] = useState("");
  const [exist, setExist] = useState(false);
  const [existOnWishlist, setExistOnWishlist] = useState(false);

  async function handleSelectSize(s) {
    try {
      if (!userData) {
        return toast.warning("You should Login first to add Item to Cart");
      }
      setSize(s);
      setError("");
      console.log(s.size);

      const response = await axiosInstance.get(
        `/user/size/${product._id}/${userData._id}/${s.size}`
      );
      setExist(response.data.success);
    } catch (err) {
      console.error(err);
    }
  }

  //add to wishlist
  async function addTOWishlist() {
    try {
      const product_id = product._id;
      const user_id = userData._id;

      const response = await addToWishListApi(product_id, user_id);

      toast.success(response.data.message);
      setExistOnWishlist(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }
  //remove from wishlist
  async function removeFromWishlist() {
    try {
      const product_id = product._id;
      const user_id = userData._id;

      const response = await removeFromWishListApi(product_id, user_id);

      toast.success(response.data.message);
      setExistOnWishlist(false);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }
  //check exist on wishlist or not
  async function checkisExistONWishlist() {
    try {
      const product_id = product._id;
      const user_id = userData._id;
      const response = await checkIsExistOnWishlistApi(product_id, user_id);
      if (response.data.success) {
        setExistOnWishlist(true);
      } else {
        setExistOnWishlist(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function closeZoomModal() {
    setIsZoomModalOpen(false);
  }

  async function handleAddCart() {
    if (!size) {
      setError("Select a size before adding to cart");
    } else {
      try {
        const stock = product.sizes.find((s) => s.size === size.size);
        console.log(stock);

        const productData = {
          productId: product._id,
          price: product.price,
          salePrice: product.salePrice,
          size: size.size,
          stock: stock.stock,
          salesPrice: product.salesPrice,
          qty: 1,
        };
        console.log(productData);

        const response = await axiosInstance.post("/user/cart", {
          userId: userData._id,
          product: productData,
        });

        setExist(true);
        if (response && response.data && response.data.message) {
          toast.success(response.data.message);
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        }
      }
    }
  }

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
    checkisExistONWishlist();
  }, [product]);

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeZoomModal}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative max-w-[30vw] max-h-[100vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:text-gray-200 z-10"
                onClick={closeZoomModal}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={mainImage}
                alt="Zoomed product view"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="scrollbar h-full order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[900px] md:min-w-[140px]">
            {product.images.map((img, index) => (
              <button
                key={index}
                className="flex-shrink-0 w-20 h-28 md:w-full md:h-52 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="order-1 md:order-2 flex-grow">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300">
              <img
                onClick={() => {
                  setIsZoomModalOpen(true);
                }}
                src={mainImage}
                alt="Product Main View"
                className="w-full h-auto object-cover aspect-[3/4] transform transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
        <Card className="p-6">
          <CardContent className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl font-semibold">Men's Exclusive Collection</p>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? "fill-current text-yellow-400"
                      : i < averageRating
                      ? "fill-current text-yellow-200"
                      : "fill-current text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-2">
                {averageRating.toFixed(1)} ({totalReviews})
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-500 line-through">
              INR {product.price}
            </p>
            <p className="text-2xl font-bold text-black">
              INR {product.salePrice}
            </p>

            <p className="text-gray-600">{product.description}</p>
            <div>
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((s) => {
                  if (s.stock > 0) {
                    return (
                      <Button
                        onClick={() => handleSelectSize(s)}
                        key={s.size}
                        className={`w-10 h-10 ${
                          size === s
                            ? "bg-black text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                      >
                        {s.size}
                      </Button>
                    );
                  }
                  return (
                    <div key={s.size} className="relative">
                      <Button
                        disabled
                        className="w-10 h-10 bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        {s.size}
                      </Button>
                      <Slash className="absolute top-0 left-0 w-full h-full text-red-200" />
                    </div>
                  );
                })}
              </div>
              {product.totalStock <= 15 && product.totalStock > 1 && (
                <h6 className="mt-5 text-red-500">
                  Total Stock Left :{product.totalStock}
                </h6>
              )}
              {product.totalStock == 0 && (
                <h6 className="mt-5 text-red-500">Out of Stock</h6>
              )}
            </div>
            <div>
              {error && <span className="text-red-500">{error}</span>}
              <div className="flex items-center space-x-4">
                {exist ? (
                  <Button
                    onClick={() => {
                      navigate("/cart");
                    }}
                    className="flex-1 bg-gray-800"
                  >
                    Go to Cart
                  </Button>
                ) : (
                  <Button onClick={handleAddCart} className="flex-1">
                    Add to Cart
                  </Button>
                )}
                {existOnWishlist ? (
                  <Button
                    onClick={removeFromWishlist}
                    variant="outline"
                    size="icon"
                  >
                    <Heart className="h-4 w-4" fill="red" />
                  </Button>
                ) : (
                  <Button onClick={addTOWishlist} variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired, // Basic object type without specifying structure
  averageRating: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired,
};
