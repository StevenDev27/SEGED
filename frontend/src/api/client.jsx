import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  withCredentials: false,
});

const LOGIN_PATH = "/";

const handleUnauthorized = () => {
  sessionStorage.removeItem("token");

  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH);
  } else {
    window.location.reload();
  }
};

// Interceptor de REQUEST: Agregar token automáticamente
api.interceptors.request.use((config) => {
  const t = sessionStorage.getItem("token");
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

// Interceptor de RESPONSE: Manejar 401 (excepto en auth)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // Solo redirigir al login si el 401 NO viene de endpoints de autenticación
    if (status === 401 && !url.includes("/api/auth/")) {
      console.log("⚠️ 401 detectado en endpoint protegido, cerrando sesión");
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;
