import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import LoginUser from './pages/LoginUser';
import SignUpUser from './pages/SignUpUser';
import CustomerHome from './pages/Customer/CustomerHome';
import CustomerProfile from './pages/Customer/CustomerProfile';
import MakeNewBooking from './pages/Customer/MakeNewBooking';
import MyActiveBookings from './pages/Customer/MyActiveBookings';
import CustomerInfo from './pages/Customer/CustomerInfo';
import CustomerNotifications from './pages/Customer/CustomerNotifications';
import CustomerHistory from './pages/Customer/CustomerHistory';
import CustomerVehicles from './pages/Customer/CustomerVehicles';
import OwnerHome from './pages/Owner/OwnerHome';
import BookingForm from './pages/Customer/BookingForm';
import NearbySpots from "./pages/Customer/NearbySpots";
import NearbyMap from './components/NearbyMap';
import ConfirmBooking from './pages/Customer/confirmBooking';
import ChooseSlot from './pages/Customer/ChooseSlot';
import PaymentsPage from './pages/Customer/PaymentsPage';
import BookingDetails from './pages/Customer/BookingDetails';
import CancelBooking from './pages/Customer/CancelBooking';
import HistoryBookingDetails from './pages/Customer/historyBookingDetails';
import BookingReminderListener from './components/BookingReminderListener';
import OwnerProfile from './pages/Owner/OwnerProfile';
import OwnerHistory from './pages/Owner/OwnerHistory';
import OwnerNotifications from './pages/Owner/OwnerNotifications';
import OwnerInfo from './pages/Owner/OwnerInfo';
import AddArea from './pages/Owner/AddArea';
import MyArea from './pages/Owner/MyArea';
import AreaDetails from './pages/Owner/AreaDetails';
// 🧠 Custom util to fetch current user from backend
async function getCurrentUser() {
  try {
    const res = await fetch("http://localhost:5000/me", {
      credentials: "include",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  return (
    <>
      {userId && <BookingReminderListener userId={userId} />}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/signup" element={<SignUpUser />} />
        <Route path="/customer" element={<CustomerHome />} />
        
        <Route path="/customer/profile" element={<CustomerProfile />}>
          <Route index element={<CustomerInfo />} />
          <Route path="info" element={<CustomerInfo />} />
          <Route path="history" element={<CustomerHistory />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="vehicles" element={<CustomerVehicles />} />
          <Route path="historydetails" element={<HistoryBookingDetails />} />
        </Route>
        <Route path="/customer/activebookings" element={<MyActiveBookings />} />
        <Route path="/customer/newbooking" element={<MakeNewBooking />} />
        <Route path="/customer/nearby" element={<NearbySpots />} />
        <Route path="/customer/chooseslot" element={<ChooseSlot />} />
        <Route path="/customer/confirm" element={<ConfirmBooking />} />
        <Route path="/customer/pay" element={<PaymentsPage />} />
        <Route path="/customer/bookingdetails" element={<BookingDetails />} />
        <Route path="customer/cancelBooking" element={<CancelBooking />} />
       
        <Route path="/owner" element={<OwnerHome />} />
      <Route path="/owner/profile" element={<OwnerProfile />}>
          <Route index element={<OwnerInfo />} />
          <Route path="info" element={<OwnerInfo />} />
          <Route path="history" element={<OwnerHistory />} />
          <Route path="notifications" element={<OwnerNotifications />} />
        </Route>
        <Route path="/owner/addarea" element={<AddArea/>}></Route>
        <Route path="/owner/myarea" element={<MyArea/>}></Route>
        <Route path="/owner/areaDetails" element={<AreaDetails />} />
      </Routes>
     
      
      
    </>
  );
}

export default App;