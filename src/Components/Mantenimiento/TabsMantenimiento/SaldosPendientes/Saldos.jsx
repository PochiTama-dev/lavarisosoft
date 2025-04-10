import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import './saldos.css'
import { liquidacionesPendientes } from '../../../../services/liquidacionesPendientesService';

const Saldos = ({ saldos }) => {
  const [liquidaciones, setLiquidaciones] = useState([]);

  useEffect(() => {
    liquidacionesPendientes()
      .then(data => setLiquidaciones(data))
      .catch(error => console.error(error));
  }, []);
 
  return (
    <>
      {saldos.providers.length > 0 && (
        <>
           <div style={{marginTop:'30px'}} >
           <Table className="table" striped hover>
            <thead>
              <tr>
                <th className="text-start">Nombre</th>
                <th className="text-start">Descripción</th>
                <th className="text-start">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {saldos.providers.map(
                (provider, index) =>
                  provider.total - provider.monto_pagado !== 0 && (
                    <tr key={index}>
                      <td className="text-start">{provider.Proveedore.nombre}</td>
                      <td className="text-start">{provider.descripcion}</td>
                      <td className="text-start text-danger">${provider.total - provider.monto_pagado}</td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
          </div>
        </>
      )}

      {saldos.employees.length > 0 && (
        <>
        <div style={{marginTop:'30px' }} >

          <Table className="table" striped hover>
            <thead>
              <tr>
                <th className="text-start">Nombre</th>
                <th className="text-start">Estado</th>
                <th className="text-start">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {saldos.employees.map((employee, index) => {
                const liquidacionesArray = Array.isArray(liquidaciones)
                  ? liquidaciones
                  : Object.values(liquidaciones);
                const liquidacion = liquidacionesArray.find(item => item.id_tecnico === employee.empleadoId);
      
                const saldo = liquidacion ? liquidacion.total : 0;
                return (
                             <tr key={index}>
                    <td className="text-start">{employee.nombre}</td>
                    <td className="text-start">LIQUIDAR</td>
                    <td className={`text-start ${saldo > 0 ? 'text-success' : saldo === 0 ? 'text-warning' : 'text-danger'}`}>
                      ${parseFloat(saldo).toFixed(2).replace(/\.00$/, '')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        </>
      )}
    </>
  );
};

Saldos.propTypes = {
  saldos: PropTypes.shape({
    providers: PropTypes.array.isRequired,
    costumers: PropTypes.array.isRequired,
    employees: PropTypes.array.isRequired,
  }).isRequired,
};

export default Saldos;
