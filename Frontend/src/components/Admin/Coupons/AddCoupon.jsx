import React, { useState } from "react";
import { Tag, Calendar, Users, Save } from "lucide-react";
import { AddCouponApi } from "@/APIs/Shopping/coupon";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { validateCouponDetails } from "@/util/ValidationFunctions";

function AddCoupon() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validate = validateCouponDetails(
      code,
      description,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      expirationDate,
      usageLimit,
      setError
    );
    console.log("validate::::::::::::>", validate);

    if (validate) {
      try {
        const coupon = {
          code,
          description,
          discount_value: parseFloat(discountValue),
          min_purchase_amount: parseFloat(minPurchaseAmount),
          max_discount_amount: parseFloat(maxDiscountAmount),
          expiration_date: new Date(expirationDate),
          usage_limit: parseInt(usageLimit),
          is_active: true,
        };
        const response = await AddCouponApi(coupon);
        toast.success(response.data.message);
        navigate("/admin/coupons");
      } catch (err) {
        console.log(err);
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-md overflow-hidden">
          <div className="bg-gradient-to-r from-black to-gray-600 px-5 py-3">
            <h1 className="text-2xl font-semibold text-white">
              Add New Coupon
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <div>
                <label
                  htmlFor="code"
                  className="block text-base font-medium text-gray-700"
                >
                  Coupon Code
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="code"
                    className="block w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="SUMMER2023"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                  <span className="text-red-700 bottom-5  mt-10 ms-2">
                    {error && error.code}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-base font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  id="description"
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter coupon description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <span className="text-red-700   mt-10 ms-2">
                  {error && error.description}
                </span>
              </div>
              <div>
                <label
                  htmlFor="discount_value"
                  className="block text-base font-medium text-gray-700"
                >
                  Discount Value (%)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-base">%</span>
                  </div>
                  <input
                    type="number"
                    id="discount_value"
                    className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="20"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.discountValue}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="min_purchase_amount"
                  className="block text-base font-medium text-gray-700"
                >
                  Minimum Purchase Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-base">₹</span>
                  </div>
                  <input
                    type="number"
                    id="min_purchase_amount"
                    className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="100"
                    value={minPurchaseAmount}
                    onChange={(e) => setMinPurchaseAmount(e.target.value)}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.minPurchaseAmount}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="max_discount_amount"
                  className="block text-base font-medium text-gray-700"
                >
                  Maximum Discount Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-base">₹</span>
                  </div>
                  <input
                    type="number"
                    id="max_discount_amount"
                    className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="50"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.maxDiscountAmount}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="expiration_date"
                  className="block text-base font-medium text-gray-700"
                >
                  Expiration Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="date"
                    id="expiration_date"
                    className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.expirationDate}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="usage_limit"
                  className="block text-base font-medium text-gray-700"
                >
                  Usage Limit
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="number"
                    id="usage_limit"
                    className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 rounded-md focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="100"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.usageLimit}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <Save className="h-5 w-5 mr-1" />
                Add Coupon
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCoupon;
