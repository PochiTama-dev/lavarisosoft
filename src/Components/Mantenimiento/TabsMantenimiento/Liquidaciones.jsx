//import Adelantos from '../Adelantos';
//import { listaCajas } from '../../../services/cajasService';
//import { obtenerLiquidaciones } from '../../../services/liquidacionesService';
import React, { useEffect, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getCobrosOrdenes();
  }, [startDate, endDate]);

  const getCobrosOrdenes = async () => {
    const liquidacionesPendientes = await getLiquidacionesPendientes();

    const pendientes = liquidacionesPendientes;

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
    setLiquidacionesHechas(liquidacionesHechasPorTecnico);
    setDatosLiquidaciones(pendientes);
  };

  const handleExportToPDF = () => {
    if (expandedRow === null) return;

    const tecnico = datosLiquidaciones[expandedRow];
    const tecnicoLiquidaciones = liquidacionesHechas[tecnico.Empleado.id]?.liquidaciones || [];
    const filteredLiquidaciones = tecnicoLiquidaciones.filter((liq) => {
      const fechaStr = new Date(liq.created_at).toLocaleDateString('en-CA');
      return (!startDate || fechaStr >= startDate) && (!endDate || fechaStr <= endDate);
    });

    const doc = new jsPDF();
    const tableColumn = ['Fecha', 'Monto'];
    const tableRows = [];

    filteredLiquidaciones.forEach((liq) => {
      const rowData = [
        new Date(liq.created_at).toLocaleDateString(),
        liq.monto,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.text(`Reporte de Liquidaciones - ${tecnico.Empleado.nombre} ${tecnico.Empleado.apellido}`, 14, 15);
    doc.save(`liquidaciones_${tecnico.Empleado.nombre}_${tecnico.Empleado.apellido}.pdf`);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleSelecTecnico = (tecnico) => {
    if (tecnicoSelected.Empleado?.nombre === tecnico.Empleado.nombre) {
      setTecnicoSelected({});
    } else {
      setTecnicoSelected(tecnico);
    }
    console.log(tecnicoSelected);
  };

  const handleLiquidarClick = () => {
    if (!tecnicoSelected.Empleado?.nombre) {
      alert("Por favor seleccione un tecnico");
    } else {
      setModal(!modal);
    }
  };

  const totalLiquidacion = datosLiquidaciones.find(liq => liq.Empleado.nombre === tecnicoSelected.Empleado?.nombre)?.total;

  const handleExpandClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
    setCurrentPage(1);
  };

  return (
    <div className='liquidaciones-ctn'>
      <Header text='Técnicos a liquidar' />

      <div className='d-flex justify-content-start mb-3 align-items-center'>
        <div style={{ minWidth: '250px', marginRight: '2.5%' }}>
          <label style={{ marginRight: '5%' }}>Desde: </label>
          <input 
            type='date' 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </div>
        <div style={{ minWidth: '250px', marginRight: '2.5%' }}>
          <label style={{ marginRight: '5%' }}>Hasta: </label>
          <input 
            type='date' 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
        <div className='d-flex align-items-center' style={{ marginRight: '2.5%' }}>
          <button onClick={handleClearFilter}>
            Limpiar
          </button>
        </div>
        <button onClick={handleExportToPDF} style={{ marginLeft: '10px' }}>
          Exportar
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
              <React.Fragment key={index}>
                <tr
                  className={expandedRow === index ? 'expanded-row' : ''}
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox') handleExpandClick(index);
                  }}
                >
                  <td style={{ textAlign: 'center', width: '40%' }}>
                    {liquidacion.Empleado.nombre} {liquidacion.Empleado.apellido}
                  </td>
                  <td style={{ textAlign: 'center' }}>{liquidacion.total}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input type='checkbox' style={{ cursor: 'pointer' }} checked={tecnicoSelected.Empleado?.nombre === liquidacion.Empleado.nombre} onChange={() => handleSelecTecnico(liquidacion)} />
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan='3'>
                      <Table striped bordered hover>
                        <thead>
                          <h3 className='text-left'>Liquidaciones realizadas</h3>
                          <tr>
                            <th>Fecha</th>
                            <th>Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            let allLiquidaciones = liquidacionesHechas[liquidacion.Empleado.id]?.liquidaciones.filter((liq) => {
                              const fechaStr = new Date(liq.created_at).toLocaleDateString('en-CA');
                              return (!startDate || fechaStr >= startDate) && (!endDate || fechaStr <= endDate);
                            }) || [];
                            allLiquidaciones.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                            
                            const startIndex = (currentPage - 1) * 10;
                            const currentData = allLiquidaciones.slice(startIndex, startIndex + 10);

                            return (
                              <>
                                {currentData.map((liq, indx) => (
                                  <tr key={indx}>
                                    <td>{new Date(liq.created_at).toLocaleDateString()}</td>
                                    <td>{liq.monto}</td>
                                  </tr>
                                ))}
                                {currentData.length === 0 && (
                                  <tr>
                                    <td colSpan="2" className="text-center">No hay liquidaciones</td>
                                  </tr>
                                )}
                              </>
                            );
                          })()}
                        </tbody>
                      </Table>
                      {(() => {
                        let allLiquidaciones = liquidacionesHechas[liquidacion.Empleado.id]?.liquidaciones.filter((liq) => {
                          const fechaStr = new Date(liq.created_at).toLocaleDateString('en-CA');
                          return (!startDate || fechaStr >= startDate) && (!endDate || fechaStr <= endDate);
                        }) || [];
                        allLiquidaciones.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        
                        const totalPages = Math.ceil(allLiquidaciones.length / 10) || 1;
                        return (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center', marginTop: '10px' }}>
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage <= 1}>
                              {'<'}
                            </button>
                            <span style={{ margin: '0 10px' }}>
                              {currentPage} / {totalPages}
                            </span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages}>
                              {'>'}
                            </button>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </Table>
      <div style={{ display: 'flex', justifyContent:'center' }}>
        <button onClick={handleLiquidarClick}>
          Liquidar
        </button>
      </div>
      {modal && (
        <div className='modal'>
          <Liquidacion tecnico={tecnicoSelected} totalLiquidacion={totalLiquidacion} setModal={setModal} />
        </div>
      )}
    </div>
  );
};

export default Liquidaciones;
