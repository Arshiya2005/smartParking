import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const BookingDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state?.data;

  if (!data) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container py-4">
          <p className="text-danger">No booking details found.</p>
        </div>
      </div>
    );
  }

  const { book, spot, vehicle, owner } = data;

  const handleCancel = () => {
    try {
      const now = new Date();

      // Properly build a full ISO date-time string using booking date and start time
      const dateOnly = book.date.split("T")[0]; // YYYY-MM-DD
      const startDateTimeStr = `${dateOnly}T${book.sTime}`; // Combine with stime: HH:mm:ss
      const bookingStartTime = new Date(startDateTimeStr);

      const timeDiffMs = bookingStartTime.getTime() - now.getTime();
      const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

      console.log("⏱️ Raw booking.date from backend:", book.date);
      console.log("🛠️ Reconstructed bookingStartTime:", bookingStartTime.toString());
      console.log("🕒 Current time (now):", now.toString());
      console.log("⌛ Time difference in hours:", timeDiffHours);

      if (timeDiffHours >= 1) {
        navigate("/customer/cancelbooking", { state: { bookingId: book.id } });
      } else {
        alert("❌ You can't cancel now. Cancellations must be made at least 1 hour before the start time.");
      }
    } catch (err) {
      console.error("⚠️ Error during cancellation logic:", err);
      alert("Something went wrong while checking cancellation eligibility.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-4">
        <h2 className="mb-4">Booking Details</h2>

        <div className="card shadow p-4" style={{ borderRadius: "12px" }}>
          <h5>Booking Info</h5>
          <p><strong>Type:</strong> {book.type}</p>
          <p><strong>Start Time:</strong> {book.sTime}</p>
          <p><strong>End Time:</strong> {book.eTime}</p>
          <p><strong>Date:</strong> {book.date}</p>

          <h5 className="mt-4">Parking Spot Info</h5>
          <p><strong>Name:</strong> {spot.name}</p>

          <h5 className="mt-4">Vehicle Info</h5>
          <p><strong>Model:</strong> {vehicle.model}</p>
          <p><strong>Type:</strong> {vehicle.type}</p>

          <h5 className="mt-4">Owner Info</h5>
          <p><strong>Name:</strong> {owner.fname} {owner.lname}</p>
          <p><strong>Username:</strong> {owner.username}</p>

          <div className="mt-4 d-flex gap-3">
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancel Booking
            </button>
            <a
              className="btn btn-primary"
              href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lon}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Navigate to Spot
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;