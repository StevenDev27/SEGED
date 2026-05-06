import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeDetalle(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? null,
    ventaId: raw.venta_id ?? "",
    productoId: raw.producto_id ?? "",
    cantidad: Number(raw.cantidad ?? 0),
    precioUnitario: Number(raw.precioUnitario ?? 0),
    descuentoTipo: raw.descuento?.tipo ?? "",
    descuentoValor: Number(raw.descuento?.valor ?? 0),
    subtotal: Number(raw.subtotal ?? 0),
    _raw: raw,
  };
}

export function useDetalleVentas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/detalle_ventas", { validateStatus: () => true });
      if (res.status >= 400) {
        throw new Error(res?.data?.message || `Error ${res.status} al cargar el detalle`);
      }
      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setItems(data.map(normalizeDetalle).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar detalle de ventas");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDetalle = useCallback(async (payload) => {
    const body = {
      venta_id: payload.ventaId,
      producto_id: payload.productoId,
      cantidad: payload.cantidad,
      precioUnitario: payload.precioUnitario,
      descuento: payload.descuentoTipo || payload.descuentoValor
        ? { tipo: payload.descuentoTipo, valor: payload.descuentoValor }
        : null,
      subtotal: payload.subtotal,
    };

    const res = await api.post("/api/detalle_ventas", body, { validateStatus: () => true });
    if (res.status >= 400) {
      throw new Error(res?.data?.message || "No se pudo crear el detalle");
    }
    const created = normalizeDetalle(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const removeDetalle = useCallback(async (id) => {
    const res = await api.delete(`/api/detalle_ventas/${id}`, { validateStatus: () => true });
    if (res.status >= 400 && res.status !== 404) {
      throw new Error(res?.data?.message || "No se pudo eliminar el detalle");
    }
    setItems((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const removeDetallesByVenta = useCallback(async (ventaId) => {
    try {
      const detallesVenta = items.filter((d) => d.ventaId === ventaId);
      
      for (const detalle of detallesVenta) {
        await removeDetalle(detalle.id);
      }
      
      return true;
    } catch (e) {
      console.error("Error eliminando detalles de la venta:", e);
      throw new Error("No se pudieron eliminar los detalles de la venta");
    }
  }, [items, removeDetalle]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getByVenta = useCallback(
    (ventaId) => items.filter((d) => d.ventaId === ventaId),
    [items]
  );

  return { 
    items, 
    loading, 
    error, 
    fetchAll, 
    createDetalle, 
    removeDetalle, 
    removeDetallesByVenta, 
    getByVenta 
  };
}
