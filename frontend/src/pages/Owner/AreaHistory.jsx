import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AreaHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const area = location.state?.area;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!area) {
      setError("Area data not found");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/owner/bookingHistoryInArea?area=${encodeURIComponent(
            JSON.stringify(area)
          )}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setBookings(data.data || []);
        } else {
          setError(data.error || "Failed to fetch history");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching booking history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [area]);

  return (
    <div className="container py-5" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card p-4 shadow-sm">
        <h2 className="mb-3">Booking History – {area?.name || "Unknown Area"}</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-secondary" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : bookings.length === 0 ? (
          <p className="text-muted text-center">No historical bookings for this area yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Slot #</th>
                  <th>Vehicle Type</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    <td>{b.slot_no}</td>
                    <td>{b.type}</td>
                    <td>{b.sTime}</td>
                    <td>{b.eTime}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === "completed"
                            ? "bg-success"
                            : b.status === "cancelled"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaHistory;