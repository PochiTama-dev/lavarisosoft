//import Adelantos from '../Adelantos';
//import { listaCajas } from '../../../services/cajasService';
//import { obtenerLiquidaciones } from '../../../services/liquidacionesService';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import '../mantenimiento.css';
import { useCustomContext } from '../../../hooks/context';
import Liquidacion from '../Liquidacion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Header from '../../Header/Header';
const Liquidaciones = () => {
  const { getLiquidacionesPendientes, getLiquidacionesHechas } = useCustomContext();
  const [expandedRow, setExpandedRow] = useState(null);
  const [datosLiquidaciones, setDatosLiquidaciones] = useState([]);
  const [liquidacionesHechas, setLiquidacionesHechas] = useState([]);
  const [tecnicoSelected, setTecnicoSelected] = useState({});
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  //const [cajas, setCajas] = useState([]);
  //const [adelantosModal, setAdelantosModal] = useState(false);
  //const [Liquidaciones, setLiquidaciones] = useState([]);
  //const [selectedCaja, setSelectedCaja] = useState('');

  useEffect(() => {
    getCobrosOrdenes();
    const fetchCajas = async () => {
      /* const response = await listaCajas();
      setCajas(response); */
      //const liquidaciones = await obtenerLiquidaciones();
      /* const liquidacionesPorTecnico = liquidaciones.reduce((acc, liq) => {
        const tecnicoId = liq.id_tecnico;
        if (!acc[tecnicoId]) {
          acc[tecnicoId] = {
            id_tecnico: tecnicoId,
            total: 0,
          };
        }
        acc[tecnicoId].total += Number(liq.monto);
        return acc;
      }, {}); */
      //console.log('Liquidaciones: ', liquidaciones);
      //console.log('Liquidaciones por tecnico: ', liquidacionesPorTecnico);
    };
    fetchCajas();
  }, []);

  const getCobrosOrdenes = async () => {
    const liquidacionesPendientes = await getLiquidacionesPendientes();
    //console.log('Liquidaciones Pendientes: ', liquidacionesPendientes);
    const liquidacionesHechas = await getLiquidacionesHechas();
    const liquidacionesHechasPorTecnico = liquidacionesHechas.reduce((acc, liq) => {
      const tecnicoId = liq.id_tecnico;
      if (!acc[tecnicoId]) {
        acc[tecnicoId] = {
          id_tecnico: tecnicoId,
          liquidaciones: [],
          total: 0,
        };
      }
      acc[tecnicoId].total += Number(liq.monto);
      acc[tecnicoId].liquidaciones.push(liq);
      return acc;
    }, {});
    console.log('Liquidaciones Hechas por Tecnico: ', liquidacionesHechasPorTecnico);
    setLiquidacionesHechas(liquidacionesHechasPorTecnico);
    setDatosLiquidaciones(liquidacionesPendientes);
  };

  /*   const transformarCobrosPorEmpleado = (cobros) => {
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
 */
  const handleSelecTecnico = (tecnico) => {
    if (tecnicoSelected.nombre === tecnico.nombre) {
      setTecnicoSelected({});
    } else {
      setTecnicoSelected(tecnico);
    }
  };

  const handleLiquidarClick = () => {
    tecnicoSelected.nombre && setModal(!modal);
  };

  /* const handleAdelantosClick = () => {
    tecnicoSelected.nombre && setAdelantosModal(true);
  }; */

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
      <Header text='Técnicos a liquidar' />

      <div className='d-flex justify-content-start mb-3'>
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
      <Table hover style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', width: '40%' }}>Nombre</th>
            <th style={{ textAlign: 'center', width: '30%' }}>Monto a Liquidar</th>
            <th style={{ textAlign: 'center', width: '30%' }}>Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          {datosLiquidaciones &&
            datosLiquidaciones.map((liquidacion, index) => (
              <>
                <tr
                  className={expandedRow === index ? 'expanded-row' : ''}
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox') handleExpandClick(index);
                  }}
                >
                  <td style={{ textAlign: 'center', width: '40%' }}>
                    {liquidacion.Empleado.nombre} {liquidacion.Empleado.apellido}
                  </td>
                  <td style={{ textAlign: 'center', width: '30%' }}>{liquidacion.total}</td>
                  <td style={{ textAlign: 'center', width: '30%' }}>
                    <input
                      type='checkbox'
                      style={{ cursor: 'pointer' }}
                      checked={tecnicoSelected.nombre === liquidacion.Empleado.nombre}
                      onChange={() => handleSelecTecnico(liquidacion.Empleado)}
                    />
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan='3'>
                      {
                        <Table striped bordered hover>
                          <thead>
                            <h3 className='text-left'>Liquidaciones realizadas</h3>
                            <tr>
                              <th>Fecha</th>
                              <th>Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.values(liquidacionesHechas)
                              .filter((liq) => liq.id_tecnico === liquidacion.Empleado.id)
                              .map((liq, liqIndex) =>
                                liq.liquidaciones.map((liq, indx) => (
                                  <tr key={(liqIndex, indx)}>
                                    <td>{new Date(liq.created_at).toLocaleDateString()}</td>
                                    <td>{liq.monto}</td>
                                  </tr>
                                ))
                              )}
                          </tbody>
                        </Table>
                      }
                    </td>
                  </tr>
                )}
              </>
            ))}
        </tbody>
      </Table>
      <div style={{ display: 'flex' }}>
        <button onClick={handleLiquidarClick} disabled={!tecnicoSelected.nombre}>
          Liquidar
        </button>
        {/* <button onClick={handleAdelantosClick} disabled={!tecnicoSelected.nombre}>
          Adelantos
        </button> */}
      </div>
      {modal && (
        <div className='modal'>
          <Liquidacion tecnico={tecnicoSelected} setModal={setModal} />
        </div>
      )}
      {/* {adelantosModal && (
        <div className='modal'>
          <Adelantos tecnico={tecnicoSelected} setModal={setAdelantosModal} />
        </div>
      )} */}
    </div>
  );
};

export default Liquidaciones;
