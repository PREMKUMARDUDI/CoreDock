import { createContext, useState, useEffect } from "react";
import { clientServer } from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Existing Login
  const login = async (email, password) => {
    const res = await clientServer.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  // --- NEW: Register Function ---
  const registerUser = async (username, email, password) => {
    const res = await clientServer.post("/auth/register", {
      username,
      email,
      password,
    });

    // Immediately save token and set user state
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, registerUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
