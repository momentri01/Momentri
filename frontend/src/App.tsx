import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PublicEvent from './pages/PublicEvent';
import ManageEvent from './pages/ManageEvent';
import AdminDashboard from './pages/AdminDashboard';
import Pricing from './pages/Pricing';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Remaining placeholder components
const Settings = () => <div className="p-8">Settings</div>;
const NotFound = () => <div className="p-8">404 - Page Not Found</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="manage-event" element={<ManageEvent />} />
          <Route path="public-event/:id" element={<PublicEvent />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
