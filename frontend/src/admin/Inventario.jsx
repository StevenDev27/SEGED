import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useInventarios } from "../hooks/useInventarios";
import api from "../api/client";


export function Inventario() {
  const { items, loading, error, fetchAll, createOne, removeOne, registrarMovimiento } = useInventarios();


  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchProducto, setSearchProducto] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const filteredProducts = useMemo(() => {
    const query = searchProducto.trim().toLowerCase();
    if (!query) return productos;
    return productos.filter((producto) => producto.nombre.toLowerCase().includes(query));
  }, [productos, searchProducto]);


  const [formData, setFormData] = useState({
    productoId: "",
    categoriaId: "",
    stockActual: "",
    stockMinimo: "",
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

  // Escuchar eventos globales que indiquen que el inventario fue actualizado (p.ej. tras una compra)
  useEffect(() => {
    const onInventarioActualizado = () => {
      try {
        fetchAll();
      } catch (e) {
        console.warn('Error al recargar inventarios tras evento:', e);
      }
    };

    window.addEventListener('inventario:actualizado', onInventarioActualizado);
    return () => window.removeEventListener('inventario:actualizado', onInventarioActualizado);
  }, [fetchAll]);


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

  const handleSearchProductoChange = (value) => {
    setSearchProducto(value);
    setShowSuggestions(Boolean(value.trim()));
    const productoExacto = productos.find((p) => p.nombre.toLowerCase() === value.trim().toLowerCase());
    if (!productoExacto) {
      setFormData((prev) => ({ ...prev, productoId: "", categoriaId: "" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      productoId: productoExacto.id,
      categoriaId: productoExacto.categoria?.id ?? "",
    }));
  };

  const handleSelectProducto = (producto) => {
    setSearchProducto(producto.nombre);
    setShowSuggestions(false);
    setFormData((prev) => ({
      ...prev,
      productoId: producto.id,
      categoriaId: producto.categoria?.id ?? "",
    }));
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
        almacen: formData.almacen,
        pasillo: formData.pasillo,
      });
      setFormData({
        productoId: "",
        categoriaId: "",
        stockActual: "",
        stockMinimo: "",
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
        <div>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchAll} disabled={loading}>
            Recargar
          </button>
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
                              : "badge bg-success"
                          }
                        >
                          {Math.round(inv.stockActual)}
                        </span>
                      </td>
                      <td>{Math.round(inv.stockMinimo)}</td>
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


      {showModal && createPortal(
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
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
        </div>,
        document.body
      )}
    </div>
  );
}
