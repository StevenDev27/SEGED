import { useState, useEffect, useCallback } from "react";
import api from "../api/client";

export function useDetalleByVenta(ventaId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!ventaId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/api/detalle_ventas", { validateStatus: () => true });

      if (res.status >= 400)
        throw new Error(res.data?.message || "Error al cargar detalles");

      const all = res.data || [];

      const filtered = all.filter((d) => d.venta_id === ventaId);

      setItems(filtered);
    } catch (err) {
      setError(err.message || "Error al cargar el detalle");
    } finally {
      setLoading(false);
    }
  }, [ventaId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { items, loading, error };
}
