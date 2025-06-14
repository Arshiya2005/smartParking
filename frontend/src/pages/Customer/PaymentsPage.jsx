// src/pages/customer/PaymentsPage.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const PaymentsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { price } = state || {};

  if (!price) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container mt-5">
          <h4 className="text-danger">No payment details found.</h4>
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/customer")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f1f1" }}>
      <NavBarCustomer />
      <div className="container py-5 d-flex justify-content-center">
        <div className="card shadow p-4" style={{ borderRadius: "12px", maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center mb-4">Payment</h3>

          <div className="mb-4 text-center">
            <h5>Total Amount to Pay:</h5>
            <h2 className="text-success">₹{price}</h2>
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={() => alert("Payment gateway integration coming soon!")}
            >
              Pay Now
            </button>
            <button
  className="btn btn-outline-secondary"
  onClick={() => navigate("/customer")}
>
  Back to Dashboard
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;