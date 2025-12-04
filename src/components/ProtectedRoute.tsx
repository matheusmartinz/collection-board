import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, authReady } = useAuth();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  // if (!isAuthenticated) {
  //   return null;
  // }

  if (!authReady) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
