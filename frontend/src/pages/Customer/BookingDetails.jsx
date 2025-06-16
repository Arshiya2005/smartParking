import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const HistoryBookingDetails = () => {
  const location = useLocation();
  const bookingId = location.state?.booking?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!bookingId) {
          setError("No booking ID found.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`/customer/Specificbooking?bookingId=${bookingId}`, {
          withCredentials: true,
        });

        console.log("✅ Booking data from backend:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("❌ Error fetching booking details:", err);
        setError("Something went wrong while fetching booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookingId]);

  if (loading) return <p className="text-center mt-4">Loading booking details...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  if (!data) return <p className="text-center mt-4">No details available.</p>;

  const { book, spot, vehicle, owner } = data;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-4">
        <h2 className="mb-4">Booking Details</h2>

        <div className="card shadow p-4" style={{ borderRadius: "12px" }}>
          <h5>Booking Info</h5>
          <p><strong>Type:</strong> {book.type}</p>
          <p><strong>Start Time:</strong> {book.stime}</p>
          <p><strong>End Time:</strong> {book.etime}</p>
          <p><strong>Date:</strong> {new Date(book.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</p>

          <h5 className="mt-4">Parking Spot Info</h5>
          <p><strong>Name:</strong> {spot.name}</p>

          <h5 className="mt-4">Vehicle Info</h5>
          <p><strong>Model:</strong> {vehicle.model}</p>
          <p><strong>Type:</strong> {vehicle.type}</p>

          <h5 className="mt-4">Owner Info</h5>
          <p><strong>Name:</strong> {owner.fname} {owner.lname}</p>
          <p><strong>Username:</strong> {owner.username}</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryBookingDetails;