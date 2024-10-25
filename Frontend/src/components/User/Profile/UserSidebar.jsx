import React, { useState } from "react";
import {
  User,
  MapPin,
  ShoppingBag,
  Wallet,
  Ticket,
  Key,
  Trash2,
  LogOut,
} from "lucide-react";
import { Button } from "../../ui/button";
import { NavLink } from "react-router-dom";
import PopupBox from "../../Admin/PopupBox";

function UserSidebar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleLogout = () => {
    console.log("Logout clicked");
    setIsPopupOpen(true);
  };

const topMenuItems = [
  { path: "myprofile", icon: User, label: "My Profile" },
  { path: "address", icon: MapPin, label: "Address" },
  { path: "orders", icon: ShoppingBag, label: "Orders" },
  { path: "wallet", icon: Wallet, label: "My Wallet" },
  { path: "coupons", icon: Ticket, label: "Coupons" },
];



  const bottomMenuItems = [
    {
      path: "changepassword",
      icon: Key,
      label: "Change Password",
    },
    { path: "delete", icon: Trash2, label: "Delete Account" },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];

  const renderMenuItem = (item, index) => (
    <li key={index} className='w-full'>
      {item.path ? (
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center p-4 text-lg ${
              isActive
                ? "text-black bg-gray-300"
                : "text-gray-600 hover:bg-gray-100"
            } transition-colors duration-200`
          }>
          <item.icon size={24} />
          <span className='ml-4'>{item.label}</span>
        </NavLink>
      ) : (
        <Button
          variant='ghost'
          className='w-full justify-start p-4 text-lg text-gray-800 hover:bg-gray-100'
          onClick={item.onClick}>
          <item.icon size={24} />
          <span className='ml-4'>{item.label}</span>
        </Button>
      )}
    </li>
  );

  return (
    <>
      <aside className='bg-white shadow-md h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden w-full sm:w-80 md:w-96'>
        <div className='p-6 border-b flex items-center justify-center'>
          <div className='w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-3xl font-bold'>
            AP
          </div>
        </div>
        <nav className='flex-grow overflow-y-auto'>
          <ul className='space-y-2 p-4'>{topMenuItems.map(renderMenuItem)}</ul>
        </nav>
        <div className='mt-auto border-t'>
          <ul className='p-4 space-y-2'>
            {bottomMenuItems.map(renderMenuItem)}
          </ul>
        </div>
        <PopupBox isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
      </aside>
    </>
  );
}

export default UserSidebar;
