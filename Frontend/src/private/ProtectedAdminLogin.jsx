import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedAdminLogin({ children }) {
  const adminData = useSelector((state) => state?.admin?.adminDatas);

  if (adminData) {
    return <Navigate to={"/admin/product"} />;
  }
  return children;
}

export default ProtectedAdminLogin;
