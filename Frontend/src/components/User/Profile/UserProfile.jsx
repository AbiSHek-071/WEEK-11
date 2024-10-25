import React from "react";
import UserSidebar from "./UserSidebar";
import Category from "@/components/Admin/Category/Category";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Route, Routes } from "react-router-dom";
import MyProfie from "./MyProfie";

function UserProfile() {
  return (
    <div className='flex h-screen'>
      <div className='w-96 fixed h-full'>
        <UserSidebar />
      </div>
      <div className='flex-grow ml-96 p-6 overflow-y-auto bg-gray-100'>
        <Provider store={store}>
          <Routes>
            {/* Define routes relative to /user/profile */}
            <Route path='myprofile' element={<MyProfie />} />
            <Route path='orders' element={<div>Orders Component</div>} />
            <Route path='address' element={<div>Address Component</div>} />
            <Route path='wallet' element={<div>wallet Component</div>} />
            <Route path='coupons' element={<div>coupons Component</div>} />
            <Route path='changepassword' element={<div>changepassword Component</div>} />
            <Route path='delete' element={<div>delete Component</div>} />
            {/* Add more routes for other menu items */}
          </Routes>
        </Provider>
      </div>
    </div>
  );
}

export default UserProfile;