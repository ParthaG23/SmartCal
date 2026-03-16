import { BrowserRouter } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

import ThemeProvider from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
return ( <ThemeProvider> <AuthProvider> <BrowserRouter>

      <div className="
        min-h-screen
        bg-gray-100
        dark:bg-black
        text-black
        dark:text-white
        transition-colors
        duration-300
      ">

        <Navbar />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          <AppRoutes />
        </motion.main>

      </div>

    </BrowserRouter>
  </AuthProvider>
</ThemeProvider>


);
}

export default App;
