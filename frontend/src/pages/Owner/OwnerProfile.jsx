import React from "react";
import { Outlet } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import OwnerProfileNav from "../../components/owner/OwnerProfileNav";

const OwnerProfile = () => {
  useAuthRedirect("owner");

  return (
    <div>
      <OwnerProfileNav/>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerProfile;
