import { useState } from "react";
import Address from "../Profile/Address";

export default function Checkout() {
    const [selectedAddress, setSelectedAddress] = useState(null);
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Billing Details</h1>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='w-full lg:w-2/3'>
          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Delivery Addresses</h2>
            <div className='space-y-4'>
              <Address selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
            </div>
            
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
            <p className='mb-2'>Select any payment methods</p>
            <div className='space-y-2'>
              {[
                {
                  label: "Debit Card / Credit Card",
                  icons: ["Hual", "Visa", "Mastercard", "Bhim"],
                },
                { label: "Wallet" },
                { label: "UPI Method" },
                { label: "Cash on delivery" },
              ].map((method, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='w-6 h-6 border-2 border-gray-400 rounded-full mr-2'></div>
                    <span>{method.label}</span>
                  </div>
                  {method.icons && (
                    <div className='flex space-x-2'>
                      {method.icons.map((icon, i) => (
                        <span
                          key={i}
                          className='text-xs bg-gray-200 px-2 py-1 rounded'>
                          {icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className='w-full lg:w-1/3'>
          <div className='bg-gray-100 p-6 rounded-md'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center mb-4'>
                <div className='w-16 h-16 bg-gray-300 mr-4'></div>
                <div>
                  <h3 className='font-semibold'>Glinter Black Hoodie</h3>
                  <p>INR 1699.00</p>
                </div>
              </div>
            ))}
            <div className='border-t pt-4 mt-4'>
              <div className='flex justify-between mb-2'>
                <span>Subtotal:</span>
                <span>INR 5097.00</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span>Shipping:</span>
                <span>INR 40.00</span>
              </div>
              <div className='flex justify-between font-semibold'>
                <span>Total:</span>
                <span>INR 5,137.00</span>
              </div>
            </div>
            <div className='mt-4 flex'>
              <input
                type='text'
                placeholder='Coupon code'
                className='flex-grow border rounded-l-md px-4 py-2'
              />
              <button className='bg-gray-900 text-white px-4 py-2 rounded-r-md'>
                Apply Coupon
              </button>
            </div>
            <button className='mt-4 w-full bg-gray-900 text-white py-3 rounded-md'>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
