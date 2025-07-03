import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const AreaActiveBookings = () => {
  useAuthRedirect("owner");
  const [ownerId, setOwnerId] = useState(null);
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch("http://localhost:3000/owner/welcome", {
          credentials: "include",
        });
        const result = await res.json();
        const owner = result?.data;

        if (res.ok && owner?.type === "owner") {
          const id = owner.id || owner._id;
          setOwnerId(id);
          console.log("🧑‍💼 Owner ID fetched:", id);
        } else {
          console.error("⚠️ Failed to verify owner");
        }
      } catch (err) {
        console.error("❌ Error fetching owner in OwnerDashboard:", err);
      }
    };

    fetchOwner();
  }, []);

  // ✅ Listen for parking-payment events via socket
  useOwnerNotifications(ownerId);
  const location = useLocation();
  const navigate = useNavigate();
  const area = location.state?.area;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!area) {
        setError("No area data provided.");
        setLoading(false);
        return;
      }

      try {
        const encoded = encodeURIComponent(JSON.stringify(area));
        const res = await fetch(
          `http://localhost:3000/owner/activeBookingInArea?area=${encoded}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (res.ok) {
          setBookings(data.data || []);
        } else {
          setError(data.error || "Failed to fetch bookings.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [area]);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Today's Bookings – {area?.name}</h2>

      {/* Calendar (read-only visual) */}
      <div className="d-flex justify-content-center mb-4">
        <DatePicker
          selected={today}
          inline
          readOnly
          calendarClassName="border rounded shadow"
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-muted text-center">No bookings for today.</div>
      ) : (
        <ul className="list-group shadow-sm">
          {bookings.map((booking) => (
            <li key={booking.id} className="list-group-item d-flex justify-content-between">
              <span>
                <strong>Slot #{booking.slot_no}</strong> – {booking.type}
              </span>
              <span>{booking.stime} to {booking.etime}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AreaActiveBookings;