import React, { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarCustomer from "../../components/NavBarCustomer";
import WlcCardCustomer from "../../components/WlcCardCustomer";
import CardActive from "../../components/cardActive";
import CardBookNow from "../../components/cardBookNow";
import peaach from "../../assets/green_back.jpg";
import socket from "../../socket";
import { toast } from "react-toastify";

const CustomerHome = () => {
  useAuthRedirect("customer");

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserAndConnectSocket = async () => {
      try {
        const response = await fetch("http://localhost:3000/customer/welcome", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
        const user = result?.data;

        if (response.ok && user?.type === "customer" && (user.id || user._id)) {
          const id = user.id || user._id;
          setUserId(id);

          socket.connect();
          socket.emit("register-user", id);

          console.log("✅ Socket.IO connected and registered user:", id);

          // Listen for reminder event
          socket.on("booking-reminder", (data) => {
            console.log("📦 Booking reminder received:", data);
          
            // Just show the message directly (it already includes the time)
            if (data?.message) {
              toast.info(data.message); // ✅ Shows: "Your parking starts at 14:00"
            } else {
              toast.info("🚗 Your parking is starting soon!");
            }
          });
        } else {
          console.warn("⚠️ User not authorized or not a customer.");
        }
      } catch (err) {
        console.error("❌ Error in fetchUserAndConnectSocket:", err);
      }
    };

    fetchUserAndConnectSocket();

    return () => {
      socket.disconnect();
      console.log("🛑 Socket.IO disconnected from CustomerHome");

      socket.off("booking-reminder");
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${peaach})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBarCustomer />
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <WlcCardCustomer />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <CardActive />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <CardBookNow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;