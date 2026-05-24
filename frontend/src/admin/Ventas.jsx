import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useVentas } from "../hooks/useVentas";
import { useDetalleVentas } from "../hooks/useDetalleVentas";
import { useClientes } from "../hooks/useClientes";
import { useProductos } from "../hooks/useProductos";
import { Link } from "react-router-dom";
import workerApi from "../api/workerClient";
import api from "../api/client";


export function Ventas() {
  const {
    items: ventas,
    loading,
    error,
    createVenta,
    createVentaConInventario,
    removeVenta,
  } = useVentas();


  const { createDetalle } = useDetalleVentas();
  const { items: clientes } = useClientes();
  const { items: productos } = useProductos();


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  const [ventaForm, setVentaForm] = useState({
    clienteId: "",
    numero: "",
    metodoPago: "Efectivo",
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


  const ventasFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return ventas;
    return ventas.filter((v) =>
      v.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ventas, searchTerm]);


  const totalPages = Math.ceil(ventasFiltradas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const ventasPaginadas = ventasFiltradas.slice(indexOfFirstItem, indexOfLastItem);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


  const onChangeVenta = (e) => {
    const { name, value } = e.target;
    setVentaForm((prev) => ({ ...prev, [name]: value }));
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
    const subTotal = lineas.reduce((acc, l) => acc + l.subtotal, 0);
    const impuestos = 0;
    const total = subTotal + impuestos;
    return { subTotal, impuestos, total };
  }, [lineas]);


  const onSubmitVenta = async (e) => {
    e.preventDefault();


    if (!ventaForm.clienteId.trim()) {
      return alert("Debes seleccionar un cliente.");
    }


    let lineasParaVenta = lineas;


    if (lineasParaVenta.length === 0) {
      if (!lineForm.productoId.trim()) {
        return alert("Agrega al menos un producto a la venta.");
      }
      if (!lineForm.cantidad || lineForm.cantidad <= 0) {
        return alert("Cantidad inválida para el producto.");
      }


      const subtotalLinea =
        lineForm.cantidad * lineForm.precioUnitario - (lineForm.descuentoValor || 0);


      lineasParaVenta = [
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


    const subTotal = lineasParaVenta.reduce((acc, l) => acc + l.subtotal, 0);
    const impuestos = 0;
    const total = subTotal + impuestos;


    const now = new Date().toISOString();


    const payloadVenta = {
      cliente_id: ventaForm.clienteId,
      usuario_id: null,
      informacionVenta: {
        numero: ventaForm.numero || "VENTA-" + Date.now(),
        fecha: now,
        metodoPago: ventaForm.metodoPago,
      },
      calculos: {
        subTotal,
        impuestos,
        total,
      },
      estado: "REGISTRADA",
      fechaCreacion: now,
      fechaActualizacion: now,
    };


    try {
      const ventaCreada = await createVentaConInventario(payloadVenta, lineasParaVenta);


      for (const linea of lineasParaVenta) {
        await createDetalle({
          ventaId: ventaCreada.id,
          productoId: linea.productoId,
          cantidad: linea.cantidad,
          precioUnitario: linea.precioUnitario,
          descuentoTipo: linea.descuentoTipo,
          descuentoValor: linea.descuentoValor,
          subtotal: linea.subtotal,
        });
      }


      try {
        const sqlPayload = buildSqlVentaPayload(payloadVenta, lineasParaVenta);
        const resSql = await workerApi.post("/api/ventas", sqlPayload, {
          validateStatus: () => true,
        });


        if (resSql.status >= 400) {
          console.error("Error desde backend SQL:", resSql.status, resSql.data);
        } else {
          console.log("Venta registrada también en SQL:", resSql.data);
        }
      } catch (errSql) {
        console.error("Error de red al llamar al backend SQL:", errSql);
      }


      alert("Venta registrada con éxito");
      setVentaForm({ clienteId: "", numero: "", metodoPago: "Efectivo" });
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
      alert(err.message || "No se pudo registrar la venta.");
    }
  };


  const handleDeleteVenta = async (id) => {
    const venta = ventas.find((v) => v.id === id);


    if (!venta) {
      return alert("No se encontró la venta en memoria.");
    }


    if (
      !window.confirm(
        `¿Eliminar la venta ${venta.numero || id}? Esto también eliminará sus detalles.`
      )
    ) {
      return;
    }


    try {
      try {
        const resDet = await api.get("/api/detalle_ventas", {
          validateStatus: () => true,
        });


        if (resDet.status < 400) {
          const data = Array.isArray(resDet.data)
            ? resDet.data
            : resDet.data?.content ?? [];


          const detallesDeEstaVenta = data.filter(
            (d) => d.venta_id === id || d.ventaId === id
          );


          await Promise.all(
            detallesDeEstaVenta.map((d) =>
              api.delete(`/api/detalle_ventas/${d.id}`, {
                validateStatus: () => true,
              })
            )
          );
        } else {
          console.error(
            "Error obteniendo detalle_ventas para eliminar:",
            resDet.status,
            resDet.data
          );
        }
      } catch (errDet) {
        console.error("Error eliminando detalle_ventas en Mongo:", errDet);
      }


      await removeVenta(id);


      if (venta.numero) {
        try {
          const resSql = await workerApi.delete(
            `/api/ventas/numero/${encodeURIComponent(venta.numero)}`,
            { validateStatus: () => true }
          );


          if (resSql.status >= 400 && resSql.status !== 404) {
            console.error("Error eliminando venta en SQL:", resSql.status, resSql.data);
          }
        } catch (errSql) {
          console.error("Error de red al eliminar venta en SQL:", errSql);
        }
      }


      alert("Venta eliminada correctamente.");
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo eliminar la venta.");
    }
  };


  const getClienteNombre = (id) => {
    const found = clientes.find((c) => c.id === id);
    return found ? found.nombre : id;
  };


  const buildSqlVentaPayload = (ventaPayload, lineasParaVenta) => {
    const cliente = clientes.find((c) => c.id === ventaPayload.cliente_id);


    const detalles = lineasParaVenta.map((l) => {
      const prod = productos.find((p) => p.id === l.productoId);
      const descuentoNum = Number(l.descuentoValor || 0);


      return {
        productoId: null,
        nombreProducto: prod?.nombre || l.productoNombre,
        cantidad: l.cantidad,
        precioUnitario: l.precioUnitario,
        descuento: descuentoNum,
        subtotal: l.subtotal,
      };
    });


    return {
      cliente: cliente
        ? {
          clienteId: null,
          nombre: cliente.nombre,
          docId: cliente.cedula || null,
        }
        : null,


      usuario: null,


      informacionVenta: {
        numero: ventaPayload.informacionVenta.numero,
        fecha: ventaPayload.informacionVenta.fecha,
        metodoPago: ventaPayload.informacionVenta.metodoPago,
        tipo: "NORMAL",
      },


      calculos: {
        subtotal: ventaPayload.calculos.subTotal,
        impuestos: ventaPayload.calculos.impuestos,
        total: ventaPayload.calculos.total,
      },


      detalles,
    };
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
        <h3 className="mb-0">Gestión de Ventas</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowFormModal(true)}>
          <i className="bi bi-plus-circle"></i> Nueva Venta
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
                <h5 className="modal-title">Nueva Venta</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowFormModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={onSubmitVenta}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Cliente</label>
                      <select
                        name="clienteId"
                        className="form-select"
                        value={ventaForm.clienteId}
                        onChange={onChangeVenta}
                        required
                      >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre} — {c.cedula}
                          </option>
                        ))}
                      </select>
                    </div>


                    <div className="col-md-4">
                      <label className="form-label">Número de venta</label>
                      <input
                        name="numero"
                        className="form-control"
                        value={ventaForm.numero}
                        onChange={onChangeVenta}
                        placeholder="Opcional, se genera si lo dejas vacío"
                      />
                    </div>


                    <div className="col-md-4">
                      <label className="form-label">Método de pago</label>
                      <select
                        name="metodoPago"
                        className="form-select"
                        value={ventaForm.metodoPago}
                        onChange={onChangeVenta}
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
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
                            {p.nombre} — ${Math.round(p.precioUnitario || 0).toLocaleString('es-CO')}
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
                              <td>${Math.round(l.precioUnitario || 0).toLocaleString('es-CO')}</td>
                              <td>${Math.round(l.descuentoValor || 0).toLocaleString('es-CO')}</td>
                              <td>${Math.round(l.subtotal || 0).toLocaleString('es-CO')}</td>
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
                      <strong>Subtotal:</strong> ${Math.round(totales.subTotal || 0).toLocaleString('es-CO')} &nbsp;
                      <strong>Impuestos:</strong> ${Math.round(totales.impuestos || 0).toLocaleString('es-CO')} &nbsp;
                      <strong>Total:</strong> ${Math.round(totales.total || 0).toLocaleString('es-CO')}
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowFormModal(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Guardando..." : "Registrar Venta"}
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
            <h5 className="mb-0">Ventas registradas ({ventasFiltradas.length})</h5>
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar por número de venta..."
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


          {!loading && ventasFiltradas.length === 0 && (
            <p className="text-center m-0">
              {searchTerm ? "No se encontraron ventas con ese número" : "No hay ventas registradas."}
            </p>
          )}


          {!loading && ventasPaginadas.length > 0 && (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Número</th>
                      <th>Cliente</th>
                      <th>Método Pago</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasPaginadas.map((v) => (
                      <tr key={v.id}>
                        <td>{v.numero}</td>
                        <td>{getClienteNombre(v.clienteId)}</td>
                        <td>{v.metodoPago}</td>
                        <td>${Math.round(v.total || 0).toLocaleString('es-CO')}</td>
                        <td>
                          <span className="badge bg-success">{v.estado}</span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/ventas/${v.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Ver detalle
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteVenta(v.id)}
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
                    {Math.min(indexOfLastItem, ventasFiltradas.length)} de{" "}
                    {ventasFiltradas.length} ventas
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
