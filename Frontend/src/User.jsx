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


function User() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/' element={<LandingPage />} />

        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<LandingPage />} />
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path='/shop' element={<ShopPage />} />
      </Routes>
    </Provider>
  );
}

export default User;
