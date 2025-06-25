import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notifications", {
        withCredentials: true,
      });
      console.log(res.data);
      // ✅ Only set if the response is structured properly
      if (
        res.data &&
        typeof res.data === "object" &&
        Array.isArray(res.data.notifications)
      ) {
        setNotifications(res.data.notifications);
      } else {
        console.warn("Unexpected response format:", res.data);
        setNotifications([]); // prevent crash
      }
    } catch (err) {
      console.error("Failed to fetch owner notifications:", err);
      setNotifications([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Owner Notifications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : !Array.isArray(notifications) || notifications.length === 0 ? (
        <p className="text-muted">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 mb-3 rounded shadow-sm ${
              n.status === "unread" ? "bg-light border-start border-4 border-danger" : "bg-white"
            }`}
            style={{ borderLeftWidth: "5px" }}
          >
            <div className="fw-semibold">{n.message}</div>
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              {new Date(n.created_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerNotifications;