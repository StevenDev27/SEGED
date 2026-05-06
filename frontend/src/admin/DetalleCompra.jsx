import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDetalleCompras } from "../hooks/useDetalleCompras";
import { useProductos } from "../hooks/useProductos";
import { useProveedores } from "../hooks/useProveedores";
import api from "../api/client";

export function DetalleCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [loadingCompra, setLoadingCompra] = useState(true);
  const [errorCompra, setErrorCompra] = useState(null);

  const { getByCompraId, loading, error } = useDetalleCompras();
  const [detalles, setDetalles] = useState([]);
  const { items: productos } = useProductos();
  const { items: proveedores } = useProveedores();

  useEffect(() => {
    const fetch = async () => {
      setLoadingCompra(true);
      try {
        const res = await api.get(`/api/compras/${id}`, { validateStatus: () => true });
        if (res.status >= 400) throw new Error("No se pudo cargar la compra.");
        setCompra(res.data);

        const detallesData = await getByCompraId(id);
        setDetalles(Array.isArray(detallesData) ? detallesData : []);
      } catch (err) {
        setErrorCompra(err.message);
      } finally {
        setLoadingCompra(false);
      }
    };
    fetch();
  }, [id, getByCompraId]);

  const getProducto = (id) => productos.find((p) => p.id === id);
  const getProveedor = (id) => proveedores.find((p) => p.id === id);

  const handleVolver = () => {
    navigate("/compras");
  };

  if (loadingCompra) return <p className="text-center mt-5">Cargando compra...</p>;
  if (errorCompra) return <p className="text-danger text-center mt-5">{errorCompra}</p>;

  const proveedor = getProveedor(compra.proveedor_id);

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-header bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Detalle de Compra #{compra.informacionCompra?.numero}</h4>
            {/* <button className="btn btn-sm btn-light" onClick={handleVolver}>
              ← Volver
            </button> */}
          </div>
        </div>
        <div className="card-body">
          <h5 className="mb-3">Información General</h5>
          <p>
            <strong>Proveedor:</strong> {proveedor?.nombreProveedor || compra.proveedor_id} —{" "}
            {proveedor?.nit || "N/A"}
          </p>
          <p>
            <strong>Método de pago:</strong> {compra.informacionCompra?.metodoPago}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(compra.informacionCompra?.fecha).toLocaleString()}
          </p>

          <h5 className="mt-4">Totales</h5>
          <p>
            <strong>Subtotal:</strong> ${Math.round(compra.calculo?.subtotal)}
          </p>
          <p>
            <strong>Descuentos:</strong> ${Math.round(compra.calculo?.descuentos)}
          </p>
          <p>
            <strong>Impuestos:</strong> ${Math.round(compra.calculo?.impuestos)}
          </p>
          <p>
            <strong>Total:</strong> <strong>${Math.round(compra.calculo?.total)}</strong>
          </p>

          <hr />

          <h5>Productos Comprados</h5>
          {loading && <p>Cargando detalle...</p>}
          {error && <p className="text-danger">{error}</p>}

          {detalles.length === 0 ? (
            <p>No hay detalles asociados.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Descuento</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((d) => {
                    const prod = getProducto(d.producto_id);
                    return (
                      <tr key={d.id}>
                        <td>{prod ? prod.nombre : "Producto no encontrado"}</td>
                        <td>{d.cantidad}</td>
                        <td>${Math.round(d.precioUnitario)}</td>
                        <td>
                          {d.descuentos?.valor
                            ? `$${Math.round(d.descuentos.valor)}`
                            : "0"}
                        </td>
                        <td>${Math.round(d.subtotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
