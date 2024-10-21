import React from "react";
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  ShoppingCart,
  Image,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation

function Sidebar() {
  return (
    <>
      <aside className='w-64 bg-white shadow-md h-full'>
        <div className='p-4 border-b'>
          <h1 className='text-2xl font-bold'>stitchers</h1>
        </div>
        <nav className='p-4'>
          <ul className='space-y-2'>
            {[
              { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
              // Routes with NavLink for /admin/category, /admin/product, and /admin/customer
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
              { icon: <ShoppingCart size={20} />, label: "Orders" },
              { icon: <Image size={20} />, label: "Banner" },
              { icon: <Ticket size={20} />, label: "Coupon" },
              { icon: <Settings size={20} />, label: "Settings" },
              { icon: <LogOut size={20} />, label: "Logout" },
            ].map((item, index) => (
              <li key={index}>
                {/* For specific admin routes, use NavLink */}
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full justify-start flex items-center p-2 ${
                        isActive ? "text-black bg-gray-200" : "text-gray-600"
                      }`
                    }>
                    {item.icon}
                    <span className='ml-2'>{item.label}</span>
                  </NavLink>
                ) : (
                  // Keep other sidebar items as buttons
                  <Button variant='ghost' className='w-full justify-start'>
                    {item.icon}
                    <span className='ml-2'>{item.label}</span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
