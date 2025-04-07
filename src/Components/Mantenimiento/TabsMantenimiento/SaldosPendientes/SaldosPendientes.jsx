import { useState } from 'react';
import Saldos from './Saldos';
import { useEffect } from 'react';
import { useCustomContext } from '../../../../hooks/context';
import Header from '../../../Header/Header';
import Tabs2 from '../../../Tabs/Tabs2';
import Tab from '../../../Tabs/Tab';

const SaldosPendiente = () => {
  const { getPresupuestos,getLiquidacionesPendientes  } = useCustomContext();
  const [saldos, setSaldos] = useState({ providers: [], costumers: [], employees: [] });
  const [activeTab, setActiveTab] = useState(0); 

  useEffect(() => {
    const getProveedores = async () => {
      const provider = await fetch('https://lv-back.online/facturascompra/lista');
      const prov = await provider.json();
      setSaldos((prevSaldos) => ({ ...prevSaldos, providers: prov }));
    };
    const getClientes = async () => {
      const costumer = await fetch('https://lv-back.online/presupuestos');
      const cos = await costumer.json();
      setSaldos((prevSaldos) => ({ ...prevSaldos, costumers: cos }));
    };
    const getTecnicos = async () => {
      const cobros = await getPresupuestos();
      const liquidaciones = await getLiquidacionesPendientes();
      const empleadosOrdenes = transformarCobrosPorEmpleado(cobros, liquidaciones);
      setSaldos((prevSaldos) => ({ ...prevSaldos, employees: empleadosOrdenes }));
    };
    getProveedores();
    getClientes();
    getTecnicos();
  }, []);
  const transformarCobrosPorEmpleado = (cobros, liquidaciones) => {
    return cobros.reduce((result, cobro) => {
      const { Empleado } = cobro.Ordene;
      const empleadoExistente = result.find((item) => item.empleadoId === Empleado.id);
      const liquidacion = liquidaciones.find((liq) => liq.id_tecnico === Empleado.id) ;
      console.log('Saldos:', liquidacion);
      const orden = {
        ...cobro.Ordene,
        presupuestoId: cobro.id,
        PlazosReparacion: cobro.PlazosReparacion,
        MediosDePago: cobro.MediosDePago,
        EstadosPresupuesto: cobro.Estados_presupuesto,
        Diagnosticos: cobro.Diagnosticos,
        dpg: cobro.dpg,
        total: liquidacion.total  
      };

      if (empleadoExistente) {
        empleadoExistente.ordenes.push(orden);
      } else {
        result.push({
          empleadoId: Empleado.id,
          nombre: `${Empleado.nombre} ${Empleado.apellido}`,
          telefono: Empleado.telefono,
          email: Empleado.email,
          direccion: Empleado.direccion,
          ordenes: [orden],
        });
      }

      return result;
    }, []);
  };

  return (
    <div className='bg-secondary-subtle saldosPendientes' style={{ padding: '20px' }}>
      <Header text='Saldos pendientes' />
      <div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor='' style={{ marginRight: '20px' }}>Filtrar por fecha </label>
          <input type='date' name='' id='' />
        </div>

        <Tabs2 active={activeTab} onChange={setActiveTab} className='client-tabs'>
          <Tab title='Proveedores'>
            <Saldos 
              saldos={{ providers: saldos.providers, employees: [] }} 
              tableStyle={{ tableLayout: 'fixed', width: '100%' }} // Ensure consistent column width
            />
          </Tab>
          <Tab title='Empleados'>
            <Saldos 
              saldos={{ providers: [], employees: saldos.employees }} 
              tableStyle={{ tableLayout: 'fixed', width: '100%' }} // Ensure consistent column width
            />
          </Tab>
        </Tabs2>
      </div>
    </div>
  );
};

export default SaldosPendiente;
