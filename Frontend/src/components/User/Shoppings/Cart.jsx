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
        reactToast.error(err.response.data.message);
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
                  <div className="space-y-8">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className={`relative grid grid-cols-6 items-center py-8 border-b border-gray-200 ${
                          item.qty === 0 ? "pointer-events-none opacity-40" : ""
                        }`}
                      >
                        {/* {item.qty === 0 && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg text-white font-semibold'>
                          <span className="">Currently Unavailable</span>
                        </div>
                      )} */}
                        <div className="col-span-2 flex items-center space-x-6">
                          <img
                            src={item?.productId?.images[0]}
                            alt={item?.productId?.images[1]}
                            className="w-40 h-60 object-cover rounded-sm"
                          />
                          <h3 className="text-lg font-semibold">
                            {item.productId.name}
                          </h3>
                        </div>

                        <p className="text-center">{item.size}</p>

                        <p className="text-center font-semibold">
                          INR {item.discountedAmount.toFixed(2)}
                        </p>

                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handelMinus(item)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition duration-200"
                            >
                              <Minus />
                            </button>
                            <span className="px-3">{item.qty}</span>
                            <button
                              onClick={() => handelPlus(item)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition duration-200"
                            >
                              <Plus />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemove(item)}
                          className="text-gray-600 hover:text-gray-800 transition duration-200 text-center pointer-events-auto opacity-100"
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
