import { useCallback, useState } from "react";
import api from "../api/client";

export function useDetalleCompras() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDetalle = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        compraId: payload.compraId,
        productoId: payload.productoId,
        cantidad: payload.cantidad,
        precioUnitario: payload.precioUnitario,
        descuentoTipo: payload.descuentoTipo || "",
        descuentoValor: payload.descuentoValor || 0,
        subtotal: payload.subtotal,
      };

      const res = await api.post("/api/detalle_compras", body, { 
        validateStatus: () => true 
      });

      if (res.status >= 400) {
        throw new Error(res?.data?.message || "No se pudo crear el detalle");
      }

      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getByCompraId = useCallback(async (compraId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/detalle_compras/compra/${compraId}`, { 
        validateStatus: () => true 
      });

      if (res.status >= 400) {
        throw new Error(res?.data?.message || "No se pudieron cargar los detalles");
      }

      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createDetalle, getByCompraId, loading, error };
}
