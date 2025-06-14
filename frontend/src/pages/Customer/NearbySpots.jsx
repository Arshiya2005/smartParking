// src/pages/customer/NearbySpots.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";
import NearbyMap from "../../components/NearbyMap";
import SlotCard from "../../components/SlotCard";

const NearbySpots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container mt-4">
          <h4>Error</h4>
          <p>Oops! Something went wrong. Error Code: 204</p>
          <button className="btn btn-primary" onClick={() => navigate("/customer/newbooking")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const userLoc = data.userloc;
  const slots = data.data;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavBarCustomer />

      <div className="container mt-4">
        <h3>Nearby Parking Spots</h3>

        {/* Map */}
        <div className="my-4">
          <NearbyMap userLocation={userLoc} spots={slots} />
        </div>

        {/* Slots List */}
        <div className="row">
          {slots.length > 0 ? (
            slots.map((spot) => (
              <div className="col-md-6 col-lg-4 mb-4" key={spot.id}>
                <SlotCard spot={spot} />
              </div>
            ))
          ) : (
            <p className="text-muted">No parking spots found nearby.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbySpots;