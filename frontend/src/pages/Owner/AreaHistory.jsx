import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AreaHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const area = location.state?.area;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!area) {
      setError("No area data provided.");
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

        if (!res.ok) throw new Error(data.error || "Failed to fetch history");
        setHistory(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [area]);

  const formatTime = (time) => time.slice(0, 5); // HH:mm
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="container py-5" style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="mb-4 text-center">Booking History – {area?.name}</h2>

      {loading && <div className="text-center">Loading history...</div>}

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="text-center text-muted">No past bookings found.</div>
      )}

      <div className="table-responsive">
        {history.length > 0 && (
          <table className="table table-bordered table-striped shadow-sm bg-white">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Slot No</th>
                <th>Type</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((b) => (
                <tr key={b.id}>
                  <td>{formatDate(b.date)}</td>
                  <td>{b.slot_no}</td>
                  <td>{b.type}</td>
                  <td>{formatTime(b.sTime)}</td>
                  <td>{formatTime(b.eTime)}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AreaHistory;