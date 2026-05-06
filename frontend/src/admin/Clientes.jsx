import React, { useMemo, useState } from "react";
import { useClientes } from "../hooks/useClientes";

export function Clientes() {
  const { items, loading, error, createOne, updateOne, removeOne, fetchAll } = useClientes();

  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    email: "",
    telefono: "",
    cedula: "",
    direccion: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasItems = useMemo(() => (items?.length ?? 0) > 0, [items]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOne({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        cedula: formData.cedula,
        direccion: formData.direccion,
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.id) return;
    setSubmitting(true);
    try {
      await updateOne(formData.id, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        cedula: formData.cedula,
        direccion: formData.direccion,
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      await removeOne(id);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      id: client.id ?? null,
      nombre: client.nombre ?? "",
      email: client.correo ?? "",
      telefono: client.celular ?? "",
      cedula: client.cedula ?? "",
      direccion: client.direccion ?? "",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ id: null, nombre: "", email: "", telefono: "", cedula: "", direccion: "" });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Clientes</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={fetchAll} disabled={loading}>Recargar</button>
          <button className="btn btn-dark" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancelar" : "Nuevo Cliente"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</h5>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} noValidate>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="nombre" name="nombre"
                  value={formData.nombre} onChange={handleInputChange} required disabled={submitting} />
              </div>

              <div className="mb-3">
                <label htmlFor="cedula" className="form-label">Cédula</label>
                <input type="text" className="form-control" id="cedula" name="cedula"
                  value={formData.cedula} onChange={handleInputChange} required disabled={submitting} />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email"
                  value={formData.email} onChange={handleInputChange} required disabled={submitting} />
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input type="tel" className="form-control" id="telefono" name="telefono"
                  value={formData.telefono} onChange={handleInputChange} required disabled={submitting} />
              </div>

              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input type="text" className="form-control" id="direccion" name="direccion"
                  value={formData.direccion} onChange={handleInputChange} disabled={submitting} />
              </div>

              <button type="submit" className="btn btn-success me-2" disabled={submitting}>
                {isEditing ? "Actualizar" : "Guardar"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={submitting}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Cédula</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center">Cargando...</td></tr>
                ) : !hasItems ? (
                  <tr><td colSpan="7" className="text-center">No hay clientes registrados</td></tr>
                ) : (
                  items.map((client) => (
                    <tr key={client.id}>
                      <td>{client.nombre}</td>
                      <td>{client.cedula}</td>
                      <td>{client.correo}</td>
                      <td>{client.celular}</td>
                      <td>{client.direccion}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(client)} disabled={submitting}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(client.id)} disabled={submitting}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
