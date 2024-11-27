import React, { useEffect, useState } from "react";
import { Tag, IndianRupee, Calendar, Users, Copy } from "lucide-react";
import { FetchCouponsApi } from "@/APIs/Shopping/coupon";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function UserCouponDisplay() {
  const userData = useSelector((store) => store.user.userDatas);
  const [coupons, setCoupons] = useState([]);

  async function fetchAllCoupons() {
    try {
      const response = await FetchCouponsApi();
      const coupons = response.data.Coupons;

      coupons.forEach((coupon) => {
        if (Array.isArray(coupon.users_applied)) {
          const userApplied = coupon.users_applied.find(
            (user_applied) => user_applied.user == userData._id
          );
          if (userApplied) {
            coupon.used = userApplied.used_count;
          }
        }
      });

      setCoupons(coupons);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch coupons");
    }
  }

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Coupon code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy coupon code");
      });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto lg:max-w-5xl xl:max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Available Coupons
        </h1>
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className={`bg-white ${
                coupon.usage_limit == coupon.used ? "opacity-40" : ""
              } rounded-lg shadow-md p-6 relative hover:shadow-lg transition duration-300 border border-gray-200`}
            >
              <div className="flex flex-col h-full">
                {coupon.used == coupon.usage_limit && (
                  <h1 className="text-red-800 font-bold  lg:text-5xl self-center absolute top-1/2">
                    USAGE LIMIT EXCEEDED
                  </h1>
                )}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {coupon.code}
                    </h2>
                    {coupon.used != coupon.usage_limit && (
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                        aria-label="Copy coupon code"
                      >
                        <Copy size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {coupon.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm flex-grow">
                  <div className="flex items-center">
                    <Tag className="mr-2 text-blue-500" size={16} />
                    <span className="font-medium">Discount:</span>
                    <span className="ml-1">{coupon.discount_value}%</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-green-500" size={16} />
                    <span className="font-medium">Min Purchase:</span>
                    <span className="ml-1">₹{coupon.min_purchase_amount}</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-yellow-500" size={16} />
                    <span className="font-medium">Max Discount:</span>
                    <span className="ml-1">
                      ₹{coupon.max_discount_amount || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-purple-500" size={16} />
                    <span className="font-medium">Expires:</span>
                    <span className="ml-1">
                      {new Date(coupon.expiration_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 text-indigo-500" size={16} />
                    <span className="font-medium">Coupon Used:</span>
                    <span className="ml-1">{coupon.used || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 text-indigo-500" size={16} />
                    <span className="font-medium">Usage Limit:</span>
                    <span className="ml-1">{coupon.usage_limit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
