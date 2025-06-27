import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";

const PaymentsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Pull individual fields
  const slot = state?.data?.slot;
  const vehicle = state?.data?.vehicle;
  const owner = state?.data?.owner;
  const chosenSlotNo = state?.data?.chosenSlotNo;
  const sTime = state?.data?.sTime;
  const eTime = state?.data?.eTime;
  const price = state?.data?.price;

  // Optional unified booking object for convenience
  const booking = { slot, vehicle, owner, chosenSlotNo };

  // Debug logs
  useEffect(() => {
    console.log("DEBUG: slot", slot);
    console.log("DEBUG: vehicle", vehicle);
    console.log("DEBUG: owner", owner);
    console.log("DEBUG: chosenSlotNo", chosenSlotNo);
    console.log("DEBUG: sTime", sTime);
    console.log("DEBUG: eTime", eTime);
    console.log("DEBUG: price", price);
  }, []);

  const handlePayment = async () => {
    if (!slot || !vehicle || !owner || !chosenSlotNo || !sTime || !eTime || !price) {
      alert("Booking details missing. Please try again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/customer/addbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          slot: { ...slot, sTime, eTime },
          vehicle,
          owner,
          chosenSlotNo,
        }),
      });

      if (res.ok) {
        alert("Payment successful! Booking confirmed.");
        navigate("/customer");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
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






// import React, { useState } from 'react';

// const RazorpayPayment = () => {
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Load Razorpay script only once
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (document.getElementById('razorpay-script')) {
//         return resolve(true); // already loaded
//       }
//       const script = document.createElement('script');
//       script.id = 'razorpay-script';
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     if (!amount || Number(amount) <= 0) {
//       alert("Please enter a valid amount");
//       return;
//     }

//     setLoading(true);
//     const scriptLoaded = await loadRazorpayScript();

//     if (!scriptLoaded) {
//       alert('Razorpay SDK failed to load.');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Step 1: Create order (BACKEND)
//       const orderRes = await fetch('http://localhost:3000/createOrder', {
//         method: 'POST',
//         credentials: 'include', // if cookies/session are used
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount }),
//       });

//       const { data: order } = await orderRes.json();

//       // Step 2: Open Razorpay Checkout
//       const options = {
//         key: 'rzp_test_5kphcQVXOO4cL6', // Replace with your Razorpay test key
//         amount: order.amount,
//         currency: order.currency,
//         name: 'Smart Parking',
//         description: 'Parking Fee Payment',
//         order_id: order.id,
//         handler: async function (response) {
//           // Step 3: Verify Payment (BACKEND)
//           const verificationRes = await fetch('http://localhost:3000/verifyPayment', {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(response),
//           });

//           const result = await verificationRes.json();
//           if (verificationRes.ok) {
//             alert(result.message || 'Payment Successful');
//             // Optional: Redirect to bookings/history
//           } else {
//             alert(result.message || 'Payment Verification Failed');
//           }
//         },
//         prefill: {
//           name: 'Test User',
//           email: 'test@example.com',
//           contact: '9999999999',
//         },
//         theme: {
//           color: '#0d9488',
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert('Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-4">Pay Parking Fee</h2>
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Enter amount"
//         className="w-full p-2 border rounded mb-4"
//       />
//       <button
//         onClick={handlePayment}
//         disabled={loading}
//         className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full"
//       >
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>
//     </div>
//   );
// };

// export default RazorpayPayment;