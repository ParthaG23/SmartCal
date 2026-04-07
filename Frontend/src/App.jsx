import { useState, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";

import ThemeProvider from "./context/ThemeContext";

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Animated Splash */}
        <AnimatePresence>
          {!splashDone && <SplashScreen onFinish={handleSplashFinish} />}
        </AnimatePresence>

        {/* Main App */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: splashDone ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="
            min-h-screen
            bg-gray-100
            dark:bg-black
            text-black
            dark:text-white
            transition-colors
            duration-300
          "
        >
          <Navbar />

          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <AppRoutes />
          </motion.main>
        </motion.div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

