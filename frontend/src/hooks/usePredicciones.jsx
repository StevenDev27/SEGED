// src/hooks/usePredicciones.js
import { useCallback, useState } from "react";
import api from "../api/client";

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

export function usePredicciones() {
  const [todos,     setTodos]     = useState([]);
  const [alertas,   setAlertas]   = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/predicciones/todos", { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      setTodos((res.data ?? []).map(normalizePrediccion).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar predicciones");
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlertas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/predicciones/alertas", { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      setAlertas((res.data ?? []).map(normalizePrediccion).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar alertas");
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPorProducto = useCallback(async (productoId) => {
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const res = await api.get(`/api/predicciones/producto/${productoId}`, { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      setResultado(normalizePrediccion(res.data));
    } catch (e) {
      setError(e.message || "Error al predecir producto");
    } finally {
      setLoading(false);
    }
  }, []);

  const predecirManual = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const res = await api.post("/api/predicciones/manual", payload, { validateStatus: () => true });
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status}`);
      const norm = normalizePrediccion(res.data);
      setResultado(norm);
      return norm;
    } catch (e) {
      setError(e.message || "Error en predicción manual");
      throw e;
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

  return {
    todos, alertas, resultado,
    loading, error,
    fetchTodos, fetchAlertas, fetchPorProducto,
    predecirManual, exportarArff,
  };
}