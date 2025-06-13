import React from "react";
import { Outlet } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import CustProfileNav from "../../components/CustProfileNav";

const CustomerProfile = () => {
  useAuthRedirect("customer");

  return (
    <div>
      <CustProfileNav />
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerProfile;
