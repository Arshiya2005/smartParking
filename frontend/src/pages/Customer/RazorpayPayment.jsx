import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const RazorpayPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const price = state?.price;
  const bookingId = state?.bookingId;

  // Debug logs
  useEffect(() => {
    console.log("🔍 Razorpay Payment Page:");
    console.log("Price (₹):", price);
    console.log("Booking ID:", bookingId);
  }, [price, bookingId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-script';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!price || !bookingId) {
      alert("Missing payment details");
      return;
    }

    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create Razorpay Order
      const orderRes = await fetch("http://localhost:3000/createOrder", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price }), // in ₹
      });

      const result = await orderRes.json();
      const order = result?.data;

      if (!order?.id) {
        throw new Error("Invalid Razorpay order");
      }

      console.log("✅ Razorpay Order Created:", order);

      // Step 2: Open Razorpay Checkout
      const options = {
        key: 'rzp_test_cou9d0vpO2wfAS', // 🔐 Replace with live key in production
        amount: order.amount,           // in paise
        currency: order.currency,
        name: "Smart Parking",
        description: "Parking Fee",
        order_id: order.id,
        handler: async function (response) {
          console.log("💸 Razorpay Response:", response);
          try {
            // Step 3: Verify Payment
            const verifyRes = await fetch("http://localhost:3000/verifyPayment", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...response,
    id: bookingId,
    amount: order?.amount || Math.round(price * 100), // ✅ Fallback ensures safety
  }),
});

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              alert(verifyData.message || "Payment successful!");
              navigate("/customer");
            } else {
              alert(verifyData.message || "Payment verification failed.");
            }
          } catch (err) {
            console.error("❌ Verification Error:", err);
            alert("Verification failed. Try again.");
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
      console.error("❌ Razorpay Error:", err);
      alert("Something went wrong during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Pay Parking Fee</h2>
      <p className="mb-4">Amount to pay: ₹{price}</p>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default RazorpayPayment;