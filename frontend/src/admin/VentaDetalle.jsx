import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useDetalleByVenta } from "../hooks/useDetalleByVenta";
import { useProductos } from "../hooks/useProductos";
import { useClientes } from "../hooks/useClientes";


export function VentaDetalle() {
  const { id } = useParams(); 
  const [venta, setVenta] = useState(null);
  const [loadingVenta, setLoadingVenta] = useState(true);
  const [errorVenta, setErrorVenta] = useState(null);


  const { items: detalle, loading, error } = useDetalleByVenta(id);
  const { items: productos } = useProductos();
  const { items: clientes } = useClientes();


  useEffect(() => {
    const fetch = async () => {
      setLoadingVenta(true);
      try {
        const res = await api.get(`/api/ventas/${id}`, { validateStatus: () => true });
        if (res.status >= 400) throw new Error("No se pudo cargar la venta.");
        setVenta(res.data);
      } catch (err) {
        setErrorVenta(err.message);
      } finally {
        setLoadingVenta(false);
      }
    };
    fetch();
  }, [id]);


  const getProducto = (id) => productos.find((p) => p.id === id);
  const getCliente = (id) => clientes.find((c) => c.id === id);


  if (loadingVenta) return <p className="text-center mt-5">Cargando venta...</p>;
  if (errorVenta) return <p className="text-danger">{errorVenta}</p>;


  const cliente = getCliente(venta.cliente_id);
  


  return (
    <div className="container mt-4">
      


      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Detalle de Venta #{venta.informacionVenta?.numero}</h4>
        </div>
        <div className="card-body">


          <h5 className="mb-3">Información General</h5>
          <p><strong>Cliente:</strong> {cliente?.nombre} — {cliente?.cedula}</p>
          <p><strong>Método de pago:</strong> {venta.informacionVenta?.metodoPago}</p>
          <p><strong>Fecha:</strong> {new Date(venta.informacionVenta?.fecha).toLocaleString()}</p>


          <h5 className="mt-4">Totales</h5>
          <p><strong>Subtotal:</strong> ${Math.round(venta.calculos?.subTotal)}</p>
          <p><strong>Impuestos:</strong> ${Math.round(venta.calculos?.impuestos)}</p>
          <p><strong>Total:</strong> <strong>${Math.round(venta.calculos?.total)}</strong></p>


          <hr />


          <h5>Productos Vendidos</h5>
          {loading && <p>Cargando detalle...</p>}
          {error && <p className="text-danger">{error}</p>}


          {detalle.length === 0 ? (
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
                  {detalle.map((d) => {
                    const prod = getProducto(d.producto_id);
                    return (
                      <tr key={d.id}>
                        <td>{prod ? prod.nombre : "Producto no encontrado"}</td>
                        <td>{d.cantidad}</td>
                        <td>${Math.round(d.precioUnitario)}</td>
                        <td>{d.descuentoValor ? `$${Math.round(d.descuentoValor)}` : "0"}</td>
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
