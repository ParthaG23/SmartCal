import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* Restore user on refresh */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /* Login — expects { token, id, name, email, picture? } */
  const login = (data) => {
    const userData = {
      id:      data.id,
      name:    data.name,
      email:   data.email,
      picture: data.picture || null,
      token:   data.token         // ✅ saved inside user object for api.js
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  /* Logout */
  const logout = () => {
    localStorage.removeItem("user");  // ✅ token is inside user, one removal is enough
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};