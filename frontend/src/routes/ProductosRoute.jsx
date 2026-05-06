import { NavBar } from "../components/NavBar";
import { Productos } from "../admin/Productos";

export const ProductosRoute = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Productos/>
      </div>
    </div>
  );
};
