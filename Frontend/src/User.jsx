import React from "react";
import { Route, Routes } from "react-router-dom";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import LandingPage from "./Pages/LandingPage";
import Product from "./components/User/Product";
import ShopPage from "./Pages/ShopPage";
import ProductPage from "./Pages/ProductPage";

import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedLogin from "./private/ProtectedLogin";
import ProtectedHome from "./private/ProtectedHome";
import UserProfile from "./components/User/Profile/UserProfile";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import Navbar from "./components/ui/Navbar";



function User() {
  return (
    <Routes>
      <Route path='/signup' element={<SignupPage />} />

      <Route
        path='/login'
        element={
          <ProtectedLogin>
            <LoginPage />
          </ProtectedLogin>
        }
      />
      <Route path='/home' element={<LandingPage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/shop' element={<ShopPage />} />
      <Route
        path='/profile/*'
        element={
          <>
             <UserProfile /> 
          </>
        }
      />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/checkout' element={<CheckoutPage />} />
    </Routes>
  );
}

export default User;
