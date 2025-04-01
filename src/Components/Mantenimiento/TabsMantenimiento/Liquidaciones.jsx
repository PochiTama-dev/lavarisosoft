import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import '../mantenimiento.css';
import { useCustomContext } from '../../../hooks/context';
import Liquidacion from '../Liquidacion';
import Adelantos from '../Adelantos';
import { listaCajas } from '../../../services/cajasService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { obtenerLiquidaciones } from '../../../services/liquidacionesService';

const Liquidaciones = () => {
  const { getPresupuestos, getSaldosPendientes } = useCustomContext();
  const [expandedRow, setExpandedRow] = useState(null); // Estado para controlar la fila expandida
  const [datosLiquidaciones, setDatosLiquidaciones] = useState([]);
  const [tecnicoSelected, setTecnicoSelected] = useState({});
  const [modal, setModal] = useState(false);
  const [adelantosModal, setAdelantosModal] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState('');
  const [cajas, setCajas] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [Liquidaciones, setLiquidaciones] = useState([]);

  useEffect(() => {
    getCobrosOrdenes();
    const fetchCajas = async () => {
      const response = await listaCajas();
      setCajas(response);
      const liquidaciones = await obtenerLiquidaciones();
      const liquidacionesPorTecnico = liquidaciones.reduce((acc, liq) => {
        const tecnicoId = liq.id_tecnico;
        if (!acc[tecnicoId]) {
          acc[tecnicoId] = {
            id_tecnico: tecnicoId,
            total: 0,
          };
        }
        acc[tecnicoId].total += Number(liq.monto);
        return acc;
      }, {});
      setLiquidaciones(liquidacionesPorTecnico);
      //console.log('Liquidaciones: ', liquidaciones);
      console.log('Liquidaciones por tecnico: ', liquidacionesPorTecnico);
    };
    fetchCajas();
  }, []);

  const getCobrosOrdenes = async () => {
    const cobros = await getPresupuestos();
    const saldosPendientes = await getSaldosPendientes();
    const empleadosOrdenes = transformarCobrosPorEmpleado(cobros);
    empleadosOrdenes.forEach((empleado) => {
      const datosLiqTecnico = saldosPendientes.filter((liq) => liq.id_tecnico === empleado.empleadoId);
      empleado.adelanto = datosLiqTecnico.reduce((acumulador, liq) => acumulador + parseFloat(liq.monto), 0);
    });
    setDatosLiquidaciones(empleadosOrdenes);
  };

  const transformarCobrosPorEmpleado = (cobros) => {
    return cobros.reduce((result, cobro) => {
      const { Empleado } = cobro.Ordene;
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

  const handleSelecTecnico = (tecnico) => {
    tecnico = {
      ...tecnico,
      porcentaje_arreglo: tecnico.ordenes[0].Empleado.porcentaje_arreglo,
      total: tecnico.ordenes.reduce((acumulador, orden) => acumulador + parseFloat(orden.total - (orden.total - orden.dpg) * orden.Empleado.porcentaje_arreglo || 0), 0).toFixed(2),
    };
    setTecnicoSelected(tecnico);
  };

  const handleLiquidarClick = () => {
    tecnicoSelected.nombre && setModal(!modal);
  };

  const handleAdelantosClick = () => {
    tecnicoSelected.nombre && setAdelantosModal(true);
  };

  const handleExpandClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleExportToPDF = () => {
    const filteredData = datosLiquidaciones.filter((liquidacion) => {
      const fechaOrden = new Date(liquidacion.ordenes[0].created_at);
      return (!startDate || fechaOrden >= new Date(startDate)) && (!endDate || fechaOrden <= new Date(endDate));
    });

    const doc = new jsPDF();
    doc.text('Reporte de Liquidaciones', 14, 16);
    doc.setFontSize(12);
    doc.text(`Desde: ${startDate || 'N/A'} Hasta: ${endDate || 'N/A'}`, 14, 22);

    const tableColumn = ['Nombre', 'Fecha', 'Monto', 'Adelanto'];
    const tableRows = [];

    filteredData.forEach((liquidacion) => {
      const liquidacionData = [
        liquidacion.nombre,
        liquidacion.ordenes.map((orden) => new Date(orden.created_at).toLocaleDateString()).join(', '),
        liquidacion.ordenes.reduce((acumulador, orden) => acumulador + parseFloat(orden.total - (orden.total - orden.dpg) * orden.Empleado.porcentaje_arreglo || 0), 0).toFixed(2),
        liquidacion.adelanto,
      ];
      tableRows.push(liquidacionData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save('Liquidaciones.pdf');
  };

  return (
    <div className='liquidaciones-ctn'>
      <h1>Técnicos a liquidar</h1>
      <div className='d-flex justify-content-start mb-3'>
        <h3 style={{ marginRight: '10%' }}>Filtrar por fecha:</h3>
        <div style={{ minWidth: '250px', marginRight: '2.5%' }}>
          <label style={{ marginRight: '5%' }}>Desde: </label>
          <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div style={{ minWidth: '250px', marginRight: '15%' }}>
          <label style={{ marginRight: '5%' }}>Hasta: </label>
          <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button onClick={handleExportToPDF} style={{ margin: '10px', height: '30px' }}>
          Exportar a PDF
        </button>
      </div>
      <Table hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Adelanto</th>
          </tr>
        </thead>
        <tbody>
          {datosLiquidaciones &&
            datosLiquidaciones
              .map((liquidacion) => ({
                ...liquidacion,
                ordenes: liquidacion.ordenes.filter((orden) => {
                  const fechaOrden = new Date(orden.created_at);
                  return (!startDate || fechaOrden >= new Date(startDate)) && (!endDate || fechaOrden <= new Date(endDate));
                }),
              }))
              .filter((liquidacion) => liquidacion.ordenes.length > 0)
              .map((liquidacion, index) => (
                <>
                  <tr className={expandedRow === index ? 'expanded-row' : ''}>
                    <td>{liquidacion.nombre}</td>
                    <td>
                      {liquidacion.ordenes.map((orden) => (
                        <div key={orden.id}>{new Date(orden.created_at).toLocaleDateString()}</div>
                      ))}
                    </td>
                    <td>
                      {liquidacion.ordenes.reduce((acumulador, orden) => acumulador + parseFloat(orden.total - (orden.total - orden.dpg) * orden.Empleado.porcentaje_arreglo || 0), 0).toFixed(2) -
                        liquidacion?.adelanto -
                        Liquidaciones[liquidacion.empleadoId]?.total}
                    </td>
                    <td>{liquidacion.adelanto}</td>
                    <td className='pointer' onClick={() => handleExpandClick(index)}>
                      {expandedRow === index ? '\u25B2' : '\u25BC'}
                    </td>
                    <td>
                      <button onClick={() => handleSelecTecnico(liquidacion)}>{tecnicoSelected.nombre === liquidacion.nombre ? 'Seleccionado' : 'Seleccionar'}</button>
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr>
                      <td colSpan='5'>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Orden</th>
                              <th>Equipo</th>
                              <th>Plazo de Reparación</th>
                              <th>Medio de Pago</th>
                              <th>Estado del Presupuesto</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {liquidacion.ordenes.map((orden, ordenIndex) => (
                              <tr key={ordenIndex}>
                                <td>{ordenIndex + 1}</td>
                                <td>{orden.numero_orden}</td>
                                <td>{orden.equipo}</td>
                                <td>{orden.PlazosReparacion?.plazo_reparacion}</td>
                                <td>{orden.MediosDePago?.medio_de_pago}</td>
                                <td>{orden.EstadosPresupuesto?.estado_presupuesto}</td>
                                <td>{parseFloat(orden.total - (orden.total - orden.dpg) * orden.Empleado.porcentaje_arreglo).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
        </tbody>
      </Table>
      <div style={{ display: 'flex' }}>
        <button onClick={handleLiquidarClick}>Liquidar</button>
        <button onClick={handleAdelantosClick}>Adelantos</button>
      </div>
      {modal && (
        <div className='modal'>
          <Liquidacion tecnico={tecnicoSelected} setModal={setModal} />
        </div>
      )}
      {adelantosModal && (
        <div className='modal'>
          <Adelantos tecnico={tecnicoSelected} setModal={setAdelantosModal} />
        </div>
      )}
    </div>
  );
};

export default Liquidaciones;
