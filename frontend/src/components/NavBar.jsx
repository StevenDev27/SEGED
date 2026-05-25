import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; 

export function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg pt-2 navbar-dark mb-4 sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/ventas">
            Seged
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/clientes" className="nav-link">
                  Clientes
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/categorias" className="nav-link">
                  Categorías
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/proveedores" className="nav-link">
                  Proveedores
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ventas" className="nav-link">
                  Ventas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/inventario" className="nav-link">
                  Inventario
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/productos" className="nav-link">
                  Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/compras" className="nav-link">
                  Compras
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/predicciones" className="nav-link">
                  Predicciones
                </Link>
              </li>
              
            </ul>

            
            <button
              className="btn btn-outline-light ms-auto mt-2"
              onClick={() => setShowConfirm(true)}
            >
              <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {showConfirm && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar cierre de sesión</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas cerrar sesión?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Sí, cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
