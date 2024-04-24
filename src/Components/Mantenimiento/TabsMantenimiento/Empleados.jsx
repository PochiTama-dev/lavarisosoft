import Table from 'react-bootstrap/Table';
import datosEmpleados from './DatosEmpleados'; 
 
const Empleados = () => {
  return (
    <div className='empleados-ctn'>
      <Table striped hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cuenta virtual</th>
            <th>Saldo (CV)</th>
            <th>Cuenta efectivo</th>
            <th>Saldo (CE)</th>
          </tr>
        </thead>
        <tbody>
          {datosEmpleados.map((empleado, index) => (
            <tr key={index}>
              <td>{empleado.nombre}</td>
              <td>{empleado.apellido}</td>
              <td>{empleado.ctaVirtual}</td>
              <td>{empleado.saldoCV}</td>
              <td>{empleado.ctaEfectivo}</td>
              <td>{empleado.saldoCE}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Empleados;