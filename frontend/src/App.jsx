import { Routes, Route } from 'react-router-dom';
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
import './index.css';
import ChooseSlot from './pages/Customer/ChooseSlot';
import PaymentsPage from './pages/Customer/PaymentsPage';
import BookingDetails from './pages/Customer/BookingDetails';
import CancelBooking from './pages/Customer/CancelBooking';
import HistoryBookingDetails from './pages/Customer/historyBookingDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/signup" element={<SignUpUser />} />
      <Route path ="/customer" element={<CustomerHome/>}/>
      <Route path ="/owner" element={<OwnerHome/>}/>
      <Route path="/customer/profile" element={<CustomerProfile />}>
  <Route index element={<CustomerInfo />} /> {/* Default */}
  <Route path="info" element={<CustomerInfo />} />
  <Route path="history" element={<CustomerHistory />} />
  <Route path="notifications" element={<CustomerNotifications />} />
  <Route path="vehicles" element={<CustomerVehicles />} />
  <Route path="historydetails" element={<HistoryBookingDetails/>}/>

</Route>
      <Route path = "/customer/activebookings" element={<MyActiveBookings/>}></Route>
      <Route path = "/customer/newbooking" element={<MakeNewBooking/>}></Route>
      <Route path = "/customer/nearby" element={<NearbySpots/>}></Route>
      <Route path = "/customer/chooseslot" element={<ChooseSlot/>}></Route>
      <Route path="/customer/confirm" element={<ConfirmBooking />} />
      <Route path="/customer/pay" element={<PaymentsPage />}></Route>
      <Route path="/customer/bookingdetails" element={<BookingDetails/>}></Route>
      <Route path="customer/cancelooking" element={<CancelBooking/>}></Route>
    </Routes>
    
  );
}

export default App;