import { NavBar } from "../components/NavBar";
import { Compras } from "../admin/Compras";

export const ComprasRoute = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Compras/>
      </div>
    </div>
  );
};
