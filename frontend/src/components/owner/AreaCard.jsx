import React from "react";
import { Link } from "react-router-dom";

const AreaCard = ({ area }) => {
  return (
    <div
      className="card shadow-sm mb-3 w-100 d-flex flex-row justify-content-between align-items-center"
      style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "1rem" }}
    >
      {/* Left side: Info */}
      <div>
        <h5 className="card-title mb-1">{area.name}</h5>
        <p className="card-text mb-1 text-muted" style={{ fontSize: "0.9rem" }}>
          ID: {area.id}
        </p>
        <p className="card-text mb-1">
          <strong>Bike Slots:</strong> {area.bike}
        </p>
        <p className="card-text mb-0">
          <strong>Car Slots:</strong> {area.car}
        </p>
      </div>

      {/* Right side: Arrow button */}
      <div>
        <Link
          to={`/owner/specificArea`}
          className="btn btn-outline-dark rounded-circle px-3 py-1"
          style={{ fontWeight: "bold", fontSize: "1.2rem" }}
        >
          &gt;
        </Link>
      </div>
    </div>
  );
};

export default AreaCard;