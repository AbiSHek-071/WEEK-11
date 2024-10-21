import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function OTPVerification({ isOpen, onClose, onVerify, email }) {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
     
    }
  };

  const handleVerify = () => {
    onVerify(otp.join('')); 
    
  };

  const handleResend = () => {
    setTimer(20);
    // Add logic to resend OTP
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-center'>Verify OTP</DialogTitle>
        </DialogHeader>
        <div className='text-center mb-4'>
          We've sent an email with an activation code to your email {email}
        </div>
        <div className='flex justify-center space-x-2 mb-4'>
          {otp.map((digit, index) => (
            <Input
              key={index}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className='w-12 h-12 text-center text-lg'
            />
          ))}
        </div>
        <div className='text-center mb-4'>
          {timer > 0 ? (
            <p>
              Send code again{" "}
              {Math.floor(timer / 60)
                .toString()
                .padStart(2, "0")}
              :{(timer % 60).toString().padStart(2, "0")}
            </p>
          ) : (
            <Button variant='link' onClick={handleResend}>
              Resend
            </Button>
          )}
        </div>
        <Button onClick={handleVerify} className='w-full'>
          Verify
        </Button>
      </DialogContent>
    </Dialog>
  );
}