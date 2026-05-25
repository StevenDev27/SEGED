import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const logoGrande = new URL("/logoGrande.jpeg", import.meta.url).href;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = await login(username, password);

      if (token) {
        setTimeout(() => {
          navigate("/clientes", { replace: true });
        }, 100);
      } else {
        setError("Error de autenticación");
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Usuario o contraseña inválidos";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex fade-in"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(90deg, #0b1020 0%, #10162b 100%)",
      }}
    >
      {/* Panel izquierdo */}
      <div
        className="d-none d-md-flex align-items-center justify-content-center position-relative"
        style={{
          width: "55%",
          height: "100vh",
          overflow: "hidden",
          background: "#0b1020",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(6,8,24,0.45), rgba(59,130,246,0.05))",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <img
          src={logoGrande}
          alt="Imagen lateral del login"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
            position: "relative",
            zIndex: 0,
          }}
        />
      </div>

      {/* Panel derecho */}
      <div
        className="d-flex align-items-center justify-content-center p-4"
        style={{
          width: "45%",
          minWidth: "380px",
          height: "100vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #0b1020 0%, #10162b 100%)",
        }}
      >
        <div className="w-100" style={{ maxWidth: "420px" }}>
          <div
            className="card shadow-lg border-0"
            style={{
              background: "rgba(20, 28, 48, 0.92)",
              borderRadius: "22px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="text-center mb-5">
                <h3
                  className="fw-bold mb-2 text-white"
                  style={{ fontSize: "2rem" }}
                >
                  Bienvenido de nuevo
                </h3>
                <p
                  className="mb-0"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem" }}
                >
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="form-label small fw-bold text-uppercase"
                    style={{
                      color: "rgba(255,255,255,0.68)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Usuario
                  </label>

                  <div className="input-group">
                    <span
                      className="input-group-text bg-transparent border-end-0"
                      style={{
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.55)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <i className="bi bi-person"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      id="username"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      required
                      disabled={loading}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#fff",
                        boxShadow: "none",
                        height: "52px",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="form-label small fw-bold text-uppercase"
                    style={{
                      color: "rgba(255,255,255,0.68)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Contraseña
                  </label>

                  <div className="input-group">
                    <span
                      className="input-group-text bg-transparent border-end-0"
                      style={{
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.55)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <i className="bi bi-lock"></i>
                    </span>

                    <input
                      type="password"
                      className="form-control border-start-0 ps-0"
                      id="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#fff",
                        boxShadow: "none",
                        height: "52px",
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className="alert alert-danger py-2 border-0"
                    style={{
                      background: "rgba(239, 68, 68, 0.12)",
                      color: "#ff6b6b",
                    }}
                    role="alert"
                  >
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn w-100 py-3 mt-2 text-white fw-semibold"
                  disabled={loading}
                  style={{
                    border: "none",
                    borderRadius: "14px",
                    background: "linear-gradient(90deg, #5b4bff 0%, #8b5cf6 100%)",
                    boxShadow: "0 10px 30px rgba(91,75,255,0.35)",
                    fontSize: "1.05rem",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Ingresando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}