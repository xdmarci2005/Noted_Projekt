import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  login: (role: string) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: {children: any}) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage (if exists) on page refresh
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (role:any) => {
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
