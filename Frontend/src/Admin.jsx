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

function Admin() {
  return (
    <div className='flex h-screen'>
      {/* Sidebar: fixed and not scrollable */}
      <div className='w-64 fixed h-full'>
        <Sidebar />
      </div>

      {/* Main content: scrollable area */}
      <div className='flex-grow ml-64 p-6 overflow-y-auto bg-gray-100'>
        <Routes>
          

          <Route path='/category' element={<Category />} />
          <Route path='/addcategory' element={<AddCategory />} />
          <Route path='/editcategory/:id' element={<EditCategory />} />
          <Route path='/product' element={<ProductManagement />} />
          <Route path='/addproduct' element={<AddProduct />} />
          <Route path='/customer' element={<Customer />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
