import { useEffect, useState } from 'react';
import Header from '../../../Header/Header';
import { listaCajas } from '../../../../services/cajasService';
import Cajas from './Cajas';
import CajaSeleccionada from './CajaSeleccionada';
import DatosCaja from './DatosCaja';
import { listaCobros } from '../../../../services/CobrosService';
import { useCustomContext } from '../../../../hooks/context';

const Totalizador = () => {
  const { listaFacturasCompra, listaFacturasVenta, getPresupuestos, getSaldosPendientes } = useCustomContext();
  const [caja, setCaja] = useState([]);
  const [cobros, setCobros] = useState([]);
  const [selectedCajaId, setSelectedCajaId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [totalFacturas, setTotalFacturas] = useState();
  const [datosLiquidaciones, setDatosLiquidaciones] = useState();
  const [saldosPendientes, setSaldosPendientes] = useState([]);

  useEffect(() => {
    const saldoPendientesCobro = async () => {
      const saldos = await getSaldosPendientes();
      const monto = saldos.reduce((acumulador, saldo) => acumulador + saldo.monto, 0);
      setSaldosPendientes(monto);
      console.log(monto);
    };
    const fetchCajasData = async () => {
      try {
        const data = await listaCajas();
        setCaja(data);
      } catch (error) {
        console.error('Error fetching cajas data:', error);
        setCaja([]);
      }
    };
    const fetchCobrosData = async () => {
      try {
        const data = await listaCobros();
        data !== false && setCobros(data);
      } catch (error) {
        console.error('Error fetching cobros data:', error);
        setCobros([]);
      }
    };
    const fetchFacturas = async () => {
      try {
        const facturasCompra = await listaFacturasCompra();
        const facturasVenta = await listaFacturasVenta();
        //console.log('Facturas Compras', facturasCompra);
        //console.log('Facturas VENTAS', facturasVenta);
        const totalCompra = facturasCompra.reduce((acumulador, factura) => acumulador + Number(factura.total), 0);
        const totalVenta = facturasVenta.reduce((acumulador, factura) => acumulador + Number(factura.total), 0);
        setTotalFacturas(totalCompra + totalVenta);
      } catch (error) {
        console.error('Error fetching cobros data:', error);
      }
    };
    fetchCajasData();
    fetchCobrosData();
    fetchFacturas();
    getCobrosOrdenes();
    saldoPendientesCobro();
  }, []);

  // GASTOS OPERATIVOS (agregar desde factura compra, una columna mas, true o false)
  // GANANCIA NETA margen bruto - gastos operativos
  // FAC PEND DE COBRO

  const handleCajaChange = (id) => {
    setSelectedCajaId(id);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredCobros = cobros.filter((cobro) => {
    const matchesCaja = selectedCajaId ? cobro.id_caja === selectedCajaId : true;
    const createdAtFormatted = cobro.created_at.slice(0, 10);
    const matchesDate = selectedDate ? createdAtFormatted === selectedDate : true;

    return matchesCaja && matchesDate;
  });

  const getCobrosOrdenes = async () => {
    const cobros = await getPresupuestos();
    //console.log(cobros);
    const empleadosOrdenes = transformarCobrosPorEmpleado(cobros);
    //console.log(empleadosOrdenes);
    const totalFacturaEmpleados = empleadosOrdenes.map((empleado) => {
      return empleado.ordenes.reduce((acumulador, orden) => acumulador + orden.total, 0);
    });
    const totalFacturado = totalFacturaEmpleados.reduce((acumulador, total) => parseFloat(acumulador + total, 0).toFixed(2));
    setDatosLiquidaciones(totalFacturado);
    //console.log(totalFacturado);
  };
  const transformarCobrosPorEmpleado = (cobros) => {
    return cobros.reduce((result, cobro) => {
      const { Empleado } = cobro.Ordene; // Extrae el empleado de la orden
      const empleadoExistente = result.find((item) => item.empleadoId === Empleado.id);
      const orden = {
        ...cobro.Ordene,
        presupuestoId: cobro.id,
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
    <div className='totalizadorContainer'>
      <Header text='Totalizador' />
      <div className='totalizadorLayout'>
        <Cajas cajas={caja} onCajaSelect={handleCajaChange} selectedCajaId={selectedCajaId} />
        <div className='content'>
          <CajaSeleccionada onDateChange={handleDateChange} />
          <DatosCaja
            cobros={filteredCobros}
            selectedDate={selectedDate}
            totalFacturado={totalFacturas}
            totalPagado={datosLiquidaciones}
            margenBruto={totalFacturas - datosLiquidaciones}
            saldosPendientes={saldosPendientes}
          />
        </div>
      </div>
    </div>
  );
};

export default Totalizador;
