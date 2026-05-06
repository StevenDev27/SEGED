import { NavBar } from "../components/NavBar";
import { Inventario } from "../admin/Inventario";

export const InventarioRoute = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Inventario/>
      </div>
    </div>
  );
};
