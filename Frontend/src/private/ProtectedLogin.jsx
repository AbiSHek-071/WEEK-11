import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedLogin({ children }) {
    const userData = useSelector((state) => state?.user?.userDatas);

    if (userData) {
        return <Navigate to={"/home"} />;
    }
    return children;
}

export default ProtectedLogin;
