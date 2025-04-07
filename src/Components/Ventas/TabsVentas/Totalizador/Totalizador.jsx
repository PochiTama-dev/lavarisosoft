import { useEffect, useState } from 'react';
import Header from '../../../Header/Header';
import { listaCajas } from '../../../../services/cajasService';
import Cajas from './Cajas';
import CajaSeleccionada from './CajaSeleccionada';
//import DatosCaja from './DatosCaja';
import { listaCobros } from '../../../../services/CobrosService';
import { useCustomContext } from '../../../../hooks/context';

const Totalizador = () => {
  const { listaFacturasCompra, listaFacturasVenta, getPresupuestos, getSaldosPendientes } = useCustomContext();
  const [caja, setCaja] = useState([]);
  const [selectedCajaId, setSelectedCajaId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [datosLiquidaciones, setDatosLiquidaciones] = useState(0);
  const [saldosPendientes, setSaldosPendientes] = useState(0);
  const [mesFacturado, setMesFacturado] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cajasData, cobrosData, facturasCompra, facturasVenta, saldos] = await Promise.all([listaCajas(), listaCobros(), listaFacturasCompra(), listaFacturasVenta(), getSaldosPendientes()]);

        setCaja(cajasData || []);
        console.log('COBROS DATA: ', cobrosData);
        console.log('FACTURAS VENTA: ', facturasVenta);
        setMesFacturado(organizarFacturasPorMes([...facturasCompra, ...facturasVenta]));
        setSaldosPendientes(calcularSaldosPendientes(saldos));
        obtenerDatosLiquidaciones();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const calcularTotalFacturas = (facturasCompra, facturasVenta) => {
    const totalCompra = facturasCompra.reduce((acc, factura) => acc + Number(factura.total), 0);
    const totalVenta = facturasVenta.reduce((acc, factura) => acc + Number(factura.total), 0);
    return totalVenta - totalCompra;
  };

  const organizarFacturasPorMes = (facturas) => {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    return facturas.reduce((acc, factura) => {
      const mesIndex = new Date(factura.created_at).getMonth();
      const mesKey = meses[mesIndex];
      acc[mesKey] = acc[mesKey] || [];
      acc[mesKey].push(factura);
      return acc;
    }, {});
  };

  const calcularSaldosPendientes = (saldos) => {
    const montoAdelanto = saldos.filter(({ tipo }) => tipo === 'adelanto' || tipo === 'liquidacion').reduce((acc, saldo) => acc + saldo.monto, 0);
    const montoOrden = saldos.filter(({ tipo }) => tipo === 'orden').reduce((acc, saldo) => acc + saldo.monto, 0);
    return montoOrden - montoAdelanto;
  };

  const obtenerDatosLiquidaciones = async () => {
    const cobros = await getPresupuestos();
    const totalFacturado = transformarCobrosPorEmpleado(cobros).reduce((acc, empleado) => acc + empleado.ordenes.reduce((sum, orden) => sum + orden.total, 0), 0);
    setDatosLiquidaciones(totalFacturado);
  };

  const transformarCobrosPorEmpleado = (cobros) => {
    return cobros.reduce((result, cobro) => {
      const { Empleado } = cobro.Ordene;
      const empleadoExistente = result.find((item) => item.empleadoId === Empleado.id);
      const orden = {
        ...cobro.Ordene,
        total: cobro.total - (cobro.total - cobro.dpg) * cobro.Ordene.Empleado.porcentaje_arreglo,
      };
      if (empleadoExistente) {
        empleadoExistente.ordenes.push(orden);
      } else {
        result.push({
          empleadoId: Empleado.id,
          nombre: `${Empleado.nombre} ${Empleado.apellido}`,
          ordenes: [orden],
        });
      }
      return result;
    }, []);
  };

  const handleCajaChange = (id) => setSelectedCajaId(id);
  const handleDateChange = (date) => setSelectedDate(date);

  return (
    <div className='totalizadorContainer'>
      <Header text='Totalizador' />
      <div className='totalizadorLayout'>
        <Cajas cajas={caja} onCajaSelect={handleCajaChange} selectedCajaId={selectedCajaId} />
        <div className='content'>
          <CajaSeleccionada onDateChange={handleDateChange} />
          <div>
            {Object.entries(mesFacturado).map(([mes, datos], index) => {
              // Reducimos datos en una sola iteración
              const { compra, venta, totalFacturado } = datos.reduce(
                (acc, dato) => {
                  const total = Number(dato.total) || 0;
                  const montoPagado = Number(dato.monto_pagado) || 0;

                  if (dato.id_proveedor) {
                    acc.compra += total - montoPagado; // Compra: total - pagado
                  } else if (dato.id_cliente) {
                    acc.venta += total; // Venta: total
                  }

                  acc.totalFacturado += total;
                  return acc;
                },
                { compra: 0, venta: 0, totalFacturado: 0 }
              );

              return (
                <div className={`d-flex datosCaja ${index % 2 === 0 ? 'bg-light' : ''}`} key={mes}>
                  <li className='col text-center'>{mes}</li>
                  <li className='col text-center'>{venta - compra}</li>
                  <li className='col text-center'>{datosLiquidaciones.toFixed(2)}</li>
                  <li className='col text-center'>{(0 - datosLiquidaciones).toFixed(2)}</li>
                  <li className='col text-center'>{datos.length}</li>
                  <li className='col text-center'>{totalFacturado.toFixed(2)}</li>
                  <li className='col text-center'>{saldosPendientes}</li>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button>Exportar a excel</button>
    </div>
  );
};

export default Totalizador;
