import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const CancelBooking = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");

  const handleRefund = () => {
    if (!accountId || !ifsc || !bankName) {
      alert("Please fill all refund details.");
      return;
    }
    alert("Refund process initiated! (Backend not implemented yet)");
    // In future: call refund API here.
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-5">
        <h2 className="mb-4">Cancel Booking</h2>

        {!showForm ? (
          <div className="card p-4 shadow" style={{ borderRadius: "12px" }}>
            <p className="fs-5 mb-4">
              Are you sure you want to cancel your booking?
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Go Back
              </button>
              <button className="btn btn-danger" onClick={() => setShowForm(true)}>
                Proceed
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-4 shadow" style={{ borderRadius: "12px" }}>
            <h5 className="mb-3">Refund Details</h5>
            <div className="mb-3">
              <label className="form-label">Account ID</label>
              <input
                type="text"
                className="form-control"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Enter your bank account number"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">IFSC Code</label>
              <input
                type="text"
                className="form-control"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                placeholder="Enter IFSC code"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                className="form-control"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
            <button className="btn btn-success mt-2" onClick={handleRefund}>
              Proceed to Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelBooking;