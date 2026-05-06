import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeVenta(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? null,
    clienteId: raw.cliente_id ?? "",
    usuarioId: raw.usuario_id ?? "",
    numero: raw.informacionVenta?.numero ?? "",
    fecha: raw.informacionVenta?.fecha ?? raw.fechaCreacion ?? null,
    metodoPago: raw.informacionVenta?.metodoPago ?? "",
    subTotal: Number(raw.calculos?.subTotal ?? 0),
    impuestos: Number(raw.calculos?.impuestos ?? 0),
    total: Number(raw.calculos?.total ?? 0),
    estado: raw.estado ?? "",
    fechaCreacion: raw.fechaCreacion ?? null,
    fechaActualizacion: raw.fechaActualizacion ?? null,
    _raw: raw,
  };
}

export function useVentas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/ventas", { validateStatus: () => true });
      if (res.status >= 400) {
        throw new Error(res?.data?.message || `Error ${res.status} al cargar ventas`);
      }
      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setItems(data.map(normalizeVenta).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar ventas");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createVenta = useCallback(async (payload) => {
    const res = await api.post("/api/ventas", payload, { validateStatus: () => true });
    if (res.status >= 400) {
      throw new Error(res?.data?.message || "No se pudo crear la venta");
    }
    const created = normalizeVenta(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const createVentaConInventario = useCallback(async (ventaData, detalles) => {
    const payload = {
      venta: ventaData,
      detalles: detalles.map(d => ({
        productoId: d.productoId,
        cantidad: d.cantidad
      }))
    };

    const res = await api.post("/api/ventas/con-inventario", payload, { 
      validateStatus: () => true 
    });
    
    if (res.status >= 400) {
      const errorMsg = typeof res.data === 'string' ? res.data : (res.data?.message || "No se pudo crear la venta");
      throw new Error(errorMsg);
    }
    
    const created = normalizeVenta(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const removeVenta = useCallback(async (id) => {
    const res = await api.delete(`/api/ventas/${id}`, { validateStatus: () => true });
    if (res.status >= 400 && res.status !== 404) {
      throw new Error(res?.data?.message || "No se pudo eliminar la venta");
    }
    setItems((prev) => prev.filter((v) => v.id !== id));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { 
    items, 
    loading, 
    error, 
    fetchAll, 
    createVenta, 
    createVentaConInventario,  
    removeVenta 
  };
}
