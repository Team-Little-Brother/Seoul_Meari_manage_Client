import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./components/layout/MainLayout";
import AiDiagnosisPage from "./pages/AiDiagnosisPage";
import DiagnosisDetailPage from "./pages/DiagnosisDetailPage";
import ArEchoManagementPage from "./pages/ArEchoManagementPage";
import ArEchoDetailPage from "./pages/ArEchoDetailPage";
import UserManagementPage from "./pages/UserManagementPage";
import UserDetailPage from "./pages/UserDetailPage";
import AdminPage from "./pages/AdminPage";
import VRContentsPage from './pages/VRContentsPage';

function App() {
  return (
// src/App.tsx
<Router>
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="ai-diagnosis" element={<AiDiagnosisPage />} />
      <Route path="ai-diagnosis/:id" element={<DiagnosisDetailPage />} />
      <Route path="ar-echo" element={<ArEchoManagementPage />} />
      <Route path="ar-echo/:id" element={<ArEchoDetailPage />} />
      <Route path="vr-contents" element={<VRContentsPage />} />
      <Route path="users" element={<UserManagementPage />} />
      <Route path="users/:id" element={<UserDetailPage />} />
      <Route path="admin" element={<AdminPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Router>
  );
}

export default App;
