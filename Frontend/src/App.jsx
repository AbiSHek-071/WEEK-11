import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./store/store"; // Make sure your store is correctly imported

import User from "./User";
import Admin from "./Admin";
import Login from "./components/Admin/Login";
import LandingPage from "./Pages/LandingPage";
import ProtectedAdminLogin from "./private/ProtectedAdminLogin";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Toaster position='bottom-right' />
      <ToastContainer position='bottom-right' />
      <GoogleOAuthProvider clientId='495895525105-d4s3eg0u6upjp00irja429ki3rhd1c2o.apps.googleusercontent.com'>
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/*' element={<User />} />
              <Route path='/admin/*' element={<Admin />} />
              <Route
                path='/admin/login'
                element={
                  <ProtectedAdminLogin>
                    <Login />
                  </ProtectedAdminLogin>
                }
              />
            </Routes>
          </Router>
        </Provider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
