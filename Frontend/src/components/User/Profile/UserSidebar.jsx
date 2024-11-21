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
  Menu,
  X,
} from "lucide-react";
import { Button } from "../../ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import PopupBox from "../../ui/PopupBox";
import { SquareChevronLeftIcon } from "lucide-react";

function UserSidebar() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked");
    setIsPopupOpen(true);
  };

  const topMenuItems = [
    { path: "myprofile", icon: User, label: "My Profile" },
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
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];

  const renderMenuItem = (item, index) => (
    <li key={index} className="w-full">
      {item.path ? (
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center p-4 text-lg ${
              isActive
                ? "text-black bg-gray-300"
                : "text-gray-600 hover:bg-gray-100"
            } transition-colors duration-200`
          }
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <item.icon size={24} />
          <span className="ml-4">{item.label}</span>
        </NavLink>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start p-4 text-lg text-gray-800 hover:bg-gray-100"
          onClick={() => {
            item.onClick();
            setIsMobileMenuOpen(false);
          }}
        >
          <item.icon size={24} />
          <span className="ml-4">{item.label}</span>
        </Button>
      )}
    </li>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={`bg-white flex flex-col transition-all duration-300 ease-in-out overflow-hidden w-full sm:w-80 md:w-96 h-full ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 z-40`}
      >
        <div className="p-6 border-b flex items-center justify-center">
          <div
            onClick={() => {
              navigate("/home");
            }}
            className="w-24 h-24 cursor-pointer bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold"
          >
            Home
          </div>
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-2 p-4">{topMenuItems.map(renderMenuItem)}</ul>
        </nav>
        <div className="mt-auto border-t">
          <ul className="p-4 space-y-2">
            {bottomMenuItems.map(renderMenuItem)}
          </ul>
        </div>
        <PopupBox isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
      </aside>
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default UserSidebar;
