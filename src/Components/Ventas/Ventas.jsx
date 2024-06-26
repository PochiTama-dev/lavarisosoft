import { useState } from "react";
import "./Ventas.css";
import Tab from "../../Components/Tabs/Tab";
import Tabs from "../../Components/Tabs/Tabs";
import Caja from "./TabsVentas/Caja";
import OpVentas from "./TabsVentas/OpVentas";
import Inventario from "./TabsVentas/Inventario";
import Totalizador from "./TabsVentas/Totalizador/Totalizador";
import LibroIVA from "./TabsVentas/LibroIVA";
import Proveedores from "./TabsVentas/Proveedores";
import Incumplimientos from "./TabsVentas/Incumplimientos";
import Header from "../Header/Header";
const Ventas = () => {
  const [active, setActive] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  return (
    <div className="ventas-container">
      <Header text="Ventas" />
      <div className="ventas-tabs">
        <Tabs active={active} onChange={handleChange}>
          <Tab title="Caja">
            <Caja />
          </Tab>
          <Tab title="OP/Ventas">
            <OpVentas />
          </Tab>
          <Tab title="Inventario">
            <Inventario />
          </Tab>
          <Tab title="Totalizador">
            <Totalizador />
          </Tab>
          <Tab title="Libro IVA">
            <LibroIVA />
          </Tab>
          <Tab title="Proveedores">
            <Proveedores />
          </Tab>
          <Tab title="Incumplimientos">
            <Incumplimientos />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Ventas;
