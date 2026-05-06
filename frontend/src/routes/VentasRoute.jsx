import { NavBar } from "../components/NavBar";
import { Ventas } from "../admin/Ventas";

export const VentasRoute = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Ventas/>
      </div>
    </div>
  );
};
