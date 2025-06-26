import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";

const AdminProfile = () => {
  const navigate = useNavigate();

  const adminData = {
    name: "System Administrator",
    email: "admin@parksmart.com",
    role: "Admin",
    description:
      "The administrator has full access to user management, system analytics, and platform monitoring.",
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        alert("Logged out successfully.");
        navigate("/login?type=admin");
      } else {
        const data = await res.json();
        alert(data.error || "Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong during logout.");
    }
  };

  return (
    <>
    <AdminNavBar/>
    <div className="container mt-5">
      <div className="card shadow p-4 border-0" style={{ borderRadius: "16px" }}>
        <div className="d-flex flex-column align-items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
            alt="Admin Avatar"
            className="rounded-circle mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h4 className="fw-bold">{adminData.name}</h4>
          <p className="text-muted mb-1">{adminData.email}</p>
          <span className="badge bg-primary px-3 py-2 mb-3">{adminData.role}</span>

          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
            style={{ fontWeight: "500" }}
          >
            Logout
          </button>
        </div>

        <hr className="my-4" />

        <div>
          <h5 className="mb-2">About</h5>
          <p className="text-muted">{adminData.description}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminProfile;