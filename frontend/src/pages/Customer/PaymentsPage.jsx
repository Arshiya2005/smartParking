import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const PaymentsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const slot = state?.data?.slot;
  const vehicle = state?.data?.vehicle;
  const owner = state?.data?.owner;
  const chosenSlotNo = state?.data?.chosenSlotNo;
  const sTime = state?.data?.sTime;
  const eTime = state?.data?.eTime;
  const price = state?.data?.price;

  const bookingDetails = {
    slot: { ...slot, sTime, eTime },
    vehicle,
    owner,
    chosenSlotNo,
  };

  useEffect(() => {
    console.log("🧾 Booking Details:");
    console.log("slot:", slot);
    console.log("vehicle:", vehicle);
    console.log("owner:", owner);
    console.log("chosenSlotNo:", chosenSlotNo);
    console.log("sTime:", sTime);
    console.log("eTime:", eTime);
    console.log("price:", price);
  }, []);

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:3000/customer/addbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bookingDetails),
      });

      const result = await res.json();
console.log("Booking API Response:", result.id); // Add this to debug

if (res.ok && result.bookingId) {
  navigate("/customer/razorpay", {
    state: {
      slot,
      vehicle,
      owner,
      chosenSlotNo,
      sTime,
      eTime,
      price,
      bookingId: result.bookingId, // ✅ Use it
    },
  });
}

      let bookingId =
        result.bookingId || result.id || result.data?.id || result.data?.bookingId;

      if (res.ok && bookingId) {
        navigate("/customer/razorpay", {
          state: {
            slot,
            vehicle,
            owner,
            chosenSlotNo,
            sTime,
            eTime,
            price,
            bookingId, // ✅ MUST pass this to payment page
          },
        });
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavBarCustomer />
      <div className="container py-5">
        <h2 className="mb-4">Payment</h2>

        <div className="card shadow p-4" style={{ borderRadius: "12px" }}>
          <p className="fs-5 mb-3">
            Please click below to complete the payment of <strong>₹{price}</strong>
          </p>

          <button className="btn btn-success" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;