import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BrainCircuit } from "lucide-react";

export function GuestGuard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
        <BrainCircuit className="h-10 w-10 text-primary animate-pulse-slow mb-4" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
