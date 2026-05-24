import { NavBar } from "../components/NavBar";
import { Predicciones } from "../admin/Predicciones";

export const PrediccionRoute = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Predicciones/>
      </div>
    </div>
  );
};
