import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeProveedor(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? null,
    nombreProveedor: raw.nombreProveedor ?? raw.nombre ?? "",
    nit: raw.nit ?? "",
    correo: raw.correo ?? raw.email ?? "",
    celular: raw.celular ?? raw.telefono ?? "",
    direccion: raw.direccion ?? "",
    _raw: raw,
  };
}

export function useProveedores() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/proveedores", { validateStatus: () => true });
      if (res.status === 401 || res.status === 403) throw new Error("No autorizado. Inicia sesión.");
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status} al cargar proveedores`);
      const data = Array.isArray(res.data) ? res.data : (res.data?.content ?? res.data ?? []);
      setItems(data.map(normalizeProveedor).filter(Boolean));
    } catch (e) {
      setError(e.message ?? "Error al cargar proveedores");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOne = useCallback(async (payload) => {
    const body = {
      nombreProveedor: payload.nombreProveedor,
      nit: payload.nit,
      correo: payload.correo,
      celular: payload.celular,
      direccion: payload.direccion,
    };
    const res = await api.post("/api/proveedores", body, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400) throw new Error(res?.data?.message || "No se pudo crear el proveedor");
    const created = normalizeProveedor(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const updateOne = useCallback(async (id, payload) => {
    const body = {
      nombreProveedor: payload.nombreProveedor,
      nit: payload.nit,
      correo: payload.correo,
      celular: payload.celular,
      direccion: payload.direccion,
    };
    const res = await api.put(`/api/proveedores/${id}`, body, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400) throw new Error(res?.data?.message || "No se pudo actualizar el proveedor");
    const updated = normalizeProveedor(res.data);
    setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const removeOne = useCallback(async (id) => {
    const res = await api.delete(`/api/proveedores/${id}`, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400 && res.status !== 404) throw new Error(res?.data?.message || "No se pudo eliminar el proveedor");
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { items, loading, error, fetchAll, createOne, updateOne, removeOne };
}
