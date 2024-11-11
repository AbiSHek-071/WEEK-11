import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Admin/Login";
import ProductManagement from "./components/Admin/Product/ProductManagement";
import Sidebar from "./components/Admin/Sidebar";
import Category from "./components/Admin/Category/Category";
import AddCategory from "./components/Admin/Category/AddCategory";
import EditCategory from "./components/Admin/Category/EditCategory";
import Customer from "./components/Admin/Customer";
import AddProduct from "./components/Admin/Product/AddProduct";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedAdminHome from "./private/ProtectedAdminHome";
import OrdersComponent from "./components/User/Profile/OrdersComponent";
import AdminOrdersComponent from "./components/Admin/AdminOrdersComponent";
import ViewOrderDetails from "./components/shared/ViewOrderDetails";
import AddProductOffer from "./components/Admin/Offer/AddProductOffer";
import AddCategoryOffer from "./components/Admin/Offer/AddCategoryOffer";
import Coupons from "./components/Admin/Coupons/Coupons";
import AddCoupon from "./components/Admin/Coupons/AddCoupon";

function Admin() {
  return (
    <div className="flex h-screen">
      {/* Sidebar: fixed and not scrollable */}
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>

      {/* Main content: scrollable area */}
      <div className="flex-grow ml-64 p-6 overflow-y-auto bg-gray-100">
        <Provider store={store}>
          <Routes>
            <Route
              path="/category"
              element={
                <ProtectedAdminHome>
                  {" "}
                  <Category />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="/addcategory"
              element={
                <ProtectedAdminHome>
                  <AddCategory />
                </ProtectedAdminHome>
              }
            />
            <Route path="/editcategory/:id" element={<EditCategory />} />
            <Route
              path="/product"
              element={
                <ProtectedAdminHome>
                  <ProductManagement />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="/addproduct"
              element={
                <ProtectedAdminHome>
                  <AddProduct />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="/customer"
              element={
                <ProtectedAdminHome>
                  <Customer />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedAdminHome>
                  <AdminOrdersComponent />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="orderdetails/:id"
              element={
                <ProtectedAdminHome>
                  <ViewOrderDetails />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="product-offer/:id/:productName"
              element={
                <ProtectedAdminHome>
                  <AddProductOffer />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="category-offer/:id/:categoryName"
              element={
                <ProtectedAdminHome>
                  <AddCategoryOffer />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="coupons"
              element={
                <ProtectedAdminHome>
                  <Coupons />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="addcoupon"
              element={
                <ProtectedAdminHome>
                  <AddCoupon />
                </ProtectedAdminHome>
              }
            />
          </Routes>
        </Provider>
      </div>
    </div>
  );
}

export default Admin;
