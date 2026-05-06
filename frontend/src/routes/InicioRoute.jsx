import { NavBar } from "../components/NavBar";
import { Inicio } from "../admin/Inicio";

export const InicioRoute = () => {
  return (
    <div
      className="d-flex flex-column"
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Inicio/>
      </div>
    </div>
  );
};



