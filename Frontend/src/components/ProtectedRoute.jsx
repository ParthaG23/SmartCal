import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  /* ✅ Wait for AuthContext to restore user from localStorage.
     Without this, a page refresh briefly sees user=null and
     wrongly redirects logged-in users to /login.            */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
        bg-gray-50 dark:bg-[#0a0a0e]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2
            border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <p className="text-sm text-gray-400 dark:text-white/30">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  /* Not logged in → go to /login, remember where they came from */
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
