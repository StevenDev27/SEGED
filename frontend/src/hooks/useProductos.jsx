import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeProducto(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? null,
    nombre: raw.nombre ?? "",
    descripcion: raw.descripcion ?? "",
    precioUnitario: Number(raw.preciounitario ?? 0),
    categoriaId: raw.categoria?.id ?? "",
    categoriaNombre: raw.categoria?.nombre ?? "",
    _raw: raw,
  };
}

export function useProductos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/productos", { validateStatus: () => true });
      if (res.status >= 400) {
        throw new Error(res?.data?.message || `Error ${res.status} al cargar productos`);
      }
      const data = Array.isArray(res.data) ? res.data : (res.data?.content ?? res.data ?? []);
      setItems(data.map(normalizeProducto).filter(Boolean));
    } catch (e) {
      setError(e.message || "Error al cargar productos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOne = useCallback(async (payload) => {
    const body = {
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      preciounitario: payload.precioUnitario,
      categoria: payload.categoriaId ? { id: payload.categoriaId } : null,
    };

    const res = await api.post("/api/productos", body, { validateStatus: () => true });
    if (res.status >= 400) {
      throw new Error(res?.data?.message || "No se pudo crear el producto");
    }


    await fetchAll();

    return normalizeProducto(res.data);
  }, [fetchAll]);

  const removeOne = useCallback(async (id) => {
    const res = await api.delete(`/api/productos/${id}`, { validateStatus: () => true });
    if (res.status >= 400 && res.status !== 404) {
      throw new Error(res?.data?.message || "No se pudo eliminar el producto");
    }
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { items, loading, error, fetchAll, createOne, removeOne };
}
