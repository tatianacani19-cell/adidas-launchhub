import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/launches" element={<Launches />} />
          <Route path="/launches/create" element={<CreateLaunch />} />
          <Route path="/launches/edit/:id" element={<EditLaunch />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;