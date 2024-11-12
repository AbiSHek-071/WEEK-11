import { toast } from "sonner";
import React, { useState } from "react";

function PaymentComponent({ total, handlePlaceOrder }) {
  console.log("---------->", total);

  const handleSubmit = () => {
    var options = {
      key: "rzp_test_BX0zEpCrEZ8x7k", // Replace with your Razorpay key
      key_secret: "MrSg4rWQeRZGpGeXJYvZWDPN", // Replace with your Razorpay secret
      amount: total * 100, // Convert amount to paise
      currency: "INR",
      name: "STICHERS",
      description: "STITCHERS E-COMMERCE PAYMENT TESTING",
      handler: function (response) {
        console.log("called function");

        handlePlaceOrder();
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
        className="bg-black text-white mt-4 w-full h-16 rounded-md"
      >
        Pay with RazorPay and Place Order
      </button>
    </div>
  );
}

export default PaymentComponent;
