import { VentaDetalle } from "../admin/VentaDetalle";
import { NavBar } from "../components/NavBar";

export const VentaDetalleRoute = () => {
  return (
    <div
      className="d-flex flex-column"
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <VentaDetalle/>
      </div>
    </div>
  );
};
