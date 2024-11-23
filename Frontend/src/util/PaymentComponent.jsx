import { toast } from "sonner";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";

function PaymentComponent({
  total,
  handlePlaceOrder,
  setPayment_status,
  cartItems,
}) {
  console.log("---------->", total);
  const navigate = useNavigate();

  const checkProductAvailability = async () => {
    try {
      const res = await axiosInstance.get("/user/product/available", {
        params: { cartItems },
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        navigate("/checkout");
        return false; // Return false to indicate failure
      }
      return true; // Return true if all products are available
    } catch (err) {
      toast.error("Error checking product availability!");
      console.error(err);
      return false; // Return false in case of error
    }
  };

  const handleSubmit = async () => {
    const isAvailable = await checkProductAvailability(); // Await availability check

    if (!isAvailable) {
      return; // Exit early if products are unavailable
    }

    var options = {
      key: "rzp_test_BX0zEpCrEZ8x7k",
      key_secret: "MrSg4rWQeRZGpGeXJYvZWDPN",
      amount: total * 100,
      currency: "INR",
      name: "STICHERS",
      description: "STITCHERS E-COMMERCE PAYMENT TESTING",
      handler: function (response) {
        console.log("Payment successful");
        let payment_status = "Paid";

        handlePlaceOrder(payment_status);
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
      modal: {
        ondismiss: function () {
          console.log("Payment failed or dismissed");
          let payment_status = "Failed";

          handlePlaceOrder(payment_status);
        },
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
