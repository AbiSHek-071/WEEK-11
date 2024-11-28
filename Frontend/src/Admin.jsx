import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedAdminHome from "./private/ProtectedAdminHome";

// Lazy loaded components
const Login = lazy(() => import("./components/Admin/Login"));
const ProductManagement = lazy(() =>
  import("./components/Admin/Product/ProductManagement")
);
const Sidebar = lazy(() => import("./components/Admin/Sidebar"));
const Category = lazy(() => import("./components/Admin/Category/Category"));
const AddCategory = lazy(() =>
  import("./components/Admin/Category/AddCategory")
);
const EditCategory = lazy(() =>
  import("./components/Admin/Category/EditCategory")
);
const Customer = lazy(() => import("./components/Admin/Customer"));
const AddProduct = lazy(() => import("./components/Admin/Product/AddProduct"));
const OrdersComponent = lazy(() =>
  import("./components/User/Profile/OrdersComponent")
);
const AdminOrdersComponent = lazy(() =>
  import("./components/Admin/AdminOrdersComponent")
);
const ViewOrderDetails = lazy(() =>
  import("./components/shared/ViewOrderDetails")
);
const AddProductOffer = lazy(() =>
  import("./components/Admin/Offer/AddProductOffer")
);
const AddCategoryOffer = lazy(() =>
  import("./components/Admin/Offer/AddCategoryOffer")
);
const Coupons = lazy(() => import("./components/Admin/Coupons/Coupons"));
const AddCoupon = lazy(() => import("./components/Admin/Coupons/AddCoupon"));
const SalesReport = lazy(() => import("./components/Admin/SalesReport"));
const AddBanner = lazy(() => import("./components/Admin/banner/AddBanner"));
const Banner = lazy(() => import("./components/Admin/banner/Banner"));
const Dashboard = lazy(() => import("./components/Admin/Dashboard"));

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
  </div>
);

function Admin() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar: fixed on large screens, toggleable on small screens */}
      <div className="lg:w-64 lg:fixed lg:h-full">
        <Suspense fallback={<Loading />}>
          <Sidebar />
        </Suspense>
      </div>

      {/* Main content: scrollable area */}
      <div className="flex-grow lg:ml-64 p-2 md:p-6 overflow-y-auto bg-gray-100">
        <Provider store={store}>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Your existing routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedAdminHome>
                    <Dashboard />
                  </ProtectedAdminHome>
                }
              />
              <Route
                path="/category"
                element={
                  <ProtectedAdminHome>
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
              <Route
                path="sales-report"
                element={
                  <ProtectedAdminHome>
                    <SalesReport />
                  </ProtectedAdminHome>
                }
              />
              <Route
                path="banner"
                element={
                  <ProtectedAdminHome>
                    <Banner />
                  </ProtectedAdminHome>
                }
              />
              <Route
                path="add-banner"
                element={
                  <ProtectedAdminHome>
                    <AddBanner />
                  </ProtectedAdminHome>
                }
              />
            </Routes>
          </Suspense>
        </Provider>
      </div>
    </div>
  );
}

export default Admin;
