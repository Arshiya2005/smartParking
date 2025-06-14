import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const ChooseSlot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { spot } = location.state || {};

  const [sTime, setSTime] = useState("");
  const [eTime, setETime] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [price, setPrice] = useState(null);

  const validateTime = () => {
    const now = new Date();
    const [startH, startM] = sTime.split(":").map(Number);
    const [endH, endM] = eTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startH, startM, 0, 0);

    const endDate = new Date();
    endDate.setHours(endH, endM, 0, 0);

    if (startDate < now) {
      return "Start time is in the past";
    }

    if (endDate <= startDate) {
      return "End time must be after start time";
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!sTime || !eTime) return alert("Please select start and end time");

    const timeError = validateTime();
    if (timeError) {
      setError(timeError);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/customer/chooseSlot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          spot,
          sTime,
          eTime,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data);
        setError("");

        // Price calculation
        const [startH, startM] = sTime.split(":").map(Number);
        const [endH, endM] = eTime.split(":").map(Number);
        const durationInMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        const durationInHours = Math.ceil(durationInMinutes / 60);

        const rate = data.slot[0].price_per_hour || 50; // fallback if undefined
        setPrice(rate * durationInHours);
      } else {
        setResponse(null);
        setPrice(null);
        setError(data.message || "Slot not available.");
      }
    } catch (err) {
      setError("An error occurred while choosing the slot.");
      console.error("ChooseSlot error:", err);
    }
  };

  const handleProceed = () => {
    navigate("/customer/confirm", { state: { booking: response, sTime, eTime, price } });
  };

  if (!spot) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container mt-5">
          <h4>Invalid access. No parking spot selected.</h4>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <NavBarCustomer />
      <div className="container py-4">
        <h3 className="mb-3">Choose Time for Booking</h3>
        <p><strong>Parking Spot:</strong> {spot.name}</p>

        <div className="mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-control"
            value={sTime}
            onChange={(e) => setSTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-control"
            value={eTime}
            onChange={(e) => setETime(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Check Availability
        </button>

        {error && <p className="text-danger mt-3">{error}</p>}

        {response && (
          <div className="alert alert-success mt-4">
            <h5>✅ Slot Available!</h5>
            {/* <p><strong>Slot No:</strong> {response.chosenSlotNo}</p> */}
            {/* <p><strong>Owner:</strong> {response.ownerdata.fname} {response.ownerdata.lname} ({response.ownerdata.email})</p>
            <p><strong>Vehicle:</strong> {response.vehicle[0].model} ({response.vehicle[0].number})</p> */}
            <p><strong>Start:</strong> {sTime}</p>
            <p><strong>End:</strong> {eTime}</p>
            <p><strong>Total Price:</strong> ₹{price}</p>
            <button className="btn btn-success mt-2" onClick={handleProceed}>Proceed Ahead</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseSlot;