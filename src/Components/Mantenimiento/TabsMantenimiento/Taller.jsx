import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { datosTaller } from './DatosFacturasAFIP';

const Taller = () => {
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);

  const handleSort = (column) => {
    if (orderBy === column) {
      setOrderAsc(!orderAsc);
    } else {
      setOrderBy(column);
      setOrderAsc(true);
    }
  };

  const sortedData = [...datosTaller].sort((a, b) => {
    if (orderBy) {
      if (a[orderBy] < b[orderBy]) {
        return orderAsc ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return orderAsc ? 1 : -1;
      }
      return 0;
    } else {
      return 0;
    }
  });

  return (
    <div className='taller-ctn'>
      <div className='taller-title-search'>
        <h1>Entrada y Salida de equipos</h1>
        <div className='search' style={{ display: 'flex', alignItems: 'center' }}>
          <h4 className="caja-input-text" style={{ marginTop: '5px', marginLeft: '50px', marginRight: '25px' }}>Filtrar por fecha </h4>
          <input className="caja-input" type="text" placeholder="dd/mm/aaaa" style={{ marginRight: '-1px' }} />
          <button className="caja-button-search">🔍︎</button>
        </div>
      </div>

      <Table striped hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("prod")}>
              Producto{" "}
              {orderBy === "prod" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("marca")}>
              Marca{" "}
              {orderBy === "marca" ? (
                orderAsc ? "▲" : "▼"
              ) : (
                <span>▼</span>
              )}
            </th>
            <th onClick={() => handleSort("modelo")}>
              Modelo{" "}
              {orderBy === "modelo" ? (
                orderAsc ? "▲" : "▼"
              ) : (
                <span>▼</span>
              )}
            </th>
            <th onClick={() => handleSort("fecha")}>
              Fecha{" "}
              {orderBy === "fecha" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("tecD")}>
              Técnico D.{" "}
              {orderBy === "tecD" ? (
                orderAsc ? "▲" : "▼"
              ) : (
                <span>▼</span>
              )}
            </th>
            <th onClick={() => handleSort("tecT")}>
              Técnico T.{" "}
              {orderBy === "tecT" ? (
                orderAsc ? "▲" : "▼"
              ) : (
                <span>▼</span>
              )}
            </th>
            <th onClick={() => handleSort("orden")}>
              N° Orden{" "}
              {orderBy === "orden" ? (
                orderAsc ? "▲" : "▼"
              ) : (
                <span>▼</span>
              )}
            </th>
            <th onClick={() => handleSort("cliente")}>
              N° Cliente{" "}
              {orderBy === "cliente" ? (
                orderAsc ? "▲" : "▼"
              ) : (
                <span>▼</span>
              )}
            </th>
            
          </tr>
        </thead>
        <tbody>
          {sortedData.map((factura, index) => (
            <tr key={index}>
              <td>{factura.prod}</td>
              <td>{factura.marca}</td>
              <td>{factura.modelo}</td>
              <td>{factura.fecha}</td>
              <td>{factura.tecD}</td>
              <td>{factura.tecT}</td>
              <td>{factura.orden}</td>
              <td>{factura.cliente}</td>
            
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Taller;