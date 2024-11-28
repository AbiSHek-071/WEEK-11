import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedLogin from "./private/ProtectedLogin";
import ProtectedHome from "./private/ProtectedHome";
import Navbar from "./components/ui/Navbar";

// Lazy load components
const SignupPage = lazy(() => import("./Pages/SignupPage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const ProductPage = lazy(() => import("./Pages/ProductPage"));
const ShopPage = lazy(() => import("./Pages/ShopPage"));
const UserProfile = lazy(() => import("./components/User/Profile/UserProfile"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));
const ForgotPassword = lazy(() => import("./components/User/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword"));
const WishlistPage = lazy(() => import("./Pages/WishlistPage"));
const PageNotFound = lazy(() => import("./components/shared/PageNotFound"));

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
  </div>
);

function User() {
  return (
    <Suspense fallback={<Loading />}>
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
            <ProtectedHome>
              <UserProfile />
            </ProtectedHome>
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

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default User;
