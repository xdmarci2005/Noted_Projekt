import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage (if exists) on page refresh
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (role) => {
    const userData = { isAuthenticated: true, role };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ Save to localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ Clear localStorage on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
