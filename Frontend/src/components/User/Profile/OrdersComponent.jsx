import axiosInstance from "@/AxiosConfig";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export default function OrdersComponent() {
  const navigate = useNavigate()
  const userData = useSelector((store) => store.user.userDatas);
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
      const response =await axiosInstance.get(`/user/orders/${userData._id}`);
      setorders(response.data.orders)
      response.data.orders.map((order)=>{
        console.log(order.order_items);
        
      });
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
        {orders.map((order) => (
          <div
            key={order.order_id}
            className='border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 p-4 md:p-6 bg-gray-50 border-b border-gray-200 text-xs md:text-sm'>
              <div className='col-span-2 md:col-span-1'>
                <div className='text-gray-500'>Order Placed</div>
                <div className='font-medium'>
                  {new Date(order.placed_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
              </div>

              <div>
                {" "}
                <div className='text-gray-500'>Products</div>
                <div className='font-medium'>{order.order_items.length}</div>
              </div>
              <div className='col-span-2 md:col-span-1'>
                <div className='text-gray-500'>Ship To</div>
                <div className='font-medium'>{order.user.name}</div>
              </div>
              <div className='col-span-2 md:col-span-1'>
                <div className='text-gray-500'>Order #</div>
                <div className='font-medium'>{order.order_id}</div>
              </div>
              <div className='md:text-right'>
                <div className='text-gray-500'>Total</div>
                <div className='font-medium'>
                  ₹{order.total_price_with_discount.toFixed(2)}
                </div>
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
                      order.order_status === "Pending"
                        ? "text-yellow-500"
                        : order.order_status === "Shipped"
                        ? "text-blue-500"
                        : order.order_status === "Delivered"
                        ? "text-green-500"
                        : order.order_status === "Cancelled"
                        ? "text-red-500"
                        : ""
                    }`}>
                    {order.order_status}
                  </span>
                </div>
              </div>

              <div className='space-y-4'>
                {order.order_items
                  .slice(
                    0,
                    expandedOrders.includes(order.order_id) ? undefined : 2
                  )
                  .map((items) => (
                    <div
                      key={items.product._id}
                      className='flex items-start gap-4 md:gap-6 py-4 border-t border-gray-100 first:border-t-0'>
                      <div className='w-24 h-36 md:w-28 md:h-40 flex-shrink-0'>
                        <img
                          src={items.product.images[0]}
                          alt={items.product.name}
                          className='w-full h-full object-cover rounded-md'
                        />
                      </div>

                      <div className='flex-grow'>
                        <h3 className='text-base md:text-lg font-medium'>
                          {items.product.name}
                        </h3>
                        <p className='text-sm md:text-base text-gray-500'>
                          Price: ₹{items.total_price.toFixed(2)}
                        </p>
                        <p className='text-sm md:text-base text-gray-500'>
                          Size: {items.size}
                        </p>
                        <p className='text-sm md:text-base text-gray-500'>
                          Qty: {items.qty}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {order.order_items.length > 2 && (
                <button
                  onClick={() => toggleOrderExpansion(order.order_id)}
                  className='mt-4 text-xs md:text-sm text-gray-600 hover:text-gray-900 underline transition-colors'>
                  {expandedOrders.includes(order.order_id)
                    ? "View less"
                    : "View all products"}
                </button>
              )}
            </div>

            <div className='px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center'>
              <button onClick={()=>{
                navigate(`/profile/vieworder/${order.order_id}`);
              }} className='px-3 py-2 md:px-4 md:py-2 bg-black text-white text-xs md:text-sm rounded-md hover:bg-gray-800 transition-colors'>
                View Order Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
