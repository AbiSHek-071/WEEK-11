import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { OTPVerification } from "./OTPVerification"; 
import axiosInstance from "@/AxiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { addUser } from "@/store/slice/userSlice";
import { useDispatch } from "react-redux";



export default function SignUp() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false);
  const [name,setName] = useState("")
  const [email, setEmail] = useState("");
  const [phone,setPhone]= useState(null);
  const [password,setPassword] = useState("")
  const [confirm,setConfirm] = useState("")
  const navigate = useNavigate();
  const [googleData,setGoogleData] = useState(null)
   const [error, setError] = useState({});
   const dispatch = useDispatch()

  function validate() {
    const error = {};

  
    if (!name?.trim()) {
      error.name = "Name is required";
    } else if (/^\d/.test(name.trim())) {
      error.name = "Name should not start with a number";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name.trim())) {
      error.name = "Name can only contain letters, numbers, and spaces";
    }

  
    if (!email?.trim()) {
      error.email = "Email is required";
    } else if (/^\d/.test(email.trim())) {
      error.email = "Email should not start with a number";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      error.email = "Invalid email format";
    }

    
    if (!phone?.trim()) {
      error.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      error.phone = "Phone number should be 10 digits";
    }

    
    if (!password?.trim()) {
      error.password = "Password is required";
    } else if (!/^[a-zA-Z0-9]{8,}$/.test(password.trim())) {
      error.password =
        "Password must be at least 8 characters long and contain only letters and numbers";
    }

    setError(error);
    if (Object.keys(error).length == 0) {
      return true;
    } else {
      return false;
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if(validate()){
      if (password == confirm) {
        try {
          toast.success("Generating OTP please Wait");
          const response = await axiosInstance.post("/user/sendotp", { email });

          toast.success(response.data.message);
          setIsOTPDialogOpen(true);
          console.log(response.data.otp);
        } catch (err) {
          if (err.response && err.response.status === 409) {
            return toast.error(err.response.data.message);
          }
          toast.error("An error occurred. Please try again.");
        }
      }
    }
   
  };

  const handleOTPVerify = async (otp) => {
  
    try{
       const response = await axiosInstance.post("/user/register", {
         name,
         email,
         phone,
         password,
         otp,
       });
      
       navigate("/user/login");
      setIsOTPDialogOpen(false);
      return toast.success(response.data.message)

      
    }catch(err){
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }else if(err.response && err.response.status === 401){
         return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
      
    }
    setIsOTPDialogOpen(false);
   
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Snitchers</h1>
          <h2 className='text-3xl font-bold mt-6 mb-6'>Sign up</h2>
        </div>
        <form className='space-y-4' onSubmit={handleSignUp}>
          <div className='space-y-1'>
            <Label htmlFor='fullName'>Full name</Label>
            <Input
              onChange={(e) => setName(e.target.value)}
              id='fullName'
              placeholder='Full name'
              required
            />
            <span className='text-red-700  mt-10 ms-2'>
              {error && error.name}
            </span>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='text'
              placeholder='Email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className='text-red-700  mt-10 ms-2'>
              {error && error.email}
            </span>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='mobileNumber'>Mobile Number</Label>
            <Input
              onChange={(e) => setPhone(e.target.value)}
              id='mobileNumber'
              type='tel'
              placeholder='Mobile Number'
              required
            />
            <span className='text-red-700  mt-10 ms-2'>
              {error && error.phone}
            </span>
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
            <span className='text-red-700  mt-10 '>
              {error && error.password}
            </span>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm password</Label>
            <div className='relative'>
              <Input
                onChange={(e) => setConfirm(e.target.value)}
                id='confirmPassword'
                type={showConfirmPassword ? "text" : "password"}
                placeholder='Confirm password'
                required
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOffIcon className='h-4 w-4 text-gray-400' />
                ) : (
                  <EyeIcon className='h-4 w-4 text-gray-400' />
                )}
              </button>
            </div>
          </div>
          <div className='text-sm text-center'>
            Already have an account?{" "}
            <Link
              to='/user/login'
              className='font-medium text-primary hover:underline'>
              Log in
            </Link>
          </div>
          <Button type='submit' className='w-full'>
            Sign Up
          </Button>
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
                 
                  dispatch(addUser(response.data.userData)); 
                  toast.success(response.data.message);
                  navigate("/user/home");
                }
              } catch (err) {
                if (err.response && err.response.status === 401) {
                  return toast.error(err.response.data.message);
                }
                toast.error("An error occurred. Please try again.");
              }
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>

      <OTPVerification
        handleSignUp={handleSignUp}
        isOpen={isOTPDialogOpen}
        onClose={() => setIsOTPDialogOpen(false)}
        onVerify={handleOTPVerify}
        email={email}
      />
    </div>
  );
}
