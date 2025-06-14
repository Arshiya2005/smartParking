import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: "", no: "", type: "car" });
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("http://localhost:3000/customer/profile/myVehicles", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setVehicles(data.data);
        else console.error("inside the FetchVehicles function : Failed to load vehicles, res was OK");
      } catch (err) {
        console.error("Vehicle fetch error(res was not OK):", err);
      }
    };
    fetchVehicles();
  }, []);

  const handleAddVehicle = async () => {
    try {
      const res = await fetch("http://localhost:3000/customer/profile/myVehicles/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newVehicle),
      });
      if (res.ok) {
        alert("Vehicle added successfully : res was OK");
        setShowAddVehicle(false);
        setNewVehicle({ name: "", no: "", type: "car" });
        const updated = await res.json();
        setVehicles((prev) => [...prev, updated]);
      } else {
        alert("Failed to add vehicle : res was not OK");
      }
    } catch (err) {
      console.error("Add vehicle error:", err);
    }
  };

  const handleSearchNearby = async () => {
    try {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (!vehicle || !location) return alert("Please fill all fields");

      const res = await fetch("http://localhost:3000/customer/searchNearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          location,
          id: vehicle.id,
          type: vehicle.type,
        }),
      });
      const data = await res.json();
      console.log("Nearby Search Response:", res.status, data);
      if (res.ok) {
        console.log("res was okay , so now navigating to the NearbySpots.jsx");
        navigate("/customer/nearby", { state: { data } });
      } else {
        alert(data.message || "Failed to fetch nearby slots : res sent was not OK");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Book a Parking Slot</h3>

      <div className="mb-3">
        <label className="form-label">Select Vehicle</label>
        {vehicles.length === 0 ? (
          <p>No vehicles found. <button className="btn btn-link p-0" onClick={() => setShowAddVehicle(true)}>Add Vehicle</button></p>
        ) : (
          <select
            className="form-select"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
          >
            <option value="">-- Choose a vehicle --</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.model} ({vehicle.number})
              </option>
            ))}
          </select>
        )}
      </div>

      {showAddVehicle && (
        <div className="mb-3">
          <h5>Add New Vehicle</h5>
          <input
            type="text"
            placeholder="Vehicle Model"
            className="form-control mb-2"
            value={newVehicle.name}
            onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Vehicle Number"
            className="form-control mb-2"
            value={newVehicle.no}
            onChange={(e) => setNewVehicle({ ...newVehicle, no: e.target.value })}
          />
          <select
            className="form-select mb-2"
            value={newVehicle.type}
            onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          <button className="btn btn-success" onClick={handleAddVehicle}>Add</button>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Enter Location</label>
        <input
          type="text"
          className="form-control"
          placeholder="Eg. FC Road Pune"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSearchNearby}>
        Proceed
      </button>
    </div>
  );
};

export default BookingForm;

