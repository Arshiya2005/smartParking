import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OwnerHome = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log(data);
        if (!res.ok || data.type !== "owner") {
          navigate("/login?type=owner");
        }
      } catch (err) {
        console.log("reached here");
        console.error("Error verifying user:", err);
        navigate("/login?type=owner");
      }
    };

    checkAuth();
  }, [navigate]);
  return (
    <div>
      HI ! FROM OWNER HOME
    </div>
  )
}

export default OwnerHome
