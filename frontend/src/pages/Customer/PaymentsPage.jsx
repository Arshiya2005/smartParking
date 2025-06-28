import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const PaymentsPage = () => {
  useAuthRedirect("customer");
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      // Step 1: Book the slot
      const res = await fetch("http://localhost:3000/customer/addbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bookingDetails),
      });

      const result = await res.json();
      console.log("📦 Booking Response:", result);

      const bookingId =
        result.bookingId || result.id || result.data?.id || result.data?.bookingId;

      if (!res.ok || !bookingId) {
        alert("Booking failed. Please try again.");
        return;
      }

      // Step 2: Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      // Step 3: Create Razorpay Order
      const orderRes = await fetch("http://localhost:3000/createOrder", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price }),
      });

      const orderResult = await orderRes.json();
      const order = orderResult?.data;

      if (!order?.id) {
        throw new Error("Invalid Razorpay order");
      }

      console.log("✅ Razorpay Order Created:", order);

      // Step 4: Open Razorpay checkout
      const options = {
        key: "rzp_test_PfCHQfot63V69Z",
        amount: order.amount,
        currency: order.currency,
        name: "Smart Parking",
        description: "Parking Fee",
        order_id: order.id,
        handler: async function (response) {
          console.log("💸 Razorpay Response:", response);

          const verifyBody = {
            ...response,
            id: bookingId,
            amount: order.amount,
          };

          console.log("📬 Sending to verifyPayment:", verifyBody);

          const verifyRes = await fetch("http://localhost:3000/verifyPayment", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verifyBody),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            alert(verifyData.message || "Payment successful!");
            navigate("/customer");
          } else {
            alert(verifyData.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0d9488",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Something went wrong. Please try again.");
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