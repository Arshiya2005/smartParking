import React, { useEffect } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarCustomer from "../../components/navCustomer";
import WlcCardCustomer from "../../components/WlcCardCustomer";
import CardActive from "../../components/cardActive";
import CardBookNow from "../../components/cardBookNow";
import peaach from "../../assets/green_back.jpg";

const CustomerHome = () => {
  useAuthRedirect("customer");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${peaach})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBarCustomer />

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <WlcCardCustomer />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <CardActive />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <CardBookNow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
