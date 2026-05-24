// src/admin/Predicciones.jsx
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../api/client";

// ─── Constantes ───────────────────────────────────────────────────────────────
const MESES = [
  "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
  "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE",
];

const FORM_INICIAL = {
  productoId:           "",
  nombreProducto:       "",
  cantidadVendidaMes:   "",
  stockActual:          "",
  precioUnitario:       "",
  categoria:            "",
  mesVenta:             "ENERO",
  frecuenciaReposicion: "",
  tienePromocion:       false,
};

// ─── Helpers visuales ─────────────────────────────────────────────────────────
function badgeAlerta(nivel) {
  switch ((nivel ?? "").toUpperCase()) {
    case "CRITICA":     return "danger";
    case "ADVERTENCIA": return "warning";
    default:            return "success";
  }
}

function badgeDemanda(demanda) {
  switch ((demanda ?? "").toUpperCase()) {
    case "ALTA":  return "danger";
    case "MEDIA": return "warning";
    default:      return "secondary";
  }
}

function iconoAlerta(nivel) {
  switch ((nivel ?? "").toUpperCase()) {
    case "CRITICA":     return "bi bi-exclamation-triangle-fill";
    case "ADVERTENCIA": return "bi bi-exclamation-circle-fill";
    default:            return "bi bi-check-circle-fill";
  }
}

function formatConfianza(val) {
  if (val == null) return "—";
  return `${Math.round(val * 100)}%`;
}

// ─── Normalizar respuesta del backend ─────────────────────────────────────────
function normalizePrediccion(raw) {
  if (!raw) return null;
  return {
    productoId:         raw.productoId ?? "",
    nombreProducto:     raw.nombreProducto ?? "—",
    stockActual:        raw.stockActual ?? 0,
    demandaPredicha:    raw.demandaPredicha ?? "—",
    confianza:          raw.confianza ?? 0,
    nivelAlerta:        raw.nivelAlerta ?? "NORMAL",
    mensajeAlerta:      raw.mensajeAlerta ?? "",
    recomendacion:      raw.recomendacion ?? "",
    categoria:          raw.categoria ?? "—",
    mesVenta:           raw.mesVenta ?? "—",
    cantidadVendidaMes: raw.cantidadVendidaMes ?? 0,
    precioUnitario:     raw.precioUnitario ?? 0,
  };
}

