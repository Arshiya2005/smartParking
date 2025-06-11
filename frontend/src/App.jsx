import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginUser from './pages/LoginUser';
import SignUpUser from './pages/SignUpUser';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/signup" element={<SignUpUser />} />
    </Routes>
  );
}

export default App;