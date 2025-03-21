import { useState } from 'react';
import './Ventas.css';
import Tab from '../../Components/Tabs/Tab';
import Tabs from '../../Components/Tabs/Tabs';
import Tabs2 from '../../Components/Tabs/Tabs2';
import Caja from './TabsVentas/Caja';
import OpVentas from './TabsVentas/OpVentas';
import Inventario from './TabsVentas/Inventario';
import Totalizador from './TabsVentas/Totalizador/Totalizador';
import LibroIVA from './TabsVentas/LibroIVA';
import Proveedores from './TabsVentas/Proveedores';
import Header from '../Header/Header';
import Facturas from '../Mantenimiento/TabsMantenimiento/Facturas';
import FacturasAFIP from '../Mantenimiento/TabsMantenimiento/FacturasAFIP';
import Liquidaciones from '../Mantenimiento/TabsMantenimiento/Liquidaciones';
import SaldosPendiente from '../Mantenimiento/TabsMantenimiento/SaldosPendientes/SaldosPendientes';
import CuentaCorriente from '../Mantenimiento/TabsMantenimiento/CuentaCorriente';
import Empleados from '../Mantenimiento/TabsMantenimiento/Empleados';
import Cajas from '../Mantenimiento/TabsMantenimiento/Cajas';
const Ventas = () => {
  const [active, setActive] = useState(0);
  const [active2, setActive2] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  const handleChange2 = (newActive) => setActive2(newActive);
  return (
    <div className='ventas-container'>
      <Header text='Ventas' />
      <div className='ventas-tabs'>
        <Tabs active={active} onChange={handleChange}>
          <Tab title='Facturas'>
            <div className='p-5 tabs-ctn'>
              <Tabs2 active={active2} onChange={handleChange2} className='client-tabs'>
                <Tab title='Facturas'>
                  <Facturas />
                </Tab>
                <Tab title='Facturas AFIP'>
                  <FacturasAFIP />
                </Tab>
              </Tabs2>
            </div>
          </Tab>
          <Tab title='Liquidaciones'>
            <Liquidaciones />
          </Tab>
          <Tab title='Caja'>
            <Caja />
          </Tab>
          <Tab title='OP/Ventas'>
            <OpVentas />
          </Tab>
          <Tab title='Inventario'>
            <Inventario />
          </Tab>
          <Tab title='Totalizador'>
            <Totalizador />
          </Tab>
          <Tab title='Libro IVA'>
            <LibroIVA />
          </Tab>
          <Tab title='Proveedores'>
            <Proveedores />
          </Tab>

          <Tab title='Saldos Pendientes'>
            <SaldosPendiente />
          </Tab>
          <Tab title='Cuentas Corrientes'>
            <div className='p-5 tabs-ctn'>
              <CuentaCorriente />
              <Tabs2 active={active2} onChange={handleChange2} className='client-tabs'>
                <Tab title='Empleados'>
                  <Empleados />
                </Tab>
                <Tab title='Cajas'>
                  <Cajas />
                </Tab>
              </Tabs2>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Ventas;
