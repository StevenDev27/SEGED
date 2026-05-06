import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCompras } from "../hooks/useCompras";
import { useDetalleCompras } from "../hooks/useDetalleCompras";
import { useProveedores } from "../hooks/useProveedores";
import { useProductos } from "../hooks/useProductos";
import { Link } from "react-router-dom";
import api from "../api/client";


export function Compras() {
  const {
    items: compras,
    loading,
    error,
    createCompra,
    createCompraConInventario,
    removeCompra,
  } = useCompras();


  const { createDetalle } = useDetalleCompras();
  const { items: proveedores, loading: loadingProveedores } = useProveedores();
  const { items: productos } = useProductos();


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  const [compraForm, setCompraForm] = useState({
    proveedorId: "",
    numero: "",
    metodoPago: "Efectivo",
    tipo: "NORMAL",
  });


  const [lineForm, setLineForm] = useState({
    productoId: "",
    productoNombre: "",
    cantidad: 1,
    precioUnitario: 0,
    descuentoTipo: "",
    descuentoValor: 0,
  });


  const [lineas, setLineas] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);


  const comprasFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return compras;
    return compras.filter((c) =>
      c.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [compras, searchTerm]);


  const totalPages = Math.ceil(comprasFiltradas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const comprasPaginadas = comprasFiltradas.slice(indexOfFirstItem, indexOfLastItem);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


  const onChangeCompra = (e) => {
    const { name, value } = e.target;
    setCompraForm((prev) => ({ ...prev, [name]: value }));
  };


  const onChangeLinea = (e) => {
    const { name, value } = e.target;


    if (name === "productoId") {
      const selected = productos.find((p) => p.id === value);


      setLineForm((prev) => ({
        ...prev,
        productoId: value,
        productoNombre: selected ? selected.nombre : "",
        precioUnitario: selected ? selected.precioUnitario : 0,
      }));
      return;
    }


    setLineForm((prev) => ({
      ...prev,
      [name]:
        name === "cantidad" || name === "precioUnitario" || name === "descuentoValor"
          ? Number(value)
          : value,
    }));
  };


  const addLinea = () => {
    if (!lineForm.productoId.trim()) {
      return alert("Debes seleccionar un producto.");
    }
    if (!lineForm.cantidad || lineForm.cantidad <= 0) {
      return alert("Cantidad inválida.");
    }


    const subtotalLinea =
      lineForm.cantidad * lineForm.precioUnitario - (lineForm.descuentoValor || 0);


    setLineas((prev) => [
      ...prev,
      {
        ...lineForm,
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now() + Math.random()),
        subtotal: subtotalLinea,
      },
    ]);


    setLineForm((prev) => ({
      ...prev,
      cantidad: 1,
      descuentoTipo: "",
      descuentoValor: 0,
    }));
  };


  const removeLineaLocal = (id) => {
    setLineas((prev) => prev.filter((l) => l.id !== id));
  };


  const totales = useMemo(() => {
    const subtotal = lineas.reduce((acc, l) => acc + l.subtotal, 0);
    const descuentos = lineas.reduce((acc, l) => acc + (l.descuentoValor || 0), 0);
    const impuestos = 0;
    const total = subtotal - descuentos + impuestos;
    return { subtotal, impuestos, descuentos, total };
  }, [lineas]);


  const onSubmitCompra = async (e) => {
    e.preventDefault();


    if (!compraForm.proveedorId.trim()) {
      return alert("Debes seleccionar un proveedor.");
    }


    let lineasParaCompra = lineas;


    if (lineasParaCompra.length === 0) {
      if (!lineForm.productoId.trim()) {
        return alert("Agrega al menos un producto a la compra.");
      }
      if (!lineForm.cantidad || lineForm.cantidad <= 0) {
        return alert("Cantidad inválida para el producto.");
      }


      const subtotalLinea =
        lineForm.cantidad * lineForm.precioUnitario - (lineForm.descuentoValor || 0);


      lineasParaCompra = [
        {
          ...lineForm,
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : String(Date.now() + Math.random()),
          subtotal: subtotalLinea,
        },
      ];
    }


    const subtotal = lineasParaCompra.reduce((acc, l) => acc + l.subtotal, 0);
    const descuentos = lineasParaCompra.reduce((acc, l) => acc + (l.descuentoValor || 0), 0);
    const impuestos = 0;
    const total = subtotal - descuentos + impuestos;


    const now = new Date().toISOString();


    const payloadCompra = {
      proveedor_id: compraForm.proveedorId,
      usuario_id: null,
      informacionCompra: {
        numero: compraForm.numero || "COMPRA-" + Date.now(),
        fecha: now,
        metodoPago: compraForm.metodoPago,
        tipo: compraForm.tipo,
      },
      calculo: {
        subtotal,
        impuestos,
        descuentos,
        total,
      },
      estado: "REGISTRADA",
      fechaCreacion: now,
      fechaActualizacion: now,
    };


    try {
      const compraCreada = await createCompraConInventario(payloadCompra, lineasParaCompra);


      for (const linea of lineasParaCompra) {
        await createDetalle({
          compraId: compraCreada.id,
          productoId: linea.productoId,
          cantidad: linea.cantidad,
          precioUnitario: linea.precioUnitario,
          descuentoTipo: linea.descuentoTipo,
          descuentoValor: linea.descuentoValor,
          subtotal: linea.subtotal,
        });
      }


      alert("Compra registrada con éxito. Inventario actualizado.");
      setCompraForm({ proveedorId: "", numero: "", metodoPago: "Efectivo", tipo: "NORMAL" });
      setLineForm({
        productoId: "",
        productoNombre: "",
        cantidad: 1,
        precioUnitario: 0,
        descuentoTipo: "",
        descuentoValor: 0,
      });
      setLineas([]);
      setShowFormModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo registrar la compra.");
    }
  };


  const handleDeleteCompra = async (id) => {
    const compra = compras.find((c) => c.id === id);


    if (!compra) {
      return alert("No se encontró la compra en memoria.");
    }


    if (
      !window.confirm(
        `¿Eliminar la compra ${compra.numero || id}? Esto también eliminará sus detalles.`
      )
    ) {
      return;
    }


    try {
      try {
        const resDet = await api.get("/api/detalle_compras", {
          validateStatus: () => true,
        });


        if (resDet.status < 400) {
          const data = Array.isArray(resDet.data)
            ? resDet.data
            : resDet.data?.content ?? [];


          const detallesDeEstaCompra = data.filter(
            (d) => d.compra_id === id || d.compraId === id
          );


          await Promise.all(
            detallesDeEstaCompra.map((d) =>
              api.delete(`/api/detalle_compras/${d.id}`, {
                validateStatus: () => true,
              })
            )
          );
        }
      } catch (errDet) {
        console.error("Error eliminando detalle_compras en Mongo:", errDet);
      }


      await removeCompra(id);
      alert("Compra eliminada correctamente.");
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo eliminar la compra.");
    }
  };


  const getProveedorNombre = (id) => {
    const found = proveedores.find((p) => p.id === id);
    return found ? found.nombreProveedor : id;
  };


  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);


    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }


    if (currentPage > 1) {
      items.push(
        <li key="first" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>
            &laquo;
          </button>
        </li>
      );
    }


    if (currentPage > 1) {
      items.push(
        <li key="prev" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
            &lsaquo;
          </button>
        </li>
      );
    }


    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }


    if (currentPage < totalPages) {
      items.push(
        <li key="next" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
            &rsaquo;
          </button>
        </li>
      );
    }


    if (currentPage < totalPages) {
      items.push(
        <li key="last" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            &raquo;
          </button>
        </li>
      );
    }


    return items;
  };


  return (
    <div className="container mt-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Gestión de Compras</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowFormModal(true)}>
          <i className="bi bi-plus-circle"></i> Nueva Compra
        </button>
      </div>


      {showFormModal && createPortal(
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Nueva Compra</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowFormModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={onSubmitCompra}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label">Proveedor</label>
                      <select
                        name="proveedorId"
                        className="form-select"
                        value={compraForm.proveedorId}
                        onChange={onChangeCompra}
                        required
                        disabled={loadingProveedores}
                      >
                        <option value="">
                          {loadingProveedores
                            ? "Cargando proveedores..."
                            : proveedores.length === 0
                              ? "No hay proveedores disponibles"
                              : "Seleccione un proveedor"}
                        </option>
                        {Array.isArray(proveedores) && proveedores.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombreProveedor}
                          </option>
                        ))}
                      </select>
                    </div>


                    <div className="col-md-3">
                      <label className="form-label">Número de compra</label>
                      <input
                        name="numero"
                        className="form-control"
                        value={compraForm.numero}
                        onChange={onChangeCompra}
                        placeholder="Opcional, se genera automáticamente"
                      />
                    </div>


                    <div className="col-md-3">
                      <label className="form-label">Método de pago</label>
                      <select
                        name="metodoPago"
                        className="form-select"
                        value={compraForm.metodoPago}
                        onChange={onChangeCompra}
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Credito">Crédito</option>
                      </select>
                    </div>


                    <div className="col-md-3">
                      <label className="form-label">Tipo</label>
                      <select
                        name="tipo"
                        className="form-select"
                        value={compraForm.tipo}
                        onChange={onChangeCompra}
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="IMPORTACION">Importación</option>
                        <option value="URGENTE">Urgente</option>
                      </select>
                    </div>
                  </div>


                  <h6>Detalle de productos</h6>
                  <div className="row g-2 align-items-end mb-2">
                    <div className="col-md-3">
                      <label className="form-label">Producto</label>
                      <select
                        name="productoId"
                        className="form-select"
                        value={lineForm.productoId}
                        onChange={onChangeLinea}
                        required={lineas.length === 0}
                      >
                        <option value="">Seleccione un producto</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        className="form-control"
                        min={1}
                        value={lineForm.cantidad}
                        onChange={onChangeLinea}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Precio Unit.</label>
                      <input
                        type="number"
                        name="precioUnitario"
                        className="form-control"
                        min={0}
                        step="1"
                        value={lineForm.precioUnitario}
                        onChange={onChangeLinea}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Desc. tipo</label>
                      <input
                        name="descuentoTipo"
                        className="form-control"
                        value={lineForm.descuentoTipo}
                        onChange={onChangeLinea}
                        placeholder="% o fijo"
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Desc. valor</label>
                      <input
                        type="number"
                        name="descuentoValor"
                        className="form-control"
                        min={0}
                        step="1"
                        value={lineForm.descuentoValor}
                        onChange={onChangeLinea}
                      />
                    </div>
                    <div className="col-md-1">
                      <button type="button" className="btn btn-success w-100" onClick={addLinea}>
                        +
                      </button>
                    </div>
                  </div>


                  {lineas.length > 0 && (
                    <div className="table-responsive mb-3">
                      <table className="table table-sm table-striped">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>P.Unit</th>
                            <th>Desc.</th>
                            <th>Subtotal</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {lineas.map((l) => (
                            <tr key={l.id}>
                              <td>{l.productoNombre || l.productoId}</td>
                              <td>{l.cantidad}</td>
                              <td>${Math.round(l.precioUnitario)}</td>
                              <td>${Math.round(l.descuentoValor)}</td>
                              <td>${Math.round(l.subtotal)}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => removeLineaLocal(l.id)}
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}


                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <strong>Subtotal:</strong> ${Math.round(totales.subtotal)} &nbsp;
                      <strong>Descuentos:</strong> ${Math.round(totales.descuentos)} &nbsp;
                      <strong>Impuestos:</strong> ${Math.round(totales.impuestos)} &nbsp;
                      <strong>Total:</strong> ${Math.round(totales.total)}
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowFormModal(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Registrar Compra"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}


      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Compras registradas ({comprasFiltradas.length})</h5>
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar por número de compra..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ width: "250px" }}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <p className="text-center m-0">Cargando...</p>}


          {!loading && comprasFiltradas.length === 0 && (
            <p className="text-center m-0">
              {searchTerm
                ? "No se encontraron compras con ese número"
                : "No hay compras registradas."}
            </p>
          )}


          {!loading && comprasPaginadas.length > 0 && (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Número</th>
                      <th>Proveedor</th>
                      <th>Método Pago</th>
                      <th>Tipo</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comprasPaginadas.map((c) => (
                      <tr key={c.id}>
                        <td>{c.numero}</td>
                        <td>{getProveedorNombre(c.proveedorId)}</td>
                        <td>{c.metodoPago}</td>
                        <td>{c.tipo}</td>
                        <td>${Math.round(c.total)}</td>
                        <td>
                          <span className="badge bg-success">{c.estado}</span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/compras/${c.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Ver detalle
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteCompra(c.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Mostrando {indexOfFirstItem + 1} a{" "}
                    {Math.min(indexOfLastItem, comprasFiltradas.length)} de{" "}
                    {comprasFiltradas.length} compras
                  </div>
                  <nav>
                    <ul className="pagination mb-0">{renderPaginationItems()}</ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
