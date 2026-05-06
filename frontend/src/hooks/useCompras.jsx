import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeCompra(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? null,
    proveedorId: raw.proveedor_id ?? "",
    usuarioId: raw.usuario_id ?? "",
    numero: raw.informacionCompra?.numero ?? "",
    fecha: raw.informacionCompra?.fecha ?? raw.fechaCreacion ?? null,
    metodoPago: raw.informacionCompra?.metodoPago ?? "",
    tipo: raw.informacionCompra?.tipo ?? "",
    subtotal: Number(raw.calculo?.subtotal ?? 0),
    impuestos: Number(raw.calculo?.impuestos ?? 0),
    descuentos: Number(raw.calculo?.descuentos ?? 0),
    total: Number(raw.calculo?.total ?? 0),
    estado: raw.estado ?? "",
    fechaCreacion: raw.fechaCreacion ?? null,
    fechaActualizacion: raw.fechaActualizacion ?? null,
    _raw: raw,
  };
}

export function useCompras() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/compras", { validateStatus: () => true });
      if (res.status >= 400) {
        throw new Error(res?.data?.message || `Error ${res.status} al cargar compras`);
      }
      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setItems(data.map(normalizeCompra).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar compras");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCompra = useCallback(async (payload) => {
    const res = await api.post("/api/compras", payload, { validateStatus: () => true });
    if (res.status >= 400) {
      throw new Error(res?.data?.message || "No se pudo crear la compra");
    }
    const created = normalizeCompra(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const createCompraConInventario = useCallback(async (compraData, detalles) => {
    const payload = {
      compra: compraData,
      detalles: detalles.map(d => ({
        productoId: d.productoId,
        cantidad: d.cantidad
      }))
    };

    const res = await api.post("/api/compras/con-inventario", payload, { 
      validateStatus: () => true 
    });
    
    if (res.status >= 400) {
      const errorMsg = typeof res.data === 'string' ? res.data : (res.data?.message || "No se pudo crear la compra");
      throw new Error(errorMsg);
    }
    
    const created = normalizeCompra(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const removeCompra = useCallback(async (id) => {
    const res = await api.delete(`/api/compras/${id}`, { validateStatus: () => true });
    if (res.status >= 400 && res.status !== 404) {
      throw new Error(res?.data?.message || "No se pudo eliminar la compra");
    }
    setItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { 
    items, 
    loading, 
    error, 
    fetchAll, 
    createCompra, 
    createCompraConInventario,
    removeCompra 
  };
}
