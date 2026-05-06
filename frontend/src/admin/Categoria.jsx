import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCategoria } from "../hooks/useCategoria";

export function Categoria() {
  const { items, loading, error, createOne, removeOne, fetchAll } = useCategoria();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaCreacion: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const hasItems = useMemo(() => (items?.length ?? 0) > 0, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOne(formData);
      setFormData({
        nombre: "",
        descripcion: "",
        fechaCreacion: new Date().toISOString().split("T")[0],
      });
      setShowFormModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm("¿Eliminar esta categoría?")) {
      try {
        await removeOne(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Gestión de Categorías</h3>
            <div>
              <button className="btn btn-primary btn-sm me-2" onClick={() => setShowFormModal(true)}>
                <i className="bi bi-plus-circle"></i> Nueva Categoría
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={fetchAll} disabled={loading}>
                Recargar
              </button>
            </div>
          </div>

          {showFormModal && createPortal(
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header bg-dark text-white">
                    <h5 className="modal-title">Crear Categoría</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowFormModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Ingrese el nombre de la categoría"
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea
                          className="form-control"
                          id="descripcion"
                          name="descripcion"
                          rows="3"
                          value={formData.descripcion}
                          onChange={handleChange}
                          placeholder="Ingrese la descripción"
                          required
                          disabled={submitting}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="fechaCreacion" className="form-label">Fecha de Creación</label>
                        <input
                          type="date"
                          className="form-control"
                          id="fechaCreacion"
                          name="fechaCreacion"
                          value={formData.fechaCreacion}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-secondary me-2" onClick={() => setShowFormModal(false)}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                          <i className="bi bi-plus-circle"></i> {submitting ? "Creando..." : "Crear Categoría"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}

          <div className="card shadow mt-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Categorías</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p className="text-center m-0">Cargando...</p>
              ) : !hasItems ? (
                <p className="text-center m-0">No hay categorías registradas</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Fecha de Creación</th>
                        <th style={{ width: 120 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((categoria) => (
                        <tr key={categoria.id}>
                          <td>{categoria.nombre}</td>
                          <td>{categoria.descripcion}</td>
                          <td>{categoria.fechaCreacion}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(categoria.id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
