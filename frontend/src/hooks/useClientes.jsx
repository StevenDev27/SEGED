import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function normalizeCliente(raw) {
  if (!raw || typeof raw !== "object") return null;
  return {
    id: raw.id ?? raw._id ?? null,
    nombre: raw.nombre ?? "",
    correo: raw.correo ?? raw.email ?? "",
    celular: raw.celular ?? raw.telefono ?? "",
    cedula: raw.cedula ?? "",
    direccion: raw.direccion ?? "",
    _raw: raw,
  };
}

export function useClientes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/clientes", { validateStatus: () => true });
      if (res.status === 401 || res.status === 403) throw new Error("No autorizado. Inicia sesión.");
      if (res.status >= 400) throw new Error(res?.data?.message || `Error ${res.status} al cargar clientes`);
      const data = Array.isArray(res.data) ? res.data : (res.data?.content ?? res.data ?? []);
      setItems(data.map(normalizeCliente).filter(Boolean));
    } catch (e) {
      setError(e.message ?? "Error al cargar clientes");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOne = useCallback(async (payload) => {
    const body = {
      nombre: payload.nombre,
      correo: payload.correo ?? payload.email ?? "",
      celular: payload.celular ?? payload.telefono ?? "",
      cedula: payload.cedula ?? "",
      direccion: payload.direccion ?? "",
    };
    const res = await api.post("/api/clientes", body, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400) throw new Error(res?.data?.message || "No se pudo crear el cliente");
    const created = normalizeCliente(res.data);
    setItems((prev) => (created ? [created, ...prev] : prev));
    return created;
  }, []);

  const updateOne = useCallback(async (id, payload) => {
    const body = {
      nombre: payload.nombre,
      correo: payload.correo ?? payload.email ?? "",
      celular: payload.celular ?? payload.telefono ?? "",
      cedula: payload.cedula ?? "",
      direccion: payload.direccion ?? "",
    };
    const res = await api.put(`/api/clientes/${id}`, body, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400) throw new Error(res?.data?.message || "No se pudo actualizar el cliente");
    const updated = normalizeCliente(res.data);
    setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const removeOne = useCallback(async (id) => {
    const res = await api.delete(`/api/clientes/${id}`, { validateStatus: () => true });
    if (res.status === 401 || res.status === 403) throw new Error("No autorizado.");
    if (res.status >= 400 && res.status !== 404) throw new Error(res?.data?.message || "No se pudo eliminar el cliente");
    setItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { items, loading, error, fetchAll, createOne, updateOne, removeOne };
}
