// src/pages/customer/CustomerVehicles.jsx
import React, { useEffect, useState } from "react";
import VehicleCard from "../../components/vehicleCard";
import { FaPlus } from "react-icons/fa";
import peachh from "../../assets/peach_background.jpg"

const CustomerVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ name: "", no: "", type: "car" });

  const fetchVehicles = async () => {
    try {
      const res = await fetch("http://localhost:3000/customer/profile/myVehicles", {
      method: "GET",
      credentials: "include",
      headers: {
      "Cache-Control": "no-cache",
    },});
      const data = await res.json();
      if (res.ok) {
        setVehicles(data.data);
      } else {
        console.error("Failed to fetch vehicles");
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const handleAddVehicle = async () => {
    const { name, no, type } = newVehicle;
  
    if (!name.trim() || !no.trim() || !type) {
      alert("Please fill in all fields before adding a vehicle.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3000/customer/profile/myVehicles/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newVehicle),
      });
      if (res.ok) {
        alert("Vehicle added successfully");
        setNewVehicle({ name: "", no: "", type: "car" });
        await fetchVehicles(); // refresh
      } else {
        alert("Failed to add vehicle");
      }
    } catch (err) {
      console.error("Add vehicle error:", err);
    }
  };
  const handleDeleteVehicle = async (id) => {
    try {
      const res = await fetch("http://localhost:3000/customer/profile/myVehicles/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("Vehicle deleted");
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      } else {
        alert("Failed to delete vehicle");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Vehicles</h3>

      {/* Add Vehicle Form */}
      <div className="card mb-4 p-3 shadow-sm">
        <h5 className="mb-3">Add New Vehicle</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Vehicle Model"
              value={newVehicle.name}
              onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Vehicle Number"
              value={newVehicle.no}
              onChange={(e) => setNewVehicle({ ...newVehicle, no: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={newVehicle.type}
              onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
          </div>
          <div className="col-md-1 d-flex align-items-center">
            <button className="btn btn-success w-100" onClick={handleAddVehicle}>
              <FaPlus />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      {vehicles.length > 0 ? (
        vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onDelete={handleDeleteVehicle} />
        ))
      ) : (
        <p className="text-muted">No vehicles found. Add your first one!</p>
      )}
    </div>
  );
};

export default CustomerVehicles;
