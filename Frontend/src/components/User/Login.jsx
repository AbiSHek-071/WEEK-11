import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { Input } from '../ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axiosInstance from '@/AxiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/store/slice/userSlice';
import { toast as reactToast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Login() {
  const dispatch = useDispatch();
  const userData = useSelector((store)=>store.user.userData);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
   const [googleData, setGoogleData] = useState(null);
  const navigate = useNavigate()

   const [showPassword, setShowPassword] = useState(false);
   const handleLogin = async (e) => {
     e.preventDefault();
     try {
       const response = await axiosInstance.post("/user/login", {
         email,
         password,
       });

       dispatch(addUser(response.data.userData));
       navigate("/");
       return toast.success(response.data.message);
     } catch (err) {
       if (err.response && err.response.status === 401) {
         return toast.error(err.response.data.message);
       } if (err.response && err.response.status === 404) {
         return toast.error(err.response.data.message);
       }
        if (err.response && err.response.status === 403) {
      
          return reactToast.error(
            <>
              <strong>Error 403:</strong> {err.response.data.message}
              <br />
             <strong>Contact the Admin for Further Details</strong>
            </>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }

       toast.error("An error occurred. Please try again.");
     }
   };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Snitchers</h1>
          <h2 className='text-3xl font-bold mt-6 mb-6'>Log In</h2>
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

          <div className='text-sm text-center'>
            Don't Have an Account?{" "}
            <Link
              to='/signup'
              className='font-medium text-primary hover:underline'>
              Signup
            </Link>
          </div>

          <Button type='submit' className='w-full'>
            Login
          </Button>
          <div onClick={()=>{
            navigate("/forget-password");
          }} className='text-sm text-primary hover:underline cursor-pointer'>
            Forgot password ?
          </div>
        </form>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or Continue with
            </span>
          </div>
        </div>
        <div className='w-full flex justify-center'>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const decodeData = jwtDecode(credentialResponse.credential);

                setGoogleData(decodeData);

                const response = await axiosInstance.post("/user/googleAuth", {
                  sub: decodeData.sub,
                  name: decodeData.name,
                  email: decodeData.email,
                });

                if (response.data.success) {
                  toast.success(response.data.message);
                  dispatch(addUser(response.data.userData));
                  navigate("/");
                }
              } catch (err) {
                if (err.response && err.response.status === 401) {
                  return toast.error(err.response.data.message);
                }
                console.log(err);

                toast.error("An error occurred. Please try again.");
              }
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Login