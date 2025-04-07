import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import './saldos.css'
const Saldos = ({ saldos }) => {
  return (
    <>
      {saldos.providers.length > 0 && (
        <>
           <div style={{marginTop:'30px'}} >
           <Table className="table" striped hover>
{/*            <Table className="table custom-striped" striped hover>
 */}            <thead>
              <tr>
                <th className="text-start">Motivo</th>
                <th className="text-start">Descripción</th>
                <th className="text-start">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {saldos.providers.map(
                (provider, index) =>
                  provider.total - provider.monto_pagado !== 0 && (
                    <tr key={index}>
                      <td className="text-start">Proveedor</td>
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
                const saldo = employee.ordenes.reduce(
                  (acc, orden) =>
                    acc +
                    parseFloat(
                      orden.total -
                        (orden.total - orden.dpg) *
                          orden.Empleado.porcentaje_arreglo || 0
                    ),
                  0
                ).toFixed(2);
                return (
                  <tr key={index}>
                    <td className="text-start">{employee.nombre}</td>
                    <td className="text-start">LIQUIDAR</td>
                    <td
                      className={`text-start ${
                        saldo > 0
                          ? 'text-success'
                          : saldo === 0
                          ? 'text-warning'
                          : 'text-danger'
                      }`}
                    >
                      ${saldo}
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
