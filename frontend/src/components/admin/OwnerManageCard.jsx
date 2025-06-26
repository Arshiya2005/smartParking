import React from "react";
import { useNavigate } from "react-router-dom";

const OwnerManageCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin/owners");
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body d-flex flex-column align-items-center text-center">
        <h4 className="card-title mb-3">Manage Owners</h4>
        <p className="card-text mb-4">
          View owner profiles, their registered areas, and activity details.
        </p>
        <button
          onClick={handleClick}
          className="btn btn-outline-success"
          style={{ fontWeight: "500" }}
        >
          Go to Owner Manager
        </button>
      </div>
    </div>
  );
};

export default OwnerManageCard;