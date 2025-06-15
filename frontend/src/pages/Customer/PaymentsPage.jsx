import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const PaymentsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Pull individual fields
  const slot = state?.data?.slot;
  const vehicle = state?.data?.vehicle;
  const owner = state?.data?.owner;
  const chosenSlotNo = state?.data?.chosenSlotNo;
  const sTime = state?.data?.sTime;
  const eTime = state?.data?.eTime;
  const price = state?.data?.price;

  // Optional unified booking object for convenience
  const booking = { slot, vehicle, owner, chosenSlotNo };

  // Debug logs
  useEffect(() => {
    console.log("DEBUG: slot", slot);
    console.log("DEBUG: vehicle", vehicle);
    console.log("DEBUG: owner", owner);
    console.log("DEBUG: chosenSlotNo", chosenSlotNo);
    console.log("DEBUG: sTime", sTime);
    console.log("DEBUG: eTime", eTime);
    console.log("DEBUG: price", price);
  }, []);

  const handlePayment = async () => {
    if (!slot || !vehicle || !owner || !chosenSlotNo || !sTime || !eTime || !price) {
      alert("Booking details missing. Please try again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/customer/addbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          slot: { ...slot, sTime, eTime },
          vehicle,
          owner,
          chosenSlotNo,
        }),
      });

      if (res.ok) {
        alert("Payment successful! Booking confirmed.");
        navigate("/customer");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavBarCustomer />
      <div className="container py-5">
        <h2 className="mb-4">Payment</h2>

        <div className="card shadow p-4" style={{ borderRadius: "12px" }}>
          <p className="fs-5 mb-3">
            Please click below to complete the payment of <strong>₹{price}</strong>
          </p>

          <button className="btn btn-success" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;