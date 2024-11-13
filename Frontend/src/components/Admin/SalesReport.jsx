import axiosInstance from "@/AxiosConfig";
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

const SalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("daily");
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const handlePdfDownload = async () => {
    try {
      const response = await axiosInstance.get("admin/sales/download/pdf", {
        params: { filterType, startDate, endDate },
        responseType: "blob", // Move this inside the options object
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "SalesReport.pdf");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axiosInstance.get("/admin/sales", {
        params: {
          filterType,
          startDate,
          endDate,
        },
      });
      const data = await response.data.orders;
      const totalsaleData = await response.data.totalSales;

      setOrders(data);
      setTotalSales(totalsaleData);
    };

    fetchOrders();
    console.log("filterType ------>", filterType);
  }, [startDate, endDate, filterType]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        {filterType == "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </>
        )}

        <div className="flex gap-2">
          {["custom", "daily", "weekly", "monthly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded ${
                filterType === type
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <span className="ml-auto">
          <b> Total {filterType} sales :</b> ₹{totalSales.toFixed(2)}
        </span>
      </div>

      {orders.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Order Date</th>
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Unit Price</th>
                  <th className="py-3 px-6 text-left">Total Price</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm font-normal">
                {orders.map((order) =>
                  order.order_items.map((item, index) => (
                    <tr
                      key={`${order._id}-${index}`}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {index === 0 ? order.user.name : ""}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {index === 0
                          ? new Date(order.placed_at).toLocaleDateString(
                              "en-GB"
                            )
                          : ""}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {item.product.name}
                      </td>
                      <td className="py-3 px-6 text-left">{item.qty}</td>
                      <td className="py-3 px-6 text-left">
                        ₹ {item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-6 text-left">
                        ₹ {(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end space-x-4 p-4">
            <button className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Download Excel
            </button>
            <button
              onClick={handlePdfDownload}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
      {!orders.length && (
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-md rounded-lg">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Sales Data
          </h2>
          <p className="text-gray-600 text-center">
            There are currently no sales records to display for the selected
            period.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your date range or check back later for new sales
            data.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesReport;