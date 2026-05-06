import { NavBar } from "../components/NavBar";
import { Clientes } from "../admin/Clientes";

export const ClienteRoute = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div style={{ height: "17%" }}>
            <NavBar/>
      </div>
      <div style={{ height: "83%", overflow: "auto" }}>
        <Clientes/>
      </div>
    </div>
  );
};



