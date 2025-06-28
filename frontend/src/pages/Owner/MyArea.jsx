import React, { useEffect, useState } from "react";
import AreaCard from "../../components/owner/AreaCard";
import greenBg from "../../assets/green_back.jpg"
import NavBarOwner from "../../components/owner/NavBarOwner";
const MyArea = () => {
  useAuthRedirect("owner");
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("http://localhost:3000/owner/parkingAreas", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setAreas(data.data || []);
        } else {
          setError(data.error || "Failed to fetch areas");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Internal error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  return (
    <>
    <NavBarOwner/>
    <div
      className="py-5"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${greenBg})`, 
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div
        className="container p-4 shadow rounded-4"
        style={{
          backgroundColor: "#ffffff", // white card wrapper
          maxWidth: "1300px",
        }}
      >
        <h2 className="text-center mb-4">My Parking Areas</h2>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {!loading && !error && areas.length === 0 && (
          <div className="text-center text-muted">No areas added yet.</div>
        )}

        <div className="d-flex flex-column gap-3">
          {areas.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </div>
    </div>
    </>
    
  );
};

export default MyArea;