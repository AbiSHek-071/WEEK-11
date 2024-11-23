import React, { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  ShoppingCart,
  Image,
  Ticket,
  LogOut,
  BadgeIndianRupee,
  Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import PopupBox from "./PopupBox";

function Sidebar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked");
    setIsPopupOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarItems = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      path: "/admin/category",
      icon: <Layers size={20} />,
      label: "Category",
    },
    {
      path: "/admin/product",
      icon: <ShoppingBag size={20} />,
      label: "Products",
    },
    {
      path: "/admin/customer",
      icon: <Users size={20} />,
      label: "Customers",
    },
    {
      path: "/admin/orders",
      icon: <ShoppingCart size={20} />,
      label: "Orders",
    },
    {
      path: "/admin/sales-report",
      icon: <BadgeIndianRupee size={20} />,
      label: "Sales Report",
    },
    {
      path: "/admin/coupons",
      icon: <Ticket size={20} />,
      label: "Coupon",
    },
    {
      path: "/admin/banner",
      icon: <Image size={20} />,
      label: "Banner",
    },
    {
      icon: <LogOut size={20} />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <aside className="bg-white shadow-md h-full transition-all duration-300 ease-in-out">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">stitchers</h1>
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </Button>
        </div>
        <nav
          className={`p-4 ${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:block transition-all duration-300 ease-in-out`}
        >
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full justify-start flex items-center p-2 ${
                        isActive ? "text-black bg-gray-200" : "text-gray-600"
                      } hover:bg-gray-100 transition-colors duration-200`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </NavLink>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => {
                      item.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <PopupBox isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
      </aside>
    </>
  );
}

export default Sidebar;
