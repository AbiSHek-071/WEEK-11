import axiosInstance from "@/AxiosConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OTPVerification } from "./OTPVerification";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()
  const [isOTPDialogOpen,setIsOTPDialogOpen] = useState(false)


  //Verifiying user exist and sending the otp 
  async function handleSubmit(e){
    e.preventDefault();

   try {
     toast.success("Generating OTP please Wait");
     const response = await axiosInstance.post("/user/forget-password", { email });

     toast.success(response.data.message);
     setIsOTPDialogOpen(true);
     console.log(response.data.otp);
   } catch (err) {
     if (err.response && err.response.status === 404) {
       return toast.error(err.response.data.message);
     }
     toast.error(err.response.data.message);
     toast.error("An error occurred. Please try again.");
   }
  }



  //After OTP verification navigate to reset password page with userId

   const handleOTPVerify = async (otp) => {
     try {
       const response = await axiosInstance.post("/user/forget-password/otp-verification", {
         email,
         otp,
       });
       const _id = response.data._id;
       toast.success(response.data.message);
       navigate(`/reset-password/${_id}`);
       setIsOTPDialogOpen(false);
       return toast.success(response.data.message);
     } catch (err) {
       if (err.response && err.response.status === 404) {
         return toast.error(err.response.data.message);
       }
       toast.error("An error occurred. Please try again.");
     }
     setIsOTPDialogOpen(false);
   };



//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       if (password == confirm) {
//         console.log("asdhasdg");

//         try {
//           toast.success("Generating OTP please Wait");
//           const response = await axiosInstance.post("/user/sendotp", { email });

//           toast.success(response.data.message);
//           setIsOTPDialogOpen(true);
//           console.log(response.data.otp);
//         } catch (err) {
//           if (err.response && err.response.status === 409) {
//             return toast.error(err.response.data.message);
//           }
//           toast.error("An error occurred. Please try again.");
//         }
//       } else {
//         toast.error("confirm password do not match");
//       }
//     }
//   };


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          Forgot Password
        </h2>
        <p className='text-gray-600 mb-6 text-center'>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
              required
              placeholder='Enter your email'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'>
            Reset Password
          </button>
        </form>
      </div>
      <OTPVerification
        // handleSignUp={handleSignUp}
        isOpen={isOTPDialogOpen}
        onClose={() => setIsOTPDialogOpen(false)}
        onVerify={handleOTPVerify}
        email={email}
      />
    </div>
  );
}
