import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCompras } from "../hooks/useCompras";
import { useDetalleCompras } from "../hooks/useDetalleCompras";
import { useProveedores } from "../hooks/useProveedores";
import { useProductos } from "../hooks/useProductos";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useCategoria } from "../hooks/useCategoria";


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
  const { items: categorias } = useCategoria();


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  const [compraForm, setCompraForm] = useState({
    proveedorId: "",
    proveedorNombre: "",
    numero: "",
    metodoPago: "Efectivo",
    tipo: "NORMAL",
  });


  const [lineForm, setLineForm] = useState({
    productoId: "",
    productoNombre: "",
    categoriaId: "",
    categoriaNombre: "",
    cantidad: 1,
    precioUnitario: 0,
    descuentoTipo: "",
    descuentoValor: 0,
  });


  const [lineas, setLineas] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showProveedorSuggestions, setShowProveedorSuggestions] = useState(false);


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
    if (name === "proveedorNombre") {
      setCompraForm((prev) => ({
        ...prev,
        proveedorNombre: value,
        proveedorId: "",
      }));
      setShowProveedorSuggestions(Boolean(value.trim()));
      return;
    }
    setCompraForm((prev) => ({ ...prev, [name]: value }));
  };


  const onChangeLinea = (e) => {
    const { name, value } = e.target;

    if (name === "productoNombre") {
      setLineForm((prev) => ({
        ...prev,
        productoNombre: value,
        productoId: "",
        precioUnitario: 0,
        categoriaId: "",
      }));
      setShowProductSuggestions(Boolean(value.trim()));
      return;
    }

    if (name === "categoriaNombre") {
      setLineForm((prev) => ({ ...prev, categoriaNombre: value, categoriaId: "" }));
      setShowCategorySuggestions(Boolean(value.trim()));
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

  const handleSelectProducto = (producto) => {
    setLineForm((prev) => ({
      ...prev,
      productoId: producto.id,
      productoNombre: producto.nombre,
      precioUnitario: producto.precioUnitario,
      categoriaId: producto.categoriaId || "",
      categoriaNombre: producto.categoriaNombre || producto.categoria?.nombre || "",
    }));
    setShowProductSuggestions(false);
  };

  const handleSelectCategoria = (categoria) => {
    setLineForm((prev) => ({
      ...prev,
      categoriaId: categoria.id,
      categoriaNombre: categoria.nombre,
    }));
    setShowCategorySuggestions(false);
  };

  const handleSelectProveedor = (proveedor) => {
    setCompraForm((prev) => ({
      ...prev,
      proveedorId: proveedor.id,
      proveedorNombre: proveedor.nombreProveedor || proveedor.nombre || "",
    }));
    setShowProveedorSuggestions(false);
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


  const findCompraByNumero = async (numero) => {
    if (!numero) return null;
    const res = await api.get('/api/compras', { validateStatus: () => true });
    if (res.status >= 400) return null;
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    const existing = data.find((c) => {
      const num = c.informacionCompra?.numero ?? c.numero ?? "";
      return String(num) === String(numero);
    });
    if (!existing) return null;
    return {
      id: existing.id ?? existing._id ?? null,
      proveedorId: existing.proveedor_id ?? "",
      numero: existing.informacionCompra?.numero ?? existing.numero ?? "",
      metodoPago: existing.informacionCompra?.metodoPago ?? "",
      tipo: existing.informacionCompra?.tipo ?? "",
      calculo: existing.calculo ?? {},
      estado: existing.estado ?? "",
      fechaCreacion: existing.fechaCreacion ?? null,
      fechaActualizacion: existing.fechaActualizacion ?? null,
      _raw: existing,
    };
  };

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


    const generatedNumero = compraForm.numero?.trim() || "COMPRA-" + Date.now();
    const payloadCompra = {
      proveedor_id: compraForm.proveedorId,
      usuario_id: null,
      informacionCompra: {
        numero: generatedNumero,
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
      let compraCreada;
      let comprasCreadasEnFallback = false;
      try {
        compraCreada = await createCompraConInventario(payloadCompra, lineasParaCompra);
      } catch (errCreateCI) {
        const msg = errCreateCI?.message || String(errCreateCI || '');
        if (msg.toLowerCase().includes('inventario') || msg.toLowerCase().includes('no existe inventario')) {
          console.warn('createCompraConInventario falló, intentando detectar compra existente antes de fallback:', msg);
          const existingCompra = await findCompraByNumero(generatedNumero);
          if (existingCompra) {
            compraCreada = existingCompra;
            console.warn('Se encontró una compra existente con el mismo número, evitando crear duplicado.');
          } else {
            compraCreada = await createCompra(payloadCompra);
            comprasCreadasEnFallback = true;

            // crear detalles solo cuando realmente creamos la compra en fallback
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
          }
        } else {
          throw errCreateCI;
        }
      }

      // Si llegamos aquí, tenemos `compraCreada` (vía createCompraConInventario o fallback)

      if (comprasCreadasEnFallback) {
        // Ya creamos los detalles dentro del fallback.
      } else {
        // Si usamos el endpoint createCompraConInventario, no volvemos a crear detalles de nuevo.
      }

      // Notificar a otras partes de la app que el inventario fue actualizado
      try {
        window.dispatchEvent(new CustomEvent('inventario:actualizado', { detail: { compraId: compraCreada.id } }));
      } catch (e) {
        console.warn('No se pudo disparar evento de inventario:', e);
      }

      // Verificar inventarios existentes, registrar movimientos de entrada y crear inventarios faltantes
      try {
        const invRes = await api.get('/api/inventarios', { validateStatus: () => true });
        const invData = Array.isArray(invRes.data) ? invRes.data : (invRes.data?.content ?? invRes.data ?? []);
        const invByProductoId = new Map();
        invData.forEach(i => {
          const pid = i.producto?.id ?? i.productoId ?? i.producto;
          if (pid) invByProductoId.set(String(pid), i);
        });

        let createdInventariosCount = 0;
        let registeredMovimientosCount = 0;

        for (const linea of lineasParaCompra) {
          const pid = linea.productoId;
          if (!pid) continue;
          const key = String(pid);
          const existingInv = invByProductoId.get(key);

          if (existingInv) {
            // Registrar movimiento de entrada para actualizar stock
            const movimientoBody = {
              tipoMovimiento: 'entrada',
              cantidad: Number(linea.cantidad) || 0,
              motivo: 'Compra automática',
              usuarioId: null,
              ventaId: null,
              compraId: compraCreada.id,
            };
            try {
              const movRes = await api.post(`/api/inventarios/${existingInv.id}/movimientos`, movimientoBody, { validateStatus: () => true });
              if (movRes && movRes.status < 400) registeredMovimientosCount += 1;
            } catch (errMov) {
              console.warn('No se pudo registrar movimiento para inventario', existingInv.id, errMov);
            }
          } else {
            // crear inventario con el stock comprado
            const body = {
              producto: { id: pid },
              categoria: linea.categoriaId ? { id: linea.categoriaId } : null,
              stockActual: linea.cantidad || 0,
              stockMinimo: 1,
              almacen: "",
              pasillo: "",
              movimientos: [],
              activo: true,
            };

            try {
              const resInv = await api.post('/api/inventarios', body, { validateStatus: () => true });
              if (resInv && resInv.status < 400) {
                createdInventariosCount += 1;
                // intentar registrar movimiento en el inventario recién creado (si el backend lo soporta)
                const newInvId = resInv.data?.id ?? resInv.data?._id ?? null;
                if (newInvId) {
                  try {
                    const movimientoBody = {
                      tipoMovimiento: 'entrada',
                      cantidad: Number(linea.cantidad) || 0,
                      motivo: 'Compra automática (inicial)',
                      usuarioId: null,
                      ventaId: null,
                      compraId: compraCreada.id,
                    };
                    const movRes = await api.post(`/api/inventarios/${newInvId}/movimientos`, movimientoBody, { validateStatus: () => true });
                    if (movRes && movRes.status < 400) registeredMovimientosCount += 1;
                  } catch (errMov2) {
                    console.warn('No se pudo registrar movimiento en inventario nuevo', newInvId, errMov2);
                  }
                }
              }
            } catch (errInv) {
              console.warn('No se pudo crear inventario para producto', pid, errInv);
            }
          }
        }

        // Forzar recarga del inventario en la UI
        try { window.dispatchEvent(new CustomEvent('inventario:actualizado', { detail: { compraId: compraCreada.id } })); } catch(e){}

        // Mensaje al usuario
        const parts = [];
        if (createdInventariosCount > 0) parts.push(`${createdInventariosCount} inventario(s) creados`);
        if (registeredMovimientosCount > 0) parts.push(`${registeredMovimientosCount} movimiento(s) registrados`);
        if (parts.length > 0) {
          alert(`Compra registrada con éxito. ${parts.join(' y ')}.`);
        } else {
          alert('Compra registrada con éxito. Inventario actualizado.');
        }
      } catch (errCheck) {
        console.warn('Error al verificar/crear inventarios tras compra:', errCheck);
        alert('Compra registrada con éxito. Inventario actualizado.');
      }
      setCompraForm({ proveedorId: "", proveedorNombre: "", numero: "", metodoPago: "Efectivo", tipo: "NORMAL" });
      setLineForm({
        productoId: "",
        productoNombre: "",
        categoriaId: "",
        categoriaNombre: "",
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
                    <div className="col-md-3 position-relative">
                      <label className="form-label">Proveedor</label>
                      <input
                        type="search"
                        name="proveedorNombre"
                        className="form-control"
                        placeholder={loadingProveedores ? "Cargando proveedores..." : "Busca proveedor"}
                        value={compraForm.proveedorNombre}
                        onChange={onChangeCompra}
                        autoComplete="off"
                        required
                        disabled={loadingProveedores}
                      />
                      {showProveedorSuggestions && compraForm.proveedorNombre.trim() && (
                        <div className="list-group position-absolute w-100 shadow" style={{ zIndex: 1100, maxHeight: 220, overflowY: 'auto' }}>
                          {proveedores
                            .filter((p) => p.nombreProveedor?.toLowerCase().includes(compraForm.proveedorNombre.trim().toLowerCase()))
                            .map((p) => (
                              <button key={p.id} type="button" className="list-group-item list-group-item-action" onClick={() => handleSelectProveedor(p)}>
                                {p.nombreProveedor}
                              </button>
                            ))}
                          {proveedores.filter((p) => p.nombreProveedor?.toLowerCase().includes(compraForm.proveedorNombre.trim().toLowerCase())).length === 0 && (
                            <div className="list-group-item text-muted">No se encontraron proveedores</div>
                          )}
                        </div>
                      )}
                      <input type="hidden" name="proveedorId" value={compraForm.proveedorId} />
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
                    <div className="col-md-4 position-relative">
                      <label className="form-label">Producto</label>
                      <input
                        type="search"
                        name="productoNombre"
                        className="form-control"
                        placeholder="Escribe para buscar producto"
                        value={lineForm.productoNombre}
                        onChange={onChangeLinea}
                        autoComplete="off"
                        required={lineas.length === 0}
                      />
                      {showProductSuggestions && lineForm.productoNombre.trim() && (
                        <div className="list-group position-absolute w-100 shadow" style={{ zIndex: 1100, maxHeight: 220, overflowY: "auto" }}>
                          {productos
                            .filter((p) => p.nombre.toLowerCase().includes(lineForm.productoNombre.trim().toLowerCase()))
                            .map((producto) => (
                              <button
                                type="button"
                                key={producto.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSelectProducto(producto)}
                              >
                                {producto.nombre}
                              </button>
                            ))}
                        </div>
                      )}
                      <input type="hidden" name="productoId" value={lineForm.productoId} />
                      <div className="mt-2 position-relative">
                        <label className="form-label small">Categoría</label>
                        <input
                          type="search"
                          name="categoriaNombre"
                          className="form-control form-control-sm"
                          placeholder="Busca o escribe categoría"
                          value={lineForm.categoriaNombre}
                          onChange={onChangeLinea}
                          autoComplete="off"
                        />
                        {showCategorySuggestions && lineForm.categoriaNombre.trim() && (
                          <div className="list-group position-absolute w-100 shadow" style={{ zIndex: 1100, maxHeight: 200, overflowY: 'auto' }}>
                            {categorias
                              .filter((c) => c.nombre.toLowerCase().includes(lineForm.categoriaNombre.trim().toLowerCase()))
                              .map((c) => (
                                <button key={c.id} type="button" className="list-group-item list-group-item-action" onClick={() => handleSelectCategoria(c)}>
                                  {c.nombre}
                                </button>
                              ))}
                          </div>
                        )}
                        <input type="hidden" name="categoriaId" value={lineForm.categoriaId} />
                      </div>
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
                              <td>${Math.round(l.precioUnitario).toLocaleString('es-CO')}</td>
                              <td>${Math.round(l.descuentoValor).toLocaleString('es-CO')}</td>
                              <td>${Math.round(l.subtotal).toLocaleString('es-CO')}</td>
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
                      <strong>Subtotal:</strong> ${Math.round(totales.subtotal).toLocaleString('es-CO')} &nbsp;
                      <strong>Descuentos:</strong> ${Math.round(totales.descuentos).toLocaleString('es-CO')} &nbsp;
                      <strong>Impuestos:</strong> ${Math.round(totales.impuestos).toLocaleString('es-CO')} &nbsp;
                      <strong>Total:</strong> ${Math.round(totales.total).toLocaleString('es-CO')}
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
                        <td>${Math.round(c.total).toLocaleString('es-CO')}</td>
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
