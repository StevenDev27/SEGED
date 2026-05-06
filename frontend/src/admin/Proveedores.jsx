import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useProveedores } from "../hooks/useProveedores";

export function Proveedores() {
  const { items, loading, error, createOne, updateOne, removeOne, fetchAll } = useProveedores();

  const [formData, setFormData] = useState({
    id: null,
    nombreProveedor: "",
    nit: "",
    correo: "",
    celular: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const validateEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateNIT = (nit) => /^[0-9]{9,10}(-[0-9]{1})?$/.test(nit);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreProveedor.trim()) newErrors.nombreProveedor = "El nombre del proveedor es requerido";
    if (!formData.nit.trim()) newErrors.nit = "El NIT es requerido";
    else if (!validateNIT(formData.nit)) newErrors.nit = "El NIT debe tener 9-10 dígitos";
    if (!formData.correo.trim()) newErrors.correo = "El correo es requerido";
    else if (!validateEmail(formData.correo)) newErrors.correo = "Ingrese un correo válido";
    if (!formData.celular.trim()) newErrors.celular = "El celular es requerido";
    else if (!validatePhone(formData.celular)) newErrors.celular = "El celular debe tener 10 dígitos";
    if (!formData.direccion.trim()) newErrors.direccion = "La dirección es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (isEditing && formData.id) {
        await updateOne(formData.id, formData);
      } else {
        await createOne(formData);
      }
      resetForm();
      setShowFormModal(false);
    } catch (err) {
      setErrors((prev) => ({ ...prev, _server: err.message || "Error al guardar" }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (prov) => {
    setFormData({
      id: prov.id ?? null,
      nombreProveedor: prov.nombreProveedor ?? "",
      nit: prov.nit ?? "",
      correo: prov.correo ?? "",
      celular: prov.celular ?? "",
      direccion: prov.direccion ?? "",
    });
    setIsEditing(true);
    setErrors({});
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este proveedor?")) {
      try {
        await removeOne(id);
      } catch (err) {
        setErrors((prev) => ({ ...prev, _server: err.message || "No se pudo eliminar" }));
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: null, nombreProveedor: "", nit: "", correo: "", celular: "", direccion: "" });
    setIsEditing(false);
    setErrors({});
  };

  const hasItems = useMemo(() => (items?.length ?? 0) > 0, [items]);

  return (
    <div className="container mt-2">
      <div className="row">
        <div className="col-lg-10 offset-lg-1">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Gestión de Proveedores</h3>
            <div>
              <button className="btn btn-primary btn-sm me-2" onClick={() => { resetForm(); setShowFormModal(true); }}>
                <i className="bi bi-plus-circle"></i> Nuevo Proveedor
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
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header bg-dark text-white">
                    <h5 className="modal-title">{isEditing ? "Editar Proveedor" : "Registrar Proveedor"}</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => { resetForm(); setShowFormModal(false); }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {errors._server && <div className="alert alert-danger py-2">{errors._server}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="nombreProveedor" className="form-label">
                            Nombre del Proveedor <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.nombreProveedor ? "is-invalid" : formData.nombreProveedor ? "is-valid" : ""}`}
                            id="nombreProveedor"
                            name="nombreProveedor"
                            value={formData.nombreProveedor}
                            onChange={handleChange}
                            disabled={submitting}
                          />
                          {errors.nombreProveedor && <div className="invalid-feedback">{errors.nombreProveedor}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="nit" className="form-label">
                            NIT <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.nit ? "is-invalid" : formData.nit ? "is-valid" : ""}`}
                            id="nit"
                            name="nit"
                            value={formData.nit}
                            onChange={handleChange}
                            disabled={submitting}
                          />
                          {errors.nit && <div className="invalid-feedback">{errors.nit}</div>}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="correo" className="form-label">
                            Correo Electrónico <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className={`form-control ${errors.correo ? "is-invalid" : formData.correo ? "is-valid" : ""}`}
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            disabled={submitting}
                          />
                          {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="celular" className="form-label">
                            Celular <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            className={`form-control ${errors.celular ? "is-invalid" : formData.celular ? "is-valid" : ""}`}
                            id="celular"
                            name="celular"
                            value={formData.celular}
                            onChange={handleChange}
                            maxLength="10"
                            disabled={submitting}
                          />
                          {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="direccion" className="form-label">
                          Dirección <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.direccion ? "is-invalid" : formData.direccion ? "is-valid" : ""}`}
                          id="direccion"
                          name="direccion"
                          rows="2"
                          value={formData.direccion}
                          onChange={handleChange}
                          disabled={submitting}
                        ></textarea>
                        {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                      </div>

                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={() => { resetForm(); setShowFormModal(false); }} disabled={submitting}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-success" disabled={submitting}>
                          {isEditing ? "Actualizar" : "Registrar"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <div className="card shadow mt-4">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Proveedores Registrados ({items.length})</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <p className="text-center m-0">Cargando...</p>
              ) : !hasItems ? (
                <p className="text-center m-0">No hay proveedores registrados</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Nombre del Proveedor</th>
                        <th>NIT</th>
                        <th>Correo</th>
                        <th>Celular</th>
                        <th>Dirección</th>
                        <th style={{ width: 160 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((proveedor) => (
                        <tr key={proveedor.id}>
                          <td>{proveedor.nombreProveedor}</td>
                          <td>{proveedor.nit}</td>
                          <td>{proveedor.correo}</td>
                          <td>{proveedor.celular}</td>
                          <td>{proveedor.direccion}</td>
                          <td className="d-flex gap-2">
                            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(proveedor)}>
                              Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(proveedor.id)}>
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
