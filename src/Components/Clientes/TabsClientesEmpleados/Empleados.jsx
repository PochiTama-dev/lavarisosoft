import Table from 'react-bootstrap/Table';
import empleadosData from './empleadosData';

const Empleados = () => {
  return (
    <div className='clientes-ctn'>
      <Table striped hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Legajo</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>CUIL</th>
            <th>Automóvil</th>
          </tr>
        </thead>
        <tbody>
          {empleadosData.map((empleado, index) => (
            <tr key={index}>
              <td>{empleado.nombre}</td>
              <td>{empleado.legajo}</td>
              <td>{empleado.rol}</td>
              <td>{empleado.telefono}</td>
              <td>{empleado.email}</td>
              <td>{empleado.cuil}</td>
              <td>{empleado.automovil}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Empleados;
