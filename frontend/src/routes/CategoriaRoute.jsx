import { NavBar } from "../components/NavBar";
import { Categoria } from "../admin/Categoria";

export const CategoriaRoute = () => {
  return (
    <div
      className="d-flex flex-column"
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Categoria/>
      </div>
    </div>
  );
};
