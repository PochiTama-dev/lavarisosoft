import { useState } from 'react';
import Saldos from './Saldos';
import { useEffect } from 'react';
import { useCustomContext } from '../../../../hooks/context';
import Header from '../../../Header/Header';
const SaldosPendiente = () => {
  const { getPresupuestos } = useCustomContext();
  const [saldos, setSaldos] = useState({ providers: [], costumers: [], employees: [] });

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
      const empleadosOrdenes = transformarCobrosPorEmpleado(cobros);
      setSaldos((prevSaldos) => ({ ...prevSaldos, employees: empleadosOrdenes }));
    };
    getProveedores();
    getClientes();
    getTecnicos();
  }, []);

  const transformarCobrosPorEmpleado = (cobros) => {
    return cobros.reduce((result, cobro) => {
      const { Empleado } = cobro.Ordene; // Extrae el empleado de la orden
      const empleadoExistente = result.find((item) => item.empleadoId === Empleado.id);
      const orden = {
        ...cobro.Ordene,
        presupuestoId: cobro.id, // Puedes agregar el ID del presupuesto si es relevante
        PlazosReparacion: cobro.PlazosReparacion,
        MediosDePago: cobro.MediosDePago,
        EstadosPresupuesto: cobro.Estados_presupuesto,
        Diagnosticos: cobro.Diagnosticos,
        dpg: cobro.dpg,
        total: cobro.total - (cobro.total - cobro.dpg) * cobro.Ordene.Empleado.porcentaje_arreglo,
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
 
        <div>
          <label htmlFor=''>Filtrar por fecha</label>
          <input type='date' name='' id='' />
        </div>

        <div>
          <ul className='row'>
            <li className='col saldosItems'>Motivo</li>
            <li className='col saldosItems'>Descripción</li>
            <li className='col saldosItems'>Estado</li>
            <li className='col saldosItems'>Saldo</li>
            <li className='col saldosItems'>Caja</li>
          </ul>
          <Saldos saldos={saldos} />
        </div>
      </div>
    </div>
  );
};

export default SaldosPendiente;
