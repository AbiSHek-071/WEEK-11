import axiosInstance from "@/AxiosConfig";
import ConfirmationModal from "@/components/shared/confirmationModal";
import Pagination from "@/components/shared/Pagination";
import ReturnConfirmation from "@/components/shared/ReturnConfirmation";
import ContiinuePayment from "@/util/ContiinuePayment";
import { Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function OrdersComponent() {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user.userDatas);
  const [orders, setorders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [reload, setreload] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  //refund states
  const [isOpenReturn, setIsOpenReturn] = useState(false);

  //pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 2;

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  async function fetchOrders() {
    try {
      const response = await axiosInstance.get(
        `/user/orders/${userData._id}?page=${page}&limit=${limit}`
      );
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
      setorders(response.data.orders);
      // response.data.orders.map((order) => {});
    } catch (err) {
      if (err.response) {
        console.log(err);

        toast.error(err.response.data.message);
      }
    }
  }

  const handleCancel = (orderId, itemId) => {
    setModalContent({
      title: "Cancel Order",
      message: "Are you sure you want to cancel this order?",
      onConfirm: async () => {
        try {
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
  };

  const handleReturnReq = async (orderId, itemId) => {
    setModalContent({
      title: "Return Order",
      message: "Are you sure you want to return this order?",
      onConfirm: async (reason, explanation) => {
        try {
          console.log("reason::>", reason);
          console.log("explanation::::::>", explanation);
          console.log("orderId:::::::>", orderId);
          console.log("itemId::::::>", itemId);
          //register return req
          const response = await axiosInstance.post("/user/return/request", {
            reason,
            explanation,
            orderId,
            itemId,
          });
          toast.success(response.data.message);
          setreload(true);
          setIsOpenReturn(false);
        } catch (err) {
          console.error(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      },
    });
    setIsOpenReturn(true);
  };

  async function handleContinuePayment(orderId) {
    try {
      const response = await axiosInstance.patch("/user/order/finish-payment", {
        orderId,
      });
      toast.success(response.data.message);
      setreload(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchOrders();
    setreload(false);
  }, [reload, page]);
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {orders.length === 0 ? (
          <div className="flex flex-col mt-32 items-center justify-center space-y-4 py-16">
            <Package size={64} className="text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-700">
              You have no orders yet
            </h2>
            <p className="text-gray-500">
              Looks like you haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 bg-black text-white py-2 px-4 rounded-md hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">My Order</h1>

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-6 md:mb-8">
              <span>home</span>
              <span className="text-gray-300">/</span>
              <span>profile</span>
              <span className="text-gray-300">/</span>
              <span className="font-medium text-black">My Order</span>
            </div>
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-3 sm:p-4 lg:p-6 bg-gray-50 border-b border-gray-200 text-xs sm:text-sm">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-gray-500">Order Placed</div>
                      <div className="font-medium">
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

                    <div className="col-span-1 sm:col-span-1">
                      <div className="text-gray-500">Products</div>
                      <div className="font-medium">
                        {order.order_items.length}
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-gray-500">Ship To</div>
                      <div className="font-medium">
                        {order.shipping_address.name}
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-gray-500">Order #</div>
                      <div className="font-medium">{order.order_id}</div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-1">
                      {order.order_items.some(
                        (item) =>
                          item.payment_status === "Failed" &&
                          item.order_status !== "Cancelled"
                      ) ? (
                        <div className="mt-2 sm:mt-0">
                          <ContiinuePayment
                            total={order.total_price_with_discount.toFixed(2)}
                            onSuccess={() => handleContinuePayment(order._id)}
                          />
                        </div>
                      ) : (
                        <div className="font-medium">
                          <div className="text-gray-500">Total</div>
                          <div>
                            ₹{order.total_price_with_discount.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div className="text-base sm:text-lg font-semibold mb-2 sm:mb-0">
                        Order Summary
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.order_items
                        .slice(
                          0,
                          expandedOrders.includes(order.order_id)
                            ? undefined
                            : 2
                        )
                        .map((items) => (
                          <div
                            key={items.product._id}
                            className="flex flex-col sm:flex-row items-start gap-4 py-4 border-t border-gray-100 first:border-t-0"
                          >
                            <div className="w-full sm:w-24 aspect-[4/3] sm:h-40 flex-shrink-0">
                              <img
                                src={items.product.images[0]}
                                alt={items.product.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>

                            <div className="flex-grow">
                              {items?.Delivered_on && (
                                <span className="text-green-800 font-semibold text-xs sm:text-sm">
                                  Delivered on:{" "}
                                  {new Date(
                                    items?.Delivered_on
                                  ).toLocaleDateString()}
                                </span>
                              )}
                              <h3 className="text-base sm:text-lg font-medium mt-2">
                                {items.product.name}
                              </h3>
                              <p className="font-semibold text-sm text-gray-500">
                                Order Status:{" "}
                                <span
                                  className={`font-medium text-xs sm:text-sm ${
                                    items.order_status === "Pending"
                                      ? "text-yellow-500"
                                      : items.order_status === "Shipped"
                                      ? "text-blue-500"
                                      : items.order_status === "Delivered"
                                      ? "text-green-500"
                                      : items.order_status === "Cancelled"
                                      ? "text-red-500"
                                      : ""
                                  }`}
                                >
                                  {items.order_status}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Price: ₹{items.total_price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Size: {items.size}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {items.qty}
                              </p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 w-full sm:w-auto">
                              {items.order_status === "Delivered" &&
                                items.order_status !== "Cancelled" &&
                                items.order_status !== "Returned" &&
                                items.order_status !== "Return Rejected" &&
                                !items?.returnReq?.request_status && (
                                  <span className="text-orange-500 text-xs sm:text-sm mb-2">
                                    Return deadline:{" "}
                                    {Math.ceil(
                                      (new Date(items.Delivered_on).getTime() +
                                        7 * 24 * 60 * 60 * 1000 -
                                        new Date().getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) <= 0
                                      ? "Expired"
                                      : `${Math.ceil(
                                          (new Date(
                                            items.Delivered_on
                                          ).getTime() +
                                            7 * 24 * 60 * 60 * 1000 -
                                            new Date().getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )} days remaining`}
                                  </span>
                                )}
                              {items.order_status !== "Cancelled" &&
                                items.order_status !== "Returned" &&
                                items.order_status !== "Delivered" &&
                                items.order_status !== "Return Rejected" &&
                                items.payment_status !== "Failed" && (
                                  <button
                                    onClick={() =>
                                      handleCancel(order._id, items._id)
                                    }
                                    className="px-3 py-2 border-2 border-black text-black text-xs sm:text-sm rounded-md hover:bg-black hover:text-white transition-colors mb-2 w-full sm:w-auto"
                                  >
                                    Cancel Order
                                  </button>
                                )}

                              {(() => {
                                const remainingDays = Math.ceil(
                                  (new Date(items.Delivered_on).getTime() +
                                    7 * 24 * 60 * 60 * 1000 -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                                );

                                return (
                                  items.order_status === "Delivered" &&
                                  !items?.returnReq?.request_status &&
                                  remainingDays > 0 && (
                                    <button
                                      onClick={() =>
                                        handleReturnReq(order._id, items._id)
                                      }
                                      className="px-3 py-2 border-2 border-black text-black text-xs sm:text-sm rounded-md hover:bg-black hover:text-white transition-colors mb-2 w-full sm:w-auto"
                                    >
                                      Return Order
                                    </button>
                                  )
                                );
                              })()}
                              {items.order_status === "Delivered" &&
                                items?.returnReq?.request_status && (
                                  <span className="text-yellow-400 font-semibold text-xs sm:text-sm">
                                    Return request is under processing
                                  </span>
                                )}
                              {items.order_status === "Return Rejected" && (
                                <span className="text-red-400 font-semibold text-xs sm:text-sm">
                                  Return request Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    {order.order_items.length > 2 && (
                      <button
                        onClick={() => toggleOrderExpansion(order.order_id)}
                        className="mt-4 text-xs sm:text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                      >
                        {expandedOrders.includes(order.order_id)
                          ? "View less"
                          : "View all products"}
                      </button>
                    )}
                  </div>

                  <div className="px-3 sm:px-4 lg:px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
                    <button
                      onClick={() => {
                        navigate(`/profile/vieworder/${order.order_id}`);
                      }}
                      className="px-3 py-2 bg-black text-white text-xs sm:text-sm rounded-md hover:bg-gray-800 transition-colors"
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <ConfirmationModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
        />
        <ReturnConfirmation
          isOpen={isOpenReturn}
          onOpenChange={setIsOpenReturn}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
        />
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </>
  );
}
