import { toast } from "sonner";
import React, { useState } from "react";

function PaymentComponent({ total, handlePlaceOrder, setPayment_status }) {
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
          console.log(
            "handle order on payment failed here :::::::::::::::::::::>"
          );
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
