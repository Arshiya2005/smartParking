import React from 'react';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import NavBarCustomer from '../../components/NavBarCustomer';

const MyActiveBookings = () => {
  useAuthRedirect("customer"); 

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      
      <div className="container py-4">
        <h2 className="mb-4">My Active Bookings</h2>
        {/* Add your booking cards or messages here */}
        <p>You currently have no active bookings.</p>
      </div>
    </div>
  );
};

export default MyActiveBookings;