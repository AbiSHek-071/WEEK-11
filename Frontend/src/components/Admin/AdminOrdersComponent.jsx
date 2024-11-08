import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Package,
  User,
  Calendar,
  DollarSign,
  Eye,
  Newspaper,
} from "lucide-react";
import axiosInstance from "@/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ConfirmationModal from "../shared/confirmationModal";

const statusOptions = [
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

 

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Returned: "bg-purple-100 text-purple-800",
};

export default function AdminOrdersComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [permenent, setpermenent] = useState("");
  const [reload, setreload] = useState(false)

  const handleStatusChange = async (orderId, newStatus, order_items) => {
    if (newStatus === "Cancelled") {
      setModalContent({
        title: "Cancel Order",
        message: "Are you sure you want to cancel this order?",
        onConfirm: async () => {
          try {
            console.log(orderId);

            const response = await axiosInstance.put(
              `/user/order/cancel/${orderId}`,
              { order_items }
            );
            setreload(true);
            return toast.success(response.data.message);
          } catch (err) {
            if (err.response) {
              console.log(err);

              toast.error(err.response.data.message);
            }
          }
        },
      });
      setIsOpen(true);
    } else {
      try {
        console.log(newStatus);
        console.log(orderId);
        const response = await axiosInstance.patch(
          `/admin/status/${orderId}/${newStatus}`
        );
        setreload(true);
        return toast.success(response.data.message);
      } catch (error) {
        console.log(error);
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/admin/orderdetails/${orderId}`);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredOrders)

  async function fetchOrders() {
    try {
      const response = await axiosInstance.get("admin/orders");
      setOrders(response.data.orders);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchOrders();
    setreload(false);
  }, [reload]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
      <h1 className='text-3xl font-bold mb-6'> Orders Dashboard</h1>
      <div className='mb-6'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search orders by ID, customer name, or email...'
            className='w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-3.5 text-gray-400' size={20} />
        </div>
      </div>

      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                <th className='px-6 py-3'>Order ID</th>
                <th className='px-6 py-3'>Customer</th>
                <th className='px-6 py-3'>Date</th>
                <th className='px-6 py-3'>Total</th>
                <th className='px-6 py-3'>Status</th>
                <th className='px-6 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <Package className='flex-shrink-0 h-6 w-6 text-gray-400 mr-2' />
                        <span className='font-medium text-gray-900'>
                          {order.order_id}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <User className='flex-shrink-0 h-6 w-6 text-gray-400 mr-2' />
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {order.shipping_address?.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {order.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <Calendar className='flex-shrink-0 h-6 w-6 text-gray-400 mr-2' />
                        <span className='text-sm text-gray-900'>
                          {new Date(order.placed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {order.order_status == "Cancelled" ||
                      order.order_status == "Returned" ? (
                        <span
                          className={`text-sm rounded-full px-3 py-1 font-semibold ${
                            statusColors[order.order_status]
                          }`}>
                          {order.order_status}
                        </span>
                      ) : (
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value,
                              order.order_items
                            )
                          }
                          className={`text-sm rounded-full px-3 py-1 font-semibold ${
                            statusColors[order.order_status]
                          }`}>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => handleViewOrderDetails(order.order_id)}
                        className='text-blue-600 hover:text-blue-900 mr-3'>
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className='text-blue-600 hover:text-blue-900'>
                        {expandedOrder === order._id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan='6' className='px-6 py-4 bg-gray-50'>
                        <div className='text-sm'>
                          <h4 className='font-semibold mb-2'>Order Details:</h4>
                          <p className='mb-2'>
                            Payment Method: {order.payment_method}
                          </p>
                          <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-100'>
                              <tr>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Item
                                </th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Size
                                </th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Quantity
                                </th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Price
                                </th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                              {order.order_items.map((item, index) => (
                                <tr key={index}>
                                  <td className='px-4 py-2 whitespace-nowrap'>
                                    {item.product.name}
                                  </td>
                                  <td className='px-4 py-2 whitespace-nowrap'>
                                    {item.size}
                                  </td>
                                  <td className='px-4 py-2 whitespace-nowrap'>
                                    {item.qty}
                                  </td>
                                  <td className='px-4 py-2 whitespace-nowrap'>
                                    ₹{item.total_price.toFixed(2)}
                                  </td>
                                  <td className='px-4 py-2 whitespace-nowrap'>
                                    ₹{(item.qty * item.total_price).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
