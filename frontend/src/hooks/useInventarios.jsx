import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeInventario(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? null,
    producto: raw.producto ?? null,
    categoria: raw.categoria ?? null,
    stockActual: Number(raw.stockActual ?? 0),
    stockMinimo: Number(raw.stockMinimo ?? 0),
    stockMaximo: Number(raw.stockMaximo ?? 0),
    almacen: raw.almacen ?? "",
    pasillo: raw.pasillo ?? "",
    movimientos: raw.movimientos ?? [],
    fechaUltimaActualizacion: raw.fechaUltimaActualizacion ?? null,
    activo: raw.activo ?? true,
    _raw: raw,
  };
}

export function useInventarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/inventarios", { validateStatus: () => true });
      if (res.status >= 400) {
        throw new Error(res?.data?.message || `Error ${res.status} al cargar inventarios`);
      }
      const data = Array.isArray(res.data) ? res.data : (res.data?.content ?? res.data ?? []);
      setItems(data.map(normalizeInventario).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar inventarios");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOne = useCallback(async (payload) => {
    const body = {
      producto: payload.productoId ? { id: payload.productoId } : null,
      categoria: payload.categoriaId ? { id: payload.categoriaId } : null,
      stockActual: payload.stockActual,
      stockMinimo: payload.stockMinimo || 0,
      stockMaximo: payload.stockMaximo || 0,
      almacen: payload.almacen,
      pasillo: payload.pasillo,
      movimientos: [],
      activo: true,
    };

    const res = await api.post("/api/inventarios", body, { validateStatus: () => true });
    if (res.status >= 400) {
      throw new Error(res?.data?.message || "No se pudo crear el inventario");
    }

    await fetchAll();

    return normalizeInventario(res.data);
  }, [fetchAll]);

  const removeOne = useCallback(async (idOrObject) => {
    // FIX: Extraer el ID si es un objeto
    const id = typeof idOrObject === 'string' ? idOrObject : idOrObject?.id;
    
    if (!id) {
      throw new Error("ID de inventario inválido");
    }

    const res = await api.delete(`/api/inventarios/${id}`, { validateStatus: () => true });
    if (res.status >= 400 && res.status !== 404) {
      throw new Error(res?.data?.message || "No se pudo eliminar el inventario");
    }
    
    setItems((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  const registrarMovimiento = useCallback(async (inventarioIdOrObject, movimientoData) => {
    const id = typeof inventarioIdOrObject === 'string' ? inventarioIdOrObject : inventarioIdOrObject?.id;
    
    if (!id) {
      throw new Error("ID de inventario inválido");
    }

    const body = {
      tipoMovimiento: movimientoData.tipoMovimiento,
      cantidad: Number(movimientoData.cantidad),
      motivo: movimientoData.motivo,
      usuarioId: movimientoData.usuarioId || null,
      ventaId: movimientoData.ventaId || null,
      compraId: movimientoData.compraId || null,
    };

    const res = await api.post(
      `/api/inventarios/${id}/movimientos`,
      body,
      { validateStatus: () => true }
    );

    if (res.status >= 400) {
      throw new Error(res?.data?.message || "No se pudo registrar el movimiento");
    }

    await fetchAll();

    return normalizeInventario(res.data);
  }, [fetchAll]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { items, loading, error, fetchAll, createOne, removeOne, registrarMovimiento };
}
