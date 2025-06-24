import React, { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarCustomer from "../../components/NavBarCustomer";
import WlcCardCustomer from "../../components/WlcCardCustomer";
import CardActive from "../../components/cardActive";
import CardBookNow from "../../components/cardBookNow";
import peaach from "../../assets/green_back.jpg";
import socket from "../../socket";

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
  
        console.log("👀 User received from /customer/welcome:", user);
  
        // More reliable check with debug
        if (response.ok) {
          if (!user) {
            console.warn("❌ No user object found in response");
            return;
          }
  
          if (user.type !== "customer") {
            console.warn("⚠️ User is not a customer. type =", user.type);
            return;
          }
  
          if (!user.id && !user._id) {
            console.warn("❌ No user ID found");
            return;
          }
  
          const id = user.id;
          setUserId(id);
  
          socket.connect();
          socket.emit("register-user", id);
  
          console.log("✅ Socket.IO connected and registered user:", id);
          alert("✅ Socket.IO connected for user: " + id);
          
        } else {
          console.warn("❌ /welcome response not OK:", response.status);
        }
      } catch (err) {
        console.error("🚨 Exception in fetchUserAndConnectSocket:", err);
        alert("❌ Failed to fetch user data.");
      }
    };
  
    fetchUserAndConnectSocket();
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