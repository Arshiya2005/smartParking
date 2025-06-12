import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CustomerHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify", {
          method: "GET",
          credentials: "include", // ✅ important for cookies/sessions
        });

        if (!res.ok) {
          // Not authenticated — redirect to login
          console.log("you are not authenticated !");
          navigate("/login?type=customer");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
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
