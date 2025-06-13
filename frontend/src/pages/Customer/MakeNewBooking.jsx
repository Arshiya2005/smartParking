import React from 'react';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import NavBarCustomer from '../../components/navCustomer';

const MakeNewBooking = () => {
  useAuthRedirect("customer"); 

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />

      <div className="container py-4">
        <h2 className="mb-4">Make a New Booking</h2>
        <p>You are on the Make New Bookings page!</p>

        {/* Add your booking form or slot selection UI here */}
      </div>
    </div>
  );
};

export default MakeNewBooking;