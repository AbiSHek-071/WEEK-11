import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addAdmin } from "@/store/slice/adminSlice";
import store from "@/store/store";

function Login() {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.admin.adminDatas);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      dispatch(addAdmin(response.data.adminData));
      navigate("/admin/product");
      return toast.success(response.data.message);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
      console.log(err);
      
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
      <div className='w-full max-w-md space-y-8 mb-20'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Snitchers</h1>
          <h2 className='text-3xl font-bold mt-6 mb-6'>Admin Log In</h2>
        </div>
        <form className='space-y-4' onSubmit={handleLogin}>
          <div className='space-y-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='Email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='Password'
                required
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOffIcon className='h-4 w-4 text-gray-400' />
                ) : (
                  <EyeIcon className='h-4 w-4 text-gray-400' />
                )}
              </button>
            </div>
          </div>

          
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </form>
        
       
      </div>
    </div>
  );
}

export default Login;
