import React, { useState } from 'react';

const PorProducto = () => {
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
    { descripcion: 'Fuelle lineal', id: 55623, tecnico: 'TC-16554', cliente: 'C-1855', precio: '$70000', cantidad: 3, fecha: '2023-10-15' },
    { descripcion: 'Otro producto', id: 12345, tecnico: 'TC-98765', cliente: 'C-5432', precio: '$50000', cantidad: 2, fecha: '2023-10-10' },
    { descripcion: 'No se ', id: 12344, tecnico: 'TC-98765', cliente: 'C-5438', precio: '$40000', cantidad: 5, fecha: '2023-09-25' },
    { descripcion: 'Coso ', id: 12341, tecnico: 'TC-9875', cliente: 'C-5439', precio: '$0.5', cantidad: 10, fecha: '2023-09-20' },
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
                  <th onClick={() => handleSort('descripcion')}>
                    Descripción {orderBy === 'descripcion' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('id')}>
                    ID {orderBy === 'id' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('tecnico')}>
                    Técnico {orderBy === 'tecnico' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('cliente')}>
                    Cliente {orderBy === 'cliente' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('precio')}>
                    Precio {orderBy === 'precio' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort('cantidad')}>
                    Cantidad {orderBy === 'cantidad' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}
                  </th>
                 
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                    <td>{item.fecha}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.id}</td>
                    <td>{item.tecnico}</td>
                    <td>{item.cliente}</td>
                    <td>{item.precio}</td>
                    <td>{item.cantidad}</td>
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

export default PorProducto;