import React from 'react';
import Table from 'react-bootstrap/Table';
import datosFacturasAFIP from './DatosFacturasAFIP'; 
 
const FacturasAFIP = () => {
  return (
    <div className='facturas-ctn'>
      <Table striped hover>
        <thead>
          <tr>
           
            <th>N° de orden</th>
            <th>Nombre y Apellido</th>
            <th>Domicilio</th>
            <th>CUIT/CUIL/CDI</th>
            <th>Factura</th>
        
          </tr>
        </thead>
        <tbody>
          {datosFacturasAFIP.map((factura, index) => (
            <tr key={index}>
              <td>{factura.numeroOrden}</td>
              <td>{factura.nombreApellido}</td>
              <td>{factura.domicilio}</td>
              <td>{factura.cuitCuilCdi}</td>
          
              <td>
                <img
                  src={factura.icon}
                  alt="Ver factura"
                  style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                  onClick={() => verFactura(factura.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FacturasAFIP;