import React, { useEffect, useState } from "react";
import { useInventarios } from "../hooks/useInventarios";
import api from "../api/client";


export function Inventario() {
  const { items, loading, error, fetchAll, createOne, removeOne, registrarMovimiento } = useInventarios();


  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [submitting, setSubmitting] = useState(false);


  const [formData, setFormData] = useState({
    productoId: "",
    categoriaId: "",
    stockActual: "",
    stockMinimo: "",
    stockMaximo: "",
    almacen: "",
    pasillo: "",
  });


  const [showModal, setShowModal] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [movimientoData, setMovimientoData] = useState({
    tipoMovimiento: "entrada",
    cantidad: "",
    motivo: "",
    usuarioId: "",
    ventaId: "",
    compraId: "",
  });


  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);


  const loadProductos = async () => {
    try {
      const res = await api.get("/api/productos", { validateStatus: () => true });
      if (Array.isArray(res.data)) setProductos(res.data);
      else if (Array.isArray(res.data?.content)) setProductos(res.data.content);
      else setProductos([]);
    } catch (e) {
      console.error("Error al cargar productos", e);
    }
  };


  const loadCategorias = async () => {
    try {
      const res = await api.get("/api/categorias", { validateStatus: () => true });
      if (Array.isArray(res.data)) setCategorias(res.data);
      else if (Array.isArray(res.data?.content)) setCategorias(res.data.content);
      else setCategorias([]);
    } catch (e) {
      console.error("Error al cargar categorías", e);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleMovimientoChange = (e) => {
    const { name, value } = e.target;
    setMovimientoData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productoId) return alert("Debe seleccionar un producto");
    if (!formData.stockActual || Number(formData.stockActual) < 0) {
      return alert("El stock actual debe ser mayor o igual a 0");
    }


    setSubmitting(true);
    try {
      await createOne({
        productoId: formData.productoId,
        categoriaId: formData.categoriaId,
        stockActual: Number(formData.stockActual),
        stockMinimo: formData.stockMinimo ? Number(formData.stockMinimo) : 0,
        stockMaximo: formData.stockMaximo ? Number(formData.stockMaximo) : 0,
        almacen: formData.almacen,
        pasillo: formData.pasillo,
      });
      setFormData({
        productoId: "",
        categoriaId: "",
        stockActual: "",
        stockMinimo: "",
        stockMaximo: "",
        almacen: "",
        pasillo: "",
      });
    } catch (err) {
      alert(err.message || "Error al crear inventario");
    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("¿Eliminar este inventario?")) return;
    try {
      await removeOne(id);
    } catch (err) {
      alert(err.message || "No se pudo eliminar");
    }
  };


  const openMovimientoModal = (inventario) => {
    setSelectedInventario(inventario);
    setMovimientoData({
      tipoMovimiento: "entrada",
      cantidad: "",
      motivo: "",
      usuarioId: "",
      ventaId: "",
      compraId: "",
    });
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedInventario(null);
  };


  const handleRegistrarMovimiento = async (e) => {
    e.preventDefault();
    if (!movimientoData.cantidad || Number(movimientoData.cantidad) <= 0) {
      return alert("La cantidad debe ser mayor a 0");
    }
    if (!movimientoData.motivo.trim()) {
      return alert("El motivo es obligatorio");
    }


    try {
      await registrarMovimiento(selectedInventario.id, movimientoData);
      closeModal();
      alert("Movimiento registrado exitosamente");
    } catch (err) {
      alert(err.message || "Error al registrar movimiento");
    }
  };


  return (
    <div className="container mt-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Gestión de Inventarios</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchAll} disabled={loading}>
          Recargar
        </button>
      </div>


      <div className="card mb-4 shadow">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Nuevo Inventario</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Producto *</label>
                <select
                  className="form-select"
                  name="productoId"
                  value={formData.productoId}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Stock Actual *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="stockActual"
                  className="form-control"
                  value={formData.stockActual}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Stock Mínimo</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="stockMinimo"
                  className="form-control"
                  value={formData.stockMinimo}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Stock Máximo</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="stockMaximo"
                  className="form-control"
                  value={formData.stockMaximo}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>


            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label className="form-label">Almacén</label>
                <input
                  type="text"
                  name="almacen"
                  className="form-control"
                  value={formData.almacen}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pasillo</label>
                <input
                  type="text"
                  name="pasillo"
                  className="form-control"
                  value={formData.pasillo}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>


            <div className="mt-3 d-flex justify-content-end">
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Inventario"}
              </button>
            </div>
          </form>
        </div>
      </div>


      {error && <div className="alert alert-danger">{error}</div>}


      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Inventarios Registrados ({items.length})</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center m-0">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-center m-0">No hay inventarios registrados</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock Actual</th>
                    <th>Stock Mín.</th>
                    <th>Stock Máx.</th>
                    <th>Almacén</th>
                    <th>Pasillo</th>
                    <th style={{ width: 200 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.producto?.nombre || "-"}</td>
                      <td>{inv.categoria?.nombre || "-"}</td>
                      <td>
                        <span
                          className={
                            inv.stockActual < inv.stockMinimo
                              ? "badge bg-danger"
                              : inv.stockActual > inv.stockMaximo
                              ? "badge bg-warning text-dark"
                              : "badge bg-success"
                          }
                        >
                          {Math.round(inv.stockActual)}
                        </span>
                      </td>
                      <td>{Math.round(inv.stockMinimo)}</td>
                      <td>{Math.round(inv.stockMaximo)}</td>
                      <td>{inv.almacen || "-"}</td>
                      <td>{inv.pasillo || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => openMovimientoModal(inv)}
                        >
                          Movimiento
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(inv.id)}
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


      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Registrar Movimiento de Inventario</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleRegistrarMovimiento}>
                <div className="modal-body">
                  <p className="mb-3">
                    <strong>Producto:</strong> {selectedInventario?.producto?.nombre}
                    <br />
                    <strong>Stock Actual:</strong> {Math.round(selectedInventario?.stockActual)}
                  </p>


                  <div className="mb-3">
                    <label className="form-label">Tipo de Movimiento *</label>
                    <select
                      className="form-select"
                      name="tipoMovimiento"
                      value={movimientoData.tipoMovimiento}
                      onChange={handleMovimientoChange}
                      required
                    >
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                      <option value="ajuste">Ajuste</option>
                    </select>
                  </div>


                  <div className="mb-3">
                    <label className="form-label">Cantidad *</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      name="cantidad"
                      className="form-control"
                      value={movimientoData.cantidad}
                      onChange={handleMovimientoChange}
                      required
                    />
                  </div>


                  <div className="mb-3">
                    <label className="form-label">Motivo *</label>
                    <textarea
                      name="motivo"
                      className="form-control"
                      rows="2"
                      value={movimientoData.motivo}
                      onChange={handleMovimientoChange}
                      required
                    ></textarea>
                  </div>


                  <div className="mb-3">
                    <label className="form-label">ID Usuario (opcional)</label>
                    <input
                      type="text"
                      name="usuarioId"
                      className="form-control"
                      value={movimientoData.usuarioId}
                      onChange={handleMovimientoChange}
                    />
                  </div>


                  <div className="mb-3">
                    <label className="form-label">ID Venta (opcional)</label>
                    <input
                      type="text"
                      name="ventaId"
                      className="form-control"
                      value={movimientoData.ventaId}
                      onChange={handleMovimientoChange}
                    />
                  </div>


                  <div className="mb-3">
                    <label className="form-label">ID Compra (opcional)</label>
                    <input
                      type="text"
                      name="compraId"
                      className="form-control"
                      value={movimientoData.compraId}
                      onChange={handleMovimientoChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Registrar Movimiento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
