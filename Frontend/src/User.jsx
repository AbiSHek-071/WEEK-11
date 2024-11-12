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
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Wishlist from "./components/User/Shoppings/Wishlist";
import WishlistPage from "./Pages/WishlistPage";
import PaymentComponent from "./util/PaymentComponent";

function User() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/login"
        element={
          <ProtectedLogin>
            <LoginPage />
          </ProtectedLogin>
        }
      />

      <Route
        path="/forget-password"
        element={
          <ProtectedLogin>
            <ForgotPassword />
          </ProtectedLogin>
        }
      />
      <Route
        path="/reset-password/:id"
        element={
          <ProtectedLogin>
            <ResetPassword />
          </ProtectedLogin>
        }
      />

      <Route path="/home" element={<LandingPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route
        path="/profile/*"
        element={
          <>
            <ProtectedHome>
              {" "}
              <UserProfile />
            </ProtectedHome>
          </>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedHome>
            <CartPage />
          </ProtectedHome>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedHome>
            <WishlistPage />
          </ProtectedHome>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedHome>
            <CheckoutPage />
          </ProtectedHome>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedHome>
            <PaymentComponent />
          </ProtectedHome>
        }
      />
    </Routes>
  );
}

export default User;
