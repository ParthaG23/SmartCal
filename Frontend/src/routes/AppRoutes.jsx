import { Routes, Route } from "react-router-dom";

import Home           from "../pages/Home";
import CalculatorPage from "../pages/CalculatorPage";
import Categories     from "../pages/Categories";
import History        from "../pages/History";
import About          from "../pages/About";
import NotFound       from "../pages/NotFound";
import Login          from "../pages/Login";
import Signup         from "../pages/Signup";
import Profile        from "../pages/Profile";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/"                  element={<Home />} />
      <Route path="/calculator/:type"  element={<CalculatorPage />} />
      <Route path="/categories"        element={<Categories />} />
      <Route path="/about"             element={<About />} />

      {/* Auth */}
      <Route path="/login"             element={<Login />} />
      <Route path="/signup"            element={<Signup />} />

      {/* Protected */}
      <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}