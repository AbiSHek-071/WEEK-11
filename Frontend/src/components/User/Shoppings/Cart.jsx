import React from "react";
import { ChevronRight, Minus, Plus, Tag, X } from "lucide-react";

export default function Cart() {
  const cartItems = [
    {
      id: 1,
      name: "Glitter Black Hoodie",
      price: 1699.0,
      quantity: 1,
      size: "L",
      image:
        "https://res.cloudinary.com/dneqndzyc/image/upload/v1729309566/br2yb1fuozrzj0e1uud9.jpg",
    },
    {
      id: 2,
      name: "Glitter Black Hoodie",
      price: 1699.0,
      quantity: 1,
      size: "L",
      image:
        "https://res.cloudinary.com/dneqndzyc/image/upload/v1729309566/br2yb1fuozrzj0e1uud9.jpg",
    },
    {
      id: 3,
      name: "Glitter Black Hoodie",
      price: 1699.0,
      quantity: 1,
      size: "L",
      image:
        "https://res.cloudinary.com/dneqndzyc/image/upload/v1729309566/br2yb1fuozrzj0e1uud9.jpg",
    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = 539;
  const deliveryFee = 40;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className='min-h-screen lg:flex flex-col justify-center items-start bg-gray-100 text-black'>
      <header>
        <div className='w-full mx-auto py-4 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold'>Shopping Cart</h1>
        </div>
      </header>
      <main className='w-full mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row lg:space-x-8'>
          <div className='lg:w-2/3'>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
              <div className='p-8'>
                <div className='hidden sm:grid grid-cols-6 text-sm font-semibold mb-4 pb-2 border-b border-gray-200'>
                  <span className='col-span-2'>Product</span>
                  <span className='text-center'>Size</span>
                  <span className='text-center'>Price</span>
                  <span className='text-center'>Quantity</span>
                  
                </div>
                <div className='space-y-8'>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className='grid grid-cols-6 items-center py-8 border-b border-gray-200'>
                      {/* Product column with image and name */}
                      <div className='col-span-2 flex items-center space-x-6'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-20 h-20 object-cover rounded-md'
                        />
                        <h3 className='text-lg font-semibold'>{item.name}</h3>
                      </div>

                      {/* Size column */}
                      <p className='text-center'>{item.size}</p>

                      {/* Price column */}
                      <p className='text-center font-semibold'>
                        INR {item.price.toFixed(2)}
                      </p>

                      {/* Quantity column */}
                      <div className='flex items-center justify-center space-x-2'>
                        <button className='px-2 py-1 text-gray-600 hover:bg-gray-100 transition duration-200'>
                          <Minus size={16} />
                        </button>
                        <span className='px-3'>{item.quantity}</span>
                        <button className='px-2 py-1 text-gray-600 hover:bg-gray-100 transition duration-200'>
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove button column */}
                      <button className='text-gray-600 hover:text-gray-800 transition duration-200 text-center'>
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='lg:w-1/3 mt-8 lg:mt-0'>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
              <div className='p-8'>
                {" "}
                {/* Adjust padding for a larger look */}
                <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
                <div className='space-y-4 mb-4'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-semibold'>
                      INR {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between text-red-600'>
                    <span>Discount (-20%)</span>
                    <span>-INR {discount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Delivery Fee</span>
                    <span className='font-semibold'>
                      INR {deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className='border-t border-gray-200 pt-3 mt-3'>
                    <div className='flex justify-between font-semibold text-lg'>
                      <span>Total</span>
                      <span>INR {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className='mt-6 space-y-4'>
                  <div className='flex space-x-4'>
                    <div className='flex-1 relative'>
                      <input
                        type='text'
                        placeholder='Add promo code'
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-200'
                      />
                      <Tag
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                        size={20}
                      />
                    </div>
                    <button className='px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out'>
                      Apply
                    </button>
                  </div>
                  <button className='w-full flex justify-center items-center space-x-2 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300 ease-in-out'>
                    <span>Go to Checkout</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
