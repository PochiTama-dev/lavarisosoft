import { useEffect, useState } from 'react';

import './Caja.css';
import './Incumplimientos.css';
import Searchers from './Op-Ventas/Searchers';
import { useCustomContext } from '../../../hooks/context';

const Incumplimientos = () => {
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [ordenes, setOrdenes] = useState([]);

  const { ordenesGenerales } = useCustomContext();

  useEffect(() => {
    getOrdenes();
  }, []);
  const getOrdenes = async () => {
    const ordenesDB = await ordenesGenerales();
    const ordenesFilter = ordenesDB.filter((orden) => orden.id_tipo_estado === 2 );
    setOrdenes(ordenesFilter);
    console.log(ordenesFilter);
  };
  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  // Ordenar datos según la columna seleccionada
  const sortedData = orderBy
    ? [...ordenes].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : ordenes;

  return (
    <div className='incumplimientos-container'>
      <div className='pt-5 px-5'>
        <h1 className='fw-bold'>Reporte de incumplimientos</h1>
        <Searchers activeTab={3} />
      </div>
      <div className='caja-excel'>
        <div className='caja-excel-wrapper px-5'>
          <table className='table'>
            <thead>
              <tr>
                <th onClick={() => handleSort('fecha')}>Fecha Creacion {orderBy === 'fecha' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                <th onClick={() => handleSort('numeroOrden')}>Orden {orderBy === 'numeroOrden' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                <th onClick={() => handleSort('estado')}>Estado {orderBy === 'estado' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                <th onClick={() => handleSort('motivo')}>Motivo {orderBy === 'motivo' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                <th onClick={() => handleSort('monto')}>Monto {orderBy === 'monto' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                <th onClick={() => handleSort('cliente')}>Cliente {orderBy === 'cliente' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                <th onClick={() => handleSort('cancelacion')}>Cancelacion/Incumplimiento {orderBy === '' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                <th onClick={() => handleSort('tecnico')}>Tecnico {orderBy === 'tecnico' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const color = item.TiposEstado.tipo_estado.charAt(0) === 'P' ? '#40A63D' : '#E58769';

                return (
                  <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                    <div>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      <span>{'detalle'}</span>
                    </div>
                    <td>{item.id}</td>
                    <td className='fw-bold' style={{ color: color }}>
                      {item.TiposEstado.tipo_estado}
                    </td>
                    <td>{item.motivo}</td>
                    <td>{item.Presupuesto?.total}</td>
                    <td>
                      {item.Cliente?.nombre} {item.Cliente?.apellido}
                    </td>
                    <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                    <td>
                      {item.Empleado?.nombre} {item.Empleado?.apellido}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Incumplimientos;
