import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slice/userSlice";

export default function PopupBox({ isOpen,setIsPopupOpen}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function handleLogout(){
      if (Cookies.get("accessToken")) {
        Cookies.remove("accessToken"); 
      }

      if (Cookies.get("refreshToken")) {
        Cookies.remove("refreshToken"); 
      }
        dispatch(logoutUser());
        navigate("/");
        setIsPopupOpen(false);
    }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsPopupOpen(false);
      }}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Log Out</DialogTitle>
          <DialogDescription>Please confirm your action.</DialogDescription>
        </DialogHeader>
        <div className='py-4'>Are you sure you want to log out?</div>

        <DialogFooter className='sm:justify-start'>
          <Button
            variant='outline'
            onClick={() => {
              setIsPopupOpen(false);
            }}>
            Cancel
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </DialogFooter>
        <button
          onClick={() => {
            setIsPopupOpen(false);
          }}
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
