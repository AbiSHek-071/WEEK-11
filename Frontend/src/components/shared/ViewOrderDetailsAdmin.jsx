import axiosInstance from "@/AxiosConfig";
import store from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { saveAs } from "file-saver";

export default function ViewOrderDetailsAdmin() {
  const adminData = useSelector((store) => store.admin.adminDatas);
  const { id } = useParams();
  const [orderData, setorderData] = useState(null);

  async function fetchOrderDetails() {
    try {
      const response = await axiosInstance.get(`/admin/order/${id}`);
      console.log(response?.data?.order);

      setorderData(response?.data?.order || {});
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  }

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  async function handleDownloadInvoice() {
    try {
      const response = await axiosInstance.post(
        "user/invoice/download",
        { orderData },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "Invoice.pdf");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h1>

      {adminData ? (
        <div className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8">
          <span>orders</span>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-black">Order Details</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8">
          <span>home</span>
          <span className="text-gray-300">/</span>
          <span>profile</span>
          <span className="text-gray-300">/</span>
          <span>orders</span>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-black">Order Details</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6 md:p-8 flex justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Order #{orderData?.order_id || "N/A"}
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Placed on:{" "}
              {orderData?.placed_at
                ? new Date(orderData.placed_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <Button onClick={handleDownloadInvoice}>Download Invoice</Button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Shipping Address</h3>
                <p className="text-lg">
                  {orderData?.shipping_address?.name || "N/A"}
                </p>
                <p>{orderData?.shipping_address?.address || "N/A"}</p>
                <p>
                  {orderData?.shipping_address?.city || "N/A"},{" "}
                  {orderData?.shipping_address?.district || "N/A"}
                </p>
                <p>
                  {orderData?.shipping_address?.state || "N/A"} -{" "}
                  {orderData?.shipping_address?.pincode || "N/A"}
                </p>
                <p>
                  Landmark: {orderData?.shipping_address?.landmark || "N/A"}
                </p>
                <p>Phone: {orderData?.shipping_address?.phone || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Payment Information
                </h3>
                <p>Method: {orderData?.payment_method || "N/A"}</p>
              </div>
              {orderData?.order_status != "Cancelled" && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Delivery Information
                  </h3>
                  <p>
                    Expected Delivery:{" "}
                    {orderData?.delivery_by
                      ? new Date(orderData.delivery_by).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>₹{orderData?.total_amount?.toFixed(2) || "0.00"}</span>
                </div>
                {/* <div className='flex justify-between'>
                  <span>Discount:</span>
                  <span>
                    -₹{orderData?.total_discount?.toFixed(2) || "0.00"}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span>Coupon Discount:</span>
                  <span>
                    -₹{orderData?.coupon_discount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>
                    {orderData?.shipping_fee > 0
                      ? orderData?.shipping_fee?.toFixed(2)
                      : "Free"}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-xl pt-4 border-t">
                  <span>Total:</span>
                  <span>
                    ₹
                    {orderData?.total_price_with_discount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Order Items</h3>
            <div className="space-y-6">
              {orderData?.order_items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 py-6 border-b last:border-b-0"
                >
                  <img
                    src={item?.product?.images?.[0] || ""}
                    alt={item?.product?.name || "Product Image"}
                    className="w-32 h-52 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <h4 className="text-lg font-medium">
                      {item?.product?.name || "N/A"}
                    </h4>
                    <p className="text-base text-gray-600">
                      Quantity: {item?.qty || "0"}
                    </p>
                    <p className="text-base text-gray-600">
                      Price: ₹{item?.price?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-base text-gray-600">
                      Payment Status: {item?.payment_status || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">Price:</p>
                    <p className="text-base text-gray-600">
                      ₹{item?.total_price?.toFixed(2) || "0.00"}
                    </p>

                    <span className="text-green-800 font-semibold">
                      Delivered on:
                      {item?.Delivered_on
                        ? new Date(item?.Delivered_on).toLocaleDateString()
                        : null}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
