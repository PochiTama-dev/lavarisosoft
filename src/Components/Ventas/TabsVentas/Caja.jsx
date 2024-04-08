import React, { useState } from 'react';
import './Caja.css'; // Asegúrate de importar el archivo CSS correctamente

const Caja = () => {
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  // Datos para la tabla de movimientos
  const movimientosData = [
    { tipo: 'Ingreso', importe: '$5000', numeroOrden: '#3366', hora: '15:06:32', comentarios: '"Recibo arreglo..."' },
    { tipo: 'Ingreso', importe: '$25000', numeroOrden: '#3365', hora: '14:24:00', comentarios: '"Presupuesto..."' },
    { tipo: 'Egreso', importe: '$480000', numeroOrden: '#3364', hora: '12:27:00', comentarios: 'Viático' },
  ];

  // Ordenar datos según la columna seleccionada
  const sortedData = orderBy
    ? [...movimientosData].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : movimientosData;

  return (
    <div className="caja-container">
      <div>
        <div className="caja-heading mb-4">
          <h1>Movimientos de caja</h1>
        </div>
        <div className="caja-input-top">
<div>
  <h4 className="caja-input-text">Buscar por número de orden</h4>
  <input className="caja-input" type="text" placeholder="Buscar" />
  <button className="caja-button-search">🔍︎</button>
</div>
</div>
<div className="caja-input-bottom">
<div>
  <h4 className="caja-input-text">Filtrar por fecha</h4>
  <input
    className="caja-input"
    type="text"
    placeholder="dd/mm/aaaa"
  />
  <button className="caja-button-search">🔍︎</button>
</div>
<div>
  <h4 className="caja-input-text">Filtrar por técnico</h4>
  <input className="caja-input" type="text" placeholder="Buscar" />
  <button className="caja-button-search">🔍︎</button>
</div>
<div>
  <h4 className="caja-input-text">Filtrar por cliente</h4>
  <input className="caja-input" type="text" placeholder="Buscar" />
  <button className="caja-button-search">🔍︎</button>
</div>
</div>
        <div className="caja-excel">
          <h2 className="caja-excel-heading">
            Movimientos del 27 de enero, 2024
          </h2>
          <div className="caja-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('tipo')}>
                    Movimiento {orderBy === 'tipo' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('importe')}>
                    Importe {orderBy === 'importe' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('numeroOrden')}>
                    No. de orden {orderBy === 'numeroOrden' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('hora')}>
                    Hora {orderBy === 'hora' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('comentarios')}>
                    Comentarios {orderBy === 'comentarios' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                    <td>{item.tipo}</td>
                    <td>{item.importe}</td>
                    <td>{item.numeroOrden}</td>
                    <td>{item.hora}</td>
                    <td>{item.comentarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;

 