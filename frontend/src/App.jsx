import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Launches = lazy(() => import("./pages/Launches"));
const CreateLaunch = lazy(() => import("./pages/CreateLaunch"));
const EditLaunch = lazy(() => import("./pages/EditLaunch"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Settings = lazy(() => import("./pages/Settings"));

function AppSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="skeleton skeleton-text" style={{ width: 120, height: 20 }} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppSpinner />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/launches" element={<ProtectedRoute><Launches /></ProtectedRoute>} />
          <Route path="/launches/create" element={<ProtectedRoute><CreateLaunch /></ProtectedRoute>} />
          <Route path="/launches/edit/:id" element={<ProtectedRoute><EditLaunch /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;