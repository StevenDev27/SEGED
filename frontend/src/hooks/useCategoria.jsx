import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeCategoria(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? null,
    nombre: raw.nombre ?? "",
    descripcion: raw.descripcion ?? "",
    fechaCreacion: (raw.fechaCreacion ?? "").slice(0, 10),
    _raw: raw,
  };
}

export function useCategoria() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/categorias", { validateStatus: () => true });
      if (res.status === 401 || res.status === 403) throw new Error("No autorizado. Inicia sesión.");
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status} al cargar categorías`);
      const data = Array.isArray(res.data) ? res.data : (res.data?.content ?? res.data ?? []);
      setItems(data.map(normalizeCategoria).filter(Boolean));
    } catch (e) {
      setError(e.message ?? "Error al cargar categorías");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOne = useCallback(async (payload) => {
    const body = {
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      fechaCreacion: payload.fechaCreacion, 
    };
    const res = await api.post("/api/categorias", body, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400) throw new Error(res?.data?.message || "No se pudo crear la categoría");
    const created = normalizeCategoria(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const removeOne = useCallback(async (id) => {
    const res = await api.delete(`/api/categorias/${id}`, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400 && res.status !== 404) throw new Error(res?.data?.message || "No se pudo eliminar la categoría");
    setItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { items, loading, error, fetchAll, createOne, removeOne };
}
