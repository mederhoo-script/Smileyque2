import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wraps a route so that only authenticated users can access it.
 * Unauthenticated visitors are redirected to /login with the original
 * destination saved in `state.from` so login can redirect back.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  // While Firebase is restoring the auth state, render nothing so we don't
  // flash the login page for an already-signed-in user.
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
