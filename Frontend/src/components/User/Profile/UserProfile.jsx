import React from "react";
import UserSidebar from "./UserSidebar";
import Category from "@/components/Admin/Category/Category";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Route, Routes } from "react-router-dom";
import MyProfie from "./MyProfie";
import OrdersComponent from "./OrdersComponent";
import ViewOrderDetails from "../../shared/ViewOrderDetails";
import ChangePassword from "./ChangePassword";
import Coupons from "./Coupons";
import Wallet from "./Wallet";

function UserProfile() {
  return (
    <div className="flex h-screen">
      <div className="  h-full">
        <UserSidebar />
      </div>
      <div className="flex-grow   overflow-y-auto bg-gray-100 sm:p-6">
        <Provider store={store}>
          <Routes>
            {/* Define routes relative to /user/profile */}
            <Route path="myprofile" element={<MyProfie />} />
            <Route path="orders" element={<OrdersComponent />} />
            <Route path="vieworder/:id" element={<ViewOrderDetails />} />
            {/* <Route path='address' element={<div>Address Component</div>} /> */}
            <Route path="wallet" element={<Wallet />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="changepassword" element={<ChangePassword />} />

            {/* Add more routes for other menu items */}
          </Routes>
        </Provider>
      </div>
    </div>
  );
}

export default UserProfile;
