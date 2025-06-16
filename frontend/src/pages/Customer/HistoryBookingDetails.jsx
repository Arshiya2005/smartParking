import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const HistoryBookingDetails = () => {
  const location = useLocation();
  const bookingId = location.state?.booking?.id;
  const [bookingDetails, setBookingDetails] = useState(null);
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
        console.log("📦 Full bookingDetails response:", res.data);
        setBookingDetails(res.data);
      } catch (err) {
        console.error("❌ Error fetching booking details:", err);
        if (err.response) {
          console.error("🔍 Backend error response:", err.response.data);
          setError(err.response.data.message || "Something went wrong on server.");
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [bookingId]);
  if (loading) return <p className="text-center mt-4">Loading booking details...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  if (!bookingDetails) return <p className="text-center mt-4">No details available.</p>;

  const { user, vehicle, slot, ownerdata, chosenSlotNo } = bookingDetails;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Booking Details</h3>
      <div className="card p-3 shadow">
        <p><strong>Slot Number:</strong> {chosenSlotNo}</p>
        <p><strong>Slot Address:</strong> {slot?.address}</p>
        <p><strong>Owner:</strong> {ownerdata?.fname} {ownerdata?.lname} ({ownerdata?.email})</p>
        <p><strong>Start Time:</strong> {slot?.stime}</p>
        <p><strong>End Time:</strong> {slot?.etime}</p>
        <p><strong>Vehicle Type:</strong> {vehicle?.type}</p>
        <p><strong>Plate No:</strong> {vehicle?.plate_no}</p>
        <p><strong>Customer:</strong> {user?.fname} {user?.lname} ({user?.username})</p>
        <p><strong>Total Price:</strong> ₹{slot?.price}</p>
      </div>
    </div>
  );
};

export default HistoryBookingDetails;