import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {

  const theme = "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
  }, []);

  const toggleTheme = () => {}; // No-op since we are always in dark mode

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}