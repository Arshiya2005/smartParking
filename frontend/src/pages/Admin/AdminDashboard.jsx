import React from "react";
import AdminNavBar from "../../components/admin/AdminNavBar";
import StatsCard from "../../components/admin/StatsCard";
import OwnerManageCard from "../../components/admin/OwnerManageCard";
import CustomerManageCard from "../../components/admin/CustomerManageCard";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import green from "../../assets/green_back.jpg";

const AdminDashboard = () => {
  useAuthRedirect("admin");

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${green})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <AdminNavBar />

        <div className="container py-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.00)", borderRadius: "12px" }}>
          <h2 className="mb-4">Welcome, Admin 👋</h2>

          {/* Stats section */}
          <div className="row mb-4">
            <div className="col-12">
              <StatsCard />
            </div>
          </div>

          {/* Management cards */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <OwnerManageCard />
            </div>
            <div className="col-md-6 mb-3">
              <CustomerManageCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;