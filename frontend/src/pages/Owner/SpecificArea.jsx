import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SpecificArea = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const area = location.state?.area;

  const [bikeData, setBikeData] = useState({ occ: 0, bike: 0 });
  const [carData, setCarData] = useState({ occ: 0, car: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!area) return;

    const fetchSlotData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/availableSlot?area=${encodeURIComponent(
            JSON.stringify(area)
          )}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setBikeData(data.bikedata);
          setCarData(data.cardata);
        }
      } catch (err) {
        console.error("Error fetching slot data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlotData();
  }, [area]);

  const chartData = [
    {
      type: "Bike",
      Empty: bikeData.bike - bikeData.occ,
      Occupied: bikeData.occ,
    },
    {
      type: "Car",
      Empty: carData.car - carData.occ,
      Occupied: carData.occ,
    },
  ];

  if (!area) return <p>No area data found.</p>;

  return (
    <div className="p-4 d-flex flex-column align-items-center gap-4">
      <h2 className="mb-3 text-center">Slot Usage - {area.name}</h2>

      {loading ? (
        <p>Loading slot availability...</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Empty" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Occupied" stackId="a" fill="#ff6f61" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/owner/areaActiveBookings", { state: { area } })
          }
        >
          Active Bookings
        </button>
        <button className="btn btn-outline-secondary" disabled>
          Change Slot Count (Coming Soon)
        </button>
        <button className="btn btn-danger" disabled>
          Delete Area (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default SpecificArea;