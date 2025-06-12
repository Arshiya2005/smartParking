import React, { useEffect } from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
const CustomerHome = () => {
    useAuthRedirect("customer");

  return (
    <div>
      <h1>Welcome, to customer home !</h1>
      {/* Add your page content here */}
    </div>
  );
};

export default CustomerHome;
