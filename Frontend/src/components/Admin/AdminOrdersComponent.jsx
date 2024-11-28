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
  Bell,
  AlertCircle,
  FolderX,
} from "lucide-react";
import axiosInstance from "@/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ConfirmationModal from "../shared/confirmationModal";
import { Button } from "../ui/button";
import ConfirmationModalwithButtons from "../shared/ConfirmationModalwithButtons";
import Pagination from "../shared/Pagination";

const statusOptions = ["Pending", "Shipped", "Delivered"];

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
    onCancel: null,
  });
  const [isOpenWithButton, setIsOpenWithButton] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [permenent, setpermenent] = useState("");
  const [reload, setreload] = useState(false);

  //pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    if (newStatus === "Cancelled") {
      setModalContent({
        title: "Cancel Order",
        message: "Are you sure you want to cancel this order?",
        onConfirm: async () => {
          try {
            console.log(itemId);

            const response = await axiosInstance.put(
              `/user/order/cancel/${orderId}/${itemId}`
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
        console.log(itemId);
        const response = await axiosInstance.patch(
          `/admin/status/${orderId}/${itemId}/${newStatus}`
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

  async function fetchOrders() {
    try {
      const response = await axiosInstance.get(
        `admin/orders?page=${page}&limit=${limit}`
      );
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
      setOrders(response.data.orders);
    } catch (err) {
      console.log(err);
    }
  }
  const handleReturnReq = async (orderId, itemId, reason, explanation) => {
    setModalContent({
      title: "Return Order",
      message: (
        <div>
          <div className="flex items-baseline">
            <h2 className="text-lg font-medium text-gray-900 mr-2">Reason:</h2>
            <p className=" text-lg font-medium  text-gray-500">{reason}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-900 mr-2">
              Explanation:
            </h2>
            <p className="text-lg font-light text-gray-600 whitespace-pre-wrap">
              {explanation}
            </p>
          </div>
        </div>
      ),
      onConfirm: async () => {
        try {
          const request_status = "Accepted";
          const response = await axiosInstance.patch("/admin/return/response", {
            orderId,
            itemId,
            request_status,
          });
          toast.success(response.data.message);
          setreload(true);
        } catch (err) {
          console.log(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      },
      onCancel: async () => {
        try {
          const request_status = "Rejected";
          const response = await axiosInstance.patch("/admin/return/response", {
            orderId,
            itemId,
            request_status,
          });
          toast.success(response.data.message);
          setreload(true);
        } catch (err) {
          console.log(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      },
    });
    setIsOpenWithButton(true);
  };

  useEffect(() => {
    fetchOrders();
    setreload(false);
  }, [reload, page]);

  return (
    <div className="container mx-auto px-0 py-0 sm:px-4 sm:py-8">
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
      <h1 className="text-3xl font-bold mb-6"> Orders Dashboard</h1>
      <div className="mb-6"></div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {filteredOrders.length != 0 && (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 sm:px-6">Order ID</th>
                  <th className="px-4 py-3 sm:px-6">Customer</th>
                  <th className="px-4 py-3 sm:px-6">Date</th>
                  <th className="px-4 py-3 sm:px-6">Total</th>
                  <th className="px-4 py-3 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900 text-sm sm:text-base">
                            {order.order_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.shipping_address?.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {order.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(order.placed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            ₹{order.total_amount.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                          {order.isReturnReq && (
                            <Button
                              onClick={() => toggleOrderExpansion(order._id)}
                              variant="ghost"
                              size="icon"
                              className="text-amber-500 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                            >
                              <AlertCircle
                                size={18}
                                className={`transition-transform ${
                                  expandedOrder === order._id ? "scale-110" : ""
                                }`}
                              />
                              <span className="sr-only">
                                Toggle return request details
                              </span>
                            </Button>
                          )}
                          <Button
                            onClick={() =>
                              handleViewOrderDetails(order.order_id)
                            }
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 transition-colors"
                          >
                            <Eye size={18} />
                            <span className="sr-only">View order details</span>
                          </Button>
                          <Button
                            onClick={() => toggleOrderExpansion(order._id)}
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 transition-colors"
                          >
                            {expandedOrder === order._id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                            <span className="sr-only">
                              Toggle order expansion
                            </span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-4 sm:px-6 bg-gray-50"
                        >
                          <div className="text-sm">
                            <h4 className="font-semibold mb-2">
                              Order Details:
                            </h4>
                            <p className="mb-2">
                              Payment Method: {order.payment_method}
                            </p>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Item
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Size
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Qty
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Price
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Total
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Status
                                    </th>
                                    {order.isReturnReq && (
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Return
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {order.order_items.map((item, index) => (
                                    <tr key={index}>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                        {item.product.name}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                        {item.size}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                        {item.qty}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                        ₹{item.total_price.toFixed(2)}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                        ₹
                                        {(item.qty * item.total_price).toFixed(
                                          2
                                        )}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                        {item.order_status == "Cancelled" ||
                                        item.order_status == "Returned" ||
                                        item.order_status ==
                                          "Return Rejected" ||
                                        item.order_status == "Delivered" ? (
                                          <span
                                            className={`text-xs sm:text-sm rounded-full px-2 py-1 font-semibold ${
                                              statusColors[item.order_status] ||
                                              "bg-red-400"
                                            }`}
                                          >
                                            {item.order_status}
                                          </span>
                                        ) : (
                                          <select
                                            value={item.order_status}
                                            onChange={(e) =>
                                              handleStatusChange(
                                                order._id,
                                                item._id,
                                                e.target.value
                                              )
                                            }
                                            className={`text-xs sm:text-sm rounded-full px-2 py-1 font-semibold ${
                                              statusColors[item.order_status]
                                            }`}
                                          >
                                            {statusOptions.map((status) => (
                                              <option
                                                key={status}
                                                value={status}
                                              >
                                                {status}
                                              </option>
                                            ))}
                                          </select>
                                        )}
                                      </td>
                                      {item.returnReq &&
                                        item.returnReq.request_status ==
                                          "Pending" && (
                                          <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                            <button
                                              onClick={() => {
                                                handleReturnReq(
                                                  order._id,
                                                  item._id,
                                                  item.returnReq.reason,
                                                  item.returnReq.explanation
                                                );
                                              }}
                                              className={`text-xs sm:text-sm rounded-full px-2 py-1 font-semibold transition-all bg-yellow-200 hover:scale-105 hover:bg-yellow-300`}
                                            >
                                              Pending Request
                                            </button>
                                          </td>
                                        )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {filteredOrders.length == 0 && (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">
              No Orders Yet
            </h1>
          </div>
        </div>
      )}
      <ConfirmationModalwithButtons
        isOpen={isOpenWithButton}
        onOpenChange={setIsOpenWithButton}
        title="Return Request"
        message={modalContent.message}
        confirmText="Accept"
        cancelText="Decline"
        onConfirm={modalContent.onConfirm}
        onCancel={modalContent.onCancel}
      />
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}
