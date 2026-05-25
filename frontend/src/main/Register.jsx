import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const logoGrande = new URL("/logoGrande.jpeg", import.meta.url).href;

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });
  const [roles, setRoles] = useState(["USER"]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleRole = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess(false);

    if (!form.username.trim()) return setErr("El usuario es obligatorio.");
    if (form.password !== form.confirm) return setErr("Las contraseñas no coinciden.");
    if (roles.length === 0) return setErr("Selecciona al menos un rol.");

    setLoading(true);
    try {
      await register(form.username, form.password, roles);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { message: "Registro exitoso. Por favor inicia sesión." },
        });
      }, 2000);
    } catch (e) {
      console.error("Error en registro:", e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo registrar. Intenta de nuevo.";
      setErr(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-left {
          width: 55%;
        }

        .register-right {
          width: 45%;
          min-width: 380px;
        }

        .register-page {
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(90deg, #0b1020 0%, #10162b 100%);
        }

        .register-input,
        .register-input:focus {
          background: rgba(255,255,255,0.03) !important;
          border-color: rgba(255,255,255,0.08) !important;
          color: #fff !important;
          box-shadow: none !important;
        }

        .register-input::placeholder {
          color: rgba(255,255,255,0.45);
        }

        .register-addon {
          background: rgba(255,255,255,0.03) !important;
          border-color: rgba(255,255,255,0.08) !important;
          color: rgba(255,255,255,0.7) !important;
        }

        .register-card {
          background: rgba(20, 28, 48, 0.92);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 22px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }

        .register-check .form-check-input {
          background-color: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.18);
        }

        .register-check .form-check-input:checked {
          background-color: #5b4bff;
          border-color: #5b4bff;
        }

        .register-check .form-check-label {
          color: rgba(255,255,255,0.82);
        }

        .register-link {
          color: #8b5cf6;
          text-decoration: none;
        }

        .register-link:hover {
          color: #a78bfa;
          text-decoration: underline;
        }

        @media (max-width: 767px) {
          .register-left {
            display: none !important;
          }

          .register-right {
            width: 100% !important;
            min-width: 100% !important;
          }

          .register-page {
            height: auto;
            min-height: 100vh;
            overflow: auto;
          }
        }
      `}</style>

      <div className="d-flex register-page">
        {/* Panel izquierdo */}
        <div
          className="register-left d-none d-md-flex align-items-center justify-content-center position-relative"
          style={{
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
            alt="Imagen lateral del registro"
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
          className="register-right d-flex align-items-center justify-content-center p-4"
          style={{
            height: "100vh",
            overflowY: "auto",
            background: "linear-gradient(180deg, #0b1020 0%, #10162b 100%)",
          }}
        >
          <div className="w-100" style={{ maxWidth: "420px" }}>
            <div className="card register-card border-0">
              <div className="card-body p-4 p-lg-5">
                <h2
                  className="text-center mb-3 fw-bold text-white"
                  style={{ fontSize: "2rem" }}
                >
                  Crear cuenta
                </h2>

                <p
                  className="text-center mb-4"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem" }}
                >
                  Registra tus datos para acceder al sistema
                </p>

                {err && (
                  <div
                    className="alert py-2 border-0"
                    style={{
                      background: "rgba(239, 68, 68, 0.12)",
                      color: "#ff6b6b",
                    }}
                  >
                    {err}
                  </div>
                )}

                {success && (
                  <div
                    className="alert py-2 border-0"
                    style={{
                      background: "rgba(34, 197, 94, 0.12)",
                      color: "#4ade80",
                    }}
                  >
                    ✅ Registro exitoso. Redirigiendo al login...
                  </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-3">
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
                    <input
                      id="username"
                      name="username"
                      className="form-control register-input"
                      value={form.username}
                      onChange={onChange}
                      autoComplete="username"
                      disabled={loading}
                      required
                      style={{ height: "52px" }}
                      placeholder="Ingresa tu usuario"
                    />
                  </div>

                  <div className="mb-3">
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
                      <input
                        type={showPass ? "text" : "password"}
                        id="password"
                        name="password"
                        className="form-control register-input"
                        value={form.password}
                        onChange={onChange}
                        autoComplete="new-password"
                        disabled={loading}
                        required
                        style={{ height: "52px" }}
                        placeholder="Ingresa tu contraseña"
                      />
                      <button
                        type="button"
                        className="btn register-addon"
                        onClick={() => setShowPass((s) => !s)}
                        tabIndex={-1}
                        disabled={loading}
                      >
                        {showPass ? "Ocultar" : "Ver"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="confirm"
                      className="form-label small fw-bold text-uppercase"
                      style={{
                        color: "rgba(255,255,255,0.68)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Confirmar contraseña
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      id="confirm"
                      name="confirm"
                      className="form-control register-input"
                      value={form.confirm}
                      onChange={onChange}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                      style={{ height: "52px" }}
                      placeholder="Confirma tu contraseña"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label small fw-bold text-uppercase"
                      style={{
                        color: "rgba(255,255,255,0.68)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Roles
                    </label>

                    <div className="form-check register-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="role-user"
                        checked={roles.includes("USER")}
                        onChange={() => toggleRole("USER")}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="role-user">
                        USER
                      </label>
                    </div>

                    <div className="form-check register-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="role-admin"
                        checked={roles.includes("ADMIN")}
                        onChange={() => toggleRole("ADMIN")}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="role-admin">
                        ADMIN
                      </label>
                    </div>

                    <small style={{ color: "rgba(255,255,255,0.45)" }}>
                      Selecciona al menos un rol.
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-3 mt-2 text-white fw-semibold"
                    disabled={loading || success}
                    style={{
                      border: "none",
                      borderRadius: "14px",
                      background: "linear-gradient(90deg, #5b4bff 0%, #8b5cf6 100%)",
                      boxShadow: "0 10px 30px rgba(91,75,255,0.35)",
                      fontSize: "1.05rem",
                    }}
                  >
                    {loading
                      ? "Creando cuenta..."
                      : success
                      ? "✓ Cuenta creada"
                      : "Crear cuenta"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small style={{ color: "rgba(255,255,255,0.65)" }}>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="register-link">
                      Inicia sesión
                    </Link>
                  </small>
                </div>
              </div>
            </div>

            <p
              className="text-center mt-3 mb-0"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
            >
              Al registrarte aceptas los términos y condiciones.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}