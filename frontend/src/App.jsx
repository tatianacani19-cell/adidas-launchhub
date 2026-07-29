import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Launches from "./pages/Launches";
import CreateLaunch from "./pages/CreateLaunch";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import EditLaunch from "./pages/EditLaunch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/launches" element={<Launches />} />

        <Route path="/launches/create" element={<CreateLaunch />} />

        <Route path="/calendar" element={<Calendar />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/launches/edit/:id" element={<EditLaunch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;