import React from 'react';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import NavBarCustomer from '../../components/navCustomer';
import BookingForm from './BookingForm';

const MakeNewBooking = () => {
  useAuthRedirect("customer"); 

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />

      <div className="container py-4">
        <h2 className="mb-4">Make a New Booking</h2>
        <p>You are on the Make New Bookings page!</p>
        <BookingForm/>
      </div>
    </div>
  );
};

export default MakeNewBooking;