// ─── Tarjeta de resultado (predicción manual) ─────────────────────────────────
function PrediccionCard({ p }) {
  return (
    <div className={`card shadow-sm border-0 border-start border-4 border-${badgeAlerta(p.nivelAlerta)}`}>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-0 fw-semibold">{p.nombreProducto}</h6>
            <small className="text-muted">{p.categoria} · {p.mesVenta}</small>
          </div>
          <span className={`badge bg-${badgeAlerta(p.nivelAlerta)} d-flex align-items-center gap-1`}>
            <i className={iconoAlerta(p.nivelAlerta)}></i>
            {p.nivelAlerta}
          </span>
        </div>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div className="small text-muted">Demanda predicha</div>
              <span className={`badge bg-${badgeDemanda(p.demandaPredicha)} fs-6`}>
                {p.demandaPredicha}
              </span>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div className="small text-muted">Confianza</div>
              <strong className="fs-6">{formatConfianza(p.confianza)}</strong>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div className="small text-muted">Stock actual</div>
              <strong>{p.stockActual}</strong>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div className="small text-muted">Vendido/mes</div>
              <strong>{p.cantidadVendidaMes}</strong>
            </div>
          </div>
        </div>
        {p.nivelAlerta !== "NORMAL" && (
          <div className={`alert alert-${badgeAlerta(p.nivelAlerta)} py-2 px-3 mb-0 small`}>
            <i className={`${iconoAlerta(p.nivelAlerta)} me-1`}></i>
            <strong>{p.mensajeAlerta}.</strong> {p.recomendacion}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Vista principal ───────────────────────────────────────────────────────────
export function Predicciones() {
  const [todos,      setTodos]      = useState([]);
  const [alertas,    setAlertas]    = useState([]);
  const [resultado,  setResultado]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [vista,      setVista]      = useState("todos");
  const [showModal,  setShowModal]  = useState(false);
  const [formData,   setFormData]   = useState(FORM_INICIAL);
  const [submitting, setSubmitting] = useState(false);

  // ── Llamadas API ──
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/predicciones/todos", { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      setTodos((res.data ?? []).map(normalizePrediccion).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar predicciones");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlertas = useCallback(async () => {
    try {
      const res = await api.get("/api/predicciones/alertas", { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      setAlertas((res.data ?? []).map(normalizePrediccion).filter(Boolean));
    } catch (e) {
      console.error("Error alertas:", e.message);
    }
  }, []);

  const repredecirProducto = useCallback(async (productoId) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/predicciones/producto/${productoId}`, { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      const norm = normalizePrediccion(res.data);
      setTodos((prev) => prev.map((p) => p.productoId === productoId ? norm : p));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportarArff = useCallback(async () => {
    try {
      const res = await api.get("/api/predicciones/exportar-arff", {
        responseType: "blob",
        validateStatus: () => true,
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/plain" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "demanda_productos.arff";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("No se pudo exportar el archivo ARFF");
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchAlertas();
  }, []);

  // ── Formulario manual ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombreProducto.trim()) return alert("El nombre del producto es obligatorio");
    setSubmitting(true);
    setResultado(null);
    try {
      const payload = {
        ...formData,
        cantidadVendidaMes:   parseInt(formData.cantidadVendidaMes)  || 0,
        stockActual:          parseFloat(formData.stockActual)        || 0,
        precioUnitario:       parseFloat(formData.precioUnitario)     || 0,
        frecuenciaReposicion: parseInt(formData.frecuenciaReposicion) || 0,
      };
      const res = await api.post("/api/predicciones/manual", payload, { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      setResultado(normalizePrediccion(res.data));
    } catch (e) {
      alert(e.message || "Error en predicción manual");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cálculos KPI ──
  const criticas    = alertas.filter((a) => a.nivelAlerta === "CRITICA").length;
  const advertencias = alertas.filter((a) => a.nivelAlerta === "ADVERTENCIA").length;
  const normales    = todos.length - alertas.length;
  const items       = vista === "alertas" ? alertas : todos;

  return (
    <div className="container mt-4">

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">
          <i className="bi bi-robot me-2"></i>Módulo Predictivo
        </h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={() => { setShowModal(true); setResultado(null); }}>
            <i className="bi bi-calculator me-1"></i>Predicción Manual
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={exportarArff}>
            <i className="bi bi-download me-1"></i>Exportar ARFF
          </button>
          <button className="btn btn-outline-secondary btn-sm"
            onClick={() => { fetchTodos(); fetchAlertas(); }} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-1"></i>Recargar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted small mb-1">
              <i className="bi bi-box-seam me-1"></i>Total productos
            </div>
            <div className="fs-3 fw-bold">{todos.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3 border-start border-4 border-danger">
            <div className="text-muted small mb-1">
              <i className="bi bi-exclamation-triangle-fill text-danger me-1"></i>Críticas
            </div>
            <div className="fs-3 fw-bold text-danger">{criticas}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3 border-start border-4 border-warning">
            <div className="text-muted small mb-1">
              <i className="bi bi-exclamation-circle-fill text-warning me-1"></i>Advertencias
            </div>
            <div className="fs-3 fw-bold text-warning">{advertencias}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3 border-start border-4 border-success">
            <div className="text-muted small mb-1">
              <i className="bi bi-check-circle-fill text-success me-1"></i>Normales
            </div>
            <div className="fs-3 fw-bold text-success">{normales}</div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Tabla */}
      <div className="card shadow">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">
            {vista === "alertas"
              ? <><i className="bi bi-bell-fill me-2 text-warning"></i>Productos con Alertas ({alertas.length})</>
              : <><i className="bi bi-table me-2"></i>Todos los Productos ({todos.length})</>
            }
          </h5>
          <div className="btn-group btn-group-sm">
            <button
              className={`btn ${vista === "todos" ? "btn-light" : "btn-outline-light"}`}
              onClick={() => setVista("todos")}
            >
              <i className="bi bi-list-ul me-1"></i>Todos
            </button>
            <button
              className={`btn ${vista === "alertas" ? "btn-warning text-dark" : "btn-outline-light"}`}
              onClick={() => setVista("alertas")}
            >
              <i className="bi bi-bell me-1"></i>Alertas
              {alertas.length > 0 && (
                <span className="badge bg-danger ms-1">{alertas.length}</span>
              )}
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <span className="spinner-border text-primary me-2"></span>
              Analizando inventario con el modelo predictivo...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              No hay predicciones disponibles
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th className="text-center">Demanda</th>
                    <th className="text-center">Confianza</th>
                    <th className="text-center">Stock</th>
                    <th className="text-center">Vendido/mes</th>
                    <th className="text-center">Alerta</th>
                    <th>Recomendación</th>
                    <th style={{ width: 90 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.productoId || p.nombreProducto}>
                      <td>
                        <div className="fw-semibold">{p.nombreProducto}</div>
                        <small className="text-muted">{p.mesVenta}</small>
                      </td>
                      <td><span className="badge bg-secondary">{p.categoria}</span></td>
                      <td className="text-center">
                        <span className={`badge bg-${badgeDemanda(p.demandaPredicha)}`}>
                          {p.demandaPredicha}
                        </span>
                      </td>
                      <td className="text-center fw-semibold">{formatConfianza(p.confianza)}</td>
                      <td className="text-center">{p.stockActual}</td>
                      <td className="text-center">{p.cantidadVendidaMes}</td>
                      <td className="text-center">
                        <span className={`badge bg-${badgeAlerta(p.nivelAlerta)} d-inline-flex align-items-center gap-1`}>
                          <i className={iconoAlerta(p.nivelAlerta)}></i>
                          {p.nivelAlerta}
                        </span>
                      </td>
                      <td><small>{p.recomendacion || "—"}</small></td>
                      <td>
                        {p.productoId && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => repredecirProducto(p.productoId)}
                            title="Repredecir este producto"
                          >
                            <i className="bi bi-arrow-clockwise"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal predicción manual */}
      {showModal && createPortal(
        <div className="modal show d-block" tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  <i className="bi bi-robot me-2"></i>Predicción Manual de Demanda
                </h5>
                <button type="button" className="btn-close btn-close-white"
                  onClick={() => { setShowModal(false); setFormData(FORM_INICIAL); setResultado(null); }}>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">ID Producto <small className="text-muted">(opcional)</small></label>
                      <input type="text" name="productoId" className="form-control"
                        value={formData.productoId} onChange={handleChange} disabled={submitting} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre del Producto <span className="text-danger">*</span></label>
                      <input type="text" name="nombreProducto" className="form-control"
                        value={formData.nombreProducto} onChange={handleChange} disabled={submitting} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Cantidad Vendida / Mes</label>
                      <input type="number" min="0" name="cantidadVendidaMes" className="form-control"
                        value={formData.cantidadVendidaMes} onChange={handleChange} disabled={submitting} />
                      <div className="form-text">≥80 ALTA · ≥30 MEDIA · &lt;30 BAJA</div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Stock Actual</label>
                      <input type="number" min="0" step="0.1" name="stockActual" className="form-control"
                        value={formData.stockActual} onChange={handleChange} disabled={submitting} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Precio Unitario</label>
                      <input type="number" min="0" step="0.01" name="precioUnitario" className="form-control"
                        value={formData.precioUnitario} onChange={handleChange} disabled={submitting} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Categoría</label>
                      <input type="text" name="categoria" className="form-control"
                        placeholder="Ej: ELECTRÓNICA" value={formData.categoria}
                        onChange={handleChange} disabled={submitting} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Mes de Venta</label>
                      <select name="mesVenta" className="form-select"
                        value={formData.mesVenta} onChange={handleChange} disabled={submitting}>
                        {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Frecuencia Reposición <small className="text-muted">(últimos 90d)</small></label>
                      <input type="number" min="0" name="frecuenciaReposicion" className="form-control"
                        value={formData.frecuenciaReposicion} onChange={handleChange} disabled={submitting} />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="tienePromocion"
                          name="tienePromocion" checked={formData.tienePromocion}
                          onChange={handleChange} disabled={submitting} />
                        <label className="form-check-label" htmlFor="tienePromocion">
                          ¿El producto tiene promoción activa?
                        </label>
                      </div>
                    </div>
                  </div>

                  {resultado && (
                    <div className="mt-4">
                      <h6 className="text-muted mb-2">
                        <i className="bi bi-graph-up me-1"></i>Resultado
                      </h6>
                      <PrediccionCard p={resultado} />
                    </div>
                  )}

                  <div className="mt-4 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary"
                      onClick={() => { setShowModal(false); setFormData(FORM_INICIAL); setResultado(null); }}>
                      Cerrar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting
                        ? <><span className="spinner-border spinner-border-sm me-1"></span>Prediciendo...</>
                        : <><i className="bi bi-cpu me-1"></i>Predecir</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}