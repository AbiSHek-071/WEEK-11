import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Admin/Login";
import ProductManagement from "./components/Admin/ProductManagement";
import Sidebar from "./components/Admin/Sidebar";
import Category from "./components/Admin/Category";
import AddCategory from "./components/Admin/AddCategory";
import EditCategory from "./components/Admin/EditCategory";
import Customer from "./components/Admin/Customer";
import AddProduct from "./components/Admin/AddProduct";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedAdminHome from "./private/ProtectedAdminHome"

function Admin() {
  return (
    <div className='flex h-screen'>
      {/* Sidebar: fixed and not scrollable */}
      <div className='w-64 fixed h-full'>
        <Sidebar />
      </div>

      {/* Main content: scrollable area */}
      <div className='flex-grow ml-64 p-6 overflow-y-auto bg-gray-100'>
        <Provider store={store}>
          <Routes>
            <Route
              path='/category'
              element={
                <ProtectedAdminHome>
                  {" "}
                  <Category />
                </ProtectedAdminHome>
              }
            />
            <Route
              path='/addcategory'
              element={
                <ProtectedAdminHome>
                  <AddCategory />
                </ProtectedAdminHome>
              }
            />
            <Route path='/editcategory/:id' element={<EditCategory />} />
            <Route
              path='/product'
              element={
                <ProtectedAdminHome>
                  <ProductManagement />
                </ProtectedAdminHome>
              }
            />
            <Route
              path='/addproduct'
              element={
                <ProtectedAdminHome>
                  <AddProduct />
                </ProtectedAdminHome>
              }
            />
            <Route
              path='/customer'
              element={
                <ProtectedAdminHome>
                  <Customer />
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
