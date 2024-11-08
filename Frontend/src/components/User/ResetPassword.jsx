import axiosInstance from "@/AxiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {id} = useParams(); 
  const navigate = useNavigate();
 

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/reset-password", {
        newPassword,
        confirmPassword,
        _id: id,
      });
      navigate("/login")
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      return toast.err(err.response.data.message);
    }
  };


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          Reset Password
        </h2>
        <p className='text-gray-600 mb-6 text-center'>
          Please enter your new password below. Make sure it's strong and
          unique.
        </p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='newPassword'
              className='block text-sm font-medium text-gray-700 mb-1'>
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
              required
              placeholder='Enter new password'
            />
          </div>
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm New Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
              required
              placeholder='Confirm new password'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
