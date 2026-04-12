import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ModuleHub from "./pages/ModuleHub";
import ModuleDetail from "./pages/ModuleDetail";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/customer/Dashboard";
import Plans from "./pages/customer/Plans";
import Claims from "./pages/customer/Claims";
import BuyPolicy from "./pages/customer/BuyPolicy";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClaimsManagement from "./pages/admin/ClaimsManagement";
import UserManagement from "./pages/admin/UserManagement";
import DoctorClaimCheck from "./pages/doctor/DoctorClaimCheck";
import HospitalClaimApply from "./pages/hospital/HospitalClaimApply";
import HospitalSearch from "./pages/customer/HospitalSearch";
import HospitalManagement from "./pages/admin/HospitalManagement";
import UnderwritingMgmtView from "./components/modules/UnderwritingMgmtView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/modules" element={<ModuleHub />} />
        <Route path="/modules/:moduleId" element={<ModuleDetail />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/buy" element={<BuyPolicy />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/hospitals" element={<HospitalSearch />} />

        <Route path="/doctor" element={<DoctorClaimCheck />} />
        <Route path="/hospital" element={<HospitalClaimApply />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/claims" element={<ClaimsManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/hospitals" element={<HospitalManagement />} />
        <Route path="/underwriting" element={<UnderwritingMgmtView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
