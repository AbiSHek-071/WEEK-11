import axiosInstance from "@/AxiosConfig";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const mockOrders = [
  {
    id: "407-3553833-2519531",
    customerName: "Customer Name",
    totalAmount: 578.0,
    orderDate: "15 September 2024",
    status: "PROCESSING",
    products: [
      {
        id: 1,
        name: "One Life Graphic T-shirt",
        price: 289.0,
        image:
          "https://res.cloudinary.com/dneqndzyc/image/upload/v1729309566/br2yb1fuozrzj0e1uud9.jpg",
      },
      {
        id: 2,
        name: "Classic Denim Jeans",
        price: 289.0,
        image:
          "https://res.cloudinary.com/dneqndzyc/image/upload/v1729309566/br2yb1fuozrzj0e1uud9.jpg",
      },
      {
        id: 3,
        name: "Leather Jacket",
        price: 589.0,
        image:
          "https://res.cloudinary.com/dneqndzyc/image/upload/v1729309566/br2yb1fuozrzj0e1uud9.jpg",
      },
    ],
  },
  {
    id: "407-3553833-2519532",
    customerName: "Customer Name",
    totalAmount: 289.0,
    orderDate: "14 September 2024",
    status: "DELIVERED",
    products: [
      {
        id: 4,
        name: "One Life Graphic T-shirt",
        price: 289.0,
        image:
          "https://res.cloudinary.com/dneqndzyc/image/upload/v1729309566/br2yb1fuozrzj0e1uud9.jpg",
      },
    ],
  },
];

export default function OrdersComponent() {
  const [orders, setorders] = useState([])
  const [expandedOrders, setExpandedOrders] = useState([]);


  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  async function fetchOrders() {
    try {
      const response =await axiosInstance.get(`/user/order/${userData._id}`);
      setorders(response.data.orders)
      toast.success(response.data.message);
    } catch (err) {
      if(err.response){
        console.log(err);
        
        toast.error(err.response.data.message);
      } 
    }
  }
  useEffect(()=>{
    fetchOrders();
  },[])
  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      <h1 className='text-2xl md:text-3xl font-bold mb-4'>My Order</h1>

      <div className='flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-6 md:mb-8'>
        <span>home</span>
        <span className='text-gray-300'>/</span>
        <span>profile</span>
        <span className='text-gray-300'>/</span>
        <span className='font-medium text-black'>My Order</span>
      </div>

      <div className='space-y-6'>
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className='border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 p-4 md:p-6 bg-gray-50 border-b border-gray-200 text-xs md:text-sm'>
              <div className='col-span-2 md:col-span-1'>
                <div className='text-gray-500'>Order Placed</div>
                <div className='font-medium'>{order.orderDate}</div>
              </div>
              <div>
                <div className='text-gray-500'>Total</div>
                <div className='font-medium'>
                  ₹{order.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className='col-span-2 md:col-span-1'>
                <div className='text-gray-500'>Ship To</div>
                <div className='font-medium'>{order.customerName}</div>
              </div>
              <div className='col-span-2 md:col-span-1'>
                <div className='text-gray-500'>Order #</div>
                <div className='font-medium'>{order.id}</div>
              </div>
              <div className='md:text-right'>
                <div className='text-gray-500'>Products</div>
                <div className='font-medium'>{order.products.length}</div>
              </div>
            </div>

            <div className='p-4 md:p-6'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
                <div className='text-base md:text-lg font-semibold mb-2 md:mb-0'>
                  Order Summary
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-xs md:text-sm'>Status:</span>
                  <span
                    className={`font-medium text-xs md:text-sm ${
                      order.status === "PROCESSING"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className='space-y-4'>
                {order.products
                  .slice(0, expandedOrders.includes(order.id) ? undefined : 2)
                  .map((product) => (
                    <div
                      key={product.id}
                      className='flex items-start gap-4 md:gap-6 py-4 border-t border-gray-100 first:border-t-0'>
                      <div className='w-20 h-20 md:w-24 md:h-24 flex-shrink-0'>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='w-full h-full object-cover rounded-md'
                        />
                      </div>

                      <div className='flex-grow'>
                        <h3 className='text-base md:text-lg font-medium'>
                          {product.name}
                        </h3>
                        <p className='text-sm md:text-base text-gray-500'>
                          Price: ₹{product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {order.products.length > 2 && (
                <button
                  onClick={() => toggleOrderExpansion(order.id)}
                  className='mt-4 text-xs md:text-sm text-gray-600 hover:text-gray-900 underline transition-colors'>
                  {expandedOrders.includes(order.id)
                    ? "View less"
                    : "View more products"}
                </button>
              )}
            </div>

            <div className='px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center'>
              <button className='px-3 py-2 md:px-4 md:py-2 bg-black text-white text-xs md:text-sm rounded-md hover:bg-gray-800 transition-colors'>
                View Order Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
