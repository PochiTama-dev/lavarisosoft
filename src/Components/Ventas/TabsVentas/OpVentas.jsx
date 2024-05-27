import { useState } from "react";
import Tab from "../../../Components/Tabs/Tab";
import Tabs2 from "../../../Components/Tabs/Tabs2";
import Ventas from "./Op-Ventas/Ventas";
import PorTecnico from "./Op-Ventas/PorTecnico";
import PorProducto from "./Op-Ventas/PorProducto";
import "./Caja.css";

const OpVentas = () => {
  const [active, setActive] = useState(0);
  const [active2, setActive2] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  const handleChange2 = (newActive2) => setActive2(newActive2);
  return (
    <div className="opventas-container">
      <h1
        style={{ fontWeight: "Bold", marginLeft: "20px", paddingTop: "2.5%" }}
      >
        Operaciones/Ventas
      </h1>
      <div className="caja-input-bottom" style={{ marginLeft: "20px" }}>
        <div>
          <h4 className="caja-input-text">Filtrar por fecha </h4>
          <input className="caja-input" type="text" placeholder="dd/mm/aaaa" />
          <button className="caja-button-search">🔍︎</button>
        </div>
        <div>
          <h4 className="caja-input-text">Cliente</h4>
          <input className="caja-input" type="text" placeholder="Buscar" />
          <button className="caja-button-search">🔍︎</button>
        </div>
        <div>
          <h4 className="caja-input-text">Medio de pago</h4>
          <input className="caja-input" type="text" placeholder="Buscar" />
          <button className="caja-button-search">🔍︎</button>
        </div>
        <div>
          <h4 className="caja-input-text">N° de orden</h4>
          <input className="caja-input" type="text" placeholder="Buscar" />
          <button className="caja-button-search">🔍︎</button>
        </div>
      </div>
      <div className="" style={{ textAlign: "center", marginTop: "0px" }}>
        <Tab>
          <div className="opventas-tabs tabs-ctn ">
            <Tabs2
              active={active2}
              onChange={handleChange2}
              className="client-tabs"
            >
              <Tab title="Ventas">
                <Ventas />
              </Tab>
              <Tab title="Por Técnico">
                <PorTecnico />
              </Tab>
              <Tab title="Por Producto">
                <PorProducto />
              </Tab>
            </Tabs2>
          </div>
        </Tab>
      </div>
    </div>
  );
};

export default OpVentas;
