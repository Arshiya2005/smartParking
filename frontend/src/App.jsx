import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginUser from './pages/LoginUser';
import SignUpUser from './pages/SignUpUser';
import CustomerHome from './pages/Customer/CustomerHome';
import OwnerHome from './pages/Owner/OwnerHome';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/signup" element={<SignUpUser />} />
      <Route path ="/customer" element={<CustomerHome/>}/>
      <Route path ="/customer" element={<OwnerHome/>}/>
    </Routes>
  );
}

export default App;