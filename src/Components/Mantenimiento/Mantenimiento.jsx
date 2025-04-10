import { useState } from 'react';
import Tab from '../../Components/Tabs/Tab';
import Tabs from '../../Components/Tabs/Tabs';
import Proveedor from './TabsMantenimiento/Proveedor';
import Taller from './TabsMantenimiento/Taller';
import PlanCuentas from './TabsMantenimiento/PlanCuentas';
import './mantenimiento.css';
import Header from '../Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Incumplimientos from '../Ventas/TabsVentas/Incumplimientos';
const Mantenimiento = () => {
  const [active, setActive] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  return (
    <div className='ventas-container'>
      <Header text='Mantenimiento'></Header>
      <div className='mantenimiento-ctn' >
        <Tabs active={active} onChange={handleChange}  >
          <Tab title='Plan de Cuentas' >
            <PlanCuentas />
          </Tab>
          <Tab title='Proveedores'>
            <Proveedor />
          </Tab>
{/*           <Tab title='Taller'>
            <Taller showHeader={false} />
          </Tab> */}
          <Tab title='Incumplimientos'>
            <Incumplimientos />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Mantenimiento;
