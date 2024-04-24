import { useState } from "react";
import Tab from "../../Components/Tabs/Tab";
import Tabs from "../../Components/Tabs/Tabs";
import Tabs2 from "../../Components/Tabs/Tabs2";
import Facturas from "./TabsMantenimiento/Facturas";
import FacturasAFIP from "./TabsMantenimiento/FacturasAFIP";
import CuentaCorriente from "./TabsMantenimiento/CuentaCorriente";
import Liquidaciones from "./TabsMantenimiento/Liquidaciones";
import Proveedor from "./TabsMantenimiento/Proveedor";
import SaldosPendiente from "./TabsMantenimiento/SaldosPendientes";
import Taller from "./TabsMantenimiento/Taller";
import PlanCuentas from "./TabsMantenimiento/PlanCuentas";
import "./mantenimiento.css";
import Header from "../Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
const Mantenimiento = () => {
  const [active, setActive] = useState(0);
  const [active2, setActive2] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  const handleChange2 = (newActive2) => setActive2(newActive2);
  return (
    <div className="ventas-container">
      <Header text="Mantenimiento"></Header>

      <div className="mantenimiento-ctn">
        <Tabs active={active} onChange={handleChange}>
          <Tab title="Facturas">
            <div className="p-5 tabs-ctn">
              <Tabs2
                active={active2}
                onChange={handleChange2}
                className="client-tabs"
              >
                <Tab title="Facturas">
                  <Facturas />
                </Tab>
                <Tab title="Facturas AFIP">
                  <FacturasAFIP />
                </Tab>
              </Tabs2>
            </div>
          </Tab>
          <Tab title="Liquidaciones">
            <Liquidaciones />
          </Tab>
          <Tab title="Plan de Cuentas">
            <PlanCuentas />
          </Tab>
          <Tab title="Cuentas Corrientes">
            <div className="p-5 tabs-ctn">
              <CuentaCorriente />
              <Tabs2
                active={active2}
                onChange={handleChange2}
                className="client-tabs"
              >
                <Tab title="Empleados">
                  <Facturas />
                </Tab>
                <Tab title="Cajas">
                  <FacturasAFIP />
                </Tab>
              </Tabs2>
            </div>
          </Tab>
          <Tab title="Proveedor">
            <Proveedor />
          </Tab>
          <Tab title="Saldos Pendientes">
            <SaldosPendiente />
          </Tab>
          <Tab title="Taller">
            <Taller />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Mantenimiento;
