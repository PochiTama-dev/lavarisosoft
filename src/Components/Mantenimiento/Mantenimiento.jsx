import {  useState } from "react";
import Tab from "../../Components/Tabs/Tab";
import Tabs from "../../Components/Tabs/Tabs";
 import Facturas from "./TabsMantenimiento/Facturas";
 import CuentaCorriente from "./TabsMantenimiento/CuentaCorriente";
 import Liquidaciones from "./TabsMantenimiento/Liquidaciones";
 import Proveedor from "./TabsMantenimiento/Proveedor";
 import SaldosPendiente from "./TabsMantenimiento/SaldosPendientes";
 import Taller from "./TabsMantenimiento/Taller";
 import PlanCuentas from "./TabsMantenimiento/PlanCuentas";
const Mantenimiento = () => {
  const [active, setActive] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  return (
    <div >
      <div >
        <h1>Mantenimiento</h1>
      </div>

      <div>
        <Tabs active={active} onChange={handleChange}>
          <Tab title="Facturas">
      <Facturas/>
          </Tab>
          <Tab title="Liquidaciones">
          <Liquidaciones/>

          </Tab>
          <Tab title="Plan de Cuentas">
          <PlanCuentas/>

           </Tab>
          <Tab title="Cuentas Corrientes">
          <CuentaCorriente/>

           </Tab>
           <Tab title="Proveedor">
           <Proveedor/>

           </Tab>
           <Tab title="Saldos Pendientes">
           <SaldosPendiente/>

           </Tab>
           <Tab title="Taller">
           <Taller/>

           </Tab>
      

        </Tabs>
      </div>
    </div>
  );
};

export default Mantenimiento;