import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CustomerHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || data.type !== "customer") {
          navigate("/login?type=customer");
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        navigate("/login?type=customer");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div>
      <h1>Welcome, to customer home !</h1>
      {/* Add your page content here */}
    </div>
  );
};

export default CustomerHome;
