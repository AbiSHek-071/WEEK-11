import React, { useState } from "react";
import { Trash2, Tag, DollarSign, Calendar, Users, Layers } from "lucide-react";

// Mock data for demonstration
const mockCoupons = [
  {
    _id: "1",
    code: "SUMMER2023",
    description: "Summer sale discount",
    discount_value: 20,
    min_purchase_amount: 100,
    max_discount_amount: 50,
    expiration_date: "2023-08-31",
    usage_limit: 100,
    is_active: true,
    eligible_categories: ["Electronics", "Clothing"],
  },
  {
    _id: "2",
    code: "WELCOME10",
    description: "New customer discount",
    discount_value: 10,
    min_purchase_amount: 50,
    max_discount_amount: 25,
    expiration_date: "2023-12-31",
    usage_limit: 200,
    is_active: true,
    eligible_categories: ["All"],
  },
  {
    _id: "3",
    code: "FLASH50",
    description: "Flash sale discount",
    discount_value: 50,
    min_purchase_amount: 200,
    max_discount_amount: 100,
    expiration_date: "2023-07-15",
    usage_limit: 50,
    is_active: false,
    eligible_categories: ["Electronics"],
  },
  {
    _id: "4",
    code: "HOLIDAY25",
    description: "Holiday season discount",
    discount_value: 25,
    min_purchase_amount: 150,
    max_discount_amount: 75,
    expiration_date: "2023-12-25",
    usage_limit: null,
    is_active: true,
    eligible_categories: ["Clothing", "Accessories"],
  },
];

export default function Component() {
  const [coupons, setCoupons] = useState(mockCoupons);

  const handleAddCoupon = () => {
    // Implement add coupon logic
    console.log("Add coupon clicked");
  };

  const handleRemoveCoupon = (id) => {
    // Implement remove coupon logic
    setCoupons(coupons.filter((coupon) => coupon._id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Coupons
          </h1>
          <button
            onClick={handleAddCoupon}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md flex items-center"
          >
            <Tag className="mr-2" size={18} />
            Add Coupon
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="rounded-lg shadow-md p-6 relative hover:shadow-lg transition duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {coupon.code}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {coupon.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {coupon.is_active ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleRemoveCoupon(coupon._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                    aria-label="Remove coupon"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Tag className="mr-2 text-blue-500" size={16} />
                  <span className="font-medium">Discount:</span>
                  <span className="ml-1">{coupon.discount_value}%</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-green-500" size={16} />
                  <span className="font-medium">Min Purchase:</span>
                  <span className="ml-1">${coupon.min_purchase_amount}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-yellow-500" size={16} />
                  <span className="font-medium">Max Discount:</span>
                  <span className="ml-1">
                    ${coupon.max_discount_amount || "N/A"}
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
                  <span className="font-medium">Usage Limit:</span>
                  <span className="ml-1">
                    {coupon.usage_limit || "Unlimited"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Layers className="mr-2 text-pink-500" size={16} />
                  <span className="font-medium">Categories:</span>
                  <span className="ml-1">
                    {coupon.eligible_categories.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
