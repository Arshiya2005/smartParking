import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import CustProfileNav from "../../components/CustProfileNav";
import useBookingReminders from "../../hooks/useBookingReminders";

const CustomerProfile = () => {
  useAuthRedirect("customer");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/customer/welcome", {
          credentials: "include",
        });
        const result = await res.json();
        const user = result?.data;

        if (res.ok && user?.type === "customer") {
          const id = user.id || user._id;
          setUserId(id);
        }
      } catch (err) {
        console.error("❌ Error fetching user in CustomerProfile:", err);
      }
    };

    fetchUser();
  }, []);

  // ✅ This will activate reminder listeners
  useBookingReminders(userId);

  return (
    <div>
      <CustProfileNav />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerProfile;