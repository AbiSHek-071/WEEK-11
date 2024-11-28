import React, { useEffect, useState } from "react";
import {
  Binary,
  ChevronRight,
  Delete,
  DeleteIcon,
  Minus,
  Plus,
  Recycle,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import { useSelector } from "react-redux";
import { toast as reactToast, ToastContainer } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user.userDatas);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtota] = useState(0);
  const [reload, setReload] = useState(false);
  const discount = 0;
  const deliveryFee = 0;
  const total = subtotal - discount + deliveryFee;

  async function fetchCartItems() {
    try {
      const response = await axiosInstance.get(`/user/cart/${userData._id}`);
      setCartItems(response.data.cartItems.items);

      setSubtota(response.data.cartItems.totalCartPrice);
    } catch (err) {
      console.log(err);
      if (err.response) {
        return toast.error(err.response.data.message);
      }
    }
  }
  async function handelMinus(item) {
    try {
      const response = await axiosInstance.patch(
        `/user/cart/min/${item._id}/${userData._id}`
      );
      console.log(response.data);
      setReload(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  async function handelPlus(item) {
    try {
      const response = await axiosInstance.patch(
        `/user/cart/add/${item._id}/${userData._id}`
      );
      console.log(response.data);
      setReload(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  async function handleRemove(item) {
    try {
      const response = await axiosInstance.delete(
        `/user/cart/${item._id}/${userData._id}`
      );
      setReload(true);
      return toast.success(response.data.message);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  useEffect(() => {
    fetchCartItems();
    setReload(false);
  }, [reload]);
  return (
    <div className="min-h-screen lg:flex flex-col justify-start items-start bg-gray-100 text-black">
      {/* <header>
        <div className='w-full mx-auto py-4 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold'>Shopping Cart</h1>
        </div>
      </header> */}
      <main className="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <ShoppingCart size={64} className="text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-700">
              Your cart is empty
            </h2>
            <p className="text-gray-500">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => {
                navigate("/shop");
              }}
              className="mt-4 bg-black text-white py-2 px-4 rounded-md hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="lg:w-2/3">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-8">
                  <div className="hidden sm:grid grid-cols-6 text-sm font-semibold mb-4 pb-2 border-b border-gray-200">
                    <span className="col-span-2">Product</span>
                    <span className="text-center">Size</span>
                    <span className="text-center">Price</span>
                    <span className="text-center">Quantity</span>
                  </div>
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className={`relative flex flex-col sm:grid sm:grid-cols-6 items-center gap-4 py-4 sm:py-6 md:py-8 border-b border-gray-200 ${
                          item.qty === 0 ? "pointer-events-none opacity-40" : ""
                        }`}
                      >
                        <div className="w-full sm:col-span-2 flex flex-col sm:flex-row items-center sm:space-x-4 md:space-x-6">
                          <img
                            src={item?.productId?.images[0]}
                            alt={item?.productId?.images[1]}
                            className="w-full max-w-[160px] sm:w-24 sm:h-36 md:w-32 md:h-48 lg:w-40 lg:h-60 object-cover rounded-sm"
                          />
                          <h3 className="text-base sm:text-lg font-semibold mt-2 sm:mt-0 text-center sm:text-left">
                            {item.productId.name}
                          </h3>
                        </div>

                        <p className="text-sm sm:text-base text-center sm:col-span-1">
                          {item.size}
                        </p>

                        <p className="text-sm sm:text-base font-semibold text-center sm:col-span-1">
                          INR {item.discountedAmount.toFixed(2)}
                        </p>

                        <div className="flex flex-col items-center sm:col-span-1">
                          <div className="flex items-center justify-center space-x-2 border border-gray-200 rounded-full">
                            <button
                              onClick={() => handelMinus(item)}
                              className="p-1 sm:p-2 text-gray-600 hover:bg-gray-100 transition duration-200 rounded-full"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-2 sm:px-3 min-w-[24px] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handelPlus(item)}
                              className="p-1 sm:p-2 text-gray-600 hover:bg-gray-100 transition duration-200 rounded-full"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemove(item)}
                          className="text-gray-600 hover:text-red-500 transition duration-200 sm:col-span-1 mt-2 sm:mt-0"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-8">
                  {" "}
                  {/* Adjust padding for a larger look */}
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        INR {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>INR {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {subtotal ? (
                      <button
                        onClick={() => {
                          navigate("/checkout");
                        }}
                        className="w-full flex justify-center items-center space-x-2 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300 ease-in-out"
                      >
                        <span>Go to Checkout</span>
                        <ChevronRight size={20} />
                      </button>
                    ) : (
                      <div className="flex justify-center flex-col items-center gap-3">
                        <span className="text-lg font-semibold text-red-400">
                          Current items in the cart are out of stock{" "}
                        </span>
                        <button
                          onClick={() => {
                            navigate("/shop");
                          }}
                          className="w-full flex justify-center items-center space-x-2 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300 ease-in-out"
                        >
                          <span>Continue Shopping</span>
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
