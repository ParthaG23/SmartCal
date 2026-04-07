import { Routes, Route } from "react-router-dom";

import Home           from "../pages/Home";
import CalculatorPage from "../pages/CalculatorPage";
import Categories     from "../pages/Categories";
import About          from "../pages/About";
import NotFound       from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                element={<Home />} />
      <Route path="/categories"      element={<Categories />} />
      <Route path="/calculator/:type" element={<CalculatorPage />} />
      <Route path="/about"           element={<About />} />
      <Route path="*"                element={<NotFound />} />
    </Routes>
  );
}