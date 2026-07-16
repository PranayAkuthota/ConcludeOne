import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import { GuestGuard } from "./components/auth/GuestGuard";
import { Layout } from "./components/layout/Layout";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import AgentsLibrary from "./pages/AgentsLibrary";
import KnowledgeCenter from "./pages/KnowledgeCenter";
import Approvals from "./pages/Approvals";
import Analytics from "./pages/Analytics";
import Memory from "./pages/Memory";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Guest Routes */}
          <Route element={<GuestGuard />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Authenticated Application Routes */}
          <Route element={<AuthGuard />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/agents" element={<AgentsLibrary />} />
              <Route path="/knowledge" element={<KnowledgeCenter />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              {/* Catch-all redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
