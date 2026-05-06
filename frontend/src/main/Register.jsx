import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login", { 
          replace: true,
          state: { message: "Registro exitoso. Por favor inicia sesión." }
        });
      }, 2000);
      
    } catch (e) {
      console.error("Error en registro:", e);
      const msg = e?.response?.data?.message || e?.message || "No se pudo registrar. Intenta de nuevo.";
      setErr(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-left { width: 65%; }
        .register-right { width: 35%; }
        @media (max-width: 767px) {
          .register-left { display: none; }
          .register-right { width: 100%; }
        }
      `}</style>

      <div className="d-flex" style={{ minHeight: '100vh' }}>
        <div
          className="register-left"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.8) 0%, rgba(0, 0, 0, 0.7) 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="text-white px-5" style={{ maxWidth: '600px' }}>
              <h1 className="display-3 fw-bold mb-4">SEGED</h1>
              <h2 className="h3 mb-4">Sistema de Gestión de ventas</h2>
              <p className="lead mb-4">
                La solución perfecta para microempresas que buscan optimizar
                el control de su inventario de manera simple y eficiente.
              </p>
              <p className="text-white-50">
                Gestiona tus ventas de forma profesional sin complicaciones.
                SEGED te ayuda a tomar decisiones informadas sobre tu stock.
              </p>
            </div>
          </div>
        </div>

        <div className="register-right d-flex align-items-center justify-content-center p-4 bg-light">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            <div className="card shadow">
              <div className="card-body">
                <h2 className="text-center mb-3">Crear cuenta</h2>

                {err && <div className="alert alert-danger py-2">{err}</div>}
                {success && (
                  <div className="alert alert-success py-2">
                    ✅ Registro exitoso. Redirigiendo al login...
                  </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Usuario</label>
                    <input
                      id="username"
                      name="username"
                      className="form-control"
                      value={form.username}
                      onChange={onChange}
                      autoComplete="username"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="input-group">
                      <input
                        type={showPass ? "text" : "password"}
                        id="password"
                        name="password"
                        className="form-control"
                        value={form.password}
                        onChange={onChange}
                        autoComplete="new-password"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPass((s) => !s)}
                        tabIndex={-1}
                        disabled={loading}
                      >
                        {showPass ? "Ocultar" : "Ver"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirm" className="form-label">Confirmar contraseña</label>
                    <input
                      type={showPass ? "text" : "password"}
                      id="confirm"
                      name="confirm"
                      className="form-control"
                      value={form.confirm}
                      onChange={onChange}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Roles</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="role-user"
                        checked={roles.includes("USER")}
                        onChange={() => toggleRole("USER")}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="role-user">USER</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="role-admin"
                        checked={roles.includes("ADMIN")}
                        onChange={() => toggleRole("ADMIN")}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="role-admin">ADMIN</label>
                    </div>
                    <small className="text-muted">Selecciona al menos un rol.</small>
                  </div>

                  <button type="submit" className="btn btn-dark w-100" disabled={loading || success}>
                    {loading ? "Creando cuenta..." : success ? "✓ Cuenta creada" : "Crear cuenta"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                  </small>
                </div>
              </div>
            </div>

            <p className="text-muted text-center mt-3" style={{ fontSize: 12 }}>
              Al registrarte aceptas los términos y condiciones.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
