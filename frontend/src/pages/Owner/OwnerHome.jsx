import React, { useEffect } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarOwner from "../../components/owner/NavBarOwner";
import WlcOwner from "../../components/owner/WlcOwner.jsx"
import MyAreaCard from "../../components/owner/MyAreaCard.jsx";
import AddAreaCard from "../../components/owner/AddAreaCard.jsx";
import ownerBg from "../../assets/green_back.jpg"; // Use a relevant background image
import MyArea from "./MyArea";

const OwnerHome = () => {
  useAuthRedirect("owner");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${ownerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBarOwner />

      <div className="container py-4">
        {/* Welcome Card */}
        <div className="row mb-4">
          <div className="col-12">
            <WlcOwner />
          </div>
        </div>

        {/* Cards */}
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <MyAreaCard />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <AddAreaCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;