import { toast } from "sonner";
import React, { useState } from "react";

function ContiinuePayment({ total, onSuccess }) {
  console.log("---------->", total);

  const handleSubmit = () => {
    var options = {
      key: "rzp_test_BX0zEpCrEZ8x7k",
      key_secret: "MrSg4rWQeRZGpGeXJYvZWDPN",
      amount: total * 100,
      currency: "INR",
      name: "STICHERS",
      description: "STITCHERS E-COMMERCE PAYMENT TESTING",
      handler: function (response) {
        console.log("called function");

        onSuccess();
      },
      prefill: {
        name: "Abhishek P",
        email: "abhishekpawoor654@gmail.com",
        contact: "8304944316",
      },
      notes: {
        address: "Razorpay Corporate office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <div>
      <button
        onClick={handleSubmit}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
      >
        Continue Payment Rs {total}
      </button>
    </div>
  );
}

export default ContiinuePayment;
