import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Home           from "../pages/Home";
import CalculatorPage from "../pages/CalculatorPage";
import Categories     from "../pages/Categories";
import History        from "../pages/History";
import About          from "../pages/About";
import NotFound       from "../pages/NotFound";
import Login          from "../pages/Login";
import Signup         from "../pages/Signup";
import Profile        from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword"; // ✅ NEW

import ProtectedRoute from "../components/ProtectedRoute";

/* ── Redirect logged-in users away from auth pages ── */
function GuestOnly({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (user)    return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* ── Public ── */}
      <Route path="/"      element={<Home />} />
      <Route path="/about" element={<About />} />

      {/* ── Guest only ── */}
      <Route path="/login"  element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />

      {/* ── Forgot password (public, guest only) ── */}
      <Route path="/forgot-password" element={
        <GuestOnly><ForgotPassword /></GuestOnly>
      } />

      {/* ── Protected ── */}
      <Route path="/categories" element={
        <ProtectedRoute><Categories /></ProtectedRoute>
      }/>
      <Route path="/calculator/:type" element={
        <ProtectedRoute><CalculatorPage /></ProtectedRoute>
      }/>
      <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
      }/>
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      }/>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}