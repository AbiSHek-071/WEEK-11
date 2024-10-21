import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

import User from "./User";
import Admin from "./Admin";
import Login from "./components/Admin/Login";

function App() {
  return (
    <>
      <Toaster position='top-right' />
      <GoogleOAuthProvider clientId='495895525105-d4s3eg0u6upjp00irja429ki3rhd1c2o.apps.googleusercontent.com'>
        <Router>
          <Routes>
            <Route path='/user/*' element={<User />} />
            <Route path='/admin/*' element={<Admin />} />
            <Route path='admin/login' element={<Login />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
