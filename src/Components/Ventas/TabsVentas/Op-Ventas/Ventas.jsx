import React, { useState } from 'react';

const Ventas = () => {
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
    { operacion: 'Venta Repuesto', numeroOrden: '#35553', tecnico: 'TC-1256', cliente: 'C-1855', monto: '$45008', medioPago: 'Efectivo', fecha: '2023-10-15' },
    { operacion: 'Venta Algo', numeroOrden: '#35550', tecnico: 'TC-1257', cliente: 'C-0854', monto: '$45000', medioPago: 'MercadoPago', fecha: '2023-10-10' },
    { operacion: 'Venta Cosa rara', numeroOrden: '#355', tecnico: 'TC-5512', cliente: 'C-085422', monto: '$42000', medioPago: 'Cheque', fecha: '2023-09-25' },
 
  ];

  const sortedData = orderBy
    ? [...data].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : data;

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
                  <th onClick={() => handleSort('operacion')}>
                    Operación {orderBy === 'operacion' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('numeroOrden')}>
                    N° de orden {orderBy === 'numeroOrden' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('tecnico')}>
                    Técnico {orderBy === 'tecnico' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
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
                    <td>{item.operacion}</td>
                    <td>{item.numeroOrden}</td>
                    <td>{item.tecnico}</td>
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

export default Ventas;