import React, { useEffect, useState } from "react";
import scooty from "../assets/girl_scooty.svg";

const WlcCardCustomer = () => {
  const [name, setName] = useState({ fname: "", lname: "" });

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await fetch("http://localhost:3000/customer/welcome", {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setName({ fname: data.fname, lname: data.lname });
        } else {
          console.error("Failed to fetch customer name.");
        }
      } catch (err) {
        console.error("Error fetching welcome info:", err);
      }
    };

    fetchWelcome();
  }, []);

  const displayName =
    name.fname.trim() || name.lname.trim()
      ? `${name.fname} ${name.lname}`
      : "Guest";

  return (
    <div
      className="card shadow-lg mb-4 p-4"
      style={{
        backgroundColor: "#F7FFF7",
        color: "#1B1B1E",
        borderRadius: "12px",
      }}
    >
      <div className="row align-items-center">
        {/* Image Column */}
        <div className="col-12 col-md-5 text-center mb-3 mb-md-0">
          <img
            src={scooty}
            alt="Scooty"
            style={{ maxHeight: "180px", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Text Column */}
        <div className="col-12 col-md-7 text-md-start text-center">
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
            Welcome, {displayName}!
          </h2>
          <p style={{ fontSize: "1.3rem", fontWeight: 500 }}>
            We're glad to have you back.
            <br />
            Ready to park smarter today?
          </p>
        </div>
      </div>
    </div>
  );
};

export default WlcCardCustomer;
