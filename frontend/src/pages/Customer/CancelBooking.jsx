import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBarCustomer from "../../components/NavBarCustomer";
import useAuthRedirect from "../../hooks/useAuthRedirect";

const CancelBooking = () => {
  useAuthRedirect("customer");
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId;

  useEffect(() => {
    const cancelBooking = async () => {
      if (!bookingId) {
        toast.error("Booking ID not found.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/customer/cancelBooking?id=${bookingId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok) {
          toast.success(data.message || "Booking cancelled!");
          setTimeout(() => {
            navigate("/customer/activebookings");
          }, 2000);
        } else {
          toast.error(data.error || "Cancellation failed.");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    cancelBooking();
  }, [bookingId, navigate]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-5">
        <h3>Processing cancellation...</h3>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CancelBooking;