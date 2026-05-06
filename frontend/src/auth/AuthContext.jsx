import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(token ? { username: "usuario" } : null);
  }, [token]);

  const login = async (username, password) => {
    const { data } = await api.post("/api/auth/login", { username, password });
    sessionStorage.setItem("token", data.token);
    setToken(data.token);
    return data.token;
  };

  const register = async (username, password, roles = ["USER"]) => {
    // Solo registrar, NO guardar token
    const { data } = await api.post("/api/auth/register", {
      username,
      password,
      roles,
    });
    
    // NO guardar token ni actualizar estado
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (_) {
      // Ignorar errores de logout
    }

    sessionStorage.removeItem("token");
    setToken(null);

    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
