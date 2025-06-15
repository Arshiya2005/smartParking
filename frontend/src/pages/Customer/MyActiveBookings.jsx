import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarCustomer from "../../components/NavBarCustomer";

const MyActiveBookings = () => {
  useAuthRedirect("customer");
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBooking = async () => {
      try {
        const res = await fetch("http://localhost:3000/customer/activeBooking", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.data && data.data.length > 0) {
          const active = data.data[0];
          setBooking(active);
          fetchBookingDetails(active);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching active booking:", err);
        setLoading(false);
      }
    };

    const fetchBookingDetails = async (book) => {
        try {
          console.log("Sending query to /Specificbooking with:", book);
      
          const res = await fetch("http://localhost:3000/customer/Specificbooking", {
            method: "POST", // ✅ switch to POST
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ book }) // ✅ backend expects { book }
          });
      
          const data = await res.json();
          if (res.ok) {
            setDetails(data);
          } else {
            console.error("Specific booking error:", data.error || "Unknown error");
          }
          setLoading(false);
        } catch (err) {
          console.error("Error in fetchBookingDetails:", err);
          setLoading(false);
        }
      };

    fetchActiveBooking();
  }, []);

  const getBookingStatus = () => {
    const now = new Date();
    const s = new Date(`1970-01-01T${booking.sTime}`);
    const e = new Date(`1970-01-01T${booking.etime}`);
    const n = new Date(`1970-01-01T${now.toTimeString().split(" ")[0]}`);
    return n < s ? "Upcoming" : "Ongoing";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-4">
        <h2 className="mb-4">My Active Booking</h2>

        {loading ? (
          <p>Loading your active booking...</p>
        ) : details ? (
          <div
            className="card shadow p-3 d-flex justify-content-between align-items-center flex-row"
            style={{ borderRadius: "12px" }}
          >
            <div>
              <p className="mb-1">
                <strong>Parking Spot:</strong> {details.spot.name}
              </p>
              <p className="mb-1">
                <strong>Vehicle:</strong> {details.vehicle.model} ({details.vehicle.number})
              </p>
              <p className="mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    getBookingStatus() === "Upcoming" ? "bg-warning" : "bg-success"
                  }`}
                >
                  {getBookingStatus()}
                </span>
              </p>
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                navigate("/customer/bookingdetails", { state: { data: details } })
              }
            >
              &gt;
            </button>
          </div>
        ) : (
          <p className="text-muted">You currently have no active bookings.</p>
        )}
      </div>
    </div>
  );
};

export default MyActiveBookings;