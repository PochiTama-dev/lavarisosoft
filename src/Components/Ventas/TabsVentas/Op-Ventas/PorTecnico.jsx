import React, { useState } from 'react';

const PorTecnico = () => {
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

  const data = [
    { tecnico: 'TC-1256', ocupacion: 'Domicilio', numeroOrden: '#3563', operacion: 'Arreglo', cliente: 'C-1855', monto: '$45008', medioPago: 'Efectivo', fecha: '2023-10-15' },
    { tecnico: 'TC-1254', ocupacion: 'Domicilio', numeroOrden: '#3565', operacion: 'Arreglo', cliente: 'C-1854', monto: '$45000', medioPago: 'MercadoPago', fecha: '2023-10-10' },
 
  ];

  const sortedData = [...data].sort((a, b) => {
    if (orderBy === 'fecha') {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return orderAsc ? dateA - dateB : dateB - dateA;
    } else {
      const valA = a[orderBy];
      const valB = b[orderBy];
      return orderAsc ? (valA < valB ? -1 : valA > valB ? 1 : 0) : valA > valB ? -1 : valA < valB ? 1 : 0;
    }
  });

  return (
    <div className="caja-container">
      <div>
        <div className="caja-excel">
          <div className="caja-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                <th onClick={() => handleSort('fecha')}>
                    Fecha {orderBy === 'fecha' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('tecnico')}>
                    Técnico {orderBy === 'tecnico' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('ocupacion')}>
                    Ocupación {orderBy === 'ocupacion' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('numeroOrden')}>
                    N° de orden {orderBy === 'numeroOrden' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('operacion')}>
                    Operación {orderBy === 'operacion' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('cliente')}>
                    Cliente {orderBy === 'cliente' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('monto')}>
                    Monto {orderBy === 'monto' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('medioPago')}>
                    Medio de pago {orderBy === 'medioPago' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
               
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                    <td>{item.fecha}</td>
                    <td>{item.tecnico}</td>
                    <td>{item.ocupacion}</td>
                    <td>{item.numeroOrden}</td>
                    <td>{item.operacion}</td>
                    <td>{item.cliente}</td>
                    <td>{item.monto}</td>
                    <td>{item.medioPago}</td>
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

export default PorTecnico;