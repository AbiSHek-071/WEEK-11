import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedHome({ children }) {
  const userData = useSelector((state) => state?.user?.userDatas);

  if (!userData) {
    return <Navigate to={"/login"} />;
  }
  return children;
}

export default ProtectedHome;
