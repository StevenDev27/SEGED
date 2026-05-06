import { DetalleCompra } from "../admin/DetalleCompra";
import { NavBar } from "../components/NavBar";

export const DetalleCompraRoute = () => {
  return (
    <div
      className="d-flex flex-column"
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <DetalleCompra/>
      </div>
    </div>
  );
};
