import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
          navigate("/inicio", { replace: true });
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
    <div className="d-flex fade-in" style={{ minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      {/* Área izquierda - Hero Section */}
      <div 
        className="d-none d-md-flex align-items-center justify-content-center flex-column p-5"
        style={{ 
          width: '55%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-20%', left: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%', right: '-10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }} />
        
        <div className="text-white position-relative z-1" style={{ maxWidth: '600px' }}>
          <h1 className="display-3 fw-bold mb-4" style={{
            background: 'linear-gradient(to right, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>SEGED</h1>
          <h2 className="h3 mb-4 fw-light text-white">El futuro de la gestión empresarial</h2>
          <p className="lead mb-4" style={{ color: 'var(--text-muted)' }}>
            La solución perfecta para microempresas que buscan optimizar 
            el control de sus ventas de manera simple, eficiente y elegante.
          </p>
          <div className="d-flex gap-3 mt-5">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-primary"></i>
              <span>Ventas Rápidas</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-primary"></i>
              <span>Inventario Real</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-primary"></i>
              <span>Analíticas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área derecha - Login Form */}
      <div className="d-flex align-items-center justify-content-center p-4" style={{ width: '100%', flex: 1, zIndex: 1 }}>
        <div className="w-100" style={{ maxWidth: '420px' }}>
          <div className="card shadow-lg border-0 p-4" style={{ background: 'rgba(30, 41, 59, 0.8)' }}>
            <div className="card-body">
              <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <i className="bi bi-person-circle fs-1 text-primary"></i>
                </div>
                <h3 className="fw-bold mb-1">Bienvenido de nuevo</h3>
                <p className="text-muted">Ingresa tus credenciales para continuar</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label text-muted small fw-bold text-uppercase">Usuario</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
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
                      style={{ boxShadow: 'none' }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-muted small fw-bold text-uppercase">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
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
                      style={{ boxShadow: 'none' }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 border-0" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100 py-2 mt-2" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Ingresando...</>
                  ) : "Iniciar Sesión"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